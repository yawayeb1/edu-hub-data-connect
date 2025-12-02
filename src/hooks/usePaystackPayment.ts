import { usePaystackPayment } from 'react-paystack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PAYSTACK_PUBLIC_KEY } from '@/lib/paystack';
import { useMemo } from 'react';

interface UsePaystackPaymentOptions {
  amount: number;
  onSuccess?: (reference: string) => void;
  onError?: (error: Error) => void;
}

export function usePaystackPaymentHook({ amount, onSuccess, onError }: UsePaystackPaymentOptions) {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const config = useMemo(() => ({
    publicKey: PAYSTACK_PUBLIC_KEY,
    email: user?.email || '',
    amount: amount * 100, // Convert GH¢ to pesewas (kobo)
    currency: 'GHS',
    metadata: {
      custom_fields: [
        {
          display_name: 'Payment Type',
          variable_name: 'payment_type',
          value: 'wallet_topup',
        },
        {
          display_name: 'User ID',
          variable_name: 'user_id',
          value: user?.id || '',
        },
      ],
    },
  }), [user?.email, user?.id, amount]);

  const initializePayment = usePaystackPayment(config);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to make a payment');
      return;
    }

    if (!user.email) {
      toast.error('Email is required for payment');
      return;
    }

    if (amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    if (!PAYSTACK_PUBLIC_KEY) {
      toast.error('Paystack is not configured. Please contact support.');
      return;
    }

    initializePayment({
      onSuccess: async (response) => {
        try {
          // Create wallet transaction record
          const { error: transactionError } = await supabase
            .from('wallet_transactions')
            .insert({
              user_id: user.id,
              amount: amount,
              type: 'credit',
              description: `Wallet top-up via Paystack`,
              reference: response.reference,
              status: 'completed',
            });

          if (transactionError) {
            console.error('Error creating transaction:', transactionError);
            toast.error('Payment successful but failed to record transaction');
            return;
          }

          // Update user balance
          const newBalance = (profile?.balance || 0) + amount;
          const { error: balanceError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', user.id);

          if (balanceError) {
            console.error('Error updating balance:', balanceError);
            toast.error('Payment successful but failed to update balance');
            return;
          }

          // Refresh profile to get updated balance
          await refreshProfile();

          toast.success(`Payment successful! GH¢${amount.toFixed(2)} added to wallet`);
          onSuccess?.(response.reference);
          
          // Redirect to wallet page
          navigate('/wallet?success=true');
        } catch (error) {
          console.error('Error processing payment:', error);
          toast.error('Payment successful but failed to update wallet');
          onError?.(error as Error);
        }
      },
      onClose: () => {
        toast.info('Payment cancelled');
      },
    });
  };

  return {
    handlePayment,
    isReady: !!user && !!user.email && !!PAYSTACK_PUBLIC_KEY && amount > 0,
  };
}


import { usePaystackPayment } from 'react-paystack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PAYSTACK_PUBLIC_KEY } from '@/lib/paystack';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

interface BundlePurchaseOptions {
  bundleId: string;
  phoneNumber: string;
  network: 'MTN_UP2U' | 'AT_ISHARE' | 'AT_BIGTIME' | 'TELECEL' | 'MTN';
  onSuccess?: (orderId: string) => void;
  onError?: (error: Error) => void;
}

export function useBundlePurchase({
  bundleId,
  phoneNumber,
  network,
  onSuccess,
  onError,
}: BundlePurchaseOptions) {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Fetch bundle details
  const { data: bundle, isLoading: bundleLoading } = useQuery({
    queryKey: ['bundle', bundleId],
    queryFn: async () => {
      if (!bundleId) return null;
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!bundleId,
  });

  const config = useMemo(() => ({
    publicKey: PAYSTACK_PUBLIC_KEY,
    email: user?.email || '',
    amount: bundle ? bundle.price_ghc * 100 : 0, // Convert GH¢ to pesewas
    currency: 'GHS',
    metadata: {
      custom_fields: [
        {
          display_name: 'Payment Type',
          variable_name: 'payment_type',
          value: 'bundle_purchase',
        },
        {
          display_name: 'Bundle ID',
          variable_name: 'bundle_id',
          value: bundleId,
        },
        {
          display_name: 'Network',
          variable_name: 'network',
          value: network,
        },
        {
          display_name: 'Phone Number',
          variable_name: 'phone_number',
          value: phoneNumber,
        },
        {
          display_name: 'User ID',
          variable_name: 'user_id',
          value: user?.id || '',
        },
      ],
    },
  }), [user?.email, user?.id, bundleId, network, phoneNumber, bundle?.price_ghc]);

  const initializePayment = usePaystackPayment(config);

  const generateOrderId = () => {
    return `#${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please sign in to purchase bundles');
      return;
    }

    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error('Please enter a phone number');
      return;
    }

    if (!bundleId) {
      toast.error('Please select a bundle');
      return;
    }

    if (!bundle) {
      toast.error('Bundle not found');
      return;
    }

    if (!PAYSTACK_PUBLIC_KEY) {
      toast.error('Paystack is not configured. Please contact support.');
      return;
    }

    // Validate phone number format (Ghana numbers)
    const phoneRegex = /^(0|\+233)[0-9]{9}$/;
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Please enter a valid Ghana phone number');
      return;
    }

    initializePayment({
      onSuccess: async (response) => {
        try {
          const orderId = generateOrderId();
          
          // Create order record
          const { error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              order_id: orderId,
              network: network,
              msisdn: cleanPhone,
              package: bundle.display_name,
              amount: bundle.price_ghc,
              cost: bundle.price_ghc * 0.95, // Assuming 5% margin (adjust as needed)
              status: 'pending',
              api_response: {
                paystack_reference: response.reference,
                payment_status: 'success',
              },
            });

          if (orderError) {
            console.error('Error creating order:', orderError);
            toast.error('Payment successful but failed to create order');
            return;
          }

          // TODO: Here you would call your telecom API to actually purchase the bundle
          // For now, we'll mark it as delivered after a short delay
          // In production, you'd call your API and update status based on response
          
          setTimeout(async () => {
            // Update order status to delivered (in production, this would be based on API response)
            await supabase
              .from('orders')
              .update({ status: 'delivered' })
              .eq('order_id', orderId);
          }, 2000);

          toast.success(`Bundle delivered! Order: ${orderId}`);
          onSuccess?.(orderId);
          
          // Redirect to transactions page
          navigate('/transactions?success=true');
        } catch (error) {
          console.error('Error processing purchase:', error);
          toast.error('Payment successful but failed to process order');
          onError?.(error as Error);
        }
      },
      onClose: () => {
        toast.info('Payment cancelled');
      },
    });
  };

  // Debug: Check why button might be disabled
  const isReady = !!user && !!user.email && !!PAYSTACK_PUBLIC_KEY && !!bundleId && !!phoneNumber.trim() && !!bundle;
  
  // Debug helper
  const debugInfo = {
    hasUser: !!user,
    hasEmail: !!user?.email,
    hasPaystackKey: !!PAYSTACK_PUBLIC_KEY,
    hasBundleId: !!bundleId,
    hasPhoneNumber: !!phoneNumber.trim(),
    hasBundle: !!bundle,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle Purchase Debug:', debugInfo);
  }

  return {
    handlePurchase,
    bundle,
    bundleLoading,
    isReady,
    bundlePrice: bundle?.price_ghc || 0,
    debugInfo, // For debugging
  };
}


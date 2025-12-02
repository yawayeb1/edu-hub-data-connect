import { useState } from 'react';
import { usePaystackPaymentHook } from '@/hooks/usePaystackPayment';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const presetAmounts = [50, 100, 250, 500];

export function WalletTopUp() {
  const { profile, user } = useAuth();
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');

  const { handlePayment, isReady } = usePaystackPaymentHook({
    amount,
    onSuccess: () => {
      // Redirect handled in hook - will go to /wallet?success=true
      setAmount(0);
      setCustomAmount('');
    },
    onError: (error) => {
      console.error('Payment error:', error);
    },
  });

  const handlePresetClick = (presetAmount: number) => {
    setAmount(presetAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    } else {
      setAmount(0);
    }
  };

  const handlePay = () => {
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    handlePayment();
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Top-Up</CardTitle>
          <CardDescription>Please sign in to top up your wallet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          <CardTitle>Top Up Wallet</CardTitle>
        </div>
        <CardDescription>
          Current balance: <span className="font-semibold">GH¢{profile?.balance?.toFixed(2) || '0.00'}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Amounts */}
        <div className="space-y-2">
          <Label>Quick Select</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                variant={amount === preset ? 'default' : 'outline'}
                onClick={() => handlePresetClick(preset)}
                className="h-12"
              >
                GH¢{preset}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="space-y-2">
          <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">GH¢</span>
            <Input
              id="custom-amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="0.00"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Selected Amount Display */}
        {amount > 0 && (
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Amount to Pay:</span>
              <span className="text-2xl font-bold text-primary">GH¢{amount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <Button
          onClick={handlePay}
          disabled={!isReady || amount <= 0}
          size="lg"
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pay with Paystack
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Secure payment powered by Paystack
        </p>
      </CardContent>
    </Card>
  );
}


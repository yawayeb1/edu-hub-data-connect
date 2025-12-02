import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from "@/components/Sidebar";
import { WalletTopUp } from "@/components/WalletTopUp";
import { WalletTransactions } from "@/components/WalletTransactions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard } from "lucide-react";
import { toast } from 'sonner';

export default function Wallet() {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get('success');

  useEffect(() => {
    if (success === 'true') {
      toast.success('Payment successful! Your wallet has been credited');
      setSearchParams({});
    }
  }, [success, setSearchParams]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your wallet balance and transactions</p>
        </div>

        {/* Big Balance Card with Load Wallet Button */}
        <Card className="mb-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your current balance is</p>
                <div className="text-5xl font-bold text-success mb-4">
                  GH¢{profile?.balance?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-muted-foreground">
                  Available for data bundle purchases
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => {
                  document.getElementById('wallet-topup')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success text-white font-semibold shadow-lg hover:shadow-xl transition-all h-12 px-8"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Load Wallet
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="wallet-topup">
          {/* Top Up Card */}
          <div>
            <WalletTopUp />
          </div>

          {/* Transactions */}
          <div>
            <WalletTransactions />
          </div>
        </div>
      </main>
    </div>
  );
}

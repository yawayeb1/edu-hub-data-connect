import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BundleDropdown } from "@/components/BundleDropdown";
import { useBundlePurchase } from "@/hooks/useBundlePurchase";
import { useAuth } from "@/contexts/AuthContext";
import { PAYSTACK_PUBLIC_KEY } from "@/lib/paystack";
import { Lock, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function MTNUP2U() {
  const { profile, user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedBundle, setSelectedBundle] = useState("");

  const getButtonText = () => {
    if (!user) return "Please Sign In";
    if (!phoneNumber.trim()) return "Enter Phone Number";
    if (!selectedBundle) return "Select Bundle";
    if (!PAYSTACK_PUBLIC_KEY) return "Paystack Not Configured";
    return "Pay with Paystack";
  };

  const { handlePurchase, bundle, bundleLoading, isReady, bundlePrice } = useBundlePurchase({
    bundleId: selectedBundle,
    phoneNumber,
    network: "MTN_UP2U",
    onSuccess: (orderId) => {
      setPhoneNumber("");
      setSelectedBundle("");
      toast.success(`Order ${orderId} created successfully!`);
    },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">MTN MASTER BUNDLE</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Your Home deserves high speed internet. Enjoy fast & reliable connectivity with MTN high-speed bundles and strong network coverage.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto bg-card rounded-2xl shadow-lg p-6 md:p-8 border border-border">
            <div className="space-y-6">
              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  PROVIDE PHONE NUMBER <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Package Selector */}
              <div className="space-y-2">
                <Label htmlFor="package" className="text-sm font-medium">
                  CHOOSE A MENU <span className="text-destructive">*</span>
                </Label>
                <BundleDropdown
                  network="MTN_UP2U"
                  selectedBundle={selectedBundle}
                  onValueChange={setSelectedBundle}
                />
              </div>

              {/* Bundle Price Display */}
              {bundle && !bundleLoading && (
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Selected Bundle:</span>
                    <span className="text-sm font-semibold">{bundle.display_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Amount to Pay:</span>
                    <span className="text-xl font-bold text-primary">GH¢{bundle.price_ghc.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Balance Display */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Available balance :</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${(profile?.balance || 0) >= bundlePrice ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
                  <span className="text-lg font-bold text-foreground">GH¢{profile?.balance?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              {/* Pay Button */}
              <Button 
                size="lg" 
                onClick={handlePurchase}
                disabled={!isReady || bundleLoading}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bundleLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {getButtonText()}
                  </>
                )}
              </Button>
              
              {/* Helpful Message */}
              {!isReady && !bundleLoading && (
                <div className="text-xs text-muted-foreground text-center mt-2">
                  {!user && <p>Please sign in to make a purchase</p>}
                  {user && !phoneNumber.trim() && <p>Enter a phone number to continue</p>}
                  {user && phoneNumber.trim() && !selectedBundle && <p>Select a bundle to continue</p>}
                  {user && phoneNumber.trim() && selectedBundle && !PAYSTACK_PUBLIC_KEY && (
                    <p className="text-destructive">Paystack is not configured. Please add VITE_PAYSTACK_PUBLIC_KEY to your .env file.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Secured Footer */}
          <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Secured by Edu-Hub Data</span>
          </div>
        </div>
      </main>
    </div>
  );
}

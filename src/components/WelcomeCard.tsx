import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface WelcomeCardProps {
  userName?: string;
  balance?: string;
}

export function WelcomeCard({ userName, balance }: WelcomeCardProps) {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  
  const displayName = userName || profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayBalance = balance || profile?.balance?.toFixed(2) || '0.00';

  return (
    <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary via-primary to-primary-dark shadow-card">
      <div className="relative z-10 space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-2">
            Greetings, {displayName}! 👋
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Your current balance is{" "}
            <span className="font-bold text-xl">GH¢{displayBalance}</span>
          </p>
        </div>
        <Button 
          size="lg"
          onClick={() => navigate('/wallet')}
          className="bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-secondary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Load Wallet
        </Button>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl -ml-24 -mb-24" />
    </Card>
  );
}

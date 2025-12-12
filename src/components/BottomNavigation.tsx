import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Wifi, 
  Receipt,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Home",
    icon: Home,
    url: "/",
  },
  {
    title: "Services",
    icon: Wifi,
    url: "/services",
  },
  {
    title: "Transactions",
    icon: Receipt,
    url: "/transactions",
  },
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t border-border">
        <div className="flex items-center justify-around h-20 px-4">
          {navItems.map((item) => (
            <button
              key={item.url}
              onClick={() => navigate(item.url)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors text-xs",
                isActive(item.url)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors text-xs text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Spacer for mobile to prevent content overlap */}
      <div className="h-20 lg:hidden" />
    </>
  );
}

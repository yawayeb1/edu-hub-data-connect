import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { 
  Home, 
  Wifi, 
  Wallet, 
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  LogOut,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
  },
  {
    title: "Services",
    icon: Wifi,
    subItems: [
      { title: "AT iShare Business", url: "/services/at-ishare" },
      { title: "MTN UP2U Business", url: "/services/mtn-up2u" },
      { title: "Telecel Business", url: "/services/telecel" },
    ],
  },
  {
    title: "Wallet",
    icon: Wallet,
    url: "/wallet",
  },
  {
    title: "Transactions",
    icon: Receipt,
    url: "/transactions",
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Services"]);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
              <Wifi className="h-4 w-4 text-primary-foreground -ml-2 -mt-2" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Edu-Hub Data</h1>
              <p className="text-xs text-muted-foreground">Ghana Data Bundles</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.title}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.title)}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {expandedItems.includes(item.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {expandedItems.includes(item.title) && (
                        <ul className="mt-1 ml-7 space-y-1">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.url}>
                              <NavLink
                                to={subItem.url}
                                className="block px-3 py-2 text-sm text-muted-foreground rounded-lg hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                                activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.title}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 Edu-Hub Data Limited
            </p>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Built by SmartDEV Engineering
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

import { Sidebar } from "@/components/Sidebar";
import { WelcomeCard } from "@/components/WelcomeCard";
import { DashboardStats } from "@/components/DashboardStats";
import { RecentTransactions } from "@/components/RecentTransactions";
import { AccountOverview } from "@/components/AccountOverview";
import { SalesChart } from "@/components/SalesChart";
import { MonthlySalesChart } from "@/components/MonthlySalesChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to your data reselling hub</p>
          </div>

          <Tabs defaultValue="sales" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sales">Sales Overview</TabsTrigger>
              <TabsTrigger value="account">Account Details</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-6">
              {/* Welcome Card */}
              <WelcomeCard />

              {/* Stats Grid */}
              <DashboardStats />

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MonthlySalesChart />
                </div>
                <div>
                  <SalesChart />
                </div>
              </div>

              {/* Sales Points */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-8 border border-success/20">
                  <h3 className="text-lg font-semibold mb-2">Sales Points</h3>
                  <p className="text-sm text-muted-foreground mb-4">Total Product Sales</p>
                  <p className="text-4xl font-bold text-success">GH¢0</p>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-primary/20"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${0.25 * 2 * Math.PI * 88} ${2 * Math.PI * 88}`}
                        className="text-primary transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <p className="text-3xl font-bold text-primary">25%</p>
                      <p className="text-sm text-muted-foreground">Progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AccountOverview />
                <div className="lg:col-span-2">
                  <RecentTransactions />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;

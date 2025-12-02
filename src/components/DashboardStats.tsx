import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from './StatCard';
import { Heart, ShoppingCart, Users, Wallet, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardStats() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get total sales (sum of delivered orders)
      const { data: salesData, error: salesError } = await supabase
        .from('orders')
        .select('amount')
        .eq('user_id', user.id)
        .eq('status', 'delivered');

      if (salesError) throw salesError;

      // Get total orders count
      const { count: ordersCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'delivered');

      if (ordersError) throw ordersError;

      const totalSales = salesData?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
      const totalOrders = ordersCount || 0;

      return {
        totalSales,
        totalOrders,
        commission: 0.067, // Fixed for now
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Sales"
        value={`GH¢${(stats?.totalSales || 0).toFixed(2)}`}
        icon={Heart}
        iconBgClass="bg-primary-light"
        iconColorClass="text-primary"
      />
      <StatCard
        title="Total Orders"
        value={String(stats?.totalOrders || 0)}
        icon={ShoppingCart}
        iconBgClass="bg-success-light"
        iconColorClass="text-success"
      />
      <StatCard
        title="Visitors"
        value="0"
        icon={Users}
        iconBgClass="bg-info-light"
        iconColorClass="text-info"
      />
      <StatCard
        title="Commission"
        value={`GH¢${(stats?.commission || 0).toFixed(3)}`}
        icon={Wallet}
        iconBgClass="bg-destructive/10"
        iconColorClass="text-destructive"
      />
    </div>
  );
}


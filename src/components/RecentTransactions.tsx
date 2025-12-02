import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Order {
  order_id: string;
  msisdn: string;
  package: string;
  status: 'pending' | 'delivered' | 'failed' | 'refunded';
  created_at: string;
}

export function RecentTransactions() {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['recent-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('order_id, msisdn, package, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return (data || []) as Order[];
    },
    enabled: !!user,
  });

  const statusColors = {
    delivered: 'bg-success-light text-success border-success/20',
    pending: 'bg-warning-light text-warning border-warning/20',
    failed: 'bg-destructive/10 text-destructive border-destructive/20',
    refunded: 'bg-muted text-muted-foreground border-muted',
  };

  if (isLoading) {
    return (
      <Card className="p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      {!orders || orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No transactions yet</p>
          <p className="text-sm mt-2">Purchase bundles to see them here</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>MSISDN</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>
                  <span className="font-medium text-primary">{order.order_id}</span>
                </TableCell>
                <TableCell className="font-mono text-sm">{order.msisdn}</TableCell>
                <TableCell className="font-medium">{order.package}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={statusColors[order.status] || ''}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

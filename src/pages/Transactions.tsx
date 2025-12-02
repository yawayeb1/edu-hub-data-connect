import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Filter, Receipt, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Order {
  id: number;
  order_id: string;
  network: string;
  msisdn: string;
  package: string;
  amount: number;
  status: 'pending' | 'delivered' | 'failed' | 'refunded';
  created_at: string;
  bundle_gb?: number;
}

interface WalletTransaction {
  id: number;
  amount: number;
  type: 'credit' | 'debit';
  description: string | null;
  reference: string | null;
  status: string;
  created_at: string;
}

const statusColors = {
  delivered: 'bg-success-light text-success border-success/20',
  pending: 'bg-warning-light text-warning border-warning/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
  refunded: 'bg-muted text-muted-foreground border-muted',
};

const networkLabels: Record<string, string> = {
  MTN_UP2U: 'MTN UP2U',
  AT_ISHARE: 'AT iShare',
  AT_BIGTIME: 'AT Big Time',
  TELECEL: 'Telecel',
  MTN: 'MTN',
};

export default function Transactions() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get('success');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (success === 'true') {
      toast.success('Bundle delivered!');
      setSearchParams({});
    }
  }, [success, setSearchParams]);

  // Fetch orders
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders', user?.id, statusFilter, networkFilter],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (networkFilter !== 'all') {
        query = query.eq('network', networkFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Order[];
    },
    enabled: !!user,
  });

  // Fetch wallet transactions
  const { data: walletTransactions, isLoading: walletLoading, error: walletError } = useQuery({
    queryKey: ['wallet-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as WalletTransaction[];
    },
    enabled: !!user,
  });

  // Filter orders by search query
  const filteredOrders = orders?.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.order_id.toLowerCase().includes(query) ||
      order.msisdn.includes(query) ||
      order.package.toLowerCase().includes(query)
    );
  });

  if (!user) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Please sign in to view transactions</CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Transactions</h1>
          </div>
          <p className="text-muted-foreground">View all your bundle purchases and wallet activity</p>
        </div>

        <Tabs defaultValue="bundles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bundles" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Bundle Purchases
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Activity
            </TabsTrigger>
          </TabsList>

          {/* Bundle Purchases Tab */}
          <TabsContent value="bundles" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <CardTitle>Filters</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Search by order ID, phone, or package..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Network Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Network</label>
                    <Select value={networkFilter} onValueChange={setNetworkFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All networks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Networks</SelectItem>
                        <SelectItem value="MTN_UP2U">MTN UP2U</SelectItem>
                        <SelectItem value="AT_ISHARE">AT iShare</SelectItem>
                        <SelectItem value="AT_BIGTIME">AT Big Time</SelectItem>
                        <SelectItem value="TELECEL">Telecel</SelectItem>
                        <SelectItem value="MTN">MTN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Bundle Purchase History</CardTitle>
                <CardDescription>
                  {filteredOrders?.length || 0} order{filteredOrders?.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-12">
                    <p className="text-destructive">Error loading transactions</p>
                  </div>
                ) : !filteredOrders || filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No bundle purchases found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {searchQuery || statusFilter !== 'all' || networkFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Purchase your first bundle to see it here'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Network</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>Package</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              <span className="font-mono font-semibold text-primary">
                                {order.order_id}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {networkLabels[order.network] || order.network}
                              </span>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{order.msisdn}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{order.package}</span>
                                {order.bundle_gb && (
                                  <span className="text-xs text-muted-foreground">
                                    ({order.bundle_gb} GB)
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              GH¢{order.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={statusColors[order.status] || ''}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(order.created_at), 'MMM d, yyyy')}
                              <br />
                              <span className="text-xs">
                                {format(new Date(order.created_at), 'h:mm a')}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Activity Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Activity</CardTitle>
                <CardDescription>
                  All your wallet credits and debits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {walletLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : walletError ? (
                  <div className="text-center py-12">
                    <p className="text-destructive">Error loading wallet transactions</p>
                  </div>
                ) : !walletTransactions || walletTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No wallet transactions found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Top up your wallet to see transactions here
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {walletTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                              <br />
                              <span className="text-xs">
                                {format(new Date(transaction.created_at), 'h:mm a')}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {transaction.type === 'credit' ? (
                                  <ArrowDownCircle className="h-4 w-4 text-success" />
                                ) : (
                                  <ArrowUpCircle className="h-4 w-4 text-destructive" />
                                )}
                                <span
                                  className={`font-semibold ${
                                    transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                                  }`}
                                >
                                  {transaction.type === 'credit' ? '+' : '-'}GH¢
                                  {transaction.amount.toFixed(2)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  transaction.type === 'credit'
                                    ? 'bg-success-light text-success border-success/20'
                                    : 'bg-destructive/10 text-destructive border-destructive/20'
                                }
                              >
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {transaction.description || 'N/A'}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {transaction.reference || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  transaction.status === 'completed'
                                    ? 'bg-success-light text-success border-success/20'
                                    : ''
                                }
                              >
                                {transaction.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

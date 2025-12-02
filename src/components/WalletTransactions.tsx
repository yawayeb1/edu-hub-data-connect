import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: number;
  amount: number;
  type: 'credit' | 'debit';
  description: string | null;
  reference: string | null;
  status: string;
  created_at: string;
}

export function WalletTransactions() {
  const { user } = useAuth();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['wallet-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as Transaction[];
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Please sign in to view transactions</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Error loading transactions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your last 10 wallet transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {!transactions || transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Top up your wallet to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                      <br />
                      <span className="text-xs">
                        {format(new Date(transaction.created_at), 'h:mm a')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}GH¢
                        {transaction.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.type === 'credit' ? (
                          <ArrowDownCircle className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowUpCircle className="h-4 w-4 text-destructive" />
                        )}
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
                      </div>
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
  );
}


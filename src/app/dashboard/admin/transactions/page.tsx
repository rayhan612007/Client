'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Payment } from '@/lib/auth-shared';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { StatCard } from '@/components/StatCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Receipt, TrendingUp, Wallet } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ totalRevenue: number; data: Payment[] }>('/api/payments/admin/all')
      .then((res) => {
        setPayments(res.data);
        setTotalRevenue(res.totalRevenue ?? 0);
      })
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const average = payments.length > 0 ? totalRevenue / payments.length : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="Transactions"
        description="Every Stripe payment processed on FixMate, in one ledger."
        icon={Receipt}
        actions={
          <span className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground tabular-nums">
            {payments.length} payments
          </span>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={TrendingUp}
            accent="emerald"
            hint="Collected through Stripe (test mode)"
          />
          <StatCard
            label="Transactions"
            value={payments.length}
            icon={Receipt}
            accent="blue"
            hint="Successful completed-job payments"
          />
          <StatCard
            label="Average payment"
            value={`$${average.toFixed(2)}`}
            icon={Wallet}
            accent="violet"
            hint="Mean value per transaction"
          />
        </div>
      )}

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Payments made through Stripe will appear here as customers settle completed jobs."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Payment date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell className="font-medium">{payment.serviceTitle}</TableCell>
                <TableCell>
                  <p className="text-sm text-foreground/80">{payment.customerName}</p>
                  <p className="truncate text-xs text-muted-foreground">{payment.customerEmail}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-foreground/80">{payment.technicianName}</p>
                  <p className="truncate text-xs text-muted-foreground">{payment.technicianEmail}</p>
                </TableCell>
                <TableCell className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  ${payment.amount.toFixed(2)}
                  <span className="ml-1 text-[10px] font-normal text-muted-foreground uppercase">
                    {payment.currency}
                  </span>
                </TableCell>
                <TableCell className="max-w-[220px] truncate font-mono text-xs text-muted-foreground">
                  {payment.transactionId}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(payment.paidAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

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
import { Receipt, Wallet } from 'lucide-react';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ data: Payment[] }>('/api/payments/my')
      .then((res) => setPayments(res.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer workspace"
        title="Payment history"
        description="Every secure Stripe payment you have made for completed repairs."
        icon={Wallet}
      />

      {!loading && payments.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Total spent"
            value={`$${totalSpent.toFixed(2)}`}
            icon={Wallet}
            accent="emerald"
            hint="Across all completed and paid jobs"
          />
          <StatCard
            label="Payments made"
            value={payments.length}
            icon={Receipt}
            accent="blue"
            hint="Receipts are available from Stripe"
          />
        </div>
      )}

      {loading ? (
        <div className="h-52 animate-pulse rounded-2xl bg-muted" />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No payments yet"
          description="Once you pay for a completed repair, the transaction and receipt will appear here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell className="font-medium">{payment.serviceTitle}</TableCell>
                <TableCell className="text-sm text-foreground/80">
                  {payment.technicianName}
                </TableCell>
                <TableCell className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  ${payment.amount.toFixed(2)}
                </TableCell>
                <TableCell className="max-w-[220px] truncate font-mono text-xs text-muted-foreground">
                  {payment.transactionId}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(payment.paidAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

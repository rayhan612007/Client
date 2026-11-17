import { STATUS_BADGE, BookingStatus, ApprovalStatus } from '@/lib/auth-shared';

const APPROVAL_BADGE: Record<ApprovalStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[status]}`}>
      {status}
    </span>
  );
}

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${APPROVAL_BADGE[status]}`}>
      {status}
    </span>
  );
}

export function PayBadge({ paid }: { paid: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        paid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {paid ? 'Paid' : 'Unpaid'}
    </span>
  );
}

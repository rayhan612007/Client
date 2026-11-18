import {
  APPROVAL_LABEL,
  BookingStatus,
  ApprovalStatus,
  STATUS_LABEL,
} from '@/lib/auth-shared';

type Tone = 'blue' | 'indigo' | 'amber' | 'emerald' | 'rose' | 'zinc';

const TONES: Record<Tone, string> = {
  blue: 'bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300',
  indigo: 'bg-indigo-500/10 text-indigo-700 ring-indigo-500/20 dark:text-indigo-300',
  amber: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300',
  emerald: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
  rose: 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300',
  zinc: 'bg-zinc-500/10 text-zinc-600 ring-zinc-500/20 dark:text-zinc-300',
};

const DOT: Record<Tone, string> = {
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500',
  zinc: 'bg-zinc-400',
};

const STATUS_TONE: Record<BookingStatus, Tone> = {
  requested: 'blue',
  accepted: 'indigo',
  'in-progress': 'amber',
  completed: 'emerald',
  rejected: 'rose',
  cancelled: 'zinc',
};

const APPROVAL_TONE: Record<ApprovalStatus, Tone> = {
  pending: 'amber',
  approved: 'emerald',
  rejected: 'rose',
};

function Badge({
  tone,
  label,
  dot = true,
}: {
  tone: Tone;
  label: string;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${TONES[tone]}`}
    >
      {dot && <span className={`size-1.5 rounded-full ${DOT[tone]}`} />}
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <Badge tone={STATUS_TONE[status]} label={STATUS_LABEL[status]} />;
}

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  return <Badge tone={APPROVAL_TONE[status]} label={APPROVAL_LABEL[status]} />;
}

export function PayBadge({ paid }: { paid: boolean }) {
  return (
    <Badge
      tone={paid ? 'emerald' : 'zinc'}
      label={paid ? 'Paid' : 'Unpaid'}
    />
  );
}

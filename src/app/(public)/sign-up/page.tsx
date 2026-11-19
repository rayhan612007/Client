'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AvatarPicker } from '@/components/AvatarPicker';
import { Field } from '@/components/SettingsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from 'lucide-react';

type SignUpRole = 'customer' | 'technician';

const ROLE_OPTIONS: {
  value: SignUpRole;
  label: string;
  description: string;
  icon: typeof UserRound;
}[] = [
    {
      value: 'customer',
      label: 'Customer',
      description: 'Book repair services',
      icon: UserRound,
    },
    {
      value: 'technician',
      label: 'Technician',
      description: 'Offer repair services',
      icon: Wrench,
    },
  ];

const BENEFITS = [
  'Book verified technicians in minutes',
  'Track every repair step in real time',
  'Secure payments, released only when done',
];

const STATS: [string, string][] = [
  ['12k+', 'Repairs done'],
  ['4.9', 'Avg. rating'],
  ['24/7', 'Support'],
];

function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 6) errors.push('At least 6 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
  return errors;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState('');
  const [role, setRole] = useState<SignUpRole>('customer');
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const pwErrors = password ? validatePassword(password) : [];
  const busy = loading || avatarUploading;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (pwErrors.length > 0) {
      toast.error('Please fix the password errors first');
      return;
    }

    setLoading(true);
    // role is sanitized again server-side (BetterAuth hook) - admin is never selectable
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email,
      password,
      role,
      ...(image ? { image } : {}),
    } as Parameters<typeof authClient.signUp.email>[0]);
    setLoading(false);

    if (error) {
      toast.error(error.message ?? 'Sign up failed');
      return;
    }

    toast.success('Account created! Redirecting to your dashboard...');
    router.push(`/dashboard/${role}`);
    router.refresh();
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-50" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* Brand panel */}
        <div className="hidden lg:block" data-aos="fade-right">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-10 text-white shadow-2xl shadow-blue-950/30 lg:flex lg:min-h-[700px] lg:flex-col lg:justify-center">
            <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-blue-500/20 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-cyan-500/15 blur-[100px]" />

            <div className="relative w-full">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold tracking-wide text-blue-200 uppercase backdrop-blur">
                <Sparkles className="size-3.5" />
                Join FixMate free
              </span>

              <h2 className="mt-8 text-4xl leading-[1.1] font-bold tracking-tight">
                Your device, in
                <span className="mt-1 block bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  expert hands.
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
                Create a free account to book trusted repairs or grow your repair business —
                all in one place.
              </p>

              <ul className="mt-8 space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
                      <ShieldCheck className="size-3" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur">
                {STATS.map(([value, label]) => (
                  <div key={label}>
                    <p className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-bold text-transparent">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto w-full max-w-md" data-aos="fade-left">
          <div className="lg:hidden">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <Wrench className="size-5" />
            </span>
          </div>

          <div className="mt-5 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Join FixMate as a customer or a technician.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-lg shadow-slate-900/[0.03] sm:p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="rounded-xl  bg-muted/20 p-3">
                <div className="flex mb-1 items-center justify-between gap-3">
                  <p className="text-sm font-medium">Profile photo</p>
                  <span className="text-[11px] text-muted-foreground">Optional</span>
                </div>
                <AvatarPicker
                  name={name}
                  value={image}
                  onChange={setImage}
                  onUploadingChange={setAvatarUploading}
                  size="md"
                />
              </div>

              <div className="grid">
                <Field label="Full name" htmlFor="name">
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="h-11 rounded-xl pl-9"
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                    />
                  </div>
                </Field>

                <Field label="Email address" htmlFor="email">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-11 rounded-xl pl-9"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </Field>
              </div>

              <div>
                <Field label="Password" htmlFor="password" hint="6+ chars · Aa">
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-11 rounded-xl pr-10 pl-9"
                      placeholder="Create a secure password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </Field>
                {pwErrors.length > 0 && (
                  <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-destructive">
                    {pwErrors.map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                  </ul>
                )}
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-medium">I am a...</legend>
                <div className="grid grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const active = role === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        aria-pressed={active}
                        className={cn(
                          'flex items-center gap-2.5 rounded-xl border p-3 text-left transition',
                          active
                            ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                            : 'border-border text-foreground hover:bg-muted',
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{option.label}</span>
                          <span className="block text-[11px] text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full rounded-xl"
                disabled={busy}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign up
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              Protected by BetterAuth encrypted sessions
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Just browsing?{' '}
            <Link
              href="/services"
              className="font-medium text-foreground hover:text-primary hover:underline"
            >
              Explore repair services
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

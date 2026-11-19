'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Field } from '@/components/SettingsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

const BENEFITS = [
  'Verified, background-checked technicians',
  'Live job tracking from request to completion',
  'Pay online only after the repair is done',
];

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? 'Invalid credentials');
      return;
    }
    toast.success('Signed in successfully');
    // Only follow same-origin relative paths — blocks open redirects like //evil.com
    if (next && next.startsWith('/') && !next.startsWith('//')) {
      router.push(next);
      return;
    }
    const res = await fetch('/api/auth/get-session', { credentials: 'include' });
    const session = await res.json().catch(() => null);
    const role = session?.user?.role ?? 'customer';
    router.push(`/dashboard/${role}`);
    router.refresh();
  }

  async function signInWithGoogle() {
    const callbackURL =
      next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

    setGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      });
      if (error) toast.error(error.message ?? 'Google sign-in failed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint opacity-50" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* Brand panel */}
        <div className="hidden lg:block" data-aos="fade-right">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-10 text-white shadow-2xl shadow-blue-950/30">
            <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-blue-500/20 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-cyan-500/15 blur-[100px]" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold tracking-wide text-blue-200 uppercase backdrop-blur">
                <Sparkles className="size-3.5" />
                Trusted repair platform
              </span>

              <h2 className="mt-8 text-4xl leading-[1.1] font-semibold tracking-tight">
                Repairs you can
                <span className="mt-1 block bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  actually trust.
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
                Track every milestone and pay only when your device is fixed and tested —
                never a rupee before.
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

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <p className="text-sm leading-relaxed text-slate-300">
                  “Technician arrived on time, fixed my AC and I only paid after testing it.
                  Exactly how repairs should work.”
                </p>
                <div className="mt-3 flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold">
                    RA
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Rafiq Ahmed</p>
                    <p className="text-[11px] text-slate-400">Verified customer · Dhaka</p>
                  </div>
                </div>
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
          <h1 className="mt-5 text-3xl font-bold tracking-tight lg:mt-0">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to manage your bookings, services and payments.
          </p>

          <div className="mt-8 rounded-2xl border border-border/70 bg-card p-6 text-card-foreground shadow-lg shadow-slate-900/[0.03] sm:p-8">
            <form onSubmit={onSubmit} className="space-y-5">
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

              <Field label="Password" htmlFor="password">
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 rounded-xl pr-10 pl-9"
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full rounded-xl"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              OR
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11 w-full rounded-xl"
              onClick={signInWithGoogle}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FcGoogle className="size-4" aria-hidden="true" />
              )}
              Continue with Google
            </Button>

            <div className="mt-6 flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              SECURE SIGN IN
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Protected by BetterAuth encrypted sessions
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to FixMate?{' '}
            <Link href="/sign-up" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Just browsing?{' '}
            <Link href="/services" className="font-medium text-foreground hover:text-primary hover:underline">
              Explore repair services
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

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
import { Loader2, UserRound, Wrench } from 'lucide-react';

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
    <div className="mx-auto w-full max-w-lg px-4 py-12 sm:py-16">
      <div className="text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
          <Wrench className="size-6" />
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join FixMate as a customer or a technician.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs sm:p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="border-b border-border/70 pb-5">
            <p className="mb-3 text-sm font-medium">
              Profile photo <span className="font-normal text-muted-foreground">(optional)</span>
            </p>
            <AvatarPicker
              name={name}
              value={image}
              onChange={setImage}
              onUploadingChange={setAvatarUploading}
              size="lg"
            />
          </div>

          <Field label="Full name" htmlFor="name">
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 rounded-xl"
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </Field>

          <Field label="Email address" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 rounded-xl"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>

          <div>
            <Field label="Password" htmlFor="password">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-10 rounded-xl"
                placeholder="Enter a secure password"
                autoComplete="new-password"
                required
              />
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
                      'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition',
                      active
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                        : 'border-border text-foreground hover:bg-muted',
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

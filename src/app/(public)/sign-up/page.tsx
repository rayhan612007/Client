'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

function validatePassword(pw: string): string[] {
  const errors: string[] = [];
  if (pw.length < 6) errors.push('At least 6 characters');
  if (!/[A-Z]/.test(pw)) errors.push('At least one uppercase letter');
  if (!/[a-z]/.test(pw)) errors.push('At least one lowercase letter');
  return errors;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  const [loading, setLoading] = useState(false);

  const pwErrors = password ? validatePassword(password) : [];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (pwErrors.length > 0) {
      toast.error('Please fix the password errors first');
      return;
    }
    setLoading(true);
    // role is sanitized again server-side (BetterAuth hook) — admin is never selectable
    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      role,
    } as Parameters<typeof authClient.signUp.email>[0]);
    setLoading(false);
    if (error) {
      toast.error(error.message ?? 'Sign up failed');
      return;
    }
    toast.success('Account created! Redirecting to your dashboard…');
    router.push(`/dashboard/${role}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold">Create Account</h1>
      <p className="mt-1 text-gray-500">Join FixMate as a customer or technician</p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <label className="text-sm font-medium">
          Full Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Your name"
            required
          />
        </label>
        <label className="text-sm font-medium">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="text-sm font-medium">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="••••••"
            required
          />
        </label>
        {pwErrors.length > 0 && (
          <ul className="-mt-2 list-inside list-disc text-xs text-red-500">
            {pwErrors.map((er) => (
              <li key={er}>{er}</li>
            ))}
          </ul>
        )}
        <fieldset className="text-sm font-medium">
          <legend className="mb-2">I am a…</legend>
          <div className="grid grid-cols-2 gap-3">
            {(['customer', 'technician'] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`rounded-xl border px-4 py-3 capitalize transition ${
                  role === r
                    ? 'border-blue-600 bg-blue-50 font-semibold text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {r === 'customer' ? '🛍️ Customer' : '🔧 Technician'}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

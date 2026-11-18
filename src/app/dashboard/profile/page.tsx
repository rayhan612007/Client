'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

import type { Role } from '@/lib/auth-shared';
import { AvatarPicker } from '@/components/AvatarPicker';
import { Field, SettingsCard } from '@/components/SettingsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { KeyRound, Loader2, Mail, ShieldCheck, UserRound } from 'lucide-react';

type ProfileUser = {
  name?: string | null;
  email: string;
  image?: string | null;
  role?: Role;
  phone?: string | null;
  area?: string | null;
  bio?: string | null;
};

type ProfileValues = {
  name: string;
  image: string;
  phone: string;
  area: string;
  bio: string;
};

const ROLE_LABEL: Record<Role, string> = {
  customer: 'Customer',
  technician: 'Technician',
  admin: 'Administrator',
};

const BIO_LIMIT = 300;

function validatePassword(password: string) {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password)) return 'Password needs at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password needs at least one lowercase letter';
  return '';
}

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Skeleton className="h-96 rounded-2xl lg:col-span-3" />
      <div className="space-y-6 lg:col-span-2">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user as ProfileUser | undefined;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile & settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your contact details up to date and manage your account security.
        </p>
      </header>

      {isPending || !user ? (
        <ProfileSkeleton />
      ) : (
        <ProfileForm user={user} onSaved={refetch} />
      )}
    </div>
  );
}

function ProfileForm({
  user,
  onSaved,
}: {
  user: ProfileUser;
  onSaved: () => Promise<void>;
}) {
  const initial: ProfileValues = {
    name: user.name ?? '',
    image: user.image ?? '',
    phone: user.phone ?? '',
    area: user.area ?? '',
    bio: user.bio ?? '',
  };

  const [form, setForm] = useState<ProfileValues>(initial);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const dirty = (Object.keys(initial) as (keyof ProfileValues)[]).some(
    (key) => form[key] !== initial[key],
  );

  function set<K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error('Your name is required');
      return;
    }

    setSaving(true);
    try {
      const payload: Parameters<typeof authClient.updateUser>[0] & {
        phone: string;
        area: string;
        bio: string;
      } = {
        name: form.name.trim(),
        image: form.image.trim(),
        phone: form.phone.trim(),
        area: form.area.trim(),
        bio: form.bio.trim(),
      };

      const { error } = await authClient.updateUser(payload);
      if (error) {
        toast.error(error.message ?? 'Could not update your profile');
        return;
      }

      await onSaved();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Could not update your profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <SettingsCard
          icon={UserRound}
          title="Personal information"
          description="This is how you appear across FixMate."
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={!dirty || saving || avatarUploading}
                onClick={() => setForm(initial)}
              >
                Reset
              </Button>
              <Button type="submit" form="profile-form" size="lg" disabled={!dirty || saving || avatarUploading}>
                {saving && <Loader2 className="size-4 animate-spin" />}
                Save changes
              </Button>
            </>
          }
        >
          <form id="profile-form" onSubmit={saveProfile} className="space-y-5">
            <div className="border-b border-border/70 pb-5">
              <AvatarPicker
                name={form.name}
                value={form.image}
                onChange={(url) => set('image', url)}
                onUploadingChange={setAvatarUploading}
              />
            </div>

            <Field label="Full name" htmlFor="name">
              <Input
                id="name"
                value={form.name}
                onChange={(event) => set('name', event.target.value)}
                className="h-10 rounded-xl"
                placeholder="Your full name"
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone" htmlFor="phone" hint="Optional">
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(event) => set('phone', event.target.value)}
                  className="h-10 rounded-xl"
                  placeholder="+880 1700-000000"
                  inputMode="tel"
                />
              </Field>
              <Field label="Area" htmlFor="area" hint="Optional">
                <Input
                  id="area"
                  value={form.area}
                  onChange={(event) => set('area', event.target.value)}
                  className="h-10 rounded-xl"
                  placeholder="Mirpur, Dhaka"
                />
              </Field>
            </div>

            <Field
              label="Bio"
              htmlFor="bio"
              hint={`${form.bio.length}/${BIO_LIMIT}`}
            >
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(event) => set('bio', event.target.value)}
                rows={4}
                maxLength={BIO_LIMIT}
                className="rounded-xl"
                placeholder="Tell customers or technicians a little about yourself."
              />
            </Field>
          </form>
        </SettingsCard>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <SettingsCard
          icon={ShieldCheck}
          title="Account"
          description="Managed by FixMate."
        >
          <div className="space-y-4">
            <Field label="Email address" htmlFor="email" hint="Read-only">
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  disabled
                  className="h-10 rounded-xl pl-9"
                />
              </div>
            </Field>

            <Field label="Account type" htmlFor="role">
              <div
                id="role"
                className="flex h-10 items-center rounded-xl border border-border bg-muted/40 px-3 text-sm font-medium capitalize"
              >
                {ROLE_LABEL[user.role ?? 'customer']}
              </div>
            </Field>
          </div>
        </SettingsCard>

        <PasswordCard />
      </div>
    </div>
  );
}

function PasswordCard() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  async function updatePassword(event: React.FormEvent) {
    event.preventDefault();

    if (!current || !next || !confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (next !== confirm) {
      toast.error('New passwords do not match');
      return;
    }
    const ruleError = validatePassword(next);
    if (ruleError) {
      toast.error(ruleError);
      return;
    }

    setSaving(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
        revokeOtherSessions: true,
      });
      if (error) {
        toast.error(error.message ?? 'Could not update your password');
        return;
      }
      toast.success('Password updated');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch {
      toast.error('Could not update your password');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsCard
      icon={KeyRound}
      title="Password"
      description="Use at least 6 characters with upper and lowercase letters."
      footer={
        <Button type="submit" form="password-form" size="lg" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Update password
        </Button>
      }
    >
      <form id="password-form" onSubmit={updatePassword} className="space-y-4">
        <Field label="Current password" htmlFor="current-password">
          <Input
            id="current-password"
            type="password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            className="h-10 rounded-xl"
            autoComplete="current-password"
            placeholder="Enter a secure password"
          />
        </Field>
        <Field label="New password" htmlFor="new-password">
          <Input
            id="new-password"
            type="password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            className="h-10 rounded-xl"
            autoComplete="new-password"
            placeholder="Enter a secure password"
          />
        </Field>
        <Field label="Confirm new password" htmlFor="confirm-password">
          <Input
            id="confirm-password"
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="h-10 rounded-xl"
            autoComplete="new-password"
            placeholder="Enter a secure password"
          />
        </Field>
      </form>
    </SettingsCard>
  );
}


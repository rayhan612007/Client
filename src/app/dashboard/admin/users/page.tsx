'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { AppUser, Role } from '@/lib/auth-shared';
import { authClient } from '@/lib/auth-client';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { FilterPills } from '@/components/FilterPills';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Search, UserCog, Users } from 'lucide-react';

const ROLES: Role[] = ['customer', 'technician', 'admin'];

const ROLE_TONE: Record<Role, string> = {
  customer: 'bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300',
  technician: 'bg-indigo-500/10 text-indigo-700 ring-indigo-500/20 dark:text-indigo-300',
  admin: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
};

type RoleFilter = Role | 'all';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const { data: session } = authClient.useSession();
  const myEmail = (session?.user as { email?: string } | undefined)?.email;

  async function load() {
    try {
      const res = await api<{ data: AppUser[] }>('/api/admin/users');
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    api<{ data: AppUser[] }>('/api/admin/users')
      .then((res) => {
        if (active) setUsers(res.data);
      })
      .catch(() => {
        if (active) setUsers([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function changeRole(user: AppUser, role: Role) {
    if (user.email === myEmail) return;
    setBusyId(user._id);
    try {
      await api(`/api/admin/users/${user._id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      toast.success(`${user.name} is now ${role}`);
      setUsers((current) =>
        current.map((entry) => (entry._id === user._id ? { ...entry, role } : entry)),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Role update failed');
      load();
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesQuery =
        !needle ||
        user.name?.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle);
      return matchesRole && matchesQuery;
    });
  }, [users, roleFilter, query]);

  const roleOptions: { value: RoleFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: users.length },
    ...ROLES.map((role) => ({
      value: role,
      label: role,
      count: users.filter((user) => user.role === role).length,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin workspace"
        title="Manage users"
        description="Review every account and adjust roles. You cannot change your own role."
        icon={Users}
        actions={
          <span className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground tabular-nums">
            {users.length} users
          </span>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterPills options={roleOptions} value={roleFilter} onChange={setRoleFilter} />
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-xl border border-input bg-card pr-3 pl-9 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="No users found"
          description="Try a different search term or role filter."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => {
              const isMe = user.email === myEmail;
              return (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex min-w-[180px] items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          user.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}`
                        }
                        alt=""
                        className="size-9 rounded-full object-cover ring-1 ring-border"
                      />
                      <span className="text-sm font-semibold">
                        {user.name}
                        {isMe && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    {isMe ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${ROLE_TONE[user.role]}`}
                      >
                        {user.role}
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        disabled={busyId === user._id}
                        onChange={(event) => changeRole(user, event.target.value as Role)}
                        aria-label={`Change role for ${user.name}`}
                        className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs font-semibold capitalize outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50 dark:bg-input/30"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

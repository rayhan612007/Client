'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AppUser, Role } from '@/lib/auth-shared';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

const ROLES: Role[] = ['customer', 'technician', 'admin'];

const ROLE_BADGE: Record<Role, string> = {
  customer: 'bg-blue-100 text-blue-700',
  technician: 'bg-indigo-100 text-indigo-700',
  admin: 'bg-purple-100 text-purple-700',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
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
    api<{ data: AppUser[] }>('/api/admin/users')
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
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
      setUsers((cur) => cur.map((u) => (u._id === user._id ? { ...u, role } : u)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Role update failed');
      load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <div className="mt-6 rounded-2xl bg-white p-12 text-center">
          <p className="text-5xl" aria-hidden>🧑‍💼</p>
          <p className="mt-3 font-semibold">No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <span className="text-sm text-gray-500">{users.length} users</span>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isMe = u.email === myEmail;
              return (
                <tr key={u._id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={u.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}`}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {u.name}
                    {isMe && <span className="ml-2 text-xs font-normal text-gray-400">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    {isMe ? (
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE[u.role]}`}>
                        {u.role}
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        disabled={busyId === u._id}
                        onChange={(e) => changeRole(u, e.target.value as Role)}
                        aria-label={`Change role for ${u.name}`}
                        className="rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-semibold focus:border-blue-500 focus:outline-none disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-400">You cannot change your own role.</p>
    </div>
  );
}

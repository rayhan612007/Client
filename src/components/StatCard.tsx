'use client';

import { ReactNode } from 'react';

export function StatCard({ label, value, icon }: { label: string; value: ReactNode; icon: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl" aria-hidden>
        {icon}
      </span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function StatCardExport() {
  return null;
}

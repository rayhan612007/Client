'use client';

import { useEffect, useState } from 'react';
import { api, uploadImage } from '@/lib/api';
import { Service, CATEGORIES } from '@/lib/auth-shared';
import { ApprovalBadge } from '@/components/badges';
import { toast } from 'sonner';

interface EditState {
  _id: string;
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  image: string;
}

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api<{ data: Service[] }>('/api/services/my/all');
      setServices(res.data);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleAvailable(s: Service) {
    try {
      await api(`/api/services/${s._id}`, { method: 'PATCH', body: JSON.stringify({ isAvailable: !s.isAvailable }) });
      toast.success(s.isAvailable ? 'Service marked unavailable' : 'Service marked available');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function onDelete(id: string) {
    setDeleteId(null);
    try {
      await api(`/api/services/${id}`, { method: 'DELETE' });
      toast.success('Service deleted');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  async function onSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    try {
      await api(`/api/services/${edit._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: edit.title,
          category: edit.category,
          description: edit.description,
          basePrice: Number(edit.basePrice),
          estimatedDuration: edit.estimatedDuration,
          serviceMode: edit.serviceMode,
          serviceArea: edit.serviceArea,
          ...(edit.image !== services.find((s) => s._id === edit._id)?.image ? { image: edit.image } : {}),
        }),
      });
      toast.success('Service updated — sent back to admin approval');
      setEdit(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  const input = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none';

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">My Services</h1>
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center">
        <p className="text-5xl" aria-hidden>🔧</p>
        <p className="mt-3 font-semibold">No services yet</p>
        <a href="/dashboard/technician/add-service" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Add Your First Service
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Services</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Approval</th>
              <th className="px-4 py-3">Available</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="h-10 w-14 rounded-lg object-cover" />
                    <span className="font-medium">{s.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{s.category}</td>
                <td className="px-4 py-3">${s.basePrice}</td>
                <td className="px-4 py-3"><ApprovalBadge status={s.approvalStatus} /></td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAvailable(s)}
                    className={`relative h-6 w-11 rounded-full transition ${s.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                    aria-label="Toggle availability"
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${s.isAvailable ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEdit({
                          _id: s._id,
                          title: s.title,
                          category: s.category,
                          description: s.description,
                          basePrice: String(s.basePrice),
                          estimatedDuration: s.estimatedDuration,
                          serviceMode: s.serviceMode,
                          serviceArea: s.serviceArea,
                          image: s.image,
                        })
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button onClick={() => setDeleteId(s._id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* edit modal */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4" onClick={() => setEdit(null)}>
          <form
            onSubmit={onSaveEdit}
            onClick={(e) => e.stopPropagation()}
            className="my-8 w-full max-w-lg rounded-2xl bg-white p-6"
          >
            <h2 className="text-xl font-bold">Edit Service</h2>
            <p className="text-xs text-amber-600">Note: editing sends the service back to admin approval.</p>
            <div className="mt-4 flex flex-col gap-3">
              <label className="text-sm font-medium">
                Title
                <input required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className={input} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium">
                  Category
                  <select value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} className={input}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Base Price (USD)
                  <input required type="number" min="1" step="0.01" value={edit.basePrice} onChange={(e) => setEdit({ ...edit, basePrice: e.target.value })} className={input} />
                </label>
              </div>
              <label className="text-sm font-medium">
                Description
                <textarea required rows={3} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} className={input} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium">
                  Estimated Duration
                  <input required value={edit.estimatedDuration} onChange={(e) => setEdit({ ...edit, estimatedDuration: e.target.value })} className={input} />
                </label>
                <label className="text-sm font-medium">
                  Service Mode
                  <select value={edit.serviceMode} onChange={(e) => setEdit({ ...edit, serviceMode: e.target.value })} className={input}>
                    <option>Home Visit</option>
                    <option>Shop Drop-off</option>
                  </select>
                </label>
              </div>
              <label className="text-sm font-medium">
                Service Area
                <input required value={edit.serviceArea} onChange={(e) => setEdit({ ...edit, serviceArea: e.target.value })} className={input} />
              </label>
              <label className="text-sm font-medium">
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadImage(file);
                      setEdit((cur) => (cur ? { ...cur, image: url } : cur));
                      toast.success('Image uploaded');
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : 'Upload failed');
                    }
                  }}
                  className="mt-1 w-full text-sm"
                />
              </label>
              {edit.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={edit.image} alt="preview" className="h-28 w-full max-w-xs rounded-xl object-cover" />
              )}
              <div className="mt-2 flex gap-3">
                <button type="button" onClick={() => setEdit(null)} className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDeleteId(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl" aria-hidden>🗑️</p>
            <h2 className="mt-2 text-lg font-bold">Delete this service?</h2>
            <p className="mt-1 text-sm text-gray-500">This can&apos;t be undone.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-lg border border-gray-300 py-2 font-semibold hover:bg-gray-50">
                Keep Service
              </button>
              <button onClick={() => onDelete(deleteId)} className="flex-1 rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-red-700">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

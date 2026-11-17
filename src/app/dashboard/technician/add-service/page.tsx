'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, uploadImage } from '@/lib/api';
import { CATEGORIES } from '@/lib/auth-shared';
import { toast } from 'sonner';

export default function AddServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: CATEGORIES[0],
    description: '',
    basePrice: '',
    estimatedDuration: '',
    serviceMode: 'Home Visit',
    serviceArea: '',
  });

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(form.basePrice);
    if (!image) {
      toast.error('Please upload a service image');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      toast.error('Base price must be a positive number');
      return;
    }
    setSaving(true);
    try {
      await api('/api/services', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          description: form.description,
          image,
          basePrice: price,
          estimatedDuration: form.estimatedDuration,
          serviceMode: form.serviceMode,
          serviceArea: form.serviceArea,
        }),
      });
      toast.success('Service added! Waiting for admin approval.');
      router.push('/dashboard/technician/my-services');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add service');
    } finally {
      setSaving(false);
    }
  }

  const input = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none';

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Add a Service</h1>
      <p className="text-sm text-gray-500">New services stay pending until an admin approves them.</p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6">
        <label className="text-sm font-medium">
          Title
          <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={input} placeholder="e.g. iPhone Screen Replacement" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Category
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={input}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Base Price (USD)
            <input required type="number" min="1" step="0.01" value={form.basePrice} onChange={(e) => set('basePrice', e.target.value)} className={input} placeholder="50" />
          </label>
        </div>
        <label className="text-sm font-medium">
          Description
          <textarea required rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className={input} placeholder="What does this service include?" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Estimated Duration
            <input required value={form.estimatedDuration} onChange={(e) => set('estimatedDuration', e.target.value)} className={input} placeholder="e.g. 2-3 hours" />
          </label>
          <label className="text-sm font-medium">
            Service Mode
            <select value={form.serviceMode} onChange={(e) => set('serviceMode', e.target.value)} className={input}>
              <option>Home Visit</option>
              <option>Shop Drop-off</option>
            </select>
          </label>
        </div>
        <label className="text-sm font-medium">
          Service Area
          <input required value={form.serviceArea} onChange={(e) => set('serviceArea', e.target.value)} className={input} placeholder='e.g. "Dhanmondi, Dhaka"' />
        </label>
        <label className="text-sm font-medium">
          Service Image <span className="text-xs text-gray-400">(file upload via ImgBB)</span>
          <input required type="file" accept="image/*" onChange={onImage} className="mt-1 w-full text-sm" />
        </label>
        {uploading && <p className="text-xs text-blue-600">Uploading image…</p>}
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="service preview" className="h-36 w-full max-w-xs rounded-xl object-cover" />
        )}
        <button type="submit" disabled={saving || uploading} className="mt-2 rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Add Service'}
        </button>
      </form>
    </div>
  );
}

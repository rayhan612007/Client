'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { api, uploadImage } from '@/lib/api';
import { CATEGORIES } from '@/lib/auth-shared';
import { PageHeader } from '@/components/PageHeader';
import { Field } from '@/components/SettingsCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ImagePlus, Loader2, Plus, Sparkles, Wrench } from 'lucide-react';

const SELECT_CLASS =
  'h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30';

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
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
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

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
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

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Technician workspace"
        title="Add a service"
        description="New listings stay pending until an admin reviews and approves them."
        icon={Plus}
      />

      <form
        onSubmit={onSubmit}
        data-aos="fade-up"
        className="overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-xs"
      >
        <div className="flex items-start gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wrench className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Service details</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Clear titles and descriptions help customers choose the right repair.
            </p>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          <Field label="Service title" htmlFor="title">
            <Input
              id="title"
              required
              value={form.title}
              onChange={(event) => set('title', event.target.value)}
              className="h-11 rounded-xl"
              placeholder="e.g. iPhone Screen Replacement"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" htmlFor="category">
              <select
                id="category"
                value={form.category}
                onChange={(event) => set('category', event.target.value)}
                className={SELECT_CLASS}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Base price (USD)" htmlFor="basePrice">
              <Input
                id="basePrice"
                required
                type="number"
                min="1"
                step="0.01"
                value={form.basePrice}
                onChange={(event) => set('basePrice', event.target.value)}
                className="h-11 rounded-xl"
                placeholder="50"
              />
            </Field>
          </div>

          <Field label="Description" htmlFor="description">
            <Textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={(event) => set('description', event.target.value)}
              className="rounded-xl"
              placeholder="What does this service include? Parts, warranty, process..."
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Estimated duration" htmlFor="duration">
              <Input
                id="duration"
                required
                value={form.estimatedDuration}
                onChange={(event) => set('estimatedDuration', event.target.value)}
                className="h-11 rounded-xl"
                placeholder="e.g. 2-3 hours"
              />
            </Field>
            <Field label="Service mode" htmlFor="mode">
              <select
                id="mode"
                value={form.serviceMode}
                onChange={(event) => set('serviceMode', event.target.value)}
                className={SELECT_CLASS}
              >
                <option>Home Visit</option>
                <option>Shop Drop-off</option>
              </select>
            </Field>
          </div>

          <Field label="Service area" htmlFor="area">
            <Input
              id="area"
              required
              value={form.serviceArea}
              onChange={(event) => set('serviceArea', event.target.value)}
              className="h-11 rounded-xl"
              placeholder="e.g. Dhanmondi, Dhaka"
            />
          </Field>

          <Field label="Service image" htmlFor="image" hint="Uploaded via ImgBB">
            <label
              htmlFor="image"
              className="group relative mt-1 flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30 transition hover:border-primary/40 hover:bg-muted/50"
            >
              {image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Service preview" className="h-44 w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/50 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                    Change image
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ImagePlus className="size-5" />
                  </span>
                  <span className="text-sm font-semibold">Click to upload an image</span>
                  <span className="text-xs text-muted-foreground">
                    PNG, JPG or WEBP · recommended 1200 × 800
                  </span>
                </span>
              )}
              {uploading && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 text-xs font-semibold text-primary backdrop-blur-sm">
                  <Loader2 className="size-5 animate-spin" />
                  Uploading image...
                </span>
              )}
              <input
                id="image"
                required
                type="file"
                accept="image/*"
                onChange={onImage}
                className="sr-only"
              />
            </label>
          </Field>

          <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-3 text-xs leading-relaxed text-primary ring-1 ring-primary/10">
            <Sparkles className="mt-0.5 size-3.5 shrink-0" />
            After saving, an administrator reviews your listing. You can track its approval state
            in My services.
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Link
            href="/dashboard/technician/my-services"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-medium transition hover:bg-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-50"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            {saving ? 'Saving...' : 'Add service'}
          </button>
        </div>
      </form>
    </div>
  );
}

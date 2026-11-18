'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, uploadImage } from '@/lib/api';
import { Service, CATEGORIES } from '@/lib/auth-shared';
import { ApprovalBadge } from '@/components/badges';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Field } from '@/components/SettingsCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { FolderOpen, ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react';

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

const SELECT_CLASS =
  'h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30';

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    let active = true;
    api<{ data: Service[] }>('/api/services/my/all')
      .then((res) => {
        if (active) setServices(res.data);
      })
      .catch(() => {
        if (active) setServices([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function toggleAvailable(service: Service) {
    try {
      await api(`/api/services/${service._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: !service.isAvailable }),
      });
      toast.success(
        service.isAvailable ? 'Service marked unavailable' : 'Service marked available',
      );
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function onDelete(id: string) {
    setDeleting(true);
    try {
      await api(`/api/services/${id}`, { method: 'DELETE' });
      toast.success('Service deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  async function onSaveEdit(event: React.FormEvent) {
    event.preventDefault();
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
          ...(edit.image !== services.find((service) => service._id === edit._id)?.image
            ? { image: edit.image }
            : {}),
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

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Technician workspace"
        title="My services"
        description="Manage pricing, availability and listing details. Edits require re-approval."
        icon={FolderOpen}
        actions={
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Add service
          </Link>
        }
      />

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : services.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No services yet"
          description="List your first repair service to start receiving customer requests."
          action={
            <Link
              href="/dashboard/technician/add-service"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Add your first service
            </Link>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>
                  <div className="flex min-w-[220px] items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt=""
                      className="h-11 w-14 rounded-lg object-cover ring-1 ring-border"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{service.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{service.serviceArea}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground/80">{service.category}</TableCell>
                <TableCell className="font-semibold tabular-nums">${service.basePrice}</TableCell>
                <TableCell>
                  <ApprovalBadge status={service.approvalStatus} />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleAvailable(service)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      service.isAvailable ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                    }`}
                    aria-label="Toggle availability"
                    aria-pressed={service.isAvailable}
                  >
                    <span
                      className={`size-5 rounded-full bg-white shadow transition-transform ${
                        service.isAvailable ? 'translate-x-[22px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        setEdit({
                          _id: service._id,
                          title: service.title,
                          category: service.category,
                          description: service.description,
                          basePrice: String(service.basePrice),
                          estimatedDuration: service.estimatedDuration,
                          serviceMode: service.serviceMode,
                          serviceArea: service.serviceArea,
                          image: service.image,
                        })
                      }
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-semibold transition hover:bg-muted"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(service)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-500/25 px-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-400"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit modal */}
      {edit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setEdit(null)}
        >
          <form
            onSubmit={onSaveEdit}
            onClick={(event) => event.stopPropagation()}
            className="my-8 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl animate-in-up"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight">Edit service</h2>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Saving sends this service back to admin approval.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto px-5 py-5">
              <Field label="Title" htmlFor="edit-title">
                <Input
                  id="edit-title"
                  required
                  value={edit.title}
                  onChange={(event) => setEdit({ ...edit, title: event.target.value })}
                  className="h-10 rounded-xl"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Category" htmlFor="edit-category">
                  <select
                    id="edit-category"
                    value={edit.category}
                    onChange={(event) => setEdit({ ...edit, category: event.target.value })}
                    className={SELECT_CLASS}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Base price (USD)" htmlFor="edit-price">
                  <Input
                    id="edit-price"
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={edit.basePrice}
                    onChange={(event) => setEdit({ ...edit, basePrice: event.target.value })}
                    className="h-10 rounded-xl"
                  />
                </Field>
              </div>

              <Field label="Description" htmlFor="edit-description">
                <Textarea
                  id="edit-description"
                  required
                  rows={3}
                  value={edit.description}
                  onChange={(event) => setEdit({ ...edit, description: event.target.value })}
                  className="rounded-xl"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Duration" htmlFor="edit-duration">
                  <Input
                    id="edit-duration"
                    required
                    value={edit.estimatedDuration}
                    onChange={(event) => setEdit({ ...edit, estimatedDuration: event.target.value })}
                    className="h-10 rounded-xl"
                  />
                </Field>
                <Field label="Service mode" htmlFor="edit-mode">
                  <select
                    id="edit-mode"
                    value={edit.serviceMode}
                    onChange={(event) => setEdit({ ...edit, serviceMode: event.target.value })}
                    className={SELECT_CLASS}
                  >
                    <option>Home Visit</option>
                    <option>Shop Drop-off</option>
                  </select>
                </Field>
              </div>

              <Field label="Service area" htmlFor="edit-area">
                <Input
                  id="edit-area"
                  required
                  value={edit.serviceArea}
                  onChange={(event) => setEdit({ ...edit, serviceArea: event.target.value })}
                  className="h-10 rounded-xl"
                />
              </Field>

              <div>
                <p className="mb-1.5 text-sm font-medium">Service image</p>
                <label className="group relative flex min-h-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/30 transition hover:border-primary/40">
                  {edit.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={edit.image}
                        alt="Service preview"
                        className="h-32 w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-950/50 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                        <ImagePlus className="size-4" />
                        Replace image
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center gap-2 py-8 text-xs text-muted-foreground">
                      <ImagePlus className="size-4" />
                      Upload an image
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadImage(file);
                        setEdit((current) => (current ? { ...current, image: url } : current));
                        toast.success('Image uploaded');
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : 'Upload failed');
                      }
                    }}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this service?"
        description={
          <>
            <span className="font-semibold text-foreground">{deleteTarget?.title}</span> will be
            permanently removed. This action cannot be undone.
          </>
        }
        confirmLabel="Yes, delete"
        cancelLabel="Keep service"
        tone="danger"
        icon={Trash2}
        loading={deleting}
        onConfirm={() => deleteTarget && onDelete(deleteTarget._id)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

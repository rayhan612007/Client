'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AvatarPicker({
  name,
  value,
  onChange,
  onUploadingChange,
  size = 'md',
}: {
  name: string;
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  size?: 'md' | 'lg';
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview =
    value ||
    `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(
      name || 'User',
    )}`;

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }

    setUploading(true);
    onUploadingChange?.(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success('Photo uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preview}
        alt=""
        className={cn(
          'shrink-0 rounded-2xl object-cover ring-1 ring-border',
          size === 'lg' ? 'size-20' : 'size-16',
        )}
      />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Camera className="size-4" />
            )}
            {value ? 'Change photo' : 'Upload photo'}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => onChange('')}
              disabled={uploading}
            >
              Remove
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">PNG or JPG.</p>
      </div>
    </div>
  );
}

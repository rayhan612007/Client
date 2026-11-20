import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <Loader2 className="size-9 animate-spin text-primary" role="status" aria-label="Loading" />
    </div>
  );
}

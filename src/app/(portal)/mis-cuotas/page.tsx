'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MisCuotasView } from '@/features/portal/mis-cuotas/components/MisCuotasView';

export default function MisCuotasPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto space-y-4 p-6">
          <Skeleton className="h-8 w-48 rounded" />
          <Skeleton className="h-4 w-64 rounded" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <MisCuotasView />
    </Suspense>
  );
}

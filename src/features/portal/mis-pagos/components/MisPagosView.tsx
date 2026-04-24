'use client';

import {
  Wallet, CheckCircle, Clock,
  XCircle, RotateCcw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton }          from '@/components/ui/skeleton';
import { useMisPayments }    from '@/features/portal/hooks/use-portal';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { PaymentStatus } from '@/features/portal/types/portal.types';

const statusConfig: Record<PaymentStatus, {
  label:     string;
  className: string;
  icon:      React.ReactNode;
}> = {
  PENDING:   { label: 'Pendiente',  className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',     icon: <Clock className="h-4 w-4" /> },
  COMPLETED: { label: 'Completado', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', icon: <CheckCircle className="h-4 w-4" /> },
  FAILED:    { label: 'Fallido',    className: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',             icon: <XCircle className="h-4 w-4" /> },
  REVERSED:  { label: 'Revertido',  className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',            icon: <RotateCcw className="h-4 w-4" /> },
};

export function MisPagosView() {
  const { data, isLoading } = useMisPayments();
  const payments            = data?.data ?? [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mis Pagos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Historial de todos tus pagos realizados
        </p>
      </div>

      <Card className="rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border/40">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-3 w-40 rounded" />
                  </div>
                  <div className="text-right space-y-1.5">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-muted rounded-2xl">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-semibold text-foreground">
                  Sin pagos registrados
                </p>
                <p className="text-sm text-muted-foreground">
                  Tus pagos aparecerán aquí una vez realizados
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {payments.map((payment) => {
                const st = statusConfig[payment.status];
                return (
                  <div
                    key={payment.id}
                    className="flex items-center gap-4 px-4 py-4 hover:bg-muted/40 transition-colors"
                  >
                    {/* Icono estado */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${st.className}`}>
                      {st.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Ref: {payment.reference} · Préstamo #{payment.loanId}
                      </p>
                    </div>

                    {/* Estado y fecha */}
                    <div className="text-right shrink-0 space-y-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}>
                        {st.label}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDateTime(payment.paymentDate)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

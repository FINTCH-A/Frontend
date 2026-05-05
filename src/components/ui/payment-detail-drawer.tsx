/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ui/payment-detail-drawer.tsx
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Hash, FileText, CreditCard, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { Payment, PaymentStatus } from '@/features/pagos/types/pagos.types';

interface PaymentDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
}

const statusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' },
  COMPLETED: { label: 'Completado', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' },
  FAILED: { label: 'Fallido', color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400' },
  REVERSED: { label: 'Revertido', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
};

export function PaymentDetailDrawer({ open, onOpenChange, payment }: PaymentDetailDrawerProps) {
  if (!payment) return null;

  const status = statusConfig[payment.status] || statusConfig.PENDING;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl p-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-2xl rounded-3xl border-0 overflow-y-auto m-2 mr-4"
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <SheetHeader className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Detalle del Pago
              </SheetTitle>
              <Badge className={`${status.color} border px-3 py-1 text-xs font-semibold rounded-full`}>
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <SheetDescription className="text-sm text-muted-foreground">
                Referencia: {payment.reference}
              </SheetDescription>
              <span className="text-xs text-muted-foreground">•</span>
              <SheetDescription className="text-sm text-muted-foreground">
                ID: #{payment.id}
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Contenido */}
          <div className="space-y-6 mt-6">
            {/* Monto destacado */}
            <div className="bg-linear-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-5 border border-primary/20 dark:border-primary/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Monto del pago
              </p>
              <p className="text-3xl md:text-4xl font-bold text-primary">
                {formatCurrency(payment.amount)}
              </p>
            </div>

            {/* Información principal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Préstamo
                </p>
                <p className="text-base font-semibold dark:text-gray-200">
                  #{payment.loanId}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Cuota
                </p>
                <p className="text-base font-semibold dark:text-gray-200">
                  {payment.installmentId ? `#${payment.installmentId}` : 'No asociada'}
                </p>
              </div>
            </div>

            {/* Fechas */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                Fechas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fecha del pago</p>
                  <p className="text-sm font-medium">{formatDateTime(payment.paymentDate)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Creado el</p>
                  <p className="text-sm font-medium">{formatDateTime(payment.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Notas */}
            {payment.notes && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FileText className="h-4 w-4" />
                  Notas adicionales
                </h3>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-foreground">{payment.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

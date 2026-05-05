/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  MoreHorizontal,
  RefreshCw,
  Wallet,
  RotateCcw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { PagoForm } from './PagoForm';
import { PaymentDetailDrawer } from '@/components/ui/payment-detail-drawer';
import { usePagos, useCreatePago, useReversePago } from '../hooks/use-pagos';
import type { Payment, PaymentFilters, PaymentStatus } from '../types/pagos.types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

// ─── Status config ────────────────────────────────────────────

const statusConfig: Record<PaymentStatus, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'Pendiente',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    icon: <Clock className="h-3 w-3" />,
  },
  COMPLETED: {
    label: 'Completado',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  FAILED: {
    label: 'Fallido',
    className: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    icon: <XCircle className="h-3 w-3" />,
  },
  REVERSED: {
    label: 'Revertido',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    icon: <RotateCcw className="h-3 w-3" />,
  },
};

// ─── Main component ───────────────────────────────────────────

export function MainPagos() {
  const [filters, setFilters] = useState<PaymentFilters>({ page: 1, limit: 10 });
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [reverseOpen, setReverseOpen] = useState(false);
  const [selected, setSelected] = useState<Payment | null>(null);

  const { data, isLoading, refetch } = usePagos(filters);
  const createMutation = useCreatePago();
  const reverseMutation = useReversePago();

  // ✅ Valores seguros para evitar errores de undefined
  const totalPagos = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const currentPage = data?.meta?.page ?? 1;
  const currentLimit = data?.meta?.limit ?? 10;
  const hasNextPage = data?.meta?.hasNextPage ?? false;
  const hasPrevPage = data?.meta?.hasPrevPage ?? false;

  const openDetail = (p: Payment) => {
    setSelected(p);
    setDetailOpen(true);
  };

  const openReverse = (p: Payment) => {
    setSelected(p);
    setReverseOpen(true);
  };

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => setFormOpen(false),
    });
  };

  const handleReverse = () => {
    if (!selected) return;
    reverseMutation.mutate(selected.id, {
      onSettled: () => {
        setReverseOpen(false);
        setSelected(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pagos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalPagos} pagos registrados
          </p>
        </div>
        <Button
          onClick={() => setFormOpen(true)}
          className="rounded-xl gap-2 font-semibold"
        >
          <Plus className="h-4 w-4" />
          Registrar Pago
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Select
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  status: v === 'all' ? undefined : (v as PaymentStatus),
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-52 rounded-xl">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="COMPLETED">Completado</SelectItem>
                <SelectItem value="FAILED">Fallido</SelectItem>
                <SelectItem value="REVERSED">Revertido</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="rounded-xl shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Referencia</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Préstamo</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Monto</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Cuota</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Fecha</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/40">
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-28 rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-16 rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-20 rounded" />
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <Skeleton className="h-4 w-12 rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <Skeleton className="h-4 w-28 rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-8 w-8 rounded" />
                        </td>
                      </tr>
                    ))
                  : !data?.data || data.data.length === 0
                  ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-muted rounded-2xl">
                              <Wallet className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="font-semibold text-foreground">
                              No hay pagos registrados
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Registra el primer pago con el botón de arriba
                            </p>
                            <Button
                              onClick={() => setFormOpen(true)}
                              size="sm"
                              className="rounded-xl mt-1"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Registrar Pago
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  : data.data.map((payment) => {
                      const st = statusConfig[payment.status];
                      if (!st) return null;
                      return (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-border/40 hover:bg-muted/40 transition-colors cursor-pointer"
                          onClick={() => openDetail(payment)}
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-primary font-semibold">
                              {payment.reference}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            #{payment.loanId}
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                            {payment.installmentId ? `#${payment.installmentId}` : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}
                            >
                              {st.icon}
                              {st.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                            {formatDateTime(payment.paymentDate)}
                          </td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                <DropdownMenuItem
                                  onClick={() => openDetail(payment)}
                                  className="gap-2 cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Ver detalle
                                </DropdownMenuItem>
                                {payment.status === 'COMPLETED' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => openReverse(payment)}
                                      className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                    >
                                      <RotateCcw className="h-3.5 w-3.5" />
                                      Revertir
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.data && data.data.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                {((currentPage - 1) * currentLimit) + 1}
                {' — '}
                {Math.min(currentPage * currentLimit, totalPagos)}
                {' de '}
                {totalPagos}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPrevPage}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                  className="rounded-xl text-xs h-8"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                  className="rounded-xl text-xs h-8"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PagoForm - Drawer para registrar pago */}
      <PagoForm
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
        onCancel={() => setFormOpen(false)}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      {/* PaymentDetailDrawer - Panel lateral para ver detalles */}
      <PaymentDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        payment={selected}
      />

      {/* AlertDialog revertir */}
      <AlertDialog open={reverseOpen} onOpenChange={setReverseOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Revertir pago?</AlertDialogTitle>
            <AlertDialogDescription>
              Se revertirá el pago de{' '}
              <strong>{selected ? formatCurrency(selected.amount) : ''}</strong>{' '}
              con referencia <strong>{selected?.reference}</strong>.
              La cuota asociada volverá a estado pendiente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReverse}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              {reverseMutation.isPending ? 'Revirtiendo...' : 'Sí, revertir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

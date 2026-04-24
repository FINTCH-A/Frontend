/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState }  from 'react';
import { motion }    from 'framer-motion';
import {
  Plus, MoreHorizontal, RefreshCw,
  Banknote, Eye, Send,
  CheckCircle, Clock, AlertCircle,
} from 'lucide-react';

import { Button }   from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { PrestamoForm }                      from './PrestamoForm';
import { usePrestamos, useCreatePrestamo, useDesembolsarPrestamo } from '../hooks/use-prestamos';
import type { Loan, LoanFilters, LoanStatus } from '../types/prestamos.types';
import { formatCurrency, formatDate }         from '@/lib/utils';

// ─── Status config ────────────────────────────────────────────

const statusConfig: Record<LoanStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Pendiente',  className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  APPROVED:  { label: 'Aprobado',   className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' },
  REJECTED:  { label: 'Rechazado',  className: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' },
  ACTIVE:    { label: 'Activo',     className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
  PAID:      { label: 'Pagado',     className: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' },
  DEFAULTED: { label: 'En mora',    className: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400' },
  CANCELLED: { label: 'Cancelado',  className: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500' },
};

// ─── Main component ───────────────────────────────────────────

export function MainPrestamos() {
  const [filters, setFilters]         = useState<LoanFilters>({ page: 1, limit: 10 });
  const [createOpen, setCreateOpen]   = useState(false);
  const [detailOpen, setDetailOpen]   = useState(false);
  const [disburseOpen, setDisburseOpen] = useState(false);
  const [selected, setSelected]       = useState<Loan | null>(null);

  const { data, isLoading, refetch }  = usePrestamos(filters);
  const createMutation                = useCreatePrestamo();
  const disburseMutation              = useDesembolsarPrestamo();

  // ✅ Valores seguros para evitar errores de undefined
  const totalPrestamos = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const currentPage = data?.meta?.page ?? 1;
  const currentLimit = data?.meta?.limit ?? 10;
  const hasNextPage = data?.meta?.hasNextPage ?? false;
  const hasPrevPage = data?.meta?.hasPrevPage ?? false;

  const openDetail   = (loan: Loan) => { setSelected(loan); setDetailOpen(true); };
  const openDisburse = (loan: Loan) => { setSelected(loan); setDisburseOpen(true); };

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleDisburse = () => {
    if (!selected) return;
    disburseMutation.mutate(selected.id, {
      onSettled: () => { setDisburseOpen(false); setSelected(null); },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Préstamos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalPrestamos} préstamos en total
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="rounded-xl gap-2 font-semibold"
        >
          <Plus className="h-4 w-4" />
          Nuevo Préstamo
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
                  status: v === 'all' ? undefined : (v as LoanStatus),
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
                <SelectItem value="APPROVED">Aprobado</SelectItem>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="PAID">Pagado</SelectItem>
                <SelectItem value="DEFAULTED">En mora</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Código</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Monto aprobado</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Total a pagar</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Plazo</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Tasa</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden xl:table-cell">Desembolso</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/40">
                        {Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4 w-full rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : !data?.data || data.data.length === 0
                  ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-muted rounded-2xl">
                              <Banknote className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="font-semibold">No hay préstamos</p>
                            <p className="text-sm text-muted-foreground">
                              Crea un préstamo desde una solicitud aprobada
                            </p>
                            <Button
                              onClick={() => setCreateOpen(true)}
                              size="sm"
                              className="rounded-xl mt-1"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Nuevo Préstamo
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  : data.data.map((loan) => {
                    const st = statusConfig[loan.status];
                    if (!st) return null;
                    return (
                      <motion.tr
                        key={loan.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border/40 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-primary">
                            {loan.loanCode}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {formatCurrency(loan.approvedAmount)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                          {formatCurrency(loan.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {loan.termMonths} meses
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {(loan.interestRate * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden xl:table-cell">
                          {loan.disbursedAt ? formatDate(loan.disbursedAt) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                              <DropdownMenuItem
                                onClick={() => openDetail(loan)}
                                className="gap-2 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Ver detalle
                              </DropdownMenuItem>
                              {loan.status === 'APPROVED' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => openDisburse(loan)}
                                    className="gap-2 cursor-pointer text-emerald-600 focus:text-emerald-600"
                                  >
                                    <Send className="h-3.5 w-3.5" />
                                    Desembolsar
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

          {/* Pagination - ✅ Usando valores seguros */}
          {data && data.data && data.data.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                {((currentPage - 1) * currentLimit) + 1}
                {' '}—{' '}
                {Math.min(currentPage * currentLimit, totalPrestamos)}
                {' '}de {totalPrestamos}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline" size="sm"
                  disabled={!hasPrevPage}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                  className="rounded-xl text-xs h-8"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline" size="sm"
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

      {/* Dialog crear */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Préstamo</DialogTitle>
          </DialogHeader>
          <PrestamoForm
            onSubmit={handleCreate}
            isPending={createMutation.isPending}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Sheet detalle */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected?.loanCode}</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-6 space-y-3">
              {[
                { label: 'Monto aprobado',  value: formatCurrency(selected.approvedAmount) },
                { label: 'Total a pagar',   value: formatCurrency(selected.totalAmount) },
                { label: 'Plazo',           value: `${selected.termMonths} meses` },
                { label: 'Tasa anual',      value: `${(selected.interestRate * 100).toFixed(2)}%` },
                { label: 'Amortización',    value: selected.amortization === 'FRENCH' ? 'Francesa' : 'Alemana' },
                { label: 'Tipo interés',    value: selected.interestType === 'FIXED' ? 'Fijo' : 'Variable' },
                { label: 'Estado',          value: statusConfig[selected.status]?.label ?? selected.status },
                { label: 'Desembolso',      value: selected.disbursedAt ? formatDate(selected.disbursedAt) : '—' },
                { label: 'Vencimiento',     value: selected.dueDate     ? formatDate(selected.dueDate)     : '—' },
                { label: 'Creado',          value: formatDate(selected.createdAt) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* AlertDialog desembolsar */}
      <AlertDialog open={disburseOpen} onOpenChange={setDisburseOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Desembolsar {selected?.loanCode}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Se desembolsarán{' '}
              <strong>{selected ? formatCurrency(selected.approvedAmount) : ''}</strong>{' '}
              y se generarán {selected?.termMonths} cuotas automáticamente.
              Esta acción no se puede revertir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisburse}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              {disburseMutation.isPending ? 'Desembolsando...' : 'Sí, desembolsar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

'use client';

import { useState }  from 'react';
import { motion }    from 'framer-motion';
import {
  ListChecks, RefreshCw,
  CheckCircle, Clock, AlertTriangle,
} from 'lucide-react';

import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCuotas }             from '../hooks/use-cuotas';
import type { Installment, InstallmentStatus } from '../types/cuotas.types';
import { formatCurrency, formatDate } from '@/lib/utils';

// ─── Status config ────────────────────────────────────────────

const statusConfig: Record<InstallmentStatus, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING: {
    label:     'Pendiente',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    icon:      <Clock className="h-3 w-3" />,
  },
  PAID: {
    label:     'Pagada',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    icon:      <CheckCircle className="h-3 w-3" />,
  },
  OVERDUE: {
    label:     'Vencida',
    className: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    icon:      <AlertTriangle className="h-3 w-3" />,
  },
  PARTIALLY_PAID: {
    label:     'Parcial',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    icon:      <Clock className="h-3 w-3" />,
  },
  WAIVED: {
    label:     'Condonada',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
    icon:      <CheckCircle className="h-3 w-3" />,
  },
};

// ─── Main component ───────────────────────────────────────────

export function MainCuotas() {
  const [inputId,       setInputId]       = useState('');
  const [activeLoanId,  setActiveLoanId]  = useState<number>(0);
  const [hasSearched,   setHasSearched]   = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useCuotas(activeLoanId);

  const handleSearch = () => {
    const parsed = parseInt(inputId.trim(), 10);
    if (isNaN(parsed) || parsed <= 0) return;
    setActiveLoanId(parsed);
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ✅ Tipado explícito para las cuotas
  const cuotas: Installment[] = data?.data ?? [];
  const meta = data?.meta;

  const paid = cuotas.filter((inst: Installment) => inst.status === 'PAID').length;
  const overdue = cuotas.filter((inst: Installment) => inst.status === 'OVERDUE').length;
  const pending = cuotas.filter((inst: Installment) =>
    ['PENDING', 'PARTIALLY_PAID'].includes(inst.status),
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cuotas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Cronograma de pagos de un préstamo
        </p>
      </div>

      {/* Buscador */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              type="number"
              placeholder="Ingresa el ID del préstamo (ej: 1)"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rounded-xl border-border/70"
              min={1}
            />
            <Button
              onClick={handleSearch}
              disabled={!inputId.trim() || isLoading || isFetching}
              className="rounded-xl shrink-0"
            >
              {isLoading || isFetching ? 'Buscando...' : 'Buscar'}
            </Button>
            {activeLoanId > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                className="rounded-xl shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estado inicial */}
      {!hasSearched && (
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-muted rounded-2xl">
                <ListChecks className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">
                Busca un préstamo
              </p>
              <p className="text-sm text-muted-foreground">
                Ingresa el ID del préstamo para ver su cronograma de cuotas
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {hasSearched && isError && (
        <Card className="rounded-2xl border border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <p className="font-semibold text-destructive">
              No se encontró el préstamo #{activeLoanId}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Verifica que el ID sea correcto e intenta de nuevo
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {hasSearched && !isError && (isLoading || cuotas.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total',
              value: isLoading ? '...' : (meta?.total ?? 0),
              color: 'text-foreground',
              bg:    'bg-muted/60',
            },
            {
              label: 'Pagadas',
              value: isLoading ? '...' : paid,
              color: 'text-emerald-600',
              bg:    'bg-emerald-50 dark:bg-emerald-950/30',
            },
            {
              label: 'Vencidas',
              value: isLoading ? '...' : overdue,
              color: 'text-red-600',
              bg:    'bg-red-50 dark:bg-red-950/30',
            },
            {
              label: 'Pendientes',
              value: isLoading ? '...' : pending,
              color: 'text-amber-600',
              bg:    'bg-amber-50 dark:bg-amber-950/30',
            },
          ].map((s) => (
            <Card
              key={s.label}
              className={`rounded-2xl border border-border/60 shadow-sm ${s.bg}`}
            >
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12 mt-1 rounded" />
                ) : (
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>
                    {s.value}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabla */}
      {hasSearched && !isError && (
        <Card className="rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/60 bg-muted/40">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" />
              Cronograma — Préstamo #{activeLoanId}
              {isFetching && !isLoading && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  Actualizando...
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Vencimiento</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Capital</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Interés</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Total cuota</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Pagado</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Pendiente</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, idx: number) => (
                      <tr key={idx} className="border-b border-border/40">
                        {Array.from({ length: 8 }).map((_, jdx: number) => (
                          <td key={jdx} className="px-4 py-3">
                            <Skeleton className="h-4 w-full rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : cuotas.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 bg-muted rounded-2xl">
                            <ListChecks className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="font-semibold text-foreground">
                            Sin cuotas generadas
                          </p>
                          <p className="text-sm text-muted-foreground">
                            El préstamo #{activeLoanId} no tiene cuotas todavía.
                            Puede que aún no haya sido desembolsado.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    cuotas.map((inst: Installment) => {
                      const st = statusConfig[inst.status as InstallmentStatus];
                      const pendingAmount = (inst.totalAmount || 0) - (inst.paidAmount || 0);
                      return (
                        <motion.tr
                          key={inst.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`border-b border-border/40 transition-colors ${
                            inst.status === 'OVERDUE'
                              ? 'bg-red-50/50 dark:bg-red-950/10 hover:bg-red-50 dark:hover:bg-red-950/20'
                              : inst.status === 'PAID'
                              ? 'bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50/50'
                              : 'hover:bg-muted/40'
                          }`}
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-semibold text-muted-foreground">
                              {String(inst.installmentNumber).padStart(2, '0')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {formatDate(inst.dueDate)}
                            {(inst.daysOverdue ?? 0) > 0 && (
                              <span className="ml-1.5 text-xs text-red-500">
                                (+{inst.daysOverdue}d)
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {formatCurrency(inst.principalAmount)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {formatCurrency(inst.interestAmount)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {formatCurrency(inst.totalAmount)}
                          </td>
                          <td className="px-4 py-3 text-emerald-600 text-xs hidden md:table-cell">
                            {(inst.paidAmount ?? 0) > 0
                              ? formatCurrency(inst.paidAmount ?? 0)
                              : '—'}
                          </td>
                          <td className="px-4 py-3 text-xs hidden md:table-cell">
                            {pendingAmount > 0 ? (
                              <span className="text-amber-600 font-medium">
                                {formatCurrency(pendingAmount)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st?.className ?? 'bg-gray-100 text-gray-600'}`}
                            >
                              {st?.icon}
                              {st?.label ?? inst.status}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination info */}
            {meta && meta.total > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
                <p className="text-xs text-muted-foreground">
                  {meta.total} cuotas en total · {paid} pagadas · {overdue} vencidas · {pending} pendientes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useState }        from 'react';
import { useSearchParams } from 'next/navigation';
import { motion }          from 'framer-motion';
import {
  ListChecks, ArrowLeft,
  CheckCircle, Clock, AlertTriangle,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';

import { Button }            from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton }          from '@/components/ui/skeleton';
import {
  useMisLoans,
  useMisInstallments,
} from '@/features/portal/hooks/use-portal';
import { PagarCuotaDialog }  from './PagarCuotaDialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import type {
  InstallmentStatus,
  Installment,
} from '@/features/portal/types/portal.types';

const statusConfig: Record<InstallmentStatus, {
  label:     string;
  className: string;
  icon:      React.ReactNode;
}> = {
  PENDING:        { label: 'Pendiente', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',               icon: <Clock className="h-3 w-3" /> },
  PAID:           { label: 'Pagada',    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', icon: <CheckCircle className="h-3 w-3" /> },
  OVERDUE:        { label: 'Vencida',   className: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',                icon: <AlertTriangle className="h-3 w-3" /> },
  PARTIALLY_PAID: { label: 'Parcial',   className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',        icon: <Clock className="h-3 w-3" /> },
  WAIVED:         { label: 'Condonada', className: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',    icon: <CheckCircle className="h-3 w-3" /> },
};

const canPay = (status: InstallmentStatus) =>
  ['PENDING', 'OVERDUE', 'PARTIALLY_PAID'].includes(status);

export function MisCuotasView() {
  const searchParams  = useSearchParams();
  const initialId     = Number(searchParams.get('loanId') ?? 0);

  const [selectedLoanId, setSelectedLoanId]     = useState(initialId);
  const [payingInstallment, setPayingInstallment] =
    useState<Installment | null>(null);

  const { data: loansData, isLoading: loansLoading } = useMisLoans();
  const {
    data:      cuotasData,
    isLoading: cuotasLoading,
    refetch:   refetchCuotas,
  } = useMisInstallments(selectedLoanId);

  const loans  = loansData?.data ?? [];
  const cuotas = cuotasData?.data ?? [];

  const paid    = cuotas.filter((c) => c.status === 'PAID').length;
  const overdue = cuotas.filter((c) => c.status === 'OVERDUE').length;
  const pending = cuotas.filter((c) =>
    ['PENDING', 'PARTIALLY_PAID'].includes(c.status),
  ).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 text-muted-foreground mb-3 -ml-2 rounded-xl"
        >
          <Link href="/mis-prestamos">
            <ArrowLeft className="h-4 w-4" />
            Mis préstamos
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Mis Cuotas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Cronograma y pago de tus préstamos
        </p>
      </div>

      {/* Selector de préstamo */}
      {loansLoading ? (
        <div className="flex gap-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-8 w-32 rounded-xl" />
          ))}
        </div>
      ) : loans.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {loans.map((loan) => (
            <button
              key={loan.id}
              onClick={() => setSelectedLoanId(loan.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                selectedLoanId === loan.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'border-border/60 hover:border-primary hover:text-primary'
              }`}
            >
              {loan.loanCode}
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                loan.status === 'ACTIVE'
                  ? 'bg-emerald-500/20 text-emerald-600'
                  : loan.status === 'PAID'
                  ? 'bg-purple-500/20 text-purple-600'
                  : 'bg-gray-500/20 text-gray-600'
              }`}>
                {loan.status === 'ACTIVE' ? 'Activo' : loan.status === 'PAID' ? 'Pagado' : loan.status}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Stats */}
      {selectedLoanId > 0 && !cuotasLoading && cuotas.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total',      value: cuotas.length, color: 'text-foreground',  bg: 'bg-muted/60' },
            { label: 'Pagadas',    value: paid,          color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
            { label: 'Vencidas',   value: overdue,       color: 'text-red-600',     bg: 'bg-red-50 dark:bg-red-950/30' },
            { label: 'Pendientes', value: pending,       color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/30' },
          ].map((s) => (
            <Card key={s.label} className={`rounded-2xl border border-border/60 ${s.bg}`}>
              <CardContent className="p-3 text-center">
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tabla cuotas */}
      {selectedLoanId > 0 ? (
        <Card className="rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/60 bg-muted/40">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" />
              Cronograma de pagos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20">
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs">#</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs">Vencimiento</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs">Cuota</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs hidden sm:table-cell">Pendiente</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs">Estado</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {cuotasLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/40">
                        {[0, 1, 2, 3, 4, 5].map((j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4 w-full rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : cuotas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                          No hay cuotas generadas para este préstamo
                        </p>
                      </td>
                    </tr>
                  ) : (
                    cuotas.map((inst) => {
                      const st       = statusConfig[inst.status];
                      const pagable  = canPay(inst.status);
                      const isOverdue = inst.status === 'OVERDUE';

                      return (
                        <motion.tr
                          key={inst.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`border-b border-border/40 transition-colors ${
                            isOverdue
                              ? 'bg-red-50/60 dark:bg-red-950/10'
                              : inst.status === 'PAID'
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/10'
                              : 'hover:bg-muted/40'
                          }`}
                        >
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {String(inst.installmentNumber).padStart(2, '0')}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {formatDate(inst.dueDate)}
                            {inst.daysOverdue > 0 && (
                              <span className="ml-1 text-xs text-red-500 font-medium">
                                +{inst.daysOverdue}d
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {formatCurrency(inst.totalAmount)}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            {inst.pendingAmount > 0 ? (
                              <span className="text-amber-600 font-semibold text-sm">
                                {formatCurrency(inst.pendingAmount)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${st.className}`}>
                              {st.icon}
                              {st.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {pagable && (
                              <Button
                                size="sm"
                                onClick={() => setPayingInstallment(inst)}
                                className={`rounded-xl gap-1.5 text-xs h-8 ${
                                  isOverdue
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : ''
                                }`}
                              >
                                <CreditCard className="h-3 w-3" />
                                Pagar
                              </Button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {cuotas.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-muted/20">
                <p className="text-xs text-muted-foreground">
                  {cuotas.length} cuotas · {paid} pagadas · {pending} pendientes
                </p>
                {pending > 0 && (
                  <p className="text-xs text-amber-600 font-medium">
                    Próximo pago: {formatCurrency(
                      cuotas.find((c) => canPay(c.status))?.totalAmount ?? 0
                    )}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border border-border/60">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-muted rounded-2xl">
                <ListChecks className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">
                Selecciona un préstamo
              </p>
              <p className="text-sm text-muted-foreground">
                Elige uno de tus préstamos para ver el cronograma de cuotas
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de pago */}
      <PagarCuotaDialog
        installment={payingInstallment}
        open={!!payingInstallment}
        onClose={() => {
          setPayingInstallment(null);
          refetchCuotas();
        }}
      />
    </div>
  );
}

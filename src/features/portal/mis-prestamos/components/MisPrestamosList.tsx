'use client';

import { motion }  from 'framer-motion';
import Link        from 'next/link';
import {
  Banknote, Plus, ArrowRight,
  Clock, CheckCircle, AlertCircle,
  RefreshCw, FileText,
} from 'lucide-react';

import { Button }           from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge }            from '@/components/ui/badge';
import { Skeleton }         from '@/components/ui/skeleton';
import { useMisLoans, useMisApplications } from '@/features/portal/hooks/use-portal';
import { useAuthStore }     from '@/store/auth.store';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { LoanStatus, ApplicationStatus } from '@/features/portal/types/portal.types';

// ─── Configuración de estados ─────────────────────────────────

const loanStatusConfig: Record<LoanStatus, {
  label: string;
  className: string;
  icon: React.ReactNode;
}> = {
  PENDING:   { label: 'En revisión', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400', icon: <Clock className="h-3.5 w-3.5" /> },
  APPROVED:  { label: 'Aprobado',    className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',     icon: <CheckCircle className="h-3.5 w-3.5" /> },
  REJECTED:  { label: 'Rechazado',   className: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',         icon: <AlertCircle className="h-3.5 w-3.5" /> },
  ACTIVE:    { label: 'Activo',      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  PAID:      { label: 'Pagado',      className: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  DEFAULTED: { label: 'En mora',     className: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400', icon: <AlertCircle className="h-3.5 w-3.5" /> },
  CANCELLED: { label: 'Cancelado',   className: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',        icon: <Clock className="h-3.5 w-3.5" /> },
};

const appStatusConfig: Record<ApplicationStatus, {
  label: string;
  className: string;
  icon: React.ReactNode;
}> = {
  DRAFT:        { label: 'Borrador',     className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', icon: <FileText className="h-3.5 w-3.5" /> },
  SUBMITTED:    { label: 'Enviada',      className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400', icon: <Clock className="h-3.5 w-3.5" /> },
  UNDER_REVIEW: { label: 'En revisión',  className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400', icon: <Clock className="h-3.5 w-3.5" /> },
  APPROVED:     { label: 'Aprobada',     className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  REJECTED:     { label: 'Rechazada',    className: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400', icon: <AlertCircle className="h-3.5 w-3.5" /> },
  CANCELLED:    { label: 'Cancelada',    className: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400', icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

export function MisPrestamosList() {
  const user = useAuthStore((s) => s.user);

  const { data: loansData, isLoading: loansLoading, refetch: refetchLoans } = useMisLoans();
  const { data: appsData, isLoading: appsLoading, refetch: refetchApps } = useMisApplications();

  const isLoading = loansLoading || appsLoading;
  const loans = loansData?.data ?? [];
  const applications = appsData?.data ?? [];

  // ✅ SOLUCIÓN 3: Mostrar solicitudes pendientes PRIMERO
  const pendingApplications = applications.filter(
    a => a.status !== 'APPROVED' && a.status !== 'REJECTED' && a.status !== 'CANCELLED'
  );
  const approvedLoans = loans.filter(l => l.status === 'ACTIVE' || l.status === 'APPROVED');
  const otherLoans = loans.filter(l => l.status !== 'ACTIVE' && l.status !== 'APPROVED');
  const rejectedApps = applications.filter(
    a => a.status === 'REJECTED' || a.status === 'CANCELLED'
  );

  const handleRefresh = () => {
    refetchLoans();
    refetchApps();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hola, {user?.firstName ?? 'Cliente'} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tus préstamos y solicitudes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="rounded-xl"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild className="rounded-xl gap-2 font-semibold">
            <Link href="/solicitar">
              <Plus className="h-4 w-4" />
              Solicitar
            </Link>
          </Button>
        </div>
      </div>

      {/* Cargando */}
      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="rounded-2xl border border-border/60">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-36 rounded" />
                <div className="grid grid-cols-3 gap-3">
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECCIÓN 1: SOLICITUDES PENDIENTES (MÁS IMPORTANTE) */}
      {/* ============================================================ */}
      {!isLoading && pendingApplications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            📝 Solicitudes en proceso
            <Badge variant="secondary" className="ml-2">
              {pendingApplications.length}
            </Badge>
          </h2>
          <div className="space-y-3">
            {pendingApplications.map((app, i) => {
              const st = appStatusConfig[app.status];
              return (
                <motion.div
                  key={`app-${app.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="rounded-2xl border border-amber-200 bg-amber-50/30 dark:bg-amber-950/20 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">
                            Solicitud #{app.id}
                          </p>
                          <p className="text-xl font-bold text-foreground mt-0.5">
                            {formatCurrency(app.requestedAmount)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}>
                          {st.icon}
                          {st.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-background/50 rounded-xl p-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Plazo solicitado</p>
                          <p className="text-sm font-semibold">{app.requestedTerm} meses</p>
                        </div>
                        <div className="bg-background/50 rounded-xl p-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Fecha</p>
                          <p className="text-sm font-semibold">{formatDate(app.createdAt)}</p>
                        </div>
                      </div>

                      {app.purpose && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                          {app.purpose}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-border/40">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-xl text-xs h-8"
                          asChild
                        >
                          <Link href={`/mis-prestamos/detalle?type=application&id=${app.id}`}>
                            Ver detalles
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECCIÓN 2: PRÉSTAMOS ACTIVOS Y APROBADOS */}
      {/* ============================================================ */}
      {!isLoading && approvedLoans.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Banknote className="h-5 w-5 text-emerald-500" />
            💰 Mis préstamos activos
            <Badge variant="secondary" className="ml-2">
              {approvedLoans.length}
            </Badge>
          </h2>
          <div className="space-y-3">
            {approvedLoans.map((loan, i) => {
              const st = loanStatusConfig[loan.status];
              return (
                <motion.div
                  key={`loan-${loan.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">
                            {loan.loanCode}
                          </p>
                          <p className="text-xl font-bold text-foreground mt-0.5">
                            {formatCurrency(loan.approvedAmount)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}>
                          {st.icon}
                          {st.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-muted/50 rounded-xl p-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Plazo</p>
                          <p className="text-xs font-bold">{loan.termMonths} meses</p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Tasa anual</p>
                          <p className="text-xs font-bold">{(loan.interestRate * 100).toFixed(1)}%</p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Total</p>
                          <p className="text-xs font-bold">{formatCurrency(loan.totalAmount)}</p>
                        </div>
                      </div>

                      {loan.status === 'ACTIVE' && loan.dueDate && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                          <p className="text-xs text-muted-foreground">
                            Vence el {formatDate(loan.dueDate)}
                          </p>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-xl gap-1.5 text-xs h-8"
                          >
                            <Link href={`/mis-cuotas?loanId=${loan.id}`}>
                              Ver cuotas
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      )}

                      {loan.status === 'APPROVED' && (
                        <div className="pt-2 border-t border-border/40">
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            ✅ Tu préstamo fue aprobado. Pronto recibirás el desembolso.
                          </p>
                        </div>
                      )}

                      {loan.status === 'DEFAULTED' && (
                        <div className="pt-2 border-t border-border/40">
                          <p className="text-xs text-orange-600 dark:text-orange-400">
                            ⚠️ Tienes cuotas vencidas. Contáctanos para regularizar.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECCIÓN 3: Sin nada (cuando no hay solicitudes ni préstamos) */}
      {/* ============================================================ */}
      {!isLoading && pendingApplications.length === 0 && approvedLoans.length === 0 && (
        <Card className="rounded-2xl border border-border/60">
          <CardContent className="py-20 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-5 bg-primary/10 rounded-2xl">
                <Banknote className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">
                  Aún no tienes préstamos
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Solicita tu primer préstamo de forma rápida y segura.
                  Respuesta en menos de 24 horas.
                </p>
              </div>
              <Button asChild className="rounded-xl gap-2 mt-2">
                <Link href="/solicitar">
                  <Plus className="h-4 w-4" />
                  Solicitar mi primer préstamo
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ============================================================ */}
      {/* SECCIÓN 4: Historial (opcional - préstamos pagados/rechazados) */}
      {/* ============================================================ */}
      {!isLoading && (otherLoans.length > 0 || rejectedApps.length > 0) && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            📜 Ver historial ({otherLoans.length + rejectedApps.length})
          </summary>
          <div className="mt-3 space-y-2">
            {otherLoans.map((loan) => {
              const st = loanStatusConfig[loan.status];
              return (
                <Card key={`history-loan-${loan.id}`} className="rounded-xl border border-border/40 bg-muted/20">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">{loan.loanCode}</p>
                        <p className="text-sm font-semibold">{formatCurrency(loan.approvedAmount)}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${st.className}`}>
                        {st.icon}
                        {st.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {rejectedApps.map((app) => {
              const st = appStatusConfig[app.status];
              return (
                <Card key={`history-app-${app.id}`} className="rounded-xl border border-border/40 bg-muted/20">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">Solicitud #{app.id}</p>
                        <p className="text-sm font-semibold">{formatCurrency(app.requestedAmount)}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${st.className}`}>
                        {st.icon}
                        {st.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}

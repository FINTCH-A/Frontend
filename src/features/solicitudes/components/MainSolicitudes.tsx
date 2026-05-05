
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState }   from 'react';
import { motion }     from 'framer-motion';
import {
  MoreHorizontal,
  RefreshCw,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

import { Button }   from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
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

import { ReviewForm }          from './ReviewForm';
import {
  useSolicitudes,
  useReviewSolicitud,
  useCancelSolicitud,
} from '../hooks/use-solicitudes';
import type {
  LoanApplication,
  ApplicationFilters,
  ApplicationStatus,
} from '../types/solicitudes.types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { LoanDetailDrawer } from '@/components/ui/loan-detail-drawer';

// ─── Status config ────────────────────────────────────────────

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  DRAFT:        {
    label: 'Borrador',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    icon: <Clock className="h-3 w-3" />,
  },
  SUBMITTED:    {
    label: 'Enviada',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    icon: <FileText className="h-3 w-3" />,
  },
  UNDER_REVIEW: {
    label: 'En revisión',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    icon: <Eye className="h-3 w-3" />,
  },
  APPROVED:     {
    label: 'Aprobada',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  REJECTED:     {
    label: 'Rechazada',
    className: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    icon: <XCircle className="h-3 w-3" />,
  },
  CANCELLED:    {
    label: 'Cancelada',
    className: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
    icon: <XCircle className="h-3 w-3" />,
  },
};

// ─── Main component ───────────────────────────────────────────

export function MainSolicitudes() {
  const [filters, setFilters]           = useState<ApplicationFilters>({
    page: 1, limit: 10,
  });
  const [reviewOpen,  setReviewOpen]   = useState(false);
  const [detailOpen,  setDetailOpen]   = useState(false);
  const [cancelOpen,  setCancelOpen]   = useState(false);
  const [selected,    setSelected]     = useState<LoanApplication | null>(null);

  const { data, isLoading, refetch }   = useSolicitudes(filters);
  const reviewMutation                 = useReviewSolicitud();
  const cancelMutation                 = useCancelSolicitud();

  // ✅ Valores seguros para evitar errores de undefined
  const totalSolicitudes = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const currentPage = data?.meta?.page ?? 1;
  const currentLimit = data?.meta?.limit ?? 10;
  const hasNextPage = data?.meta?.hasNextPage ?? false;
  const hasPrevPage = data?.meta?.hasPrevPage ?? false;

  const openReview = (app: LoanApplication) => {
    setSelected(app);
    setReviewOpen(true);
  };

  const openDetail = (app: LoanApplication) => {
    setSelected(app);
    setDetailOpen(true);
  };

  const openCancel = (app: LoanApplication) => {
    setSelected(app);
    setCancelOpen(true);
  };

  const handleReview = (formData: any) => {
    if (!selected) return;
    reviewMutation.mutate(
      { id: selected.id, data: formData },
      { onSuccess: () => setReviewOpen(false) },
    );
  };

  const handleCancel = () => {
    if (!selected) return;
    cancelMutation.mutate(selected.id, {
      onSettled: () => setCancelOpen(false),
    });
  };

  const canReview = (status: ApplicationStatus) =>
    ['SUBMITTED', 'UNDER_REVIEW'].includes(status);

  const canCancel = (status: ApplicationStatus) =>
    !['APPROVED', 'REJECTED', 'CANCELLED'].includes(status);

  // Transformar datos de solicitud para el drawer
  const transformApplicationForDrawer = (app: LoanApplication): any => {
    return {
      id: app.id,
      status: app.status,
      createdAt: app.createdAt,
      requestedAmount: app.requestedAmount,
      requestedTerm: app.requestedTerm,
      purpose: app.purpose,
      analystNotes: app.analystNotes,
      reviewedAt: app.reviewedAt,
      // Estos campos pueden venir del review si existen
      approvedAmount: (app as any).approvedAmount,
      interestRate: (app as any).interestRate,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Solicitudes de Préstamo
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalSolicitudes} solicitudes en total
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  status: v === 'all' ? undefined : (v as ApplicationStatus),
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-full sm:w-52 rounded-xl">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="DRAFT">Borrador</SelectItem>
                <SelectItem value="SUBMITTED">Enviada</SelectItem>
                <SelectItem value="UNDER_REVIEW">En revisión</SelectItem>
                <SelectItem value="APPROVED">Aprobada</SelectItem>
                <SelectItem value="REJECTED">Rechazada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
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
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Monto
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Plazo
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">
                    Propósito
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">
                    Fecha
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/40"
                      >
                        <td className="px-4 py-3"><Skeleton className="h-4 w-16 rounded" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-24 rounded" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-16 rounded" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-4 w-32 rounded" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-4 w-24 rounded" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-8 w-8 rounded" /></td>
                      </tr>
                    ))
                  : !data?.data || data.data.length === 0
                  ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-16 text-center"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-muted rounded-2xl">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="font-semibold text-foreground">
                              No hay solicitudes
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Las solicitudes de préstamo aparecerán aquí
                            </p>
                          </div>
                        </td>
                      </tr>
                    )
                  : data.data.map((app) => {
                    const st = statusConfig[app.status];
                    if (!st) return null;
                    return (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-border/40 hover:bg-muted/40 transition-colors cursor-pointer"
                        onClick={() => openDetail(app)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{app.id}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-foreground">
                            {formatCurrency(app.requestedAmount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {app.requestedTerm} meses
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                          <span className="truncate max-w-45 block text-xs">
                            {app.purpose ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}>
                            {st.icon}
                            {st.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 rounded-xl"
                            >
                              <DropdownMenuItem
                                onClick={() => openDetail(app)}
                                className="gap-2 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Ver detalle
                              </DropdownMenuItem>
                              {canReview(app.status) && (
                                <DropdownMenuItem
                                  onClick={() => openReview(app)}
                                  className="gap-2 cursor-pointer"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Revisar
                                </DropdownMenuItem>
                              )}
                              {canCancel(app.status) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => openCancel(app)}
                                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Cancelar
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
                {' '}—{' '}
                {Math.min(currentPage * currentLimit, totalSolicitudes)}
                {' '}de {totalSolicitudes}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPrevPage}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      page: (f.page ?? 1) - 1,
                    }))
                  }
                  className="rounded-xl text-xs h-8"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      page: (f.page ?? 1) + 1,
                    }))
                  }
                  className="rounded-xl text-xs h-8"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog revisar */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Revisar solicitud #{selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <ReviewForm
            application={selected!}
            onSubmit={handleReview}
            isPending={reviewMutation.isPending}
            onCancel={() => setReviewOpen(false)}
            open={reviewOpen}
            onOpenChange={setReviewOpen}
          />
          )}
        </DialogContent>
      </Dialog>

      {/* LoanDetailDrawer - Panel lateral moderno para solicitudes */}
      <LoanDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        data={selected ? transformApplicationForDrawer(selected) : null}
        type="application"
      />

      {/* AlertDialog cancelar */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Cancelar solicitud #{selected?.id}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cancelará la solicitud de préstamo. No podrá
              revertirse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              Volver
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              {cancelMutation.isPending
                ? 'Cancelando...'
                : 'Sí, cancelar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

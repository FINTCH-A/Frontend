/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X, Eye, CheckCircle, XCircle, TrendingUp, DollarSign, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  SheetDescription,
} from '@/components/ui/sheet';
import type { LoanApplication } from '../types/solicitudes.types';
import { formatCurrency, formatDate } from '@/lib/utils';

const schema = z.object({
  status: z.enum([
    'APPROVED',
    'REJECTED',
    'UNDER_REVIEW',
  ]),
  analystNotes: z.string().max(1000).optional(),
  approvedAmount: z.preprocess(
    (v) => (v === '' || v === undefined ? undefined : Number(v)),
    z.number().positive().max(50000).optional(),
  ),
  interestRate: z.preprocess(
    (v) => (v === '' || v === undefined ? undefined : Number(v)),
    z.number().min(1).max(100).optional(),
  ),
});

type ReviewForm = z.infer<typeof schema>;

interface ReviewFormProps {
  application: LoanApplication;
  onSubmit: (data: ReviewForm) => void;
  isPending: boolean;
  onCancel: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Borrador', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  SUBMITTED: { label: 'Enviada', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' },
  UNDER_REVIEW: { label: 'En revisión', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' },
  APPROVED: { label: 'Aprobada', color: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400' },
  REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400' },
  CANCELLED: { label: 'Cancelada', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
};

export function ReviewForm({
  application,
  onSubmit,
  isPending,
  onCancel,
  open,
  onOpenChange,
}: ReviewFormProps) {
  const form = useForm<ReviewForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      status: 'UNDER_REVIEW',
      analystNotes: application.analystNotes || '',
      approvedAmount: application.requestedAmount,
      interestRate: 18,
    },
  });

  const status = form.watch('status');
  const currentStatus = statusConfig[application.status] || statusConfig.DRAFT;

  const handleSubmit = (data: ReviewForm) => {
    onSubmit(data);
  };

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
                Revisar Solicitud
              </SheetTitle>
              <Badge className={`${currentStatus.color} border px-3 py-1 text-xs font-semibold rounded-full`}>
                {currentStatus.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <SheetDescription className="text-sm text-muted-foreground">
                Solicitud #{application.id}
              </SheetDescription>
              <span className="text-xs text-muted-foreground">•</span>
              <SheetDescription className="text-sm text-muted-foreground">
                {formatDate(application.createdAt)}
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Contenido */}
          <div className="space-y-6 mt-6">
            {/* Resumen de la solicitud */}
            <div className="bg-linear-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-5 border border-primary/20 dark:border-primary/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Resumen de la solicitud
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Monto solicitado
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(application.requestedAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Plazo
                  </span>
                  <span className="text-base font-semibold">
                    {application.requestedTerm} meses
                  </span>
                </div>
                {application.purpose && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Propósito
                    </span>
                    <span className="text-sm font-medium text-right max-w-48">
                      {application.purpose}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Formulario de revisión */}
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              {/* Estado/Decisión */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Decisión
                </Label>
                <Select
                  onValueChange={(value) => form.setValue('status', value as any)}
                  value={form.watch('status')}
                >
                  <SelectTrigger className="rounded-xl h-12 border-border/70">
                    <SelectValue placeholder="Selecciona una decisión" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="UNDER_REVIEW" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-amber-500" />
                        <span>🔍 En revisión</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="APPROVED" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>✅ Aprobar</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="REJECTED" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>❌ Rechazar</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campos condicionales al aprobar */}
              <AnimatePresence>
                {status === 'APPROVED' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          Monto aprobado (S/)
                        </Label>
                        <Input
                          type="number"
                          placeholder="Monto a aprobar"
                          className="rounded-xl h-11 border-border/70"
                          {...form.register('approvedAmount')}
                        />
                        {form.formState.errors.approvedAmount && (
                          <p className="text-xs text-red-500">{form.formState.errors.approvedAmount.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                          Tasa anual (%)
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Tasa de interés"
                          className="rounded-xl h-11 border-border/70"
                          {...form.register('interestRate')}
                        />
                        {form.formState.errors.interestRate && (
                          <p className="text-xs text-red-500">{form.formState.errors.interestRate.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notas del analista */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Notas del analista
                </Label>
                <Textarea
                  placeholder="Escribe aquí tus observaciones sobre la solicitud..."
                  className="rounded-xl resize-none border-border/70 min-h-24"
                  {...form.register('analystNotes')}
                />
                {form.formState.errors.analystNotes && (
                  <p className="text-xs text-red-500">{form.formState.errors.analystNotes.message}</p>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isPending}
                  className="flex-1 rounded-xl h-11 font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-xl h-11 font-semibold bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Guardar decisión
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm }     from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }           from 'zod';
import { Loader2 }     from 'lucide-react';

import { Button }   from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input }    from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { LoanApplication } from '../types/solicitudes.types';

const schema = z.object({
  status: z.enum([
    'APPROVED',
    'REJECTED',
    'UNDER_REVIEW',
  ]),
  analystNotes:   z.string().max(1000).optional(),
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
  onSubmit:    (data: ReviewForm) => void;
  isPending:   boolean;
  onCancel:    () => void;
}

export function ReviewForm({
  application,
  onSubmit,
  isPending,
  onCancel,
}: ReviewFormProps) {
  const form = useForm<ReviewForm>({
    resolver:      zodResolver(schema) as any,
    defaultValues: {
      status:         'UNDER_REVIEW',
      analystNotes:   '',
      approvedAmount: application.requestedAmount,
      interestRate:   18,
    },
  });

  const status = form.watch('status');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Resumen de solicitud */}
        <div className="bg-muted/50 rounded-xl p-3 text-sm space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monto solicitado</span>
            <span className="font-semibold">
              S/ {application.requestedAmount.toLocaleString('es-PE')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plazo</span>
            <span className="font-semibold">
              {application.requestedTerm} meses
            </span>
          </div>
          {application.purpose && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Propósito</span>
              <span className="font-semibold max-w-50 text-right truncate">
                {application.purpose}
              </span>
            </div>
          )}
        </div>

        {/* Estado */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Decisión</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UNDER_REVIEW">
                    🔍 En revisión
                  </SelectItem>
                  <SelectItem value="APPROVED">
                    ✅ Aprobar
                  </SelectItem>
                  <SelectItem value="REJECTED">
                    ❌ Rechazar
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campos solo si se aprueba */}
        {status === 'APPROVED' && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="approvedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto aprobado (S/)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5000"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa anual (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="18"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Notas */}
        <FormField
          control={form.control}
          name="analystNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas del analista</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observaciones sobre la solicitud..."
                  className="rounded-xl resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-xl"
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Guardar decisión
          </Button>
        </div>
      </form>
    </Form>
  );
}

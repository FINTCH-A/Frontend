/* eslint-disable @typescript-eslint/no-explicit-any */
// En tu componente PrestamoForm, agrega el estado y el panel
'use client';

import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoanDetailDrawer } from '@/components/ui/loan-detail-drawer';

const schema = z.object({
  loanApplicationId: z.coerce.number().positive('ID de solicitud requerido'),
  approvedAmount: z.coerce.number().positive('El monto debe ser positivo').max(50000),
  interestRate: z.coerce.number().min(1, 'Mínimo 1%').max(100, 'Máximo 100%'),
  interestType: z.enum(['FIXED', 'VARIABLE']).default('FIXED'),
  amortization: z.enum(['FRENCH', 'GERMAN']).default('FRENCH'),
});

type PrestamoFormInput = {
  loanApplicationId: number | string;
  approvedAmount: number | string;
  interestRate: number | string;
  interestType: 'FIXED' | 'VARIABLE';
  amortization: 'FRENCH' | 'GERMAN';
};

type PrestamoFormOutput = z.output<typeof schema>;

interface PrestamoFormProps {
  applicationId?: number;
  requestedAmount?: number;
  requestedTerm?: number;
  applicationData?: any; // Datos completos de la solicitud para mostrar en el panel
  onSubmit: (data: PrestamoFormOutput) => void;
  isPending: boolean;
  onCancel: () => void;
}

export function PrestamoForm({
  applicationId,
  requestedAmount,
  requestedTerm,
  applicationData,
  onSubmit,
  isPending,
  onCancel,
}: PrestamoFormProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const form = useForm<PrestamoFormInput, unknown, PrestamoFormOutput>({
    resolver: zodResolver(schema) as unknown as Resolver<PrestamoFormInput, unknown, PrestamoFormOutput>,
    defaultValues: {
      loanApplicationId: applicationId ?? '',
      approvedAmount: requestedAmount?.toString() || '',
      interestRate: '16',
      interestType: 'FIXED',
      amortization: 'FRENCH',
    },
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Botón para ver detalles */}
          {(requestedAmount || requestedTerm) && (
            <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">Resumen de solicitud</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDrawerOpen(true)}
                  className="gap-1 text-xs h-7"
                >
                  <Eye className="h-3 w-3" />
                  Ver detalles
                </Button>
              </div>
              {requestedAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monto solicitado</span>
                  <span className="font-semibold">S/ {requestedAmount.toLocaleString('es-PE')}</span>
                </div>
              )}
              {requestedTerm && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plazo solicitado</span>
                  <span className="font-semibold">{requestedTerm} meses</span>
                </div>
              )}
            </div>
          )}

          <FormField
            control={form.control}
            name="loanApplicationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID de Solicitud Aprobada</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    className="rounded-xl h-11"
                    disabled={!!applicationId}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      placeholder="8,000.00"
                      className="rounded-xl h-11"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
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
                      placeholder="16.00"
                      className="rounded-xl h-11"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="interestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de interés</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FIXED">Fijo</SelectItem>
                      <SelectItem value="VARIABLE">Variable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amortization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amortización</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FRENCH">Francesa</SelectItem>
                      <SelectItem value="GERMAN">Alemana</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              className="flex-1 rounded-xl h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl h-11"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear préstamo
            </Button>
          </div>
        </form>
      </Form>

      {/* Panel de detalles */}
      <LoanDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        data={applicationData || { id: applicationId, requestedAmount, requestedTerm, status: 'PENDING' }}
        type="application"
      />
    </>
  );
}

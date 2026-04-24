'use client';

import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }           from 'zod';
import { Loader2 }     from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
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

const schema = z.object({
  loanApplicationId: z.coerce.number().positive('ID de solicitud requerido'),
  approvedAmount:    z.coerce.number().positive('El monto debe ser positivo').max(50000),
  interestRate:      z.coerce.number().min(1, 'Mínimo 1%').max(100, 'Máximo 100%'),
  interestType:      z.enum(['FIXED', 'VARIABLE']).default('FIXED'),
  amortization:      z.enum(['FRENCH', 'GERMAN']).default('FRENCH'),
});

// ✅ Input: lo que maneja el form internamente (strings desde los inputs HTML)
type PrestamoFormInput = {
  loanApplicationId: number | string;
  approvedAmount:    number | string;
  interestRate:      number | string;
  interestType:      'FIXED' | 'VARIABLE';
  amortization:      'FRENCH' | 'GERMAN';
};

// ✅ Output: lo que sale validado del schema (números reales)
type PrestamoFormOutput = z.output<typeof schema>;

interface PrestamoFormProps {
  applicationId?: number;
  requestedAmount?: number;  // 👈 AGREGAR
  requestedTerm?: number;     // 👈 AGREGAR
  onSubmit: (data: PrestamoFormOutput) => void;
  isPending: boolean;
  onCancel: () => void;
}

export function PrestamoForm({
  applicationId,
  requestedAmount,
  requestedTerm,
  onSubmit,
  isPending,
  onCancel,
}: PrestamoFormProps) {
  const form = useForm<PrestamoFormInput, unknown, PrestamoFormOutput>({
    resolver: zodResolver(schema) as unknown as Resolver<PrestamoFormInput, unknown, PrestamoFormOutput>,
    defaultValues: {
      loanApplicationId: applicationId ?? '',
      approvedAmount:    requestedAmount?.toString() || '',  // 👈 MODIFICADO
      interestRate:      '16',  // 👈 MODIFICADO (16% como en la imagen)
      interestType:      'FIXED',
      amortization:      'FRENCH',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

      {(requestedAmount || requestedTerm) && (
  <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-2">
    <h3 className="font-semibold text-sm mb-2">Resumen de solicitud</h3>
    {requestedAmount && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">Monto solicitado</span>
        <span className="font-semibold">
          S/ {requestedAmount.toLocaleString('es-PE')}
        </span>
      </div>
    )}
    {requestedTerm && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">Plazo solicitado</span>
        <span className="font-semibold">
          {requestedTerm} meses
        </span>
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
                  className="rounded-xl"
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
  className="rounded-xl h-11"  // 👈 AGREGAR h-11
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
  className="rounded-xl h-11"  // 👈 AGREGAR h-11
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
                    <SelectTrigger className="rounded-xl">
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
  );
}

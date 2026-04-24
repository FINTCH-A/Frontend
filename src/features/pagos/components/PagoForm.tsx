/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm }     from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }           from 'zod';
import { Loader2 }     from 'lucide-react';

import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const schema = z.object({
  loanId: z.preprocess(
    (v) => Number(v),
    z.number().positive('ID de préstamo requerido'),
  ),
  installmentId: z.preprocess(
    (v) => (v === '' || v === undefined ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  amount: z.preprocess(
    (v) => Number(v),
    z.number().positive('El monto debe ser positivo'),
  ),
  notes: z.string().max(500).optional(),
});

type PagoForm = z.infer<typeof schema>;

interface PagoFormProps {
  onSubmit:  (data: PagoForm) => void;
  isPending: boolean;
  onCancel:  () => void;
}

export function PagoForm({ onSubmit, isPending, onCancel }: PagoFormProps) {
  const form = useForm<PagoForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      loanId:        undefined,
      installmentId: undefined,
      amount:        undefined,
      notes:         '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="loanId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID del Préstamo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
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
            name="installmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID de Cuota (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    className="rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto (S/)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="350.00"
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Pago vía Yape, operación #123..."
                  className="rounded-xl resize-none"
                  rows={2}
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
            Registrar pago
          </Button>
        </div>
      </form>
    </Form>
  );
}

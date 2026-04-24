/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState }    from 'react';
import { useForm }     from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }           from 'zod';
import {
  Loader2, CreditCard,
  Smartphone, Banknote,
  CheckCircle,
} from 'lucide-react';
import { motion }      from 'framer-motion';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRealizarPago } from '@/features/portal/hooks/use-portal';
import { formatCurrency }  from '@/lib/utils';
import type { Installment } from '@/features/portal/types/portal.types';

const schema = z.object({
  amount: z.preprocess(
    (v) => Number(v),
    z.number().positive('El monto debe ser positivo'),
  ),
  notes: z.string().max(200).optional(),
});

type PagoForm = z.infer<typeof schema>;

const METODOS = [
  { id: 'yape',       label: 'Yape',         icon: Smartphone, color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400' },
  { id: 'plin',       label: 'Plin',         icon: Smartphone, color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400' },
  { id: 'transferencia', label: 'Transferencia', icon: Banknote, color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { id: 'efectivo',   label: 'Efectivo',     icon: CreditCard, color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400' },
];

interface PagarCuotaDialogProps {
  installment: Installment | null;
  open:        boolean;
  onClose:     () => void;
}

export function PagarCuotaDialog({
  installment,
  open,
  onClose,
}: PagarCuotaDialogProps) {
  const [metodo,  setMetodo]  = useState('yape');
  const [success, setSuccess] = useState(false);

  const pagarMutation = useRealizarPago();

  const form = useForm<PagoForm>({
    resolver:      zodResolver(schema) as any,
    defaultValues: {
      amount: installment?.pendingAmount ?? installment?.totalAmount ?? 0,
      notes:  '',
    },
    values: {
      amount: installment?.pendingAmount ?? installment?.totalAmount ?? 0,
      notes:  '',
    },
  });

  const handleClose = () => {
    setSuccess(false);
    setMetodo('yape');
    form.reset();
    onClose();
  };

  const onSubmit = (data: PagoForm) => {
    if (!installment) return;

    pagarMutation.mutate(
      {
        loanId:        installment.loanId,
        installmentId: installment.id,
        amount:        data.amount,
        notes:         data.notes
          ? `${data.notes} - vía ${metodo}`
          : `Pago cuota #${installment.installmentNumber} vía ${metodo}`,
      },
      {
        onSuccess: () => setSuccess(true),
      },
    );
  };

  if (!installment) return null;

  const pendingAmount = installment.pendingAmount > 0
    ? installment.pendingAmount
    : installment.totalAmount;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Pagar Cuota #{installment.installmentNumber}
          </DialogTitle>
        </DialogHeader>

        {/* Éxito */}
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className="p-5 bg-emerald-100 dark:bg-emerald-950/40 rounded-full">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                ¡Pago realizado!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tu pago de {formatCurrency(form.getValues('amount'))} fue
                procesado correctamente.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full rounded-xl"
            >
              Cerrar
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {/* Resumen cuota */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cuota</span>
                <span className="font-semibold">
                  #{installment.installmentNumber} de {installment.loanId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monto cuota</span>
                <span className="font-semibold">
                  {formatCurrency(installment.totalAmount)}
                </span>
              </div>
              {installment.paidAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ya pagado</span>
                  <span className="text-emerald-600 font-semibold">
                    {formatCurrency(installment.paidAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t border-border/40 pt-2 mt-2">
                <span className="font-semibold">Pendiente</span>
                <span className="font-bold text-primary text-base">
                  {formatCurrency(pendingAmount)}
                </span>
              </div>
            </div>

            {/* Método de pago */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Método de pago
              </p>
              <div className="grid grid-cols-2 gap-2">
                {METODOS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMetodo(m.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                        metodo === m.id
                          ? m.color + ' border-current shadow-sm'
                          : 'border-border/60 hover:border-primary/40 text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulario */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto a pagar (S/)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">
                            S/
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            className="pl-9 h-11 rounded-xl font-semibold text-base"
                            {...field}
                          />
                        </div>
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
                      <FormLabel>Nota (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Operación #12345"
                          className="rounded-xl"
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
                    onClick={handleClose}
                    disabled={pagarMutation.isPending}
                    className="flex-1 rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={pagarMutation.isPending}
                    className="flex-1 rounded-xl font-semibold"
                  >
                    {pagarMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      `Pagar ${formatCurrency(form.watch('amount') || 0)}`
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

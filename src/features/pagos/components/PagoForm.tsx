/* eslint-disable @typescript-eslint/no-explicit-any */
 'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CreditCard, DollarSign, Hash, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

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
}) as z.ZodType<{
  loanId: number;
  installmentId?: number;
  amount: number;
  notes?: string;
}>;

type PagoForm = z.infer<typeof schema>;

interface PagoFormProps {
  onSubmit: (data: PagoForm) => void;
  isPending: boolean;
  onCancel: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PagoForm({ onSubmit, isPending, onCancel, open, onOpenChange }: PagoFormProps) {
  const form = useForm<PagoForm>({
    resolver: zodResolver(schema as z.ZodType<any, any, any>),
    defaultValues: {
      loanId: undefined,
      installmentId: undefined,
      amount: undefined,
      notes: '',
    },
  });

  const handleSubmit = (data: PagoForm) => {
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
                Registrar Pago
              </SheetTitle>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Nuevo
              </Badge>
            </div>
            <SheetDescription className="text-sm text-muted-foreground mt-2">
              Completa los datos para registrar un nuevo pago
            </SheetDescription>
          </SheetHeader>

          {/* Formulario */}
          <div className="mt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="loanId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold flex items-center gap-2">
                          <Hash className="h-3 w-3" />
                          ID del Préstamo
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ej: 1"
                            className="rounded-xl h-11 border-border/70"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                        <FormLabel className="text-sm font-semibold flex items-center gap-2">
                          <Hash className="h-3 w-3" />
                          ID de Cuota (opcional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ej: 1"
                            className="rounded-xl h-11 border-border/70"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        Monto (S/)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="350.00"
                          className="rounded-xl h-11 border-border/70"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
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
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        Notas (opcional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ej: Pago vía Yape, operación #123..."
                          className="rounded-xl resize-none border-border/70 min-h-24"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botones */}
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
                        Registrando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Registrar pago
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  score: z.preprocess(
    (v) => Number(v),
    z.number()
      .min(300, 'Mínimo 300')
      .max(950, 'Máximo 950'),
  ),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']).refine((val) => val !== undefined, {
    message: 'Selecciona un nivel de riesgo',
  }),
  paymentHistory: z.preprocess(
    (v) => (v === '' || v === undefined ? undefined : Number(v)),
    z.number().min(0).max(1).optional(),
  ),
  debtRatio: z.preprocess(
    (v) => (v === '' || v === undefined ? undefined : Number(v)),
    z.number().min(0).max(1).optional(),
  ),
  maxLoanAmount: z.preprocess(
    (v) => (v === '' || v === undefined ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  notes:     z.string().max(1000).optional(),
  expiresAt: z.string().optional(),
});

type CreditScoreForm = z.infer<typeof schema>;

interface CreditScoreFormProps {
  userId:    number;
  onSubmit:  (data: CreditScoreForm) => void;
  isPending: boolean;
  onCancel:  () => void;
}

export function CreditScoreForm({
  userId,
  onSubmit,
  isPending,
  onCancel,
}: CreditScoreFormProps) {
  const form = useForm<CreditScoreForm>({
    resolver:      zodResolver(schema) as any,
    defaultValues: {
      score:          700,
      riskLevel:      'MEDIUM',
      paymentHistory: undefined,
      debtRatio:      undefined,
      maxLoanAmount:  undefined,
      notes:          '',
      expiresAt:      '',
    },
  });

  const score     = form.watch('score');
  const riskLevel = form.watch('riskLevel');

  const getScoreColor = (s: number) => {
    if (s >= 750) return 'text-emerald-600';
    if (s >= 650) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Score preview */}
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">
            Score crediticio
          </p>
          <p className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            de 950 puntos máximos
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score (300 — 950)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={300}
                    max={950}
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
            name="riskLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel de riesgo</FormLabel>
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
                    <SelectItem value="LOW">🟢 Bajo</SelectItem>
                    <SelectItem value="MEDIUM">🟡 Medio</SelectItem>
                    <SelectItem value="HIGH">🟠 Alto</SelectItem>
                    <SelectItem value="VERY_HIGH">🔴 Muy alto</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paymentHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historial de pagos (0-1)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    max={1}
                    placeholder="0.95"
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
            name="debtRatio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ratio de deuda (0-1)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    max={1}
                    placeholder="0.30"
                    className="rounded-xl"
                    {...field}
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
            name="maxLoanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto máx. préstamo (S/)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="15000"
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
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expira el (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas del analista</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observaciones sobre el perfil crediticio..."
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
            Guardar evaluación
          </Button>
        </div>
      </form>
    </Form>
  );
}

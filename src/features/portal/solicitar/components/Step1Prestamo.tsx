/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/portal/solicitar/components/Step1Prestamo.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronRight, Banknote } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

const TERM_OPTIONS = [3, 6, 12, 18, 24, 36, 48, 60];
const AMOUNT_OPTIONS = [500, 1000, 2000, 3000, 5000, 10000, 15000, 20000];

interface Step1PrestamoProps {
  form: any;
  amount: number;
  term: number;
  fee: number;
  onSubmit: (data: any) => void;
}

export function Step1Prestamo({ form, amount, term, fee, onSubmit }: Step1PrestamoProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="rounded-2xl border border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Banknote className="h-4 w-4 text-primary" />
                ¿Cuánto necesitas?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <FormField
                control={form.control}
                name="requestedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm text-muted-foreground">S/</span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-9 h-12 text-lg font-bold rounded-xl"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2">
                {AMOUNT_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => form.setValue('requestedAmount', a)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      amount === a
                        ? 'bg-primary text-white border-primary'
                        : 'border-border/60 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {formatCurrency(a)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">¿En cuántos meses pagarás?</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <FormField
                control={form.control}
                name="requestedTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-4 gap-2">
                        {TERM_OPTIONS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => form.setValue('requestedTerm', t)}
                            className={`py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                              Number(field.value) === t
                                ? 'bg-primary text-white border-primary'
                                : 'border-border/60 hover:border-primary hover:text-primary'
                            }`}
                          >
                            {t}m
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {amount > 0 && fee > 0 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="rounded-2xl border border-primary/30 bg-primary/5">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">Estimado referencial (18% anual)</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: 'Cuota mensual', value: formatCurrency(fee) },
                      { label: 'Total a pagar', value: formatCurrency(fee * term) },
                      { label: 'Plazo', value: `${term} meses` },
                    ].map((m) => (
                      <div key={m.label} className="bg-background/70 rounded-xl p-2.5">
                        <p className="text-[10px] text-muted-foreground">{m.label}</p>
                        <p className="text-sm font-bold">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Para qué usarás el préstamo? (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ej: Compra de equipos, capital de trabajo..."
                    className="rounded-xl resize-none"
                    rows={2}
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-11 rounded-xl font-semibold gap-2">
            Continuar <ChevronRight className="h-4 w-4" />
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

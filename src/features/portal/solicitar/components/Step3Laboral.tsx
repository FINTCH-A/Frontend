/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/portal/solicitar/components/Step3Laboral.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, ChevronLeft, Briefcase, Loader2 } from 'lucide-react'; // ← Agregar ChevronLeft
import { motion } from 'framer-motion';

const EMPLOYMENT_LABELS: Record<string, string> = {
  EMPLOYED: 'Empleado',
  SELF_EMPLOYED: 'Independiente',
  UNEMPLOYED: 'Desempleado',
  RETIRED: 'Jubilado/Pensionista',
  STUDENT: 'Estudiante',
};

interface Step3LaboralProps {
  form: any;
  loading: boolean;
  onSubmit: (data: any) => void;
  onPrev: () => void;
}

export function Step3Laboral({ form, loading, onSubmit, onPrev }: Step3LaboralProps) { // ← Agregar onPrev a los parámetros
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="rounded-2xl border border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Situación laboral e ingresos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situación laboral</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(EMPLOYMENT_LABELS).map(([v, l]) => (
                          <SelectItem key={v} value={v}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa / Negocio (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de tu empleador o negocio" className="rounded-xl" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ingresos mensuales (S/)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2500"
                          className="rounded-xl"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gastos mensuales (S/)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1200"
                          className="rounded-xl"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="numberOfDependents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° dependientes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="rounded-xl"
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherIncomeSources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Otros ingresos (S/) opcional</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="rounded-xl"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones en fila */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onPrev}
              variant="outline"
              className="flex-1 h-11 rounded-xl font-semibold gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Atrás
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-xl font-semibold gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Continuar <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}

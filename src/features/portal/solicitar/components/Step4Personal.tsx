/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/portal/solicitar/components/Step4Personal.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, ChevronLeft, Users, Loader2 } from 'lucide-react'; // ← Agregar ChevronLeft
import { motion } from 'framer-motion';

const MARITAL_LABELS: Record<string, string> = {
  SINGLE: 'Soltero/a',
  MARRIED: 'Casado/a',
  DIVORCED: 'Divorciado/a',
  WIDOWED: 'Viudo/a',
  DOMESTIC_PARTNERSHIP: 'Conviviente',
};

const HOUSING_LABELS: Record<string, string> = {
  OWNED: 'Casa propia',
  RENTED: 'Alquilada',
  FAMILY: 'Casa familiar',
  OTHER: 'Otra',
};

interface Step4PersonalProps {
  form: any;
  loading: boolean;
  onSubmit: (data: any) => void;
  onPrev: () => void; // ← Agregar onPrev a la interfaz
}

export function Step4Personal({ form, loading, onSubmit, onPrev }: Step4PersonalProps) { // ← Agregar onPrev a los parámetros
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="rounded-2xl border border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Información personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado civil</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(MARITAL_LABELS).map(([v, l]) => (
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
                name="housingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de vivienda</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(HOUSING_LABELS).map(([v, l]) => (
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
                name="numberOfChildren"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de hijos</FormLabel>
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

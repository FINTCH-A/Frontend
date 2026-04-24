/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/portal/solicitar/components/Step2Direccion.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronRight, ChevronLeft, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step2DireccionProps {
  form: any;
  loading: boolean;
  onSubmit: (data: any) => void;
  onPrev: () => void;  // ← Asegurar que existe en la interfaz
}

export function Step2Direccion({ form, loading, onSubmit, onPrev }: Step2DireccionProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="rounded-2xl border border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Tu dirección actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="Perú" className="rounded-xl" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Junín" className="rounded-xl" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input placeholder="Huancayo" className="rounded-xl" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distrito</FormLabel>
                    <FormControl>
                      <Input placeholder="El Tambo" className="rounded-xl" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección completa</FormLabel>
                    <FormControl>
                      <Input placeholder="Av. Giráldez 245, Piso 2" className="rounded-xl" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código postal (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="12001" className="rounded-xl" {...field} value={field.value ?? ''} />
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
              type="button"  // ← Importante: type="button", no "submit"
              onClick={onPrev}  // ← Usar la función onPrev
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

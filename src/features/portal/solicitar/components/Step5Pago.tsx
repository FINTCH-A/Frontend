/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/portal/solicitar/components/Step5Pago.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, ChevronLeft, Smartphone, Banknote, Loader2 } from 'lucide-react'; // ← Agregar ChevronLeft
import { motion } from 'framer-motion';

const PAYMENT_PROVIDERS = {
  DIGITAL_WALLET: [
    { value: 'YAPE',  label: 'Yape'  },
    { value: 'PLIN',  label: 'Plin'  },
    { value: 'TUNKI', label: 'Tunki' },
  ],
  BANK_ACCOUNT: [
    { value: 'BCP',                label: 'BCP'               },
    { value: 'BBVA',               label: 'BBVA'              },
    { value: 'INTERBANK',          label: 'Interbank'         },
    { value: 'SCOTIABANK',         label: 'Scotiabank'        },
    { value: 'BANCO_DE_LA_NACION', label: 'Banco de la Nación'},
  ],
};

type PaymentType = 'DIGITAL_WALLET' | 'BANK_ACCOUNT' | '';

interface Step5PagoProps {
  form: any;
  loading: boolean;
  onSubmit: (data: any) => void;
  onPrev: () => void; // ← Agregar onPrev a la interfaz
}

export function Step5Pago({ form, loading, onSubmit, onPrev }: Step5PagoProps) { // ← Agregar onPrev a los parámetros
  // Estado local para controlar qué tipo está seleccionado.
  // Sincronizado con el form pero manejado por React directamente
  // para garantizar re-render inmediato al cambiar de tipo.
  const [paymentType, setPaymentType] = useState<PaymentType>(
    form.getValues('type') || ''
  );

  const currentProviders =
    paymentType === 'DIGITAL_WALLET'
      ? PAYMENT_PROVIDERS.DIGITAL_WALLET
      : paymentType === 'BANK_ACCOUNT'
      ? PAYMENT_PROVIDERS.BANK_ACCOUNT
      : [];

  const handleTypeChange = (newType: PaymentType) => {
    // 1. Actualizar estado local → dispara re-render inmediato
    setPaymentType(newType);
    // 2. Sincronizar con React Hook Form
    form.setValue('type', newType, { shouldValidate: true });
    // 3. Limpiar campos dependientes
    form.setValue('provider',      '', { shouldValidate: false });
    form.setValue('accountNumber', '', { shouldValidate: false });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="rounded-2xl border border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                ¿Cómo quieres recibir el dinero?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">

              {/* Selector de tipo */}
              <FormField
                control={form.control}
                name="type"
                render={() => (
                  <FormItem>
                    <FormLabel>Tipo de cuenta</FormLabel>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleTypeChange('DIGITAL_WALLET')}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          paymentType === 'DIGITAL_WALLET'
                            ? 'border-primary bg-primary/5'
                            : 'border-border/60 hover:border-primary/50'
                        }`}
                      >
                        <Smartphone
                          className={`h-5 w-5 mx-auto mb-1 ${
                            paymentType === 'DIGITAL_WALLET' ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                        <p className="text-xs font-semibold">Billetera digital</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTypeChange('BANK_ACCOUNT')}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          paymentType === 'BANK_ACCOUNT'
                            ? 'border-primary bg-primary/5'
                            : 'border-border/60 hover:border-primary/50'
                        }`}
                      >
                        <Banknote
                          className={`h-5 w-5 mx-auto mb-1 ${
                            paymentType === 'BANK_ACCOUNT' ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                        <p className="text-xs font-semibold">Cuenta bancaria</p>
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Selector de Proveedor */}
              {/* key en el Select para forzar remonte de Radix UI al cambiar tipo */}
              {paymentType && (
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor</FormLabel>
                      <Select
                        key={`select-${paymentType}`}
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Selecciona un proveedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currentProviders.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Número de cuenta/teléfono */}
              {paymentType && (
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {paymentType === 'DIGITAL_WALLET' ? 'Número de teléfono' : 'Número de cuenta'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          key={`input-${paymentType}`}
                          placeholder={
                            paymentType === 'DIGITAL_WALLET'
                              ? 'Ej: 987654321'
                              : 'Ej: 1234-5678-9012-3456'
                          }
                          className="rounded-xl"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Nombre del titular */}
              {paymentType && (
                <FormField
                  control={form.control}
                  name="accountHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del titular</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Como aparece en tu documento"
                          className="rounded-xl"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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

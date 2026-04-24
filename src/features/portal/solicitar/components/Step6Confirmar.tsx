/* eslint-disable @typescript-eslint/no-unused-vars */
// src/features/portal/solicitar/components/Step6Confirmar.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Loader2, FileCheck, Calendar, DollarSign, MapPin, Briefcase, Users, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import type { SolicitarFormState } from '../types/solicitar.types';

const EMPLOYMENT_LABELS: Record<string, string> = {
  EMPLOYED: 'Empleado',
  SELF_EMPLOYED: 'Independiente',
  UNEMPLOYED: 'Desempleado',
  RETIRED: 'Jubilado/Pensionista',
  STUDENT: 'Estudiante',
};

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

interface Step6ConfirmarProps {
  formData: SolicitarFormState;
  amount: number;
  term: number;
  fee: number;
  loading: boolean;
  onSubmit: () => void;
  onPrev: () => void;
}

export function Step6Confirmar({ formData, amount, term, fee, loading, onSubmit, onPrev }: Step6ConfirmarProps) {
  const { step1Data, step2Data, step3Data, step4Data, step5Data } = formData;

  if (!step1Data || !step2Data || !step3Data || !step4Data || !step5Data) {
    return (
      <Card className="rounded-2xl border border-red-500/30 bg-red-50">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-800 font-semibold">Información incompleta</p>
          <p className="text-red-600 text-sm mt-1">Por favor, completa todos los pasos anteriores</p>
        </CardContent>
      </Card>
    );
  }

  const totalPayment = fee * term;
  const monthlyIncome = step3Data.monthlyIncome;
  const monthlyExpenses = step3Data.monthlyExpenses;
  const disposableIncome = monthlyIncome - monthlyExpenses;
  const debtToIncomeRatio = monthlyIncome > 0 ? (fee / monthlyIncome) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="space-y-4">
        <Card className="rounded-2xl border border-primary/30 bg-linear-to-br from-primary/5 to-transparent">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">MONTO SOLICITADO</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-semibold">CUOTA MENSUAL</p>
                <p className="text-2xl font-bold">{formatCurrency(fee)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
              <div>
                <p className="text-xs text-muted-foreground">Plazo</p>
                <p className="text-sm font-semibold">{term} meses</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total a pagar</p>
                <p className="text-sm font-semibold">{formatCurrency(totalPayment)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3">
          <Card className="rounded-xl border border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Detalle del préstamo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Finalidad:</span>
                <span className="font-medium">{step1Data.purpose || 'No especificada'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TEA:</span>
                <span className="font-medium">18% anual</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacidad de pago:</span>
                <span className={`font-medium ${debtToIncomeRatio <= 30 ? 'text-green-600' : debtToIncomeRatio <= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {debtToIncomeRatio.toFixed(1)}% de ingresos
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Dirección
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{step2Data.streetAddress}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {step2Data.district}, {step2Data.city} - {step2Data.department}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Situación laboral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Situación:</span>
                <span className="font-medium">{EMPLOYMENT_LABELS[step3Data.employmentStatus]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ingresos mensuales:</span>
                <span className="font-medium">{formatCurrency(step3Data.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gastos mensuales:</span>
                <span className="font-medium">{formatCurrency(step3Data.monthlyExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacidad residual:</span>
                <span className="font-medium text-green-600">{formatCurrency(disposableIncome)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Información personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado civil:</span>
                <span className="font-medium">{MARITAL_LABELS[step4Data.maritalStatus]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hijos:</span>
                <span className="font-medium">{step4Data.numberOfChildren}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vivienda:</span>
                <span className="font-medium">{HOUSING_LABELS[step4Data.housingType]}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                Datos de pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">{step5Data.type === 'DIGITAL_WALLET' ? 'Billetera digital' : 'Cuenta bancaria'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proveedor:</span>
                <span className="font-medium">{step5Data.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Número:</span>
                <span className="font-medium">{step5Data.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Titular:</span>
                <span className="font-medium">{step5Data.accountHolder}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onPrev} className="flex-1 h-11 rounded-xl">
            Atrás
          </Button>
          <Button onClick={onSubmit} disabled={loading} className="flex-1 h-11 rounded-xl gap-2 bg-green-600 hover:bg-green-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
            {loading ? 'Enviando...' : 'Confirmar solicitud'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

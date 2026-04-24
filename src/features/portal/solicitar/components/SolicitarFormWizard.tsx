/* eslint-disable @typescript-eslint/no-unused-vars */
// src/features/portal/solicitar/components/SolicitarFormWizard.tsx
'use client';

import { useSolicitarForm } from '../../hooks/useSolicitarForm';
import { Step1Prestamo } from './Step1Prestamo';
import { Step2Direccion } from './Step2Direccion';
import { Step3Laboral } from './Step3Laboral';
import { Step4Personal } from './Step4Personal';
import { Step5Pago } from './Step5Pago';
import { Step6Confirmar } from './Step6Confirmar';
import { StepSuccess } from './StepSuccess';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

const STEP_TITLES = [
  'Monto y plazo',
  'Dirección',
  'Situación laboral',
  'Información personal',
  'Datos de pago',
  'Confirmar',
];

export function SolicitarFormWizard() {
  const {
    step,
    loading,
    success,
    appId,
    amount,
    term,
    fee,
    forms,
    actions,
    formData,  // ← Agregado aquí
  } = useSolicitarForm();

  if (success && appId) {
    return <StepSuccess applicationId={appId} />;
  }

  const progress = ((step - 1) / 6) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Paso {step} de 6</span>
          <span>{STEP_TITLES[step - 1]}</span>
        </div>
        <Progress value={progress} className="h-2 rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        <div className="min-h-125">
          {step === 1 && (
            <Step1Prestamo
              key="step1"
              form={forms.form1}
              amount={amount}
              term={term}
              fee={fee}
              onSubmit={actions.saveStep1}
            />
          )}
          {step === 2 && (
            <Step2Direccion
              key="step2"
              form={forms.form2}
              loading={loading}
              onSubmit={actions.saveStep2}
              onPrev={actions.prevStep}
            />
          )}
          {step === 3 && (
            <Step3Laboral
              key="step3"
              form={forms.form3}
              loading={loading}
              onSubmit={actions.saveStep3}
              onPrev={actions.prevStep}
            />
          )}
          {step === 4 && (
            <Step4Personal
              key="step4"
              form={forms.form4}
              loading={loading}
              onSubmit={actions.saveStep4}
              onPrev={actions.prevStep}
            />
          )}
          {step === 5 && (
            <Step5Pago
              key="step5"
              form={forms.form5}
              loading={loading}
              onSubmit={actions.saveStep5}
              onPrev={actions.prevStep}
            />
          )}
          {step === 6 && (
            <Step6Confirmar
              key="step6"
              formData={formData}  // ← Cambiado de actions.formData a formData
              amount={amount}
              term={term}
              fee={fee}
              loading={loading}
              onSubmit={actions.submitApplication}
              onPrev={actions.prevStep}
            />
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}

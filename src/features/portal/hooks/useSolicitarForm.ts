/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/portal/hooks/useSolicitarForm.ts
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  useCreateApplication,
  useSubmitApplication
} from './use-portal';
import { portalService } from '../services/portal.service';
import {
  step1Schema, step2Schema, step3Schema,
  step4Schema, step5Schema
} from '../solicitar/schemas/solicitar.schemas';
import type { Step1, Step2, Step3, Step4, Step5, SolicitarFormState } from '../solicitar/types/solicitar.types';

export function useSolicitarForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SolicitarFormState>({
    step1Data: null,
    step2Data: null,
    step3Data: null,
    step4Data: null,
    step5Data: null,
  });

  // Mutations de React Query
  const createApplicationMutation = useCreateApplication();
  const submitApplicationMutation = useSubmitApplication();

  // Formularios
  const form1 = useForm<Step1>({
    resolver: zodResolver(step1Schema) as any,
    defaultValues: { requestedAmount: undefined, requestedTerm: 12, purpose: '' },
  });

  const form2 = useForm<Step2>({
    resolver: zodResolver(step2Schema) as any,
    defaultValues: { country: 'Perú', department: '', city: '', district: '', streetAddress: '', postalCode: '' },
  });

  const form3 = useForm<Step3>({
    resolver: zodResolver(step3Schema) as any,
    defaultValues: {
      employmentStatus: undefined,
      employerName: '',
      monthlyIncome: undefined,
      monthlyExpenses: undefined,
      numberOfDependents: 0,
      otherIncomeSources: undefined,
    },
  });

  const form4 = useForm<Step4>({
    resolver: zodResolver(step4Schema) as any,
    defaultValues: { maritalStatus: undefined, numberOfChildren: 0, housingType: undefined },
  });

  const form5 = useForm<Step5>({
    resolver: zodResolver(step5Schema) as any,
    defaultValues: { type: 'DIGITAL_WALLET', provider: '', accountNumber: '', accountHolder: '', isDefault: true },
  });

  const amount = form1.watch('requestedAmount') || 0;
  const term = form1.watch('requestedTerm') || 12;
  const rate = 0.18 / 12;
  const factor = Math.pow(1 + rate, term);
  const fee = amount > 0 ? (amount * (rate * factor)) / (factor - 1) : 0;

  // Cargar datos existentes del usuario
  useEffect(() => {
    const loadExisting = async () => {
      try {
        const [address, financial, family, methods] = await Promise.allSettled([
          portalService.getMyAddress(),
          portalService.getMyFinancialInfo(),
          portalService.getMyFamilyInfo(),
          portalService.getMyPaymentMethods(),
        ]);

        if (address.status === 'fulfilled' && address.value) {
          const a = address.value;
          form2.reset({
            country: a.country || 'Perú',
            department: a.department ?? '',
            city: a.city ?? '',
            district: a.district ?? '',
            streetAddress: a.streetAddress ?? '',
            postalCode: a.postalCode ?? '',
          });
        }
        if (financial.status === 'fulfilled' && financial.value) {
          const f = financial.value;
          form3.reset({
            employmentStatus: f.employmentStatus ?? undefined,
            employerName: f.employerName ?? '',
            monthlyIncome: f.monthlyIncome ? Number(f.monthlyIncome) : undefined,
            monthlyExpenses: f.monthlyExpenses ? Number(f.monthlyExpenses) : undefined,
            numberOfDependents: f.numberOfDependents ?? 0,
            otherIncomeSources: f.otherIncomeSources ? Number(f.otherIncomeSources) : undefined,
          });
        }
        if (family.status === 'fulfilled' && family.value) {
          const fm = family.value;
          form4.reset({
            maritalStatus: fm.maritalStatus ?? undefined,
            numberOfChildren: fm.numberOfChildren ?? 0,
            housingType: fm.housingType ?? undefined,
          });
        }
        if (methods.status === 'fulfilled' && methods.value?.length > 0) {
          const m = methods.value[0];
          form5.reset({
            type: m.type ?? 'DIGITAL_WALLET',
            provider: m.provider ?? '',
            accountNumber: m.accountNumber ?? '',
            accountHolder: m.accountHolder ?? '',
            isDefault: true,
          });
        }
      } catch {
        // Silencioso
      }
    };
    loadExisting();
  }, [form2, form3, form4, form5]);

  const nextStep = (stepNumber: number) => setStep(stepNumber);
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const saveStep1 = (data: Step1) => {
    setFormData(prev => ({ ...prev, step1Data: data }));
    setStep(2);
  };

  const saveStep2 = async (data: Step2) => {
    setLoading(true);
    try {
      await portalService.saveAddress(data);
      setFormData(prev => ({ ...prev, step2Data: data }));
      setStep(3);
    } catch {
      toast.error('Error al guardar dirección');
    } finally {
      setLoading(false);
    }
  };

  const saveStep3 = async (data: Step3) => {
    setLoading(true);
    try {
      await portalService.saveFinancialInfo(data);
      setFormData(prev => ({ ...prev, step3Data: data }));
      setStep(4);
    } catch {
      toast.error('Error al guardar información laboral');
    } finally {
      setLoading(false);
    }
  };

  const saveStep4 = async (data: Step4) => {
    setLoading(true);
    try {
      await portalService.saveFamilyInfo(data);
      setFormData(prev => ({ ...prev, step4Data: data }));
      setStep(5);
    } catch {
      toast.error('Error al guardar información personal');
    } finally {
      setLoading(false);
    }
  };

  const saveStep5 = async (data: Step5) => {
    setLoading(true);
    try {
      await portalService.savePaymentMethod(data);
      setFormData(prev => ({ ...prev, step5Data: data }));
      setStep(6);
    } catch {
      setFormData(prev => ({ ...prev, step5Data: data }));
      setStep(6);
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async () => {
    if (!formData.step1Data) return;
    setLoading(true);
    try {
      const app = await createApplicationMutation.mutateAsync({
        requestedAmount: formData.step1Data.requestedAmount,
        requestedTerm: formData.step1Data.requestedTerm,
        purpose: formData.step1Data.purpose?.trim() || undefined,
      });
      await submitApplicationMutation.mutateAsync(app.id);
      setAppId(app.id);
      setSuccess(true);
      toast.success('¡Solicitud enviada correctamente!');
    } catch (err: any) {
      // Error ya manejado por los mutations
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    loading,
    success,
    appId,
    formData,
    amount,
    term,
    fee,
    forms: { form1, form2, form3, form4, form5 },
    actions: {
      nextStep,
      prevStep,
      saveStep1,
      saveStep2,
      saveStep3,
      saveStep4,
      saveStep5,
      submitApplication,
    },
  };
}

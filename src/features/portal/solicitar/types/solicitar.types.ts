// src/features/portal/solicitar/types/solicitar.types.ts
import { z } from 'zod';
import {
  step1Schema, step2Schema, step3Schema,
  step4Schema, step5Schema
} from '../schemas/solicitar.schemas';

export type Step1 = z.infer<typeof step1Schema>;
export type Step2 = z.infer<typeof step2Schema>;
export type Step3 = z.infer<typeof step3Schema>;
export type Step4 = z.infer<typeof step4Schema>;
export type Step5 = z.infer<typeof step5Schema>;

export interface SolicitarFormState {
  step1Data: Step1 | null;
  step2Data: Step2 | null;
  step3Data: Step3 | null;
  step4Data: Step4 | null;
  step5Data: Step5 | null;
}

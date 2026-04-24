// src/features/portal/solicitar/schemas/solicitar.schemas.ts
import { z } from 'zod';

export const step1Schema = z.object({
  requestedAmount: z.coerce.number().min(500, 'Mínimo S/ 500').max(50000, 'Máximo S/ 50,000'),
  requestedTerm: z.coerce.number().min(3, 'Mínimo 3 meses').max(60, 'Máximo 60 meses'),
  purpose: z.string().max(500).optional(),
});

export const step2Schema = z.object({
  country: z.string().default('Perú'),
  department: z.string().min(2, 'Requerido'),
  city: z.string().min(2, 'Requerido'),
  district: z.string().min(2, 'Requerido'),
  streetAddress: z.string().min(5, 'Ingresa tu dirección completa'),
  postalCode: z.string().optional(),
});

export const step3Schema = z.object({
  employmentStatus: z.enum(['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED', 'STUDENT'], {
    message: 'Selecciona tu situación laboral',
  }),
  employerName: z.string().optional(),
  monthlyIncome: z.coerce.number().positive('Ingresa tus ingresos'),
  monthlyExpenses: z.coerce.number().min(0, 'Ingresa tus gastos'),
  numberOfDependents: z.coerce.number().int().min(0).max(20),
  otherIncomeSources: z.coerce.number().min(0).optional(),
});

export const step4Schema = z.object({
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'DOMESTIC_PARTNERSHIP'], {
    message: 'Selecciona tu estado civil',
  }),
  numberOfChildren: z.coerce.number().int().min(0).max(20),
  housingType: z.enum(['OWNED', 'RENTED', 'FAMILY', 'OTHER'], {
    message: 'Selecciona tu tipo de vivienda',
  }),
});

export const step5Schema = z.object({
  type: z.enum(['DIGITAL_WALLET', 'BANK_ACCOUNT'], {
    message: 'Selecciona un tipo',
  }),
  provider: z.string().min(2, 'Selecciona un proveedor'),
  accountNumber: z.string().min(5, 'Número requerido').max(50),
  accountHolder: z.string().min(3, 'Nombre del titular requerido'),
  isDefault: z.boolean().default(true),
});

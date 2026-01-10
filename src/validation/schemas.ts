// ============================================================
// ENTERPRISE VALIDATION SCHEMAS - Zod
// ============================================================

import { z } from 'zod';

// ============================================================
// UTILITY SCHEMAS
// ============================================================

// US Phone number validation
export const phoneSchema = z.string()
  .min(10, { message: 'Phone number is required' })
  .regex(
    /^(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
    { message: 'Please enter a valid US phone number' }
  );

// Email validation
export const emailSchema = z.string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Please enter a valid email address' });

// Date of birth with age validation
export const dobSchema = z.string()
  .min(1, { message: 'Date of birth is required' })
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: 'Please enter a valid date' })
  .refine((val) => {
    const date = new Date(val);
    const age = Math.floor((Date.now() - date.getTime()) / 31557600000);
    return age >= 18;
  }, { message: 'You must be at least 18 years old' })
  .refine((val) => {
    const date = new Date(val);
    const age = Math.floor((Date.now() - date.getTime()) / 31557600000);
    return age <= 120;
  }, { message: 'Please enter a valid date of birth' });

// Name validation (letters, spaces, hyphens, apostrophes)
export const nameSchema = z.string()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(50, { message: 'Name must be less than 50 characters' })
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    { message: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
  );

// US State code validation
export const stateSchema = z.string()
  .length(2, { message: 'Please select a state' })
  .regex(/^[A-Z]{2}$/, { message: 'Invalid state code' });

// Weight validation (lbs)
export const weightSchema = z.number()
  .min(50, { message: 'Weight must be at least 50 lbs' })
  .max(800, { message: 'Weight must be less than 800 lbs' });

// Height feet validation
export const heightFeetSchema = z.number()
  .min(3, { message: 'Height must be at least 3 feet' })
  .max(8, { message: 'Height must be less than 8 feet' });

// Height inches validation
export const heightInchesSchema = z.number()
  .min(0, { message: 'Inches must be 0 or more' })
  .max(11, { message: 'Inches must be less than 12' });

// ============================================================
// SECTION SCHEMAS
// ============================================================

// Personal Information
export const personalInfoSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  dob: dobSchema,
});

// Address Information
export const addressSchema = z.object({
  street: z.string().min(5, { message: 'Street address is required' }),
  apartment: z.string().optional(),
  city: z.string().min(2, { message: 'City is required' }),
  state: stateSchema,
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: 'Invalid ZIP code' }),
  country: z.string().default('US'),
});

// Weight Information
export const weightInfoSchema = z.object({
  currentWeight: weightSchema,
  idealWeight: weightSchema,
  heightFeet: heightFeetSchema,
  heightInches: heightInchesSchema,
}).refine((data) => {
  return data.idealWeight < data.currentWeight;
}, {
  message: 'Ideal weight must be less than current weight for weight loss treatment',
  path: ['idealWeight'],
});

// Medical Profile
export const medicalProfileSchema = z.object({
  weight: weightInfoSchema.optional(),
  bmi: z.number().min(10).max(100).optional(),
  goals: z.array(z.string()).min(1, { message: 'Please select at least one goal' }).optional(),
  activityLevel: z.enum(['1', '2', '3', '4', '5']).optional(),
  sex: z.enum(['man', 'woman']).optional(),
});

// Medical History
export const medicalHistorySchema = z.object({
  chronicConditions: z.array(z.string()).optional(),
  digestiveConditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  mentalHealthConditions: z.array(z.string()).optional(),
  surgeries: z.array(z.string()).optional(),
  bloodPressure: z.string().optional(),
  pregnancyStatus: z.enum(['yes', 'no']).optional(),
});

// GLP-1 Profile
export const glp1ProfileSchema = z.object({
  history: z.enum(['currently_taking', 'previously_taken', 'never_taken']).optional(),
  type: z.enum(['semaglutide', 'tirzepatide', 'liraglutide', 'oral_glp1', 'other']).optional(),
  dosage: z.string().optional(),
  sideEffects: z.array(z.string()).optional(),
  satisfaction: z.enum(['increase', 'maintain', 'reduce']).optional(),
  success: z.enum(['successful', 'partial', 'not_successful']).optional(),
});

// ============================================================
// STEP-SPECIFIC SCHEMAS
// ============================================================

// Goals step
export const goalsSchema = z.array(z.string())
  .min(1, { message: 'Please select at least one goal' });

// Single selection steps (activity level, yes/no questions)
export const singleSelectSchema = z.string()
  .min(1, { message: 'Please make a selection' });

// Multi-select steps (conditions, medications)
export const multiSelectSchema = z.array(z.string())
  .min(1, { message: 'Please select at least one option' });

// Contact info step
export const contactInfoSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  consentToContact: z.boolean().refine((val) => val === true, {
    message: 'You must agree to be contacted to continue',
  }),
});

// Name step
export const nameStepSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
});

// State selection step
export const stateStepSchema = z.object({
  state: z.string().min(1, { message: 'Please select a state' }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms to continue',
  }),
});

// Weight steps
export const currentWeightStepSchema = z.object({
  currentWeight: weightSchema,
  heightFeet: heightFeetSchema,
  heightInches: heightInchesSchema.optional().default(0),
});

export const idealWeightStepSchema = z.object({
  idealWeight: weightSchema,
});

// ============================================================
// FULL INTAKE VALIDATION
// ============================================================

export const fullIntakeSchema = z.object({
  personalInfo: personalInfoSchema,
  address: addressSchema,
  medicalProfile: medicalProfileSchema,
  medicalHistory: medicalHistorySchema,
  glp1Profile: glp1ProfileSchema,
});

// ============================================================
// SCHEMA FACTORY (for dynamic validation)
// ============================================================

export type SchemaType = 
  | 'goals'
  | 'single-select'
  | 'multi-select'
  | 'contact-info'
  | 'name'
  | 'state'
  | 'current-weight'
  | 'ideal-weight'
  | 'dob'
  | 'address';

export function getSchemaForStep(schemaType: SchemaType): z.ZodSchema {
  const schemas: Record<SchemaType, z.ZodSchema> = {
    'goals': goalsSchema,
    'single-select': singleSelectSchema,
    'multi-select': multiSelectSchema,
    'contact-info': contactInfoSchema,
    'name': nameStepSchema,
    'state': stateStepSchema,
    'current-weight': currentWeightStepSchema,
    'ideal-weight': idealWeightStepSchema,
    'dob': dobSchema,
    'address': addressSchema,
  };

  return schemas[schemaType] || z.any();
}

// ============================================================
// VALIDATION UTILITIES
// ============================================================

export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function validateStep(schemaType: SchemaType, data: unknown): ValidationResult {
  const schema = getSchemaForStep(schemaType);
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path || 'root'] = issue.message;
  });

  return { success: false, errors };
}

export function validateField(schema: z.ZodSchema, value: unknown): string | null {
  const result = schema.safeParse(value);
  if (result.success) {
    return null;
  }
  return result.error.issues[0]?.message || 'Invalid value';
}


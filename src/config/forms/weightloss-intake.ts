// ============================================================
// WEIGHT LOSS INTAKE FORM CONFIGURATION
// ============================================================

import type { FormConfig, FormStep } from '@/types/form';

// ============================================================
// STEP DEFINITIONS
// ============================================================

const steps: FormStep[] = [
  // ========== ONBOARDING SECTION ==========
  {
    id: 'goals',
    path: 'goals',
    title: {
      en: 'How would your life change by losing weight?',
      es: '¿Cómo cambiaría tu vida al perder peso?',
    },
    subtitle: {
      en: 'Select all that apply.',
      es: 'Selecciona todos los que apliquen.',
    },
    type: 'multi-select',
    fields: [
      {
        id: 'goals',
        type: 'checkbox',
        label: { en: 'Goals', es: 'Objetivos' },
        storageKey: 'goals',
        options: [
          { id: 'clothes', label: { en: 'Enjoy how your clothes fit', es: 'Disfrutar cómo te queda la ropa' }, value: 'clothes' },
          { id: 'confidence', label: { en: 'Having more confidence', es: 'Tener más confianza' }, value: 'confidence' },
          { id: 'energy', label: { en: 'Getting your energy back', es: 'Recuperar tu energía' }, value: 'energy' },
          { id: 'feel_better', label: { en: 'Feel better about yourself', es: 'Sentirte mejor contigo mismo' }, value: 'feel_better' },
          { id: 'health', label: { en: 'Improving your overall health', es: 'Mejorar tu salud general' }, value: 'health' },
        ],
        validation: [
          { type: 'required', message: { en: 'Please select at least one goal', es: 'Por favor selecciona al menos un objetivo' } },
        ],
      },
    ],
    autoAdvance: false,
    showContinueButton: true,
    nextStep: 'medication-preference',
    prevStep: null,
    progressPercent: 3,
  },

  {
    id: 'medication-preference',
    path: 'medication-preference',
    title: {
      en: 'Do you have a specific weight loss medication in mind?',
      es: '¿Tienes en mente algún medicamento específico para perder peso?',
    },
    type: 'single-select',
    fields: [
      {
        id: 'medication_preference',
        type: 'radio',
        label: { en: 'Preference', es: 'Preferencia' },
        storageKey: 'medication_preference',
        options: [
          { id: 'recommendation', label: { en: "Not yet, I'm looking for a recommendation", es: 'Todavía no, busco una recomendación' }, value: 'recommendation' },
          { id: 'have_in_mind', label: { en: 'Yes, I already have something in mind', es: 'Sí, ya tengo algo en mente' }, value: 'have_in_mind' },
        ],
      },
    ],
    autoAdvance: true,
    showContinueButton: false,
    nextStep: 'research-done',
    prevStep: 'goals',
    progressPercent: 6,
  },

  {
    id: 'research-done',
    path: 'research-done',
    title: {
      en: "You've got it. We'll begin with some questions about you.",
      es: 'Perfecto. Comenzaremos con algunas preguntas sobre ti.',
    },
    subtitle: {
      en: "After that, we'll dive into your health history to find which treatment option matches your goals and health history.",
      es: 'Después de eso, revisaremos tu historial médico para encontrar la opción de tratamiento que coincida con tus objetivos e historial de salud.',
    },
    type: 'info',
    fields: [],
    autoAdvance: false,
    showContinueButton: true,
    nextStep: 'consent',
    prevStep: 'medication-preference',
    progressPercent: 8,
  },

  // ========== CONSENT & BASIC INFO ==========
  {
    id: 'consent',
    path: 'consent',
    title: {
      en: 'This questionnaire helps us understand your medical history, lifestyle, and goals.',
      es: 'Este cuestionario nos ayuda a entender tu historial médico, estilo de vida y objetivos.',
    },
    subtitle: {
      en: 'Similar to the form you fill out when you visit the doctor.',
      es: 'Similar al formulario que llenas cuando visitas al médico.',
    },
    type: 'custom',
    component: 'ConsentStep',
    fields: [
      {
        id: 'consent_accepted',
        type: 'checkbox',
        label: { en: 'I agree to the terms', es: 'Acepto los términos' },
        storageKey: 'consent_accepted',
        validation: [
          { type: 'required', message: { en: 'You must accept the terms to continue', es: 'Debes aceptar los términos para continuar' } },
        ],
      },
    ],
    autoAdvance: false,
    showContinueButton: true,
    nextStep: 'state',
    prevStep: 'research-done',
    progressPercent: 10,
  },

  {
    id: 'state',
    path: 'state',
    title: {
      en: 'Select the state you live in:',
      es: 'Selecciona el estado en el que vives:',
    },
    subtitle: {
      en: 'This state is where your medication will be shipped to, if prescribed.',
      es: 'Este estado es donde se enviará tu medicamento, si se receta.',
    },
    type: 'input',
    fields: [
      {
        id: 'state',
        type: 'select',
        label: { en: 'State', es: 'Estado' },
        storageKey: 'state',
        validation: [
          { type: 'required', message: { en: 'Please select a state', es: 'Por favor selecciona un estado' } },
        ],
      },
      {
        id: 'terms_accepted',
        type: 'checkbox',
        label: { en: 'I agree to the terms and conditions', es: 'Acepto los términos y condiciones' },
        storageKey: 'terms_accepted',
        validation: [
          { type: 'required', message: { en: 'You must accept the terms', es: 'Debes aceptar los términos' } },
        ],
      },
    ],
    autoAdvance: false,
    showContinueButton: true,
    nextStep: 'name',
    prevStep: 'consent',
    progressPercent: 12,
  },

  {
    id: 'name',
    path: 'name',
    title: {
      en: 'What is your name?',
      es: '¿Cuál es tu nombre?',
    },
    subtitle: {
      en: 'This way, we can personalize your experience from the very beginning.',
      es: 'De esta manera, podemos personalizar tu experiencia desde el principio.',
    },
    type: 'input',
    fields: [
      {
        id: 'firstName',
        type: 'text',
        label: { en: 'First Name', es: 'Nombre' },
        placeholder: { en: 'First Name', es: 'Nombre' },
        storageKey: 'firstName',
        validation: [
          { type: 'required', message: { en: 'First name is required', es: 'El nombre es requerido' } },
          { type: 'minLength', value: 2, message: { en: 'Name must be at least 2 characters', es: 'El nombre debe tener al menos 2 caracteres' } },
        ],
      },
      {
        id: 'lastName',
        type: 'text',
        label: { en: 'Last Name', es: 'Apellido' },
        placeholder: { en: 'Last Name', es: 'Apellido' },
        storageKey: 'lastName',
        validation: [
          { type: 'required', message: { en: 'Last name is required', es: 'El apellido es requerido' } },
          { type: 'minLength', value: 2, message: { en: 'Name must be at least 2 characters', es: 'El nombre debe tener al menos 2 caracteres' } },
        ],
      },
    ],
    autoAdvance: false,
    showContinueButton: true,
    nextStep: 'dob',
    prevStep: 'state',
    progressPercent: 15,
  },

  {
    id: 'dob',
    path: 'dob',
    title: {
      en: 'To check if you qualify, tell us your date of birth.',
      es: 'Para verificar si calificas, dinos tu fecha de nacimiento.',
    },
    subtitle: {
      en: 'This helps us confirm that you meet the age requirements for treatment.',
      es: 'Esto nos ayuda a confirmar que cumples con los requisitos de edad para el tratamiento.',
    },
    type: 'input',
    fields: [
      {
        id: 'dob',
        type: 'date',
        label: { en: 'Date of Birth', es: 'Fecha de Nacimiento' },
        placeholder: { en: 'MM/DD/YYYY', es: 'MM/DD/AAAA' },
        storageKey: 'dob',
        validation: [
          { type: 'required', message: { en: 'Date of birth is required', es: 'La fecha de nacimiento es requerida' } },
          { type: 'age', value: 18, message: { en: 'You must be at least 18 years old', es: 'Debes tener al menos 18 años' } },
        ],
      },
    ],
    autoAdvance: false,
    showContinueButton: true,
    nextStep: 'contact-info',
    prevStep: 'name',
    progressPercent: 18,
  },

  {
    id: 'contact-info',
    path: 'contact-info',
    title: {
      en: 'How can we reach you?',
      es: '¿Cómo podemos contactarte?',
    },
    type: 'input',
    fields: [
      {
        id: 'email',
        type: 'email',
        label: { en: 'Email', es: 'Correo electrónico' },
        placeholder: { en: 'your@email.com', es: 'tu@email.com' },
        storageKey: 'email',
        validation: [
          { type: 'required', message: { en: 'Email is required', es: 'El correo electrónico es requerido' } },
          { type: 'email', message: { en: 'Please enter a valid email', es: 'Por favor ingresa un correo válido' } },
        ],
      },
      {
        id: 'phone',
        type: 'phone',
        label: { en: 'Phone number', es: 'Número de teléfono' },
        placeholder: { en: '(555) 555-5555', es: '(555) 555-5555' },
        storageKey: 'phone',
        validation: [
          { type: 'required', message: { en: 'Phone number is required', es: 'El número de teléfono es requerido' } },
          { type: 'phone', message: { en: 'Please enter a valid phone number', es: 'Por favor ingresa un número válido' } },
        ],
      },
      {
        id: 'contact_consent',
        type: 'checkbox',
        label: { en: 'I agree to receive communications', es: 'Acepto recibir comunicaciones' },
        storageKey: 'contact_consent',
      },
    ],
    autoAdvance: false,
    showContinueButton: true,
    nextStep: 'address',
    prevStep: 'dob',
    progressPercent: 22,
  },

  // ========== MEDICAL SECTION ==========
  {
    id: 'sex-assigned',
    path: 'sex-assigned',
    title: {
      en: 'Sex assigned at birth',
      es: 'Sexo asignado al nacer',
    },
    subtitle: {
      en: 'This medical information helps us properly assess your eligibility and determine the most appropriate treatment.',
      es: 'Esta información médica nos ayuda a evaluar adecuadamente tu elegibilidad y determinar el tratamiento más apropiado.',
    },
    type: 'single-select',
    fields: [
      {
        id: 'sex',
        type: 'radio',
        label: { en: 'Sex', es: 'Sexo' },
        storageKey: 'sex',
        options: [
          { id: 'man', label: { en: 'Man', es: 'Hombre' }, value: 'man' },
          { id: 'woman', label: { en: 'Woman', es: 'Mujer' }, value: 'woman' },
        ],
      },
    ],
    autoAdvance: true,
    showContinueButton: false,
    nextStep: 'activity-level',
    prevStep: 'medical-history-overview',
    progressPercent: 35,
  },

  {
    id: 'activity-level',
    path: 'activity-level',
    title: {
      en: 'What is your usual level of daily physical activity?',
      es: '¿Cuál es tu nivel habitual de actividad física diaria?',
    },
    type: 'single-select',
    fields: [
      {
        id: 'activity_level',
        type: 'radio',
        label: { en: 'Activity Level', es: 'Nivel de Actividad' },
        storageKey: 'activity_level',
        options: [
          { id: '5', label: { en: '5 - Very Active', es: '5 - Muy Activo' }, value: '5', description: { en: 'Exercise 5 to 7 times per week', es: 'Ejercicio 5 a 7 veces por semana' } },
          { id: '4', label: { en: '4', es: '4' }, value: '4' },
          { id: '3', label: { en: '3 - Moderately Active', es: '3 - Moderadamente Activo' }, value: '3', description: { en: 'Exercise 3 to 4 times per week', es: 'Ejercicio 3 a 4 veces por semana' } },
          { id: '2', label: { en: '2', es: '2' }, value: '2' },
          { id: '1', label: { en: '1 - Not very active', es: '1 - No soy muy activo' }, value: '1', description: { en: "Usually don't exercise", es: 'Usualmente no hago ejercicio' } },
        ],
      },
    ],
    autoAdvance: true,
    showContinueButton: false,
    nextStep: 'mental-health',
    prevStep: 'sex-assigned',
    progressPercent: 40,
  },

  {
    id: 'mental-health',
    path: 'mental-health',
    title: {
      en: 'Have you been diagnosed with any mental health conditions?',
      es: '¿Has sido diagnosticado con alguna condición de salud mental?',
    },
    type: 'single-select',
    fields: [
      {
        id: 'has_mental_health_condition',
        type: 'radio',
        label: { en: 'Mental Health', es: 'Salud Mental' },
        storageKey: 'has_mental_health_condition',
        options: [
          { id: 'yes', label: { en: 'Yes', es: 'Sí' }, value: 'yes' },
          { id: 'no', label: { en: 'No', es: 'No' }, value: 'no' },
        ],
      },
    ],
    autoAdvance: true,
    showContinueButton: false,
    nextStep: [
      { conditions: [{ field: 'has_mental_health_condition', operator: 'equals', value: 'yes' }], target: 'mental-health-conditions' },
      { conditions: [{ field: 'has_mental_health_condition', operator: 'equals', value: 'no' }], target: 'chronic-conditions' },
    ],
    prevStep: 'activity-level',
    progressPercent: 45,
  },

  {
    id: 'chronic-conditions',
    path: 'chronic-conditions',
    title: {
      en: 'Do you have any medical conditions or chronic diseases?',
      es: '¿Tienes alguna condición médica o enfermedad crónica?',
    },
    type: 'single-select',
    fields: [
      {
        id: 'has_chronic_conditions',
        type: 'radio',
        label: { en: 'Chronic Conditions', es: 'Condiciones Crónicas' },
        storageKey: 'has_chronic_conditions',
        options: [
          { id: 'yes', label: { en: 'Yes', es: 'Sí' }, value: 'yes' },
          { id: 'no', label: { en: 'No', es: 'No' }, value: 'no' },
        ],
      },
    ],
    autoAdvance: true,
    showContinueButton: false,
    nextStep: [
      { conditions: [{ field: 'has_chronic_conditions', operator: 'equals', value: 'yes' }], target: 'chronic-conditions-detail' },
      { conditions: [{ field: 'has_chronic_conditions', operator: 'equals', value: 'no' }], target: 'medications' },
    ],
    prevStep: 'mental-health',
    progressPercent: 50,
  },

  // ========== GLP-1 SECTION ==========
  {
    id: 'glp1-history',
    path: 'glp1-history',
    title: {
      en: 'Do you currently take or have you ever taken a GLP-1 medication for weight loss?',
      es: '¿Actualmente toma o ha tomado alguna vez un medicamento GLP-1 para perder peso?',
    },
    subtitle: {
      en: 'GLP-1s include compounded semaglutide, compounded tirzepatide, Ozempic, Wegovy, Mounjaro or Zepbound',
      es: 'GLP-1s incluyen semaglutida compuesta, tirzepatida compuesta, Ozempic, Wegovy, Mounjaro o Zepbound',
    },
    type: 'single-select',
    fields: [
      {
        id: 'glp1_history',
        type: 'radio',
        label: { en: 'GLP-1 History', es: 'Historial GLP-1' },
        storageKey: 'glp1_history',
        options: [
          { id: 'currently_taking', label: { en: 'I am currently taking a GLP-1 medication', es: 'Actualmente estoy tomando un medicamento GLP-1' }, value: 'currently_taking' },
          { id: 'previously_taken', label: { en: 'I have taken a GLP-1 medication in the past, but not currently', es: 'He tomado un medicamento GLP-1 en el pasado, pero no actualmente' }, value: 'previously_taken' },
          { id: 'never_taken', label: { en: 'I have never taken a GLP-1 medication', es: 'Nunca he tomado un medicamento GLP-1' }, value: 'never_taken' },
        ],
      },
    ],
    autoAdvance: true,
    showContinueButton: false,
    nextStep: [
      { conditions: [{ field: 'glp1_history', operator: 'in', value: ['currently_taking', 'previously_taken'] }], target: 'glp1-type' },
      { conditions: [{ field: 'glp1_history', operator: 'equals', value: 'never_taken' }], target: 'alcohol-consumption' },
    ],
    prevStep: 'treatment-benefits',
    progressPercent: 82,
  },

  {
    id: 'glp1-type',
    path: 'glp1-type',
    title: {
      en: 'Which GLP-1 medication did you take or are you currently taking?',
      es: '¿Qué medicamento GLP-1 tomaste o estás tomando actualmente?',
    },
    type: 'single-select',
    fields: [
      {
        id: 'glp1_type',
        type: 'radio',
        label: { en: 'GLP-1 Type', es: 'Tipo de GLP-1' },
        storageKey: 'glp1_type',
        options: [
          { id: 'liraglutide', label: { en: 'Injectable liraglutide', es: 'Liraglutida inyectable' }, value: 'liraglutide', description: { en: 'Victoza, Saxenda', es: 'Victoza, Saxenda' } },
          { id: 'semaglutide', label: { en: 'Injectable semaglutide', es: 'Semaglutida inyectable' }, value: 'semaglutide', description: { en: 'Ozempic, Wegovy or compounded', es: 'Ozempic, Wegovy o compuesta' } },
          { id: 'tirzepatide', label: { en: 'Injectable tirzepatide', es: 'Tirzepatida inyectable' }, value: 'tirzepatide', description: { en: 'Mounjaro, Zepbound or compounded', es: 'Mounjaro, Zepbound o compuesta' } },
          { id: 'oral_glp1', label: { en: 'Oral GLP-1 Medication', es: 'Medicamento GLP-1 Oral' }, value: 'oral_glp1' },
          { id: 'other', label: { en: 'Other medication', es: 'Otro medicamento' }, value: 'other' },
        ],
      },
    ],
    autoAdvance: true,
    showContinueButton: false,
    nextStep: [
      { conditions: [{ field: 'glp1_type', operator: 'equals', value: 'semaglutide' }], target: 'semaglutide-dosage' },
      { conditions: [{ field: 'glp1_type', operator: 'equals', value: 'tirzepatide' }], target: 'tirzepatide-dosage' },
      { conditions: [{ field: 'glp1_type', operator: 'in', value: ['liraglutide', 'oral_glp1', 'other'] }], target: 'dosage-satisfaction' },
    ],
    prevStep: 'glp1-history',
    progressPercent: 84,
  },
];

// ============================================================
// FORM CONFIGURATION
// ============================================================

export const weightLossIntakeConfig: FormConfig = {
  id: 'weight-loss-intake-v1',
  name: 'Weight Loss Medical Intake',
  version: '1.0.0',
  description: 'Medical intake questionnaire for weight loss treatment eligibility',
  
  steps,
  startStep: 'goals',
  
  languages: ['en', 'es'],
  defaultLanguage: 'en',
  
  integrations: [
    {
      type: 'airtable',
      triggers: ['complete'],
      mapping: {
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'email': 'Email',
        'phone': 'Phone',
        'state': 'State',
        // ... more mappings
      },
    },
  ],
  
  createdAt: '2025-01-03',
  updatedAt: '2025-01-03',
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getStepById(stepId: string): FormStep | undefined {
  return steps.find(step => step.id === stepId);
}

export function getStepByPath(path: string): FormStep | undefined {
  return steps.find(step => step.path === path);
}

export function getNextStep(currentStepId: string, responses: Record<string, any>): string | null {
  const currentStep = getStepById(currentStepId);
  if (!currentStep) return null;

  const nextStep = currentStep.nextStep;

  // Static navigation
  if (typeof nextStep === 'string') {
    return nextStep;
  }

  // Conditional navigation
  if (Array.isArray(nextStep)) {
    for (const nav of nextStep) {
      const allConditionsMet = nav.conditions.every(condition => {
        const fieldValue = responses[condition.field];
        
        switch (condition.operator) {
          case 'equals':
            return fieldValue === condition.value;
          case 'notEquals':
            return fieldValue !== condition.value;
          case 'in':
            return Array.isArray(condition.value) && condition.value.includes(fieldValue);
          case 'notIn':
            return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
          case 'contains':
            return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
          default:
            return false;
        }
      });

      if (allConditionsMet) {
        return nav.target;
      }
    }
  }

  return null;
}

export function getPreviousStep(currentStepId: string): string | null {
  const currentStep = getStepById(currentStepId);
  return currentStep?.prevStep || null;
}

export function getTotalSteps(): number {
  return steps.length;
}

export function getStepProgress(stepId: string): number {
  const step = getStepById(stepId);
  return step?.progressPercent || 0;
}


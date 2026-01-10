// ============================================================
// ENTERPRISE FORM SYSTEM - TYPE DEFINITIONS
// ============================================================

// Supported languages
export type Language = 'en' | 'es';

// Localized string for multi-language support
export interface LocalizedString {
  en: string;
  es: string;
}

// ============================================================
// FIELD TYPES
// ============================================================

export type FieldType = 
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'select'
  | 'radio'        // Single select with radio buttons
  | 'checkbox'     // Multi-select with checkboxes
  | 'address'
  | 'hidden';

// Validation rule types
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'phone' | 'age' | 'custom';
  value?: string | number | RegExp;
  message: LocalizedString;
}

// Conditional logic for showing/hiding fields or steps
export interface ConditionalRule {
  field: string;           // The field ID to check
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn';
  value: string | number | string[] | boolean;
}

// Option for select/radio/checkbox fields
export interface FieldOption {
  id: string;
  label: LocalizedString;
  value: string;
  description?: LocalizedString;
  icon?: string;
}

// ============================================================
// FORM FIELD CONFIGURATION
// ============================================================

export interface FormField {
  id: string;
  type: FieldType;
  label: LocalizedString;
  placeholder?: LocalizedString;
  description?: LocalizedString;
  options?: FieldOption[];          // For select/radio/checkbox
  validation?: ValidationRule[];
  conditionalDisplay?: ConditionalRule[];  // Show field only if conditions met
  storageKey: string;               // Key for storing in state
  defaultValue?: any;
  props?: Record<string, any>;      // Additional field-specific props
}

// ============================================================
// FORM STEP CONFIGURATION
// ============================================================

export type StepType = 
  | 'single-select'   // Radio buttons, auto-advance on selection
  | 'multi-select'    // Checkboxes, requires continue button
  | 'input'           // Text/number inputs
  | 'info'            // Information display only
  | 'custom';         // Custom component

// Navigation can be static or conditional
export type StepNavigation = string | ConditionalNavigation[];

export interface ConditionalNavigation {
  conditions: ConditionalRule[];
  target: string;
}

export interface FormStep {
  id: string;
  path: string;                     // URL path segment
  title: LocalizedString;
  subtitle?: LocalizedString;
  type: StepType;
  fields: FormField[];
  autoAdvance: boolean;             // Auto-navigate on selection (single-select)
  showContinueButton: boolean;
  nextStep: StepNavigation;
  prevStep: string | null;
  progressPercent: number;
  
  // UI customization
  layout?: 'default' | 'compact' | 'centered';
  showProgress?: boolean;
  showBackButton?: boolean;
  
  // Custom component for 'custom' type steps
  component?: string;
}

// ============================================================
// FORM CONFIGURATION
// ============================================================

export interface IntegrationConfig {
  type: 'airtable' | 'webhook' | 'api';
  endpoint?: string;
  apiKey?: string;
  mapping?: Record<string, string>;
  triggers?: ('complete' | 'checkpoint' | 'abandon')[];
}

export interface FormBranding {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface FormConfig {
  id: string;
  name: string;
  version: string;
  description?: string;
  
  // Steps configuration
  steps: FormStep[];
  startStep: string;
  
  // Features
  languages: Language[];
  defaultLanguage: Language;
  
  // Integrations
  integrations: IntegrationConfig[];
  
  // Branding (optional - defaults to global)
  branding?: FormBranding;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// INTAKE STATE
// ============================================================

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
}

export interface AddressInfo {
  street?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface WeightInfo {
  currentWeight?: number;
  idealWeight?: number;
  heightFeet?: number;
  heightInches?: number;
}

export interface MedicalProfile {
  weight?: WeightInfo;
  bmi?: number;
  goals?: string[];
  activityLevel?: string;
  sex?: string;
}

export interface MedicalHistory {
  chronicConditions?: string[];
  digestiveConditions?: string[];
  medications?: string[];
  allergies?: string[];
  mentalHealthConditions?: string[];
  surgeries?: string[];
  bloodPressure?: string;
  pregnancyStatus?: string;
}

export interface GLP1Profile {
  history?: string;
  type?: string;
  dosage?: string;
  sideEffects?: string[];
  satisfaction?: string;
  success?: string;
}

// Type for form response values
export type ResponseValue = string | number | boolean | string[] | Record<string, unknown> | null | undefined;

export interface IntakeData {
  sessionId: string;
  currentStep: string;
  completedSteps: string[];
  startedAt: string;
  lastUpdatedAt: string;
  
  // Form responses organized by section
  personalInfo: PersonalInfo;
  address: AddressInfo;
  medicalProfile: MedicalProfile;
  medicalHistory: MedicalHistory;
  glp1Profile: GLP1Profile;
  
  // Raw responses by field ID
  responses: Record<string, ResponseValue>;
  
  // Qualification status
  qualified?: boolean;
  disqualificationReason?: string;
}

// ============================================================
// SUBMISSION TYPES
// ============================================================

export interface SubmissionResult {
  success: boolean;
  recordId?: string;
  error?: string;
  timestamp: string;
}

export interface CheckpointData {
  stepId: string;
  timestamp: string;
  data: Record<string, any>;
  sessionId: string;
}


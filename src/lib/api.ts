// API functions for submitting intake data at checkpoints
// Note: These functions use browser APIs (localStorage, sessionStorage)
// and should only be called from client-side code
import { translations } from '@/translations';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.eonpro.io';

// Mapping for common stored values to English
const valueToEnglish: Record<string, string> = {
  // Sex
  'man': 'Man',
  'woman': 'Woman',
  'hombre': 'Man',
  'mujer': 'Woman',
  
  // Yes/No
  'yes': 'Yes',
  'no': 'No',
  'sí': 'Yes',
  'si': 'Yes',
  
  // GLP-1 History
  'currently_taking': 'Currently taking GLP-1',
  'previously_taken': 'Previously taken GLP-1',
  'never_taken': 'Never taken GLP-1',
  
  // GLP-1 Types
  'semaglutide': 'Semaglutide',
  'tirzepatide': 'Tirzepatide',
  
  // Medication preference
  'recommendation': 'Looking for a recommendation',
  'have_in_mind': 'Already have something in mind',
  
  // Activity levels
  '1': 'Not very active (1)',
  '2': 'Low activity (2)',
  '3': 'Moderately active (3)',
  '4': 'Active (4)',
  '5': 'Very active (5)',
  
  // Blood pressure
  'normal': 'Normal',
  'high': 'High',
  'low': 'Low',
  'dont_know': "Don't know",
  'no_se': "Don't know",
  
  // Satisfaction levels
  'satisfied': 'Satisfied',
  'not_satisfied': 'Not satisfied',
  'somewhat': 'Somewhat satisfied',
  
  // Success levels
  'successful': 'Successful',
  'not_successful': 'Not successful',
  'partial': 'Partial success',
};

// Helper function to convert translation keys to English text
function toEnglish(value: string | undefined | null): string {
  if (!value) return '';
  
  // Check if it's a known value mapping
  const lowerValue = value.toLowerCase();
  if (valueToEnglish[lowerValue]) {
    return valueToEnglish[lowerValue];
  }
  if (valueToEnglish[value]) {
    return valueToEnglish[value];
  }
  
  // If it's a translation key (contains a dot and exists in translations)
  const enTranslations = translations.en as Record<string, string>;
  if (value.includes('.') && enTranslations[value]) {
    return enTranslations[value];
  }
  
  // Check if value is a Spanish translation and find the English equivalent
  const esTranslations = translations.es as Record<string, string>;
  for (const [key, esValue] of Object.entries(esTranslations)) {
    if (esValue === value && enTranslations[key]) {
      return enTranslations[key];
    }
  }
  
  // Return original value if not a translation key (already in English or raw data)
  return value;
}

// Helper function to convert an array of values to English
function arrayToEnglish(arr: string[] | undefined | null): string[] {
  if (!arr || !Array.isArray(arr)) return [];
  return arr.map(item => toEnglish(item));
}

export interface CheckpointData {
  checkpointName: string;
  timestamp: string;
  data: Record<string, unknown>;
  sessionId: string;
  status: 'partial' | 'complete' | 'qualified';
}

export interface IntakeSubmission {
  sessionId: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dob?: any;
    sex?: string;
    bloodPressure?: string;
    pregnancyBreastfeeding?: string;
  };
  address?: any;
  medicalProfile?: {
    weight?: any;
    bmi?: number;
    goals?: string[];
    activityLevel?: string;
  };
  medicalHistory?: {
    chronicConditions?: string[];
    digestiveConditions?: string[];
    medications?: string[];
    allergies?: string[];
    mentalHealthConditions?: string[];
    surgeryHistory?: string;
    surgeryDetails?: string[];
    familyConditions?: string[];
    kidneyConditions?: string[];
    medicalConditions?: string[];
    personalDiabetes?: string;
    personalGastroparesis?: string;
    personalPancreatitis?: string;
    personalThyroidCancer?: string;
    personalMen?: string;
    hasMentalHealth?: string;
    hasChronicConditions?: string;
  };
  glp1Profile?: {
    history?: string;
    type?: string;
    sideEffects?: string[];
    medicationPreference?: string;
    semaglutideDosage?: string;
    semaglutideSideEffects?: string[];
    semaglutideSuccess?: string;
    tirzepatideDosage?: string;
    tirzepatideSideEffects?: string[];
    tirzepatideSuccess?: string;
    dosageSatisfaction?: string;
    dosageInterest?: string;
  };
  lifestyle?: {
    alcoholConsumption?: string;
    recreationalDrugs?: string[];
    weightLossHistory?: string[];
    weightLossSupport?: string[];
    healthImprovements?: string[];
  };
  referral?: {
    sources?: string[];
    referrerName?: string;
    referrerType?: string;
  };
  qualificationStatus?: {
    qualified?: boolean;
    completedAt?: string;
    checkpoints?: string[];
    takingMedications?: string;
    personalizedTreatmentInterest?: string;
  };
  consents?: {
    privacyPolicyAccepted?: boolean;
    privacyPolicyAcceptedAt?: string;
    termsOfUseAccepted?: boolean;
    termsOfUseAcceptedAt?: string;
    telehealthConsentAccepted?: boolean;
    telehealthConsentAcceptedAt?: string;
    cancellationPolicyAccepted?: boolean;
    cancellationPolicyAcceptedAt?: string;
    floridaBillOfRightsAccepted?: boolean;
    floridaBillOfRightsAcceptedAt?: string;
    floridaConsentAccepted?: boolean;
    floridaConsentAcceptedAt?: string;
  };
}

// Generate or get session ID
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('intake_session_id');
  if (!sessionId) {
    sessionId = `EON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('intake_session_id', sessionId);
  }
  return sessionId;
}

// Submit checkpoint data
export async function submitCheckpoint(
  checkpointName: string,
  data: any,
  status: 'partial' | 'complete' | 'qualified' = 'partial'
): Promise<boolean> {
  try {
    const sessionId = getSessionId();
    
    const checkpointData: CheckpointData = {
      checkpointName,
      timestamp: new Date().toISOString(),
      data,
      sessionId,
      status
    };

    // Store locally first (backup)
    const existingCheckpoints = JSON.parse(
      sessionStorage.getItem('intake_checkpoints') || '[]'
    );
    existingCheckpoints.push(checkpointData);
    sessionStorage.setItem('intake_checkpoints', JSON.stringify(existingCheckpoints));

    // Send to API (commented out until backend is ready)
    // const response = await fetch(`${API_BASE_URL}/intake/checkpoint`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(checkpointData)
    // });

    // return response.ok;
    return true; // Return true for now since data is saved locally
  } catch (error) {
    console.error('Checkpoint submission failed:', error);
    // Data is still saved locally
    return false;
  }
}

// Submit complete intake data to Airtable
export async function submitIntake(intakeData: IntakeSubmission): Promise<{
  success: boolean;
  intakeId?: string;
  error?: string;
}> {
  try {
    // Helper to convert arrays to comma-separated strings
    const arrayToString = (arr: unknown[] | undefined | null): string => {
      if (!arr || !Array.isArray(arr)) return '';
      return arrayToEnglish(arr as string[]).join(', ');
    };

    // Prepare data for Airtable - ALL RESPONSES IN ENGLISH regardless of flow language
    const airtableData = {
      sessionId: intakeData.sessionId,
      // Personal Info
      firstName: intakeData.personalInfo?.firstName,
      lastName: intakeData.personalInfo?.lastName,
      email: intakeData.personalInfo?.email,
      phone: intakeData.personalInfo?.phone,
      dob: (intakeData.personalInfo?.dob && typeof intakeData.personalInfo.dob === 'object')
        ? JSON.stringify(intakeData.personalInfo.dob)
        : intakeData.personalInfo?.dob || undefined,
      sex: toEnglish(intakeData.personalInfo?.sex),
      bloodPressure: toEnglish(intakeData.personalInfo?.bloodPressure),
      pregnancyBreastfeeding: toEnglish(intakeData.personalInfo?.pregnancyBreastfeeding),
      // Address
      state: intakeData.address?.state,
      address: intakeData.address?.fullAddress || intakeData.address?.street || '',
      apartment: intakeData.address?.unit || '',
      // Weight & BMI
      currentWeight: intakeData.medicalProfile?.weight?.currentWeight,
      idealWeight: intakeData.medicalProfile?.weight?.idealWeight,
      // Combine height into single field (e.g., "5'10\"")
      height: intakeData.medicalProfile?.weight?.heightFeet 
        ? `${intakeData.medicalProfile.weight.heightFeet}'${intakeData.medicalProfile.weight.heightInches || 0}"`
        : '',
      bmi: intakeData.medicalProfile?.bmi,
      // Goals & Activity
      goals: arrayToString(intakeData.medicalProfile?.goals),
      activityLevel: toEnglish(intakeData.medicalProfile?.activityLevel),
      // Medical Conditions
      chronicConditions: arrayToString(intakeData.medicalHistory?.chronicConditions),
      digestiveConditions: arrayToString(intakeData.medicalHistory?.digestiveConditions),
      medications: arrayToString(intakeData.medicalHistory?.medications),
      allergies: arrayToString(intakeData.medicalHistory?.allergies),
      mentalHealthConditions: arrayToString(intakeData.medicalHistory?.mentalHealthConditions),
      // Additional Medical History
      surgeryHistory: toEnglish(intakeData.medicalHistory?.surgeryHistory),
      surgeryDetails: arrayToString(intakeData.medicalHistory?.surgeryDetails),
      familyConditions: arrayToString(intakeData.medicalHistory?.familyConditions),
      kidneyConditions: arrayToString(intakeData.medicalHistory?.kidneyConditions),
      medicalConditions: arrayToString(intakeData.medicalHistory?.medicalConditions),
      personalDiabetes: toEnglish(intakeData.medicalHistory?.personalDiabetes),
      personalGastroparesis: toEnglish(intakeData.medicalHistory?.personalGastroparesis),
      personalPancreatitis: toEnglish(intakeData.medicalHistory?.personalPancreatitis),
      personalThyroidCancer: toEnglish(intakeData.medicalHistory?.personalThyroidCancer),
      personalMen: toEnglish(intakeData.medicalHistory?.personalMen),
      hasMentalHealth: toEnglish(intakeData.medicalHistory?.hasMentalHealth),
      hasChronicConditions: toEnglish(intakeData.medicalHistory?.hasChronicConditions),
      // GLP-1 Profile
      glp1History: toEnglish(intakeData.glp1Profile?.history),
      glp1Type: toEnglish(intakeData.glp1Profile?.type),
      sideEffects: arrayToString(intakeData.glp1Profile?.sideEffects),
      medicationPreference: toEnglish(intakeData.glp1Profile?.medicationPreference),
      semaglutideDosage: toEnglish(intakeData.glp1Profile?.semaglutideDosage),
      semaglutideSideEffects: arrayToString(intakeData.glp1Profile?.semaglutideSideEffects),
      semaglutideSuccess: toEnglish(intakeData.glp1Profile?.semaglutideSuccess),
      tirzepatideDosage: toEnglish(intakeData.glp1Profile?.tirzepatideDosage),
      tirzepatideSideEffects: arrayToString(intakeData.glp1Profile?.tirzepatideSideEffects),
      tirzepatideSuccess: toEnglish(intakeData.glp1Profile?.tirzepatideSuccess),
      dosageSatisfaction: toEnglish(intakeData.glp1Profile?.dosageSatisfaction),
      dosageInterest: toEnglish(intakeData.glp1Profile?.dosageInterest),
      // Lifestyle
      alcoholConsumption: toEnglish(intakeData.lifestyle?.alcoholConsumption),
      recreationalDrugs: arrayToString(intakeData.lifestyle?.recreationalDrugs),
      weightLossHistory: arrayToString(intakeData.lifestyle?.weightLossHistory),
      weightLossSupport: arrayToString(intakeData.lifestyle?.weightLossSupport),
      healthImprovements: arrayToString(intakeData.lifestyle?.healthImprovements),
      // Referral
      referralSources: arrayToString(intakeData.referral?.sources),
      referrerName: intakeData.referral?.referrerName,
      referrerType: intakeData.referral?.referrerType,
      // Qualification Status
      qualified: intakeData.qualificationStatus?.qualified,
      takingMedications: toEnglish(intakeData.qualificationStatus?.takingMedications),
      personalizedTreatmentInterest: toEnglish(intakeData.qualificationStatus?.personalizedTreatmentInterest),
      submittedAt: intakeData.qualificationStatus?.completedAt || new Date().toISOString(),
      // Keep track of original flow language
      flowLanguage: isBrowser ? (localStorage.getItem('preferredLanguage') || 'en') : 'en',
      // Consent tracking
      privacyPolicyAccepted: intakeData.consents?.privacyPolicyAccepted ?? false,
      privacyPolicyAcceptedAt: intakeData.consents?.privacyPolicyAcceptedAt || '',
      termsOfUseAccepted: intakeData.consents?.termsOfUseAccepted ?? false,
      termsOfUseAcceptedAt: intakeData.consents?.termsOfUseAcceptedAt || '',
      telehealthConsentAccepted: intakeData.consents?.telehealthConsentAccepted ?? false,
      telehealthConsentAcceptedAt: intakeData.consents?.telehealthConsentAcceptedAt || '',
      cancellationPolicyAccepted: intakeData.consents?.cancellationPolicyAccepted ?? false,
      cancellationPolicyAcceptedAt: intakeData.consents?.cancellationPolicyAcceptedAt || '',
      floridaBillOfRightsAccepted: intakeData.consents?.floridaBillOfRightsAccepted ?? false,
      floridaBillOfRightsAcceptedAt: intakeData.consents?.floridaBillOfRightsAcceptedAt || '',
      floridaConsentAccepted: intakeData.consents?.floridaConsentAccepted ?? false,
      floridaConsentAcceptedAt: intakeData.consents?.floridaConsentAcceptedAt || '',
    };

    // Check if we have an existing record from midpoint submission
    const existingRecordId = isBrowser ? sessionStorage.getItem('airtable_record_id') : null;
    
    // If we have an existing record, update it; otherwise create new
    const requestData = existingRecordId 
      ? { ...airtableData, updateRecordId: existingRecordId }
      : airtableData;
    

    // Send to Airtable API route
    const response = await fetch('/api/airtable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();
    
    // Save submission status locally (only in browser)
    if (result.success && isBrowser) {
      sessionStorage.setItem('intake_submitted', 'true');
      sessionStorage.setItem('intake_id', result.recordId || `INTAKE-${Date.now()}`);
    }

    return {
      success: result.success,
      intakeId: result.recordId || `INTAKE-${Date.now()}`,
      error: result.error
    };
  } catch (error) {
    console.error('Intake submission failed:', error);
    
    // Fallback: save locally even if API fails - but report as failure
    const fallbackId = `LOCAL-${Date.now()}`;
    if (isBrowser) {
      sessionStorage.setItem('intake_pending_sync', 'true');
      sessionStorage.setItem('intake_id', fallbackId);
    }
    
    return {
      success: false,
      intakeId: fallbackId,
      error: error instanceof Error ? error.message : 'API unavailable - data saved locally for retry'
    };
  }
}

// Collect all session data for submission
// Must be called from client-side code only
export function collectIntakeData(): IntakeSubmission {
  if (!isBrowser) {
    throw new Error('collectIntakeData must be called from client-side code');
  }

  const sessionId = getSessionId();

  // Parse stored data - using CORRECT sessionStorage keys
  const nameData = sessionStorage.getItem('intake_name');
  const contactData = sessionStorage.getItem('intake_contact');
  const dobData = sessionStorage.getItem('intake_dob');
  const addressData = sessionStorage.getItem('intake_address');

  // Weight data is stored in separate keys
  const currentWeight = sessionStorage.getItem('intake_current_weight');
  const idealWeight = sessionStorage.getItem('intake_ideal_weight');
  const heightData = sessionStorage.getItem('intake_height');

  // Goals stored with 'intake_' prefix
  const goalsData = sessionStorage.getItem('intake_goals');
  const activityData = sessionStorage.getItem('activity_level');

  // Medical history
  const chronicConditions = sessionStorage.getItem('chronic_conditions');
  const digestiveConditions = sessionStorage.getItem('digestive_conditions');
  const medications = sessionStorage.getItem('current_medications');
  const allergies = sessionStorage.getItem('allergies');
  const mentalHealth = sessionStorage.getItem('mental_health_conditions');

  // GLP-1 data
  const glp1History = sessionStorage.getItem('glp1_history');
  const glp1Type = sessionStorage.getItem('glp1_type');
  const sideEffects = sessionStorage.getItem('common_side_effects');
  const medicationPref = sessionStorage.getItem('medication_preference');

  // === ADDITIONAL FIELDS ===
  // Personal/Medical
  const sexAssigned = sessionStorage.getItem('intake_sex');
  const bloodPressure = sessionStorage.getItem('blood_pressure');
  const pregnancyBreastfeeding = sessionStorage.getItem('pregnancy_breastfeeding');

  // Additional Medical History
  const surgeryHistory = sessionStorage.getItem('surgery_history');
  const surgeryDetails = sessionStorage.getItem('surgery_details');
  const familyConditions = sessionStorage.getItem('family_conditions');
  const kidneyConditions = sessionStorage.getItem('kidney_conditions');
  const medicalConditions = sessionStorage.getItem('medical_conditions');
  const personalDiabetes = sessionStorage.getItem('personal_diabetes_t2');
  const personalGastroparesis = sessionStorage.getItem('personal_gastroparesis');
  const personalPancreatitis = sessionStorage.getItem('personal_pancreatitis');
  const personalThyroidCancer = sessionStorage.getItem('personal_thyroid_cancer');
  const personalMen = sessionStorage.getItem('personal_men');

  // GLP-1 Specific
  const semaglutideDosage = sessionStorage.getItem('semaglutide_dosage');
  const semaglutideSideEffects = sessionStorage.getItem('semaglutide_side_effects');
  const semaglutideSuccess = sessionStorage.getItem('semaglutide_success');
  const tirzepatideDosage = sessionStorage.getItem('tirzepatide_dosage');
  const tirzepatideSideEffects = sessionStorage.getItem('tirzepatide_side_effects');
  const tirzepatideSuccess = sessionStorage.getItem('tirzepatide_success');
  const dosageSatisfaction = sessionStorage.getItem('dosage_satisfaction');
  const dosageInterest = sessionStorage.getItem('dosage_interest');

  // Lifestyle
  const alcoholConsumption = sessionStorage.getItem('alcohol_consumption');
  const recreationalDrugs = sessionStorage.getItem('recreational_drugs');
  const weightLossHistory = sessionStorage.getItem('weight_loss_history');
  const weightLossSupport = sessionStorage.getItem('weight_loss_support');
  const healthImprovements = sessionStorage.getItem('health_improvements');

  // Referral
  const referralSources = sessionStorage.getItem('referral_sources');
  const referrerName = sessionStorage.getItem('referrer_name');
  const referrerType = sessionStorage.getItem('referrer_type');

  // Other flags
  const takingMedications = sessionStorage.getItem('taking_medications');
  const hasMentalHealth = sessionStorage.getItem('has_mental_health_condition');
  const hasChronicConditions = sessionStorage.getItem('has_chronic_conditions');
  const personalizedTreatment = sessionStorage.getItem('personalized_treatment_interest');

  // Consent tracking - using ACTUAL keys stored by landing page and consent page
  // Landing page stores: privacy_policy_accepted (initial click)
  // Consent page stores: consent_privacy_policy_accepted (full legal consent)
  // We prefer the consent page value (full legal consent) over the landing page click
  const privacyPolicyAccepted = sessionStorage.getItem('consent_privacy_policy_accepted') 
    || sessionStorage.getItem('privacy_policy_accepted');
  const privacyPolicyAcceptedAt = sessionStorage.getItem('consent_privacy_policy_accepted_at')
    || sessionStorage.getItem('privacy_policy_accepted_at');
  const termsOfUseAccepted = sessionStorage.getItem('terms_of_use_accepted');
  const termsOfUseAcceptedAt = sessionStorage.getItem('terms_of_use_accepted_at');
  const telehealthConsentAccepted = sessionStorage.getItem('telehealth_consent_accepted');
  const telehealthConsentAcceptedAt = sessionStorage.getItem('telehealth_consent_accepted_at');
  const cancellationPolicyAccepted = sessionStorage.getItem('cancellation_policy_accepted');
  const cancellationPolicyAcceptedAt = sessionStorage.getItem('cancellation_policy_accepted_at');
  const floridaBillOfRightsAccepted = sessionStorage.getItem('florida_bill_of_rights_accepted');
  const floridaBillOfRightsAcceptedAt = sessionStorage.getItem('florida_bill_of_rights_accepted_at');
  const floridaConsentAccepted = sessionStorage.getItem('florida_consent_accepted');
  const floridaConsentAcceptedAt = sessionStorage.getItem('florida_consent_accepted_at');

  // Build weight object from separate keys
  const parsedHeight = heightData ? JSON.parse(heightData) : {};
  const weightObject = {
    currentWeight: currentWeight ? parseInt(currentWeight) : null,
    idealWeight: idealWeight ? parseInt(idealWeight) : null,
    heightFeet: parsedHeight.feet ? parseInt(parsedHeight.feet) : null,
    heightInches: parsedHeight.inches !== undefined && parsedHeight.inches !== '' ? parseInt(parsedHeight.inches) : null
  };

  const intakeData: IntakeSubmission = {
    sessionId,
    personalInfo: {
      ...(nameData ? JSON.parse(nameData) : {}),
      ...(contactData ? JSON.parse(contactData) : {}),
      dob: dobData || null,
      sex: sexAssigned || '',
      bloodPressure: bloodPressure || '',
      pregnancyBreastfeeding: pregnancyBreastfeeding || ''
    },
    address: addressData ? JSON.parse(addressData) : null,
    medicalProfile: {
      weight: weightObject,
      bmi: calculateBMIFromObject(weightObject) || undefined,
      goals: goalsData ? JSON.parse(goalsData) : [],
      activityLevel: activityData || ''
    },
    medicalHistory: {
      chronicConditions: chronicConditions ? JSON.parse(chronicConditions) : [],
      digestiveConditions: digestiveConditions ? JSON.parse(digestiveConditions) : [],
      medications: medications ? JSON.parse(medications) : [],
      allergies: allergies ? JSON.parse(allergies) : [],
      mentalHealthConditions: mentalHealth ? JSON.parse(mentalHealth) : [],
      surgeryHistory: surgeryHistory || '',
      surgeryDetails: surgeryDetails ? JSON.parse(surgeryDetails) : [],
      familyConditions: familyConditions ? JSON.parse(familyConditions) : [],
      kidneyConditions: kidneyConditions ? JSON.parse(kidneyConditions) : [],
      medicalConditions: medicalConditions ? JSON.parse(medicalConditions) : [],
      personalDiabetes: personalDiabetes || '',
      personalGastroparesis: personalGastroparesis || '',
      personalPancreatitis: personalPancreatitis || '',
      personalThyroidCancer: personalThyroidCancer || '',
      personalMen: personalMen || '',
      hasMentalHealth: hasMentalHealth || '',
      hasChronicConditions: hasChronicConditions || ''
    },
    glp1Profile: {
      history: glp1History || '',
      type: glp1Type || '',
      sideEffects: sideEffects ? JSON.parse(sideEffects) : [],
      medicationPreference: medicationPref || '',
      semaglutideDosage: semaglutideDosage || '',
      semaglutideSideEffects: semaglutideSideEffects ? JSON.parse(semaglutideSideEffects) : [],
      semaglutideSuccess: semaglutideSuccess || '',
      tirzepatideDosage: tirzepatideDosage || '',
      tirzepatideSideEffects: tirzepatideSideEffects ? JSON.parse(tirzepatideSideEffects) : [],
      tirzepatideSuccess: tirzepatideSuccess || '',
      dosageSatisfaction: dosageSatisfaction || '',
      dosageInterest: dosageInterest || ''
    },
    lifestyle: {
      alcoholConsumption: alcoholConsumption || '',
      recreationalDrugs: recreationalDrugs ? JSON.parse(recreationalDrugs) : [],
      weightLossHistory: weightLossHistory ? JSON.parse(weightLossHistory) : [],
      weightLossSupport: weightLossSupport ? JSON.parse(weightLossSupport) : [],
      healthImprovements: healthImprovements ? JSON.parse(healthImprovements) : []
    },
    referral: {
      sources: referralSources ? JSON.parse(referralSources) : [],
      referrerName: referrerName || '',
      referrerType: referrerType || ''
    },
    qualificationStatus: {
      qualified: true,
      completedAt: new Date().toISOString(),
      checkpoints: JSON.parse(sessionStorage.getItem('completed_checkpoints') || '[]'),
      takingMedications: takingMedications || '',
      personalizedTreatmentInterest: personalizedTreatment || ''
    },
    consents: {
      privacyPolicyAccepted: privacyPolicyAccepted === 'true',
      privacyPolicyAcceptedAt: privacyPolicyAcceptedAt || '',
      termsOfUseAccepted: termsOfUseAccepted === 'true',
      termsOfUseAcceptedAt: termsOfUseAcceptedAt || '',
      telehealthConsentAccepted: telehealthConsentAccepted === 'true',
      telehealthConsentAcceptedAt: telehealthConsentAcceptedAt || '',
      cancellationPolicyAccepted: cancellationPolicyAccepted === 'true',
      cancellationPolicyAcceptedAt: cancellationPolicyAcceptedAt || '',
      floridaBillOfRightsAccepted: floridaBillOfRightsAccepted === 'true',
      floridaBillOfRightsAcceptedAt: floridaBillOfRightsAcceptedAt || '',
      floridaConsentAccepted: floridaConsentAccepted === 'true',
      floridaConsentAcceptedAt: floridaConsentAcceptedAt || ''
    }
  };

  return intakeData;
}

// Helper function to calculate BMI from weight object
function calculateBMIFromObject(weightData: { currentWeight: number | null; heightFeet: number | null; heightInches: number | null }): number | null {
  if (!weightData) return null;
  
  try {
    const weight = weightData.currentWeight;
    const heightInches = ((weightData.heightFeet || 0) * 12) + (weightData.heightInches || 0);
    
    if (weight && heightInches) {
      const bmi = (weight / (heightInches * heightInches)) * 703;
      return Math.round(bmi * 10) / 10;
    }
  } catch (e) {
    console.error('BMI calculation error:', e);
  }
  
  return null;
}

// Mark checkpoint as completed
export function markCheckpointCompleted(checkpointName: string): void {
  const completed = JSON.parse(
    sessionStorage.getItem('completed_checkpoints') || '[]'
  );
  if (!completed.includes(checkpointName)) {
    completed.push(checkpointName);
    sessionStorage.setItem('completed_checkpoints', JSON.stringify(completed));
  }
}

// ============================================================================
// INTAKEQ INTEGRATION
// Send intake data to IntakeQ and generate PDF
// ============================================================================

interface IntakeQResult {
  success: boolean;
  clientId?: string;
  pdfGenerated?: boolean;
  pdfUploaded?: boolean;
  pdfUrl?: string;
  error?: string;
}

export async function sendToIntakeQ(): Promise<IntakeQResult> {
  if (!isBrowser) {
    return { success: false, error: 'Not in browser environment' };
  }

  try {
    // Gather all intake data from session storage
    const intakeData = collectIntakeData();
    
    // Parse stored data
    const nameData = sessionStorage.getItem('intake_name');
    const contactData = sessionStorage.getItem('intake_contact');
    const dobData = sessionStorage.getItem('intake_dob');
    const heightData = sessionStorage.getItem('intake_height');
    const addressData = sessionStorage.getItem('intake_address');
    
    const parsedName = nameData ? JSON.parse(nameData) : {};
    const parsedContact = contactData ? JSON.parse(contactData) : {};
    const parsedDob = dobData ? JSON.parse(dobData) : {};
    const parsedHeight = heightData ? JSON.parse(heightData) : {};
    const parsedAddress = addressData ? JSON.parse(addressData) : {};

    // Format DOB
    let dobFormatted = '';
    if (parsedDob.month && parsedDob.day && parsedDob.year) {
      dobFormatted = `${parsedDob.month}/${parsedDob.day}/${parsedDob.year}`;
    }

    // Format height
    let heightString = '';
    if (parsedHeight.feet) {
      heightString = `${parsedHeight.feet}'${parsedHeight.inches || 0}"`;
    }

    // Get session ID
    const sessionId = sessionStorage.getItem('intake_session_id') || `EON-${Date.now()}`;

    // Build payload for IntakeQ API
    const payload = {
      sessionId,
      firstName: parsedName.firstName || intakeData.personalInfo?.firstName || '',
      lastName: parsedName.lastName || intakeData.personalInfo?.lastName || '',
      email: parsedContact.email || intakeData.personalInfo?.email || '',
      phone: parsedContact.phone || intakeData.personalInfo?.phone || '',
      dob: dobFormatted,
      sex: intakeData.personalInfo?.sex || '',
      state: intakeData.address?.state || '',
      address: parsedAddress.street || intakeData.address?.fullAddress || '',
      apartment: parsedAddress.unit || intakeData.address?.unit || '',
      city: parsedAddress.city || '',
      zipCode: parsedAddress.zip || '',
      currentWeight: intakeData.medicalProfile?.weight?.currentWeight,
      idealWeight: intakeData.medicalProfile?.weight?.idealWeight,
      height: heightString,
      bmi: intakeData.medicalProfile?.bmi,
      activityLevel: intakeData.medicalProfile?.activityLevel || '',
      bloodPressure: intakeData.personalInfo?.bloodPressure || '',
      pregnancyBreastfeeding: intakeData.personalInfo?.pregnancyBreastfeeding || '',
      chronicConditions: arrayToString(intakeData.medicalHistory?.chronicConditions),
      digestiveConditions: arrayToString(intakeData.medicalHistory?.digestiveConditions),
      medications: arrayToString(intakeData.medicalHistory?.medications),
      allergies: arrayToString(intakeData.medicalHistory?.allergies),
      mentalHealthConditions: arrayToString(intakeData.medicalHistory?.mentalHealthConditions),
      surgeryHistory: intakeData.medicalHistory?.surgeryHistory || '',
      surgeryDetails: arrayToString(intakeData.medicalHistory?.surgeryDetails),
      familyConditions: arrayToString(intakeData.medicalHistory?.familyConditions),
      kidneyConditions: arrayToString(intakeData.medicalHistory?.kidneyConditions),
      medicalConditions: arrayToString(intakeData.medicalHistory?.medicalConditions),
      glp1History: intakeData.glp1Profile?.history || '',
      glp1Type: intakeData.glp1Profile?.type || '',
      sideEffects: arrayToString(intakeData.glp1Profile?.sideEffects),
      semaglutideDosage: intakeData.glp1Profile?.semaglutideDosage || '',
      semaglutideSuccess: intakeData.glp1Profile?.semaglutideSuccess || '',
      semaglutideSideEffects: arrayToString(intakeData.glp1Profile?.semaglutideSideEffects),
      tirzepatideDosage: intakeData.glp1Profile?.tirzepatideDosage || '',
      tirzepatideSuccess: intakeData.glp1Profile?.tirzepatideSuccess || '',
      tirzepatideSideEffects: arrayToString(intakeData.glp1Profile?.tirzepatideSideEffects),
      personalizedTreatmentInterest: intakeData.qualificationStatus?.personalizedTreatmentInterest || '',
      healthImprovements: arrayToString(intakeData.medicalProfile?.goals),
      weightLossHistory: arrayToString(intakeData.lifestyle?.weightLossHistory),
      referralSources: arrayToString(intakeData.referral?.sources),
      referrerName: intakeData.referral?.referrerName || '',
      language: sessionStorage.getItem('preferred_language') || 'en',
    };

    console.log('[IntakeQ] Sending data to IntakeQ...');

    const response = await fetch('/api/intakeq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      console.log('[IntakeQ] Success:', result.clientId);
      // Store the IntakeQ client ID
      sessionStorage.setItem('intakeq_client_id', result.clientId);
      return {
        success: true,
        clientId: result.clientId,
        pdfGenerated: result.pdfGenerated,
        pdfUploaded: result.pdfUploaded,
        pdfUrl: result.pdfUrl,
      };
    } else {
      console.error('[IntakeQ] Failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('[IntakeQ] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'IntakeQ integration failed',
    };
  }
}

// Helper to convert array to comma-separated string
function arrayToString(arr: string[] | undefined | null): string {
  if (!arr || !Array.isArray(arr)) return '';
  return arr.filter(Boolean).join(', ');
}

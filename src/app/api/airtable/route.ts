import { NextRequest, NextResponse } from 'next/server';

// Development-only logging
const isDev = process.env.NODE_ENV === 'development';
const log = (...args: unknown[]) => isDev && console.log(...args);

// Airtable API configuration - uses Personal Access Token (PAT)
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Intake Submissions';

// Known safe field names that exist in Airtable
// IMPORTANT: Only include fields that are actually created in your Airtable table
// Check your Airtable table columns and add matching field names here
const KNOWN_AIRTABLE_FIELDS = new Set([
  // Core identification fields
  'Session ID',
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'State',
  'Language',
  'Type',
  // Medical data fields
  'Date of Birth',
  'Sex',
  'Blood Pressure',
  'Pregnancy/Breastfeeding',
  'Address',
  'Apartment',
  'Current Weight (lbs)',
  'Ideal Weight',
  'Height',
  'BMI',
  'Goals',
  'Activity Level',
  // Medical history
  'Chronic Conditions',
  'Digestive Conditions',
  'Medications',
  'Allergies',
  'Mental Health Conditions',
  'Surgery History',
  'Surgery Details',
  'Family Conditions',
  'Kidney Conditions',
  'Medical Conditions',
  // Personal medical history
  'Personal Diabetes T2',
  'Personal Gastroparesis',
  'Personal Pancreatitis',
  'Personal Thyroid Cancer',
  'Personal MEN',
  'Has Mental Health',
  'Has Chronic Conditions',
  // GLP-1 data
  'GLP-1 History',
  'GLP-1 Type',
  'Side Effects',
  'Medication Preference',
  'Semaglutide Dosage',
  'Semaglutide Side Effects',
  'Semaglutide Success',
  'Tirzepatide Dosage',
  'Tirzepatide Side Effects',
  'Tirzepatide Success',
  'Dosage Satisfaction',
  'Dosage Interest',
  // Lifestyle
  'Alcohol Consumption',
  'Recreational Drugs',
  'Weight Loss History',
  'Weight Loss Support',
  'Health Improvements',
  // Referral
  'Referral Sources',
  'Referrer Name',
  'Referrer Type',
  // Status
  'Taking Medications',
  'Personalized Treatment Interest',
  // Consent checkboxes
  'Privacy Policy Accepted',
  'Terms of Use Accepted',
  'Telehealth Consent Accepted',
  'Cancellation Policy Accepted',
  'Florida Bill of Rights Accepted',
  'Florida Consent Accepted',
  // Note: Consent timestamp fields (e.g., "Privacy Policy Accepted At") are computed fields
  // in Airtable and cannot be written to directly - they auto-populate when checkbox is set
]);

// Fields that are checkbox type in Airtable (need boolean values)
const CHECKBOX_FIELDS = new Set([
  'Qualified',
  'Privacy Policy Accepted',
  'Terms of Use Accepted',
  'Telehealth Consent Accepted',
  'Cancellation Policy Accepted',
  'Florida Bill of Rights Accepted',
  'Florida Consent Accepted',
]);

// Fields that are number type in Airtable (need numeric values)
const NUMBER_FIELDS = new Set([
  'Current Weight (lbs)',
  'Ideal Weight',
  'BMI',
]);

interface IntakeRecord {
  sessionId: string;
  // For updating existing records (midpoint → final)
  updateRecordId?: string;
  // Personal Info
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  sex?: string;
  bloodPressure?: string;
  pregnancyBreastfeeding?: string;
  // Address
  state?: string;
  address?: string;
  apartment?: string;
  // Weight & BMI
  currentWeight?: number | string;
  idealWeight?: number | string;
  height?: string;
  bmi?: number | string;
  // Goals & Activity
  goals?: string;
  activityLevel?: string;
  // Medical Conditions
  chronicConditions?: string;
  digestiveConditions?: string;
  medications?: string;
  allergies?: string;
  mentalHealthConditions?: string;
  // Additional Medical History
  surgeryHistory?: string;
  surgeryDetails?: string;
  familyConditions?: string;
  kidneyConditions?: string;
  medicalConditions?: string;
  personalDiabetes?: string;
  personalGastroparesis?: string;
  personalPancreatitis?: string;
  personalThyroidCancer?: string;
  personalMen?: string;
  hasMentalHealth?: string;
  hasChronicConditions?: string;
  // GLP-1 Profile
  glp1History?: string;
  glp1Type?: string;
  sideEffects?: string;
  medicationPreference?: string;
  semaglutideDosage?: string;
  semaglutideSideEffects?: string;
  semaglutideSuccess?: string;
  tirzepatideDosage?: string;
  tirzepatideSideEffects?: string;
  tirzepatideSuccess?: string;
  dosageSatisfaction?: string;
  dosageInterest?: string;
  // Lifestyle
  alcoholConsumption?: string;
  recreationalDrugs?: string;
  weightLossHistory?: string;
  weightLossSupport?: string;
  healthImprovements?: string;
  // Referral
  referralSources?: string;
  referrerName?: string;
  referrerType?: string;
  // Qualification Status
  qualified?: boolean;
  takingMedications?: string;
  personalizedTreatmentInterest?: string;
  submittedAt?: string;
  flowLanguage?: string;
  // Consent tracking - checkboxes
  privacyPolicyAccepted?: boolean;
  termsOfUseAccepted?: boolean;
  telehealthConsentAccepted?: boolean;
  cancellationPolicyAccepted?: boolean;
  floridaBillOfRightsAccepted?: boolean;
  floridaConsentAccepted?: boolean;
  // Consent tracking - timestamps
  privacyPolicyAcceptedAt?: string;
  termsOfUseAcceptedAt?: string;
  telehealthConsentAcceptedAt?: string;
  cancellationPolicyAcceptedAt?: string;
  floridaBillOfRightsAcceptedAt?: string;
  floridaConsentAcceptedAt?: string;
}

// CORS headers - configured via middleware, but kept for direct API responses
// The middleware handles CORS preflight and origin validation
function getCorsHeaders(request?: NextRequest): Record<string, string> {
  const origin = request?.headers.get('origin') || '';
  const allowedOrigins = [
    'https://otmens-intake.vercel.app',
    'https://otmens-intakes.vercel.app',
    'https://www.otmenshealth.com',
    'https://otmenshealth.com',
    'https://checkout.otmenshealth.com',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean) as string[];
  
  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
  }
  
  const isAllowed = allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development';
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin || allowedOrigins[0] : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);
  log('=== AIRTABLE API CALLED ===');
  log('Timestamp:', new Date().toISOString());
  
  try {
    const data: IntakeRecord = await request.json();
    
    const isUpdate = !!data.updateRecordId;
    log('Received intake submission:', {
      sessionId: data.sessionId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      state: data.state,
      qualified: data.qualified,
      isUpdate,
      updateRecordId: data.updateRecordId || 'N/A'
    });
    // Check for required environment variables
    if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
      console.error('Airtable not configured! AIRTABLE_PAT:', !!AIRTABLE_PAT, 'AIRTABLE_BASE_ID:', !!AIRTABLE_BASE_ID);
      return NextResponse.json({
        success: false,
        error: 'Airtable not configured',
        message: 'Add AIRTABLE_PAT and AIRTABLE_BASE_ID to environment variables',
        recordId: `LOCAL-${Date.now()}`
      }, { headers: corsHeaders });
    }

    // Helper to convert any value to string (Airtable text fields)
    const toString = (val: unknown): string => {
      if (val === null || val === undefined) {
        return '';
      }
      if (typeof val === 'boolean') {
        return val ? 'Yes' : 'No';
      }
      if (typeof val === 'number') {
        return String(val);
      }
      return String(val);
    };

    // Build fields object - ALL fields from Airtable
    const allFields: Record<string, string | boolean | number> = {
      // Core identification
      'Session ID': toString(data.sessionId),
      'First Name': toString(data.firstName),
      'Last Name': toString(data.lastName),
      'Email': toString(data.email),
      'Phone': toString(data.phone),
      'State': toString(data.state),
      'Language': toString(data.flowLanguage),
      // Medical data
      'Date of Birth': toString(data.dob),
      'Sex': toString(data.sex),
      'Blood Pressure': toString(data.bloodPressure),
      'Pregnancy/Breastfeeding': toString(data.pregnancyBreastfeeding),
      'Address': toString(data.address),
      'Apartment': toString(data.apartment),
      'Current Weight (lbs)': toString(data.currentWeight),
      'Ideal Weight': toString(data.idealWeight),
      'Height': toString(data.height),
      'BMI': toString(data.bmi),
      'Goals': toString(data.goals),
      'Activity Level': toString(data.activityLevel),
      // Medical history
      'Chronic Conditions': toString(data.chronicConditions),
      'Digestive Conditions': toString(data.digestiveConditions),
      'Medications': toString(data.medications),
      'Allergies': toString(data.allergies),
      'Mental Health Conditions': toString(data.mentalHealthConditions),
      'Surgery History': toString(data.surgeryHistory),
      'Surgery Details': toString(data.surgeryDetails),
      'Family Conditions': toString(data.familyConditions),
      'Kidney Conditions': toString(data.kidneyConditions),
      'Medical Conditions': toString(data.medicalConditions),
      // Personal medical history
      'Personal Diabetes T2': toString(data.personalDiabetes),
      'Personal Gastroparesis': toString(data.personalGastroparesis),
      'Personal Pancreatitis': toString(data.personalPancreatitis),
      'Personal Thyroid Cancer': toString(data.personalThyroidCancer),
      'Personal MEN': toString(data.personalMen),
      'Has Mental Health': toString(data.hasMentalHealth),
      'Has Chronic Conditions': toString(data.hasChronicConditions),
      // GLP-1 data
      'GLP-1 History': toString(data.glp1History),
      'GLP-1 Type': toString(data.glp1Type),
      'Side Effects': toString(data.sideEffects),
      'Medication Preference': toString(data.medicationPreference),
      'Semaglutide Dosage': toString(data.semaglutideDosage),
      'Semaglutide Side Effects': toString(data.semaglutideSideEffects),
      'Semaglutide Success': toString(data.semaglutideSuccess),
      'Tirzepatide Dosage': toString(data.tirzepatideDosage),
      'Tirzepatide Side Effects': toString(data.tirzepatideSideEffects),
      'Tirzepatide Success': toString(data.tirzepatideSuccess),
      'Dosage Satisfaction': toString(data.dosageSatisfaction),
      'Dosage Interest': toString(data.dosageInterest),
      // Lifestyle
      'Alcohol Consumption': toString(data.alcoholConsumption),
      'Recreational Drugs': toString(data.recreationalDrugs),
      'Weight Loss History': toString(data.weightLossHistory),
      'Weight Loss Support': toString(data.weightLossSupport),
      'Health Improvements': toString(data.healthImprovements),
      // Referral
      'Referral Sources': toString(data.referralSources),
      'Referrer Name': toString(data.referrerName),
      'Referrer Type': toString(data.referrerType),
      // Status
      'Qualified': data.qualified ?? false,
      'Taking Medications': toString(data.takingMedications),
      'Personalized Treatment Interest': toString(data.personalizedTreatmentInterest),
      // Consent checkboxes - timestamps are auto-computed by Airtable when these are set
      'Privacy Policy Accepted': data.privacyPolicyAccepted ?? false,
      'Terms of Use Accepted': data.termsOfUseAccepted ?? false,
      'Telehealth Consent Accepted': data.telehealthConsentAccepted ?? false,
      'Cancellation Policy Accepted': data.cancellationPolicyAccepted ?? false,
      'Florida Bill of Rights Accepted': data.floridaBillOfRightsAccepted ?? false,
      'Florida Consent Accepted': data.floridaConsentAccepted ?? false,
    };

    // Build final fields object with proper types
    const fields: Record<string, string | boolean | number> = {};
    const skippedFields: string[] = [];
    
    for (const [key, value] of Object.entries(allFields)) {
      // Skip empty values
      if (value === undefined || value === null || value === '') {
        continue;
      }
      
      // Handle checkbox fields (need boolean)
      if (CHECKBOX_FIELDS.has(key)) {
        fields[key] = value === 'Yes' || value === 'true' || value === true;
        continue;
      }
      
      // Handle number fields (need numeric values)
      if (NUMBER_FIELDS.has(key)) {
        const numValue = parseFloat(String(value));
        if (!isNaN(numValue)) {
          fields[key] = numValue;
        }
        continue;
      }
      
      // Only include text fields that are known to exist in Airtable
      if (KNOWN_AIRTABLE_FIELDS.has(key)) {
        fields[key] = value;
      } else {
        skippedFields.push(key);
      }
    }

    log('Sending fields to Airtable:', Object.keys(fields));
    if (skippedFields.length > 0) {
      log('Skipped unknown fields:', skippedFields);
    }

    // Determine if this is a CREATE or UPDATE operation
    const airtableUrl = isUpdate && data.updateRecordId
      ? `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${data.updateRecordId}`
      : `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    
    const httpMethod = isUpdate ? 'PATCH' : 'POST';
    
    log(`${isUpdate ? '📝 UPDATING' : '➕ CREATING'} Airtable record...`);

    // Send to Airtable using Personal Access Token with retry logic
    let lastError: unknown = null;
    let response: Response | null = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await fetch(airtableUrl, {
          method: httpMethod,
          headers: {
            'Authorization': `Bearer ${AIRTABLE_PAT}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields }),
        });
        
        if (response.ok) {
          break; // Success, exit retry loop
        }
        
        // If it's a 422 (validation error), don't retry - it will fail again
        if (response.status === 422) {
          break;
        }
        
        log(`Airtable attempt ${attempt} failed with status ${response.status}, retrying...`);
        lastError = `HTTP ${response.status}`;
        
      } catch (fetchError) {
        log(`Airtable attempt ${attempt} network error:`, fetchError);
        lastError = fetchError;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }

    if (!response || !response.ok) {
      let errorData;
      try {
        errorData = response ? await response.json() : { error: 'Network error' };
      } catch {
        errorData = { error: String(lastError) };
      }
      
      console.error('Airtable error after retries:', JSON.stringify(errorData, null, 2));
      console.error('Fields sent:', Object.keys(fields));

      // Return detailed error for debugging
      return NextResponse.json({
        success: false,
        error: `Airtable API error: ${response?.status || 'network error'}`,
        details: errorData,
        fieldsSent: Object.keys(fields),
        skippedFields: skippedFields.length > 0 ? skippedFields : undefined
      }, { status: response?.status || 500, headers: corsHeaders });
    }

    const result = await response.json();

    log('Successfully saved to Airtable with ID:', result.id);
    return NextResponse.json({
      success: true,
      recordId: result.id,
      message: 'Successfully saved to Airtable',
      fieldsSaved: Object.keys(fields).length
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error saving to Airtable:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save data'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(request) });
}

// GET endpoint to fetch patient checkout data by record ID
// HIPAA Compliant: Returns only non-PHI data needed for checkout pre-fill
export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);
  const { searchParams } = new URL(request.url);
  const recordId = searchParams.get('ref');

  // If no record ID, return config status
  if (!recordId) {
    const configured = !!(AIRTABLE_PAT && AIRTABLE_BASE_ID);
    return NextResponse.json({
      configured,
      tableName: AIRTABLE_TABLE_NAME,
      message: configured
        ? 'Airtable integration is configured'
        : 'Airtable credentials not set. Add AIRTABLE_PAT and AIRTABLE_BASE_ID to environment variables.'
    }, { headers: corsHeaders });
  }

  // Validate record ID format (Airtable IDs start with 'rec')
  if (!recordId.startsWith('rec')) {
    return NextResponse.json(
      { success: false, error: 'Invalid record reference' },
      { status: 400, headers: corsHeaders }
    );
  }

  // Check for required environment variables
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    return NextResponse.json(
      { success: false, error: 'Airtable not configured' },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    // Fetch record from Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${recordId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Record not found' },
          { status: 404, headers: corsHeaders }
        );
      }
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const record = await response.json();

    // HIPAA Compliant: Only return data needed for checkout pre-fill
    // Do NOT return sensitive medical information
    const checkoutData = {
      success: true,
      data: {
        firstName: record.fields['First Name'] || '',
        lastName: record.fields['Last Name'] || '',
        email: record.fields['Email'] || '',
        phone: record.fields['Phone'] || '',
        state: record.fields['State'] || '',
        address: record.fields['Address'] || '',
        medicationPreference: record.fields['Medication Preference'] || '',
        qualified: record.fields['Qualified'] ?? false,
      }
    };

    return NextResponse.json(checkoutData, { headers: corsHeaders });

  } catch (error) {
    console.error('Error fetching from Airtable:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500, headers: corsHeaders }
    );
  }
}

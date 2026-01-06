'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface IntakeLayoutProps {
  children: ReactNode;
}

// List of all intake-related sessionStorage keys to clear on refresh
const INTAKE_STORAGE_KEYS = [
  'intake_goals',
  'intake_name',
  'intake_state',
  'intake_contact',
  'intake_dob',
  'intake_address',
  'intake_sex',
  'intake_ideal_weight',
  'intake_current_weight',
  'intake_height',
  'intake_session_id',
  'intake_checkpoints',
  'intake_submitted',
  'intake_id',
  'intake_pending_sync',
  'activity_level',
  'medication_preference',
  'glp1_history',
  'glp1_type',
  'has_chronic_conditions',
  'chronic_conditions',
  'digestive_conditions',
  'taking_medications',
  'current_medications',
  'allergies',
  'has_mental_health_condition',
  'mental_health_conditions',
  'surgery_history',
  'surgery_details',
  'blood_pressure',
  'alcohol_consumption',
  'common_side_effects',
  'personalized_treatment_interest',
  'referral_sources',
  'referrer_name',
  'referrer_type',
  'health_improvements',
  'completed_checkpoints',
  'personal_thyroid_cancer',
  'personal_men',
  'personal_pancreatitis',
  'personal_gastroparesis',
  'personal_diabetes_t2',
  'pregnancy_breastfeeding',
  'semaglutide_dosage',
  'semaglutide_side_effects',
  'semaglutide_success',
  'tirzepatide_dosage',
  'tirzepatide_side_effects',
  'tirzepatide_success',
  'dosage_satisfaction',
  'dosage_interest',
  'recreational_drugs',
  'weight_loss_history',
  'weight_loss_support',
  'kidney_conditions',
  'medical_conditions',
  'family_conditions',
  // Consent tracking keys (snake_case as stored by pages)
  'privacy_policy_accepted',
  'privacy_policy_accepted_at',
  'terms_of_use_accepted',
  'terms_of_use_accepted_at',
  'consent_privacy_policy_accepted',
  'consent_privacy_policy_accepted_at',
  'telehealth_consent_accepted',
  'telehealth_consent_accepted_at',
  'cancellation_policy_accepted',
  'cancellation_policy_accepted_at',
  'florida_bill_of_rights_accepted',
  'florida_bill_of_rights_accepted_at',
  'florida_consent_accepted',
  'florida_consent_accepted_at',
  // Submission tracking
  'submission_status',
  'submission_error',
  'submitted_intake_id',
  'checkout_redirect_in_progress',
];

// Clear all intake data from both sessionStorage and localStorage
function clearAllIntakeData() {
  // Clear sessionStorage keys
  INTAKE_STORAGE_KEYS.forEach(key => {
    sessionStorage.removeItem(key);
  });
  
  // Clear Zustand persisted store from localStorage
  localStorage.removeItem('eon-intake-storage');
}

export default function IntakeLayout({ children }: IntakeLayoutProps) {
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Check if this is a page refresh using performance API
    const navEntries = performance.getEntriesByType('navigation');
    const navigationType = navEntries.length > 0 ? (navEntries[0] as PerformanceNavigationTiming).type : null;
    
    // Only clear and redirect if:
    // 1. It's a reload (refresh)
    // 2. AND there was previous data (user was in the middle of intake)
    if (navigationType === 'reload') {
      const hadPreviousData = sessionStorage.getItem('intake_goals') || 
                              sessionStorage.getItem('intake_name') ||
                              sessionStorage.getItem('intake_state') ||
                              localStorage.getItem('eon-intake-storage');
      
      if (hadPreviousData) {
        // Clear all intake data on refresh
        clearAllIntakeData();
        
        // Redirect to the start of the intake
        router.replace('/');
        return;
      }
    }
    
    // Set flag to indicate legitimate navigation
    sessionStorage.setItem('intake_navigation_flag', 'true');

    // Handler for beforeunload event - shows browser's native warning dialog
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Skip warning if checkout redirect is in progress
      const isCheckoutRedirect = sessionStorage.getItem('checkout_redirect_in_progress');
      if (isCheckoutRedirect === 'true') {
        return;
      }
      
      // Check if user has started the intake (has any data in session)
      const hasStarted = sessionStorage.getItem('intake_goals') || 
                         sessionStorage.getItem('intake_name') ||
                         sessionStorage.getItem('intake_state') ||
                         sessionStorage.getItem('intake_contact') ||
                         localStorage.getItem('eon-intake-storage');
      
      // Only show warning if user has entered some data
      if (hasStarted) {
        // Prevent the default action (leaving the page)
        e.preventDefault();
        
        // Chrome requires returnValue to be set
        // Note: Modern browsers show a generic message for security reasons
        // but the dialog WILL appear
        e.returnValue = '';
        return '';
      }
    };

    // Add event listener for refresh/close warning
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [language, router]);

  return <>{children}</>;
}


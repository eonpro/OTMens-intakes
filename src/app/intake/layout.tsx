'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { logSessionTimeout, logSessionStart } from '@/lib/audit';

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
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeoutRemaining, setTimeoutRemaining] = useState(0);

  // Session timeout for HIPAA compliance (30 minutes inactivity)
  const { resetTimeout } = useSessionTimeout({
    timeout: 30 * 60 * 1000, // 30 minutes
    warningTime: 5 * 60 * 1000, // 5 minutes warning
    onWarning: (remaining) => {
      setTimeoutRemaining(Math.ceil(remaining / 1000 / 60)); // Minutes
      setShowTimeoutWarning(true);
    },
    onTimeout: () => {
      logSessionTimeout();
      clearAllIntakeData();
      router.replace('/?session=expired');
    },
    enabled: true,
  });

  // Handle user continuing after warning
  const handleContinueSession = () => {
    setShowTimeoutWarning(false);
    resetTimeout();
  };

  useEffect(() => {
    // Log session start for audit trail
    logSessionStart();
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

  return (
    <>
      {children}
      
      {/* Session Timeout Warning Modal */}
      {showTimeoutWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'es' ? 'Sesión por expirar' : 'Session Expiring Soon'}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {language === 'es' 
                  ? `Tu sesión expirará en ${timeoutRemaining} minutos debido a inactividad. ¿Deseas continuar?`
                  : `Your session will expire in ${timeoutRemaining} minutes due to inactivity. Would you like to continue?`
                }
              </p>
              
              <p className="text-sm text-gray-500 mb-6">
                {language === 'es'
                  ? 'Por razones de seguridad, tu información se borrará automáticamente.'
                  : 'For security reasons, your information will be automatically cleared.'
                }
              </p>
              
              <button
                onClick={handleContinueSession}
                className="w-full py-3 px-6 bg-[#cab172] text-black font-medium rounded-full hover:bg-[#b59a5e] transition-colors"
              >
                {language === 'es' ? 'Continuar sesión' : 'Continue Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


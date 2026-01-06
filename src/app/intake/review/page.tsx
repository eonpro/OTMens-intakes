'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { submitIntake, collectIntakeData, markCheckpointCompleted } from '@/lib/api';

export default function ReviewPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [state, setState] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'pending' | 'submitting' | 'success' | 'error'>('pending');
  const hasSubmitted = useRef(false);

  // Get user data on mount
  useEffect(() => {
    const nameData = sessionStorage.getItem('intake_name');
    const stateData = sessionStorage.getItem('intake_state');
    
    if (nameData) {
      try {
        const parsed = JSON.parse(nameData);
        setFirstName(parsed.firstName || '');
      } catch {
        setFirstName('');
      }
    }
    
    if (stateData) {
      try {
        const parsed = JSON.parse(stateData);
        // Convert state code to full name
        const stateNames: { [key: string]: string } = {
          'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
          'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
          'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
          'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
          'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
          'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
          'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
          'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
          'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
          'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
        };
        setState(stateNames[parsed.state] || parsed.state || '');
      } catch {
        setState('');
      }
    }
  }, []);

  // Submit data to Airtable
  const submitToAirtable = useCallback(async () => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    
    setSubmissionStatus('submitting');

    try {
      // Collect all intake data
      const intakeData = collectIntakeData();

      // Mark checkpoint
      markCheckpointCompleted('qualification-complete');
      
      // Submit to Airtable
      const result = await submitIntake(intakeData);

      if (result.success && result.intakeId) {
        sessionStorage.setItem('submitted_intake_id', result.intakeId);
        sessionStorage.setItem('submission_status', 'success');
        setSubmissionStatus('success');
        
        // NOTE: IntakeQ integration is handled by Airtable automation
        // The Airtable automation has full functionality including:
        // - Custom fields (BMI, weight, height, etc.)
        // - Intake PDF generation and upload
        // - SOAP Note PDF generation with state-based license
        // - Proper field mapping to IntakeQ client profile
        // 
        // The local sendToIntakeQ() was disabled to avoid creating
        // duplicate/incomplete IntakeQ profiles before Airtable automation runs.
        
        // Navigate after successful submission
        setTimeout(() => {
          router.push('/intake/qualified');
        }, 500);
      } else {
        console.error('❌ FAILED:', result.error);
        sessionStorage.setItem('submission_status', 'failed');
        sessionStorage.setItem('submission_error', result.error || 'Unknown error');
        setSubmissionStatus('error');
        
        // Still navigate after delay
        setTimeout(() => {
          router.push('/intake/qualified');
        }, 2000);
      }
    } catch (error) {
      console.error('💥 EXCEPTION:', error);
      sessionStorage.setItem('submission_status', 'error');
      sessionStorage.setItem('submission_error', String(error));
      setSubmissionStatus('error');
      
      // Still navigate after delay
      setTimeout(() => {
        router.push('/intake/qualified');
      }, 2000);
    }
  }, [router]);

  // Trigger submission after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      submitToAirtable();
    }, 2000); // Start submission after 2 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [submitToAirtable]);

  return (
    <div className="min-h-screen bg-white flex flex-col page-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Thank you message - larger font */}
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-gray-400">
              {language === 'es' ? 'Gracias, ' : 'Thank you, '}
            </span>
            <span className="text-[#413d3d]">{firstName || ''}</span>
          </h1>
          
          {/* Lottie Animation - Medical processing animation */}
          <div className="flex justify-center">
            <div className="w-64 h-64 relative">
              <iframe
                src="https://lottie.host/embed/9fb843e1-1010-4dd3-bb0c-c9e194ec74ef/FPTlU6rmSq.lottie"
                style={{
                  width: '256px',
                  height: '256px',
                  border: 'none',
                  background: 'transparent'
                }}
                title="Processing animation"
              />
            </div>
          </div>
          
          {/* Information text - larger font */}
          <div className="space-y-0">
            <p className="text-2xl lg:text-3xl text-gray-400 leading-tight">
              {language === 'es' 
                ? 'Tu información esta siendo asignada a un'
                : 'Your information is being assigned to a'}
            </p>
            <p className="text-2xl lg:text-3xl leading-tight">
              <span className="text-[#413d3d] font-bold">{state || ''}</span>
              <span className="text-gray-400"> {language === 'es' ? 'médico licenciado via' : 'licensed physician via'}</span>
            </p>
          </div>
          
          {/* MedLink Logo */}
          <div className="flex justify-center mt-4">
            <img 
              src="https://static.wixstatic.com/shapes/c49a9b_f5e1ceda9f1341bc9e97cc0a6b4d19a3.svg"
              alt="MedLink"
              className="h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
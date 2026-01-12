'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FindingProviderPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [stateName, setStateName] = useState('your area');
  const [providersFound, setProvidersFound] = useState(0);
  const hasNavigated = useRef(false);

  const steps = language === 'es' 
    ? ['Verificando disponibilidad...', 'Buscando proveedores...', 'Validando credenciales...', '¡Proveedor encontrado!']
    : ['Checking availability...', 'Searching providers...', 'Validating credentials...', 'Provider found!'];

  // Get state on mount
  useEffect(() => {
    const stateData = sessionStorage.getItem('intake_state');
    if (stateData) {
      try {
        const parsed = JSON.parse(stateData);
        // Map state codes back to full names for display
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
        setStateName(stateNames[parsed.state] || parsed.state || 'your area');
      } catch {
        setStateName('your area');
      }
    }
  }, []);

  // Animate progress bar
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1.5;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  // Cycle through steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 900);

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  // Animate providers found counter
  useEffect(() => {
    const counterInterval = setInterval(() => {
      setProvidersFound(prev => {
        if (prev >= 12) return 12;
        return prev + 1;
      });
    }, 250);

    return () => clearInterval(counterInterval);
  }, []);

  // Handle navigation after delay
  useEffect(() => {
    const navigationTimer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/name');
      }
    }, 4000);

    return () => {
      clearTimeout(navigationTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#faf9f7] to-[#f5ecd8]/30 flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Location icon with pulse */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Pulse rings */}
            <div className="absolute inset-0 w-32 h-32 -m-4">
              <div className="absolute inset-0 rounded-full bg-[#cab172]/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-2 rounded-full bg-[#cab172]/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
            </div>
            
            {/* Main icon container */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-[#cab172] to-[#f7d06b] rounded-full flex items-center justify-center shadow-lg">
              {/* Location/Search icon */}
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              
              {/* Checkmark overlay when complete */}
              {progress >= 100 && (
                <div className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main text */}
        <h1 className="text-[24px] lg:text-[28px] font-semibold text-[#413d3d] mb-2">
          {language === 'es' ? 'Buscando un proveedor' : 'Finding a licensed provider'}
        </h1>
        <p className="text-[20px] lg:text-[24px] text-[#cab172] font-medium mb-8">
          {language === 'es' ? `en ${stateName}` : `in ${stateName}`}
        </p>

        {/* Progress bar */}
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-[#cab172] to-[#f7d06b] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="h-full w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{
                animation: 'shimmer 1.5s ease-in-out infinite',
                transform: `translateX(${progress * 3}px)`
              }}
            />
          </div>
        </div>

        {/* Step indicator */}
        <p className="text-sm font-medium text-[#cab172] mb-6 h-5">
          {steps[currentStep]}
        </p>

        {/* Provider cards animation */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-16 h-20 rounded-xl transition-all duration-500 flex flex-col items-center justify-center ${
                providersFound > i * 4 ? 'bg-[#f5ecd8] scale-100 opacity-100' : 'bg-gray-100 scale-90 opacity-50'
              }`}
              style={{
                transitionDelay: `${i * 150}ms`
              }}
            >
              {/* Doctor icon */}
              <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center transition-all ${
                providersFound > i * 4 ? 'bg-[#cab172]' : 'bg-gray-300'
              }`}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              {providersFound > i * 4 && (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Providers found counter */}
        <div className="text-center">
          <span className="text-3xl font-bold text-[#cab172]">{providersFound}</span>
          <span className="text-gray-500 ml-2">
            {language === 'es' ? 'proveedores disponibles' : 'providers available'}
          </span>
        </div>

        {/* Bottom dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#cab172]"
              style={{
                animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(400px); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

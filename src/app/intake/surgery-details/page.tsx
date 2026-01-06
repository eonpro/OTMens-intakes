'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';

export default function SurgeryDetailsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const surgeryOptions = [
    { 
      id: 'gastric_bypass', 
      es: 'Bypass gástrico (Roux-en-Y)', 
      en: 'Gastric bypass (Roux-en-Y)' 
    },
    { 
      id: 'duodenal_switch', 
      es: 'Cambio duodenal', 
      en: 'Duodenal switch' 
    },
    { 
      id: 'lap_band', 
      es: 'Banda gástrica (Lap Band)', 
      en: 'Gastric band (Lap Band)' 
    },
    { 
      id: 'gastric_sleeve', 
      es: 'Manga gástrica', 
      en: 'Gastric sleeve' 
    },
    { 
      id: 'intestinal_surgery', 
      es: 'Cirugía intestinal', 
      en: 'Intestinal surgery' 
    },
    { 
      id: 'none', 
      es: 'No, ninguno de estos', 
      en: 'No, none of these' 
    }
  ];

  const handleToggle = (optionId: string) => {
    if (optionId === 'none') {
      // Auto-advance when "none" is selected
      setSelectedItems(['none']);
      sessionStorage.setItem('surgery_details', JSON.stringify(['none']));
      setTimeout(() => {
        router.push('/intake/blood-pressure');
      }, 200);
    } else {
      if (selectedItems.includes('none')) {
        setSelectedItems([optionId]);
      } else {
        if (selectedItems.includes(optionId)) {
          setSelectedItems(selectedItems.filter(item => item !== optionId));
        } else {
          setSelectedItems([...selectedItems, optionId]);
        }
      }
    }
  };

  const handleContinue = () => {
    if (selectedItems.length > 0) {
      sessionStorage.setItem('surgery_details', JSON.stringify(selectedItems));
      router.push('/intake/blood-pressure');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[79%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/surgery" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <EonmedsLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Ha tenido alguna cirugía o procedimiento médico?'
              : 'Have you had any surgery or medical procedure?'}
          </h1>

          <div className="space-y-3">
            {surgeryOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleToggle(option.id)}
                className={`w-full p-4 text-left rounded-2xl transition-all flex items-center ${
                  selectedItems.includes(option.id)
                    ? 'bg-[#f5ecd8] border border-[#cab172]'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-all ${
                  selectedItems.includes(option.id) ? 'bg-white border-[#413d3d]' : 'bg-white border-gray-300'
                }`}>
                  {selectedItems.includes(option.id) && (
                    <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-base lg:text-lg font-medium text-[#413d3d]">
                  {language === 'es' ? option.es : option.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom button - only show if items other than 'none' are selected */}
      {selectedItems.length > 0 && !selectedItems.includes('none') && (
        <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-2xl mx-auto w-full">
          <button 
            onClick={handleContinue}
            className="w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-center space-x-3 transition-all bg-[#413d3d] hover:bg-[#2a2727]"
            style={{ color: '#ffffff' }}
          >
            <span style={{ color: '#ffffff' }}>{language === 'es' ? 'Continuar' : 'Continue'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          {/* Copyright text */}
          <CopyrightText className="mt-4" />
        </div>
      )}
      
      {/* Copyright when no button shown */}
      {(selectedItems.length === 0 || selectedItems.includes('none')) && (
        <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-2xl mx-auto w-full">
          <CopyrightText />
        </div>
      )}
    </div>
  );
}

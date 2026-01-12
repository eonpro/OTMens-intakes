'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';
import BMIWidget from '@/components/BMIWidget';
import { submitCheckpoint, markCheckpointCompleted } from '@/lib/api';

export default function BMIResultPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [bmi, setBmi] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [idealWeight, setIdealWeight] = useState(0);
  const [heightStr, setHeightStr] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showBmiInfo, setShowBmiInfo] = useState(false);

  useEffect(() => {
    // Get data from session storage
    const nameData = sessionStorage.getItem('intake_name');
    const weightData = sessionStorage.getItem('intake_current_weight');
    const idealWeightData = sessionStorage.getItem('intake_ideal_weight');
    const heightData = sessionStorage.getItem('intake_height');
    
    if (nameData) {
      setFirstName(JSON.parse(nameData).firstName);
    }
    
    if (weightData && heightData) {
      const weight = parseInt(weightData);
      const height = JSON.parse(heightData);
      const totalInches = parseInt(height.feet) * 12 + parseInt(height.inches);
      
      // Calculate BMI: (weight / (height^2)) * 703
      const calculatedBMI = (weight / (totalInches * totalInches)) * 703;
      const finalBMI = Math.round(calculatedBMI * 100) / 100;
      setBmi(finalBMI);
      setCurrentWeight(weight);
      setHeightStr(`${height.feet}'${height.inches}"`);
      
      // Submit BMI checkpoint
      const checkpointData = {
        bmi: finalBMI,
        currentWeight: weight,
        idealWeight: parseInt(idealWeightData || '0'),
        height: `${height.feet}'${height.inches}"`,
        weightToLose: weight - parseInt(idealWeightData || '0'),
        timestamp: new Date().toISOString()
      };
      
      submitCheckpoint('bmi-calculation', checkpointData, 'partial').catch(err => {
        console.error('BMI checkpoint submission failed:', err);
      });
      markCheckpointCompleted('bmi-calculation');
    }
    
    if (idealWeightData) {
      setIdealWeight(parseInt(idealWeightData));
    }
  }, []);

  const weightToLose = currentWeight - idealWeight;
  const goalBMI = idealWeight && currentWeight ? 
    Math.round(((idealWeight / Math.pow((parseInt(heightStr.split("'")[0]) * 12 + parseInt(heightStr.split("'")[1] || '0')), 2)) * 703) * 100) / 100 : 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-4/6 bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/current-weight" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* OTMens Logo */}
      <OTMensLogo compact={true} />
      
      <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 pb-6 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-5">
          {/* Header Text */}
          <div className="text-left mb-5">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[#413d3d] leading-tight">
              {t('bmi.result.header.line1')}<br/>
              {t('bmi.result.header.line2')}<br/>
              {t('bmi.result.header.line3')}<br/>
              {t('bmi.result.header.line4')}
            </h2>
          </div>
          
          {/* BMI Result Card */}
          <div className="bg-[#f5ecd8] rounded-3xl p-5 space-y-3">
            <h1 className="text-[22px] font-semibold text-black">
              <span className="text-[#cab172]">{firstName || 'firstname'}</span>, {t('bmi.result.yourBMI')} {t('bmi.result.is')}
            </h1>
            
            <div className="text-5xl font-bold text-[#cab172]">{bmi ? bmi.toFixed(2) : 'NaN'}</div>
            
            <div className="space-y-0.5 text-sm text-black">
              <p className="font-normal">{t('bmi.result.currentWeight')}: <span className="text-[#cab172]">{currentWeight ? `${currentWeight} ${t('common.lbs')}` : 'starting_weight lbs'}</span></p>
              <p className="font-normal">{t('bmi.result.height')}: <span className="text-[#cab172]">{heightStr || 'feet\'inches"'}</span></p>
            </div>
            
            <p className="text-[12px] text-gray-500 font-normal leading-snug pt-2">
              {t('bmi.result.disclaimer')}
            </p>
            
            {/* BMI Range Bar - Clean Widget */}
            <BMIWidget bmi={bmi} language={language as 'en' | 'es'} />
            
            {/* Approval Message */}
            <div className="bg-[#EFECE7] rounded-2xl p-4 flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#cab172] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-black font-normal leading-snug pt-1">
                {t('bmi.result.fallsWithinRange')}
              </p>
            </div>
          </div>

          {/* Goal Card */}
          <div className="bg-[#EFECE7] rounded-3xl p-5 space-y-3">
            <h2 className="text-lg font-semibold text-black">{t('bmi.result.yourGoal')}</h2>
            <div className="text-5xl font-bold text-[#cab172]">{weightToLose ? `${Math.abs(weightToLose).toFixed(2)}` : '0.00'} {t('common.lbs')}</div>
            <p className="text-sm text-black font-normal">{t('bmi.result.averageLoss')}</p>
            
            <div className="space-y-2 pt-2">
              <p className="text-base font-normal text-black">{t('bmi.result.bmiGoal')} <span className="text-[#cab172] font-semibold">{goalBMI ? goalBMI.toFixed(2) : 'NaN'}</span></p>
              
              {/* Expandable BMI Info */}
              <button 
                onClick={() => setShowBmiInfo(!showBmiInfo)}
                className="flex items-center gap-1 text-[#cab172] text-sm font-medium"
              >
                <span className="underline">{t('bmi.result.whyImportant')}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${showBmiInfo ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Expandable Info Box */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showBmiInfo ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[#f5ecd8] rounded-xl p-3 mt-1 border border-[#cab172]/20">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {language === 'es' 
                      ? 'El IMC es una medida de la grasa corporal basada en la altura y el peso. Los médicos lo usan para evaluar riesgos de salud relacionados con el peso y determinar tratamientos apropiados.'
                      : 'BMI is a measure of body fat based on height and weight. Doctors use it to assess weight-related health risks and determine appropriate treatments for conditions like heart disease and diabetes.'}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-black font-normal leading-relaxed">{t('bmi.result.doctorsUse')}</p>
            </div>

            {/* Doctor Image */}
            <div className="flex items-center space-x-4 bg-[#f5ecd8] rounded-2xl p-4 mt-3">
              <img 
                src="https://static.wixstatic.com/media/c49a9b_5b7eb6087f204fb488efae8b63ec6f5f~mv2.webp"
                alt="Doctor"
                className="rounded-full object-cover flex-shrink-0"
                style={{ width: '100px', height: '100px' }}
              />
              <p className="text-[13px] text-black font-normal leading-snug">
                {t('bmi.result.restAssured')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 lg:px-8 pt-4 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={() => router.push('/intake/medical-history-overview')}
          className="continue-button"
        >
          <span className="text-white">{t('bmi.result.continue')}</span>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright text */}
        <p className="copyright-text text-center mt-4">
          © 2025 Overtime Men's Health. All rights reserved.
          Exclusive and protected process.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';
import { submitCheckpoint, markCheckpointCompleted } from '@/lib/api';

export default function ChronicConditionsDetailPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredConditions, setFilteredConditions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Common chronic conditions
  const chronicConditions = language === 'es' ? [
    // Cardiovascular
    'Hipertensión', 'Hipotensión', 'Enfermedad cardíaca', 'Insuficiencia cardíaca', 
    'Arritmia', 'Fibrilación auricular', 'Angina de pecho', 'Infarto de miocardio',
    'Enfermedad arterial periférica', 'Aneurisma', 'Trombosis venosa profunda',
    
    // Diabetes & Metabolic
    'Diabetes tipo 1', 'Diabetes tipo 2', 'Prediabetes', 'Diabetes gestacional',
    'Síndrome metabólico', 'Obesidad', 'Resistencia a la insulina',
    
    // Respiratory
    'Asma', 'EPOC', 'Enfisema', 'Bronquitis crónica', 'Apnea del sueño',
    'Fibrosis pulmonar', 'Sarcoidosis', 'Hipertensión pulmonar', 'Neumonía recurrente',
    
    // Kidney & Urinary
    'Enfermedad renal crónica', 'Cálculos renales', 'Infecciones urinarias recurrentes',
    'Incontinencia urinaria', 'Nefropatía diabética', 'Síndrome nefrótico',
    
    // Liver & Digestive
    'Cirrosis hepática', 'Hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Hígado graso',
    'Enfermedad de Crohn', 'Colitis ulcerosa', 'Síndrome del intestino irritable',
    'Reflujo gastroesofágico', 'Úlcera péptica', 'Gastritis crónica', 'Celiaquía',
    'Diverticulitis', 'Pancreatitis crónica', 'Cálculos biliares',
    
    // Musculoskeletal
    'Artritis reumatoide', 'Osteoartritis', 'Fibromialgia', 'Gota', 'Lupus',
    'Osteoporosis', 'Espondilitis anquilosante', 'Artritis psoriásica', 'Bursitis',
    'Tendinitis crónica', 'Síndrome del túnel carpiano', 'Hernia discal',
    
    // Neurological
    'Migraña', 'Epilepsia', 'Parkinson', 'Alzheimer', 'Esclerosis múltiple',
    'Neuropatía periférica', 'Neuralgia', 'Accidente cerebrovascular', 'ACV/Derrame',
    'Demencia', 'Síndrome de piernas inquietas', 'Vértigo crónico', 'Miastenia gravis',
    
    // Mental Health
    'Depresión', 'Ansiedad', 'Trastorno bipolar', 'Esquizofrenia', 'TDAH',
    'Trastorno de estrés postraumático', 'Trastorno obsesivo-compulsivo',
    'Trastorno de pánico', 'Insomnio crónico', 'Trastorno alimentario',
    
    // Endocrine
    'Hipotiroidismo', 'Hipertiroidismo', 'Enfermedad de Hashimoto', 'Enfermedad de Graves',
    'Síndrome de ovario poliquístico', 'Enfermedad de Addison', 'Síndrome de Cushing',
    'Hipogonadismo', 'Acromegalia', 'Prolactinoma',
    
    // Blood & Immune
    'Anemia', 'Anemia falciforme', 'Talasemia', 'Hemofilia', 'Leucemia',
    'Linfoma', 'Mieloma múltiple', 'Trombocitopenia', 'VIH/SIDA',
    'Artritis reactiva', 'Síndrome de Sjögren', 'Esclerodermia',
    
    // Skin
    'Psoriasis', 'Eczema', 'Dermatitis atópica', 'Rosácea', 'Vitíligo',
    'Melanoma', 'Carcinoma basocelular', 'Acné crónico', 'Hidradenitis supurativa',
    
    // Cancer
    'Cáncer de mama', 'Cáncer de pulmón', 'Cáncer de próstata', 'Cáncer colorrectal',
    'Cáncer de páncreas', 'Cáncer de hígado', 'Cáncer de riñón', 'Cáncer de vejiga',
    'Cáncer de tiroides', 'Cáncer de ovario', 'Cáncer cervical', 'Cáncer de estómago',
    
    // Other
    'Colesterol alto', 'Triglicéridos altos', 'Glaucoma', 'Cataratas',
    'Degeneración macular', 'Pérdida auditiva', 'Tinnitus', 'Endometriosis',
    'Síndrome de fatiga crónica', 'Herpes crónico', 'Tuberculosis'
  ] : [
    // Cardiovascular
    'Hypertension', 'Hypotension', 'Heart disease', 'Heart failure', 
    'Arrhythmia', 'Atrial fibrillation', 'Angina', 'Heart attack',
    'Peripheral artery disease', 'Aneurysm', 'Deep vein thrombosis',
    
    // Diabetes & Metabolic
    'Type 1 diabetes', 'Type 2 diabetes', 'Prediabetes', 'Gestational diabetes',
    'Metabolic syndrome', 'Obesity', 'Insulin resistance',
    
    // Respiratory
    'Asthma', 'COPD', 'Emphysema', 'Chronic bronchitis', 'Sleep apnea',
    'Pulmonary fibrosis', 'Sarcoidosis', 'Pulmonary hypertension', 'Recurrent pneumonia',
    
    // Kidney & Urinary
    'Chronic kidney disease', 'Kidney stones', 'Recurrent UTIs',
    'Urinary incontinence', 'Diabetic nephropathy', 'Nephrotic syndrome',
    
    // Liver & Digestive
    'Cirrhosis', 'Hepatitis A', 'Hepatitis B', 'Hepatitis C', 'Fatty liver disease',
    'Crohn\'s disease', 'Ulcerative colitis', 'Irritable bowel syndrome',
    'GERD', 'Peptic ulcer', 'Chronic gastritis', 'Celiac disease',
    'Diverticulitis', 'Chronic pancreatitis', 'Gallstones',
    
    // Musculoskeletal
    'Rheumatoid arthritis', 'Osteoarthritis', 'Fibromyalgia', 'Gout', 'Lupus',
    'Osteoporosis', 'Ankylosing spondylitis', 'Psoriatic arthritis', 'Bursitis',
    'Chronic tendinitis', 'Carpal tunnel syndrome', 'Herniated disc',
    
    // Neurological
    'Migraine', 'Epilepsy', 'Parkinson\'s disease', 'Alzheimer\'s disease', 'Multiple sclerosis',
    'Peripheral neuropathy', 'Neuralgia', 'Stroke', 'TIA/Mini-stroke',
    'Dementia', 'Restless leg syndrome', 'Chronic vertigo', 'Myasthenia gravis',
    
    // Mental Health
    'Depression', 'Anxiety', 'Bipolar disorder', 'Schizophrenia', 'ADHD',
    'PTSD', 'OCD', 'Panic disorder', 'Chronic insomnia', 'Eating disorder',
    
    // Endocrine
    'Hypothyroidism', 'Hyperthyroidism', 'Hashimoto\'s disease', 'Graves\' disease',
    'PCOS', 'Addison\'s disease', 'Cushing\'s syndrome',
    'Hypogonadism', 'Acromegaly', 'Prolactinoma',
    
    // Blood & Immune
    'Anemia', 'Sickle cell disease', 'Thalassemia', 'Hemophilia', 'Leukemia',
    'Lymphoma', 'Multiple myeloma', 'Thrombocytopenia', 'HIV/AIDS',
    'Reactive arthritis', 'Sjögren\'s syndrome', 'Scleroderma',
    
    // Skin
    'Psoriasis', 'Eczema', 'Atopic dermatitis', 'Rosacea', 'Vitiligo',
    'Melanoma', 'Basal cell carcinoma', 'Chronic acne', 'Hidradenitis suppurativa',
    
    // Cancer
    'Breast cancer', 'Lung cancer', 'Prostate cancer', 'Colorectal cancer',
    'Pancreatic cancer', 'Liver cancer', 'Kidney cancer', 'Bladder cancer',
    'Thyroid cancer', 'Ovarian cancer', 'Cervical cancer', 'Stomach cancer',
    
    // Other
    'High cholesterol', 'High triglycerides', 'Glaucoma', 'Cataracts',
    'Macular degeneration', 'Hearing loss', 'Tinnitus', 'Endometriosis',
    'Chronic fatigue syndrome', 'Chronic herpes', 'Tuberculosis'
  ];

  // Filter conditions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredConditions([]);
      setShowSuggestions(false);
    } else {
      const filtered = chronicConditions
        .filter(condition => 
          condition.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedConditions.includes(condition)
        )
        .slice(0, 5); // Show max 5 suggestions
      setFilteredConditions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  }, [searchTerm, selectedConditions]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddCondition = (condition: string) => {
    if (!selectedConditions.includes(condition)) {
      setSelectedConditions([...selectedConditions, condition]);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveCondition = (condition: string) => {
    setSelectedConditions(selectedConditions.filter(c => c !== condition));
  };

  const handleContinue = () => {
    sessionStorage.setItem('chronic_conditions', JSON.stringify(selectedConditions));
    
    // Submit medical history checkpoint
    const checkpointData = {
      chronicConditions: selectedConditions,
      timestamp: new Date().toISOString()
    };
    
    submitCheckpoint('medical-history', checkpointData, 'partial').catch(err => {
      console.error('Medical history checkpoint submission failed:', err);
    });
    markCheckpointCompleted('medical-history');
    
    router.push('/intake/digestive-conditions');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[82%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/chronic-conditions" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          {/* Title */}
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Qué tipo de condición o enfermedad crónica padeces?'
              : 'What type of chronic condition or disease do you have?'}
          </h1>
          
          {/* Search input with autocomplete */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'es' ? 'Condición cronica' : 'Chronic condition'}
              className="w-full p-4 text-base md:text-lg border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-400"
              onFocus={() => {
                if (filteredConditions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            
            {/* Autocomplete suggestions */}
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto"
              >
                {filteredConditions.map((condition, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddCondition(condition)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-base">{condition}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Selected conditions */}
          {selectedConditions.length > 0 && (
            <div className="space-y-2">
              {selectedConditions.map((condition, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#f5ecd8] rounded-xl"
                >
                  <span className="text-base font-medium">{condition}</span>
                  <button
                    onClick={() => handleRemoveCondition(condition)}
                    className="ml-3 p-1 hover:bg-black/10 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Continue button */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleContinue}
          className="continue-button"
        >
          <span>{language === 'es' ? 'Continuar' : 'Continue'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <p className="copyright-text">
            {language === 'es' ? (
              <>
                © 2025 EONPro, LLC. Todos los derechos reservados.<br/>
                Proceso exclusivo y protegido. Copiar o reproducir sin autorización está prohibido.
              </>
            ) : (
              <>
                © 2025 EONPro, LLC. All rights reserved.<br/>
                Exclusive and protected process. Copying or reproduction without authorization is prohibited.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
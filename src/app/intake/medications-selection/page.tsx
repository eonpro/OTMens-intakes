'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import EonmedsLogo from '@/components/EonmedsLogo';

// Comprehensive medication and supplement database
const medicationsDatabase = {
  es: [
    // Analgésicos y antiinflamatorios
    'Aspirina', 'Paracetamol', 'Acetaminofén', 'Ibuprofeno', 'Naproxeno',
    'Diclofenaco', 'Ketorolaco', 'Indometacina', 'Celecoxib', 'Meloxicam',
    'Tramadol', 'Codeína', 'Morfina', 'Oxicodona', 'Fentanilo',
    
    // Antibióticos
    'Amoxicilina', 'Ampicilina', 'Penicilina', 'Cefalexina', 'Ciprofloxacino',
    'Levofloxacino', 'Azitromicina', 'Claritromicina', 'Doxiciclina', 'Metronidazol',
    'Clindamicina', 'Vancomicina', 'Gentamicina', 'Cotrimoxazol', 'Nitrofurantoína',
    
    // Cardiovasculares
    'Losartán', 'Valsartán', 'Telmisartán', 'Lisinopril', 'Enalapril', 'Captopril',
    'Amlodipino', 'Nifedipino', 'Diltiazem', 'Verapamilo', 'Atenolol', 'Metoprolol',
    'Propranolol', 'Carvedilol', 'Bisoprolol', 'Furosemida', 'Hidroclorotiazida',
    'Espironolactona', 'Digoxina', 'Nitroglicerina', 'Isosorbida',
    
    // Diabetes
    'Metformina', 'Glibenclamida', 'Glimepirida', 'Sitagliptina', 'Linagliptina',
    'Empagliflozina', 'Dapagliflozina', 'Liraglutida', 'Semaglutida', 'Insulina',
    'Insulina NPH', 'Insulina glargina', 'Insulina lispro', 'Insulina aspart',
    
    // Colesterol
    'Atorvastatina', 'Simvastatina', 'Rosuvastatina', 'Pravastatina', 'Lovastatina',
    'Ezetimiba', 'Fenofibrato', 'Gemfibrozilo', 'Colestiramina', 'Evolocumab',
    
    // Gastrointestinales
    'Omeprazol', 'Esomeprazol', 'Lansoprazol', 'Pantoprazol', 'Rabeprazol',
    'Ranitidina', 'Famotidina', 'Sucralfato', 'Bismuto', 'Loperamida',
    'Metoclopramida', 'Domperidona', 'Ondansetrón', 'Lactulosa', 'Psyllium',
    
    // Psiquiátricos y neurológicos
    'Alprazolam', 'Clonazepam', 'Lorazepam', 'Diazepam', 'Bromazepam',
    'Sertralina', 'Fluoxetina', 'Paroxetina', 'Escitalopram', 'Citalopram',
    'Venlafaxina', 'Duloxetina', 'Bupropión', 'Mirtazapina', 'Trazodona',
    'Quetiapina', 'Olanzapina', 'Risperidona', 'Aripiprazol', 'Litio',
    'Gabapentina', 'Pregabalina', 'Carbamazepina', 'Valproato', 'Lamotrigina',
    'Levetiracetam', 'Topiramato', 'Zolpidem', 'Eszopiclona', 'Melatonina',
    
    // Hormonales y tiroideos
    'Levotiroxina', 'Liotironina', 'Metimazol', 'Propiltiouracilo',
    'Prednisona', 'Prednisolona', 'Dexametasona', 'Hidrocortisona', 'Betametasona',
    'Testosterona', 'Estradiol', 'Progesterona', 'Tibolona', 'Raloxifeno',
    
    // Respiratorios
    'Salbutamol', 'Budesonida', 'Fluticasona', 'Beclometasona', 'Montelukast',
    'Tiotropio', 'Formoterol', 'Salmeterol', 'Teofilina', 'Bromhexina',
    'Ambroxol', 'N-acetilcisteína', 'Dextrometorfano', 'Guaifenesina',
    
    // Alérgicos
    'Loratadina', 'Cetirizina', 'Fexofenadina', 'Desloratadina', 'Levocetirizina',
    'Difenhidramina', 'Clorfeniramina', 'Hidroxizina', 'Ketotifeno', 'Cromoglicato',
    
    // Anticonceptivos
    'Píldoras anticonceptivas', 'Yasmin', 'Diane 35', 'Microgynon', 'Nordette',
    'Belara', 'Marvelon', 'Femiane', 'Levonorgestrel', 'Depo-Provera',
    'Implanon', 'Mirena', 'NuvaRing', 'Parche anticonceptivo',
    
    // Vitaminas y minerales
    'Vitamina A', 'Tiamina B1', 'Riboflavina B2', 'Niacina B3', 'Ácido pantoténico B5',
    'Piridoxina B6', 'Biotina B7', 'Ácido fólico B9', 'Cobalamina B12', 'Vitamina C',
    'Vitamina D', 'Vitamina D3', 'Vitamina E', 'Vitamina K', 'Complejo B',
    'Multivitamínico', 'Calcio', 'Calcio con vitamina D', 'Hierro', 'Sulfato ferroso',
    'Magnesio', 'Zinc', 'Potasio', 'Selenio', 'Yodo', 'Cobre', 'Cromo', 'Manganeso',
    
    // Suplementos herbales y naturales
    'Omega 3', 'Aceite de pescado', 'Aceite de krill', 'Probióticos', 'Prebióticos',
    'Colágeno', 'Glucosamina', 'Condroitina', 'MSM', 'Ácido hialurónico',
    'Coenzima Q10', 'Resveratrol', 'Curcumina', 'Valeriana', 'Pasiflora',
    'Ginseng', 'Ginkgo biloba', 'Echinacea', 'Ajo', 'Cúrcuma', 'Jengibre',
    'Saw palmetto', 'Cardo mariano', 'Té verde', 'Garcinia cambogia',
    'Spirulina', 'Chlorella', 'Maca', 'Ashwagandha', 'Rhodiola',
    
    // Suplementos deportivos
    'Proteína de suero', 'Proteína de caseína', 'Proteína vegetal', 'Creatina',
    'L-carnitina', 'L-arginina', 'L-glutamina', 'BCAA', 'Beta-alanina',
    'Cafeína', 'Pre-entreno', 'Óxido nítrico', 'HMB', 'CLA',
    
    // Otros
    'Warfarina', 'Clopidogrel', 'Rivaroxabán', 'Apixabán', 'Dabigatrán',
    'Alopurinol', 'Colchicina', 'Finasterida', 'Dutasterida', 'Minoxidil',
    'Sildenafil', 'Tadalafil', 'Tamsulosina', 'Isotretinoína', 'Adapaleno'
  ],
  en: [
    // Pain relievers and anti-inflammatories
    'Aspirin', 'Acetaminophen', 'Tylenol', 'Ibuprofen', 'Advil', 'Motrin',
    'Naproxen', 'Aleve', 'Diclofenac', 'Ketorolac', 'Indomethacin', 'Celecoxib',
    'Meloxicam', 'Tramadol', 'Codeine', 'Morphine', 'Oxycodone', 'Hydrocodone',
    'Fentanyl', 'Gabapentin', 'Pregabalin',
    
    // Antibiotics
    'Amoxicillin', 'Augmentin', 'Ampicillin', 'Penicillin', 'Cephalexin',
    'Ciprofloxacin', 'Levofloxacin', 'Azithromycin', 'Z-Pack', 'Clarithromycin',
    'Doxycycline', 'Metronidazole', 'Clindamycin', 'Vancomycin', 'Gentamicin',
    'Bactrim', 'Nitrofurantoin', 'Ceftriaxone', 'Cefdinir',
    
    // Cardiovascular
    'Losartan', 'Valsartan', 'Telmisartan', 'Lisinopril', 'Enalapril', 'Captopril',
    'Benazepril', 'Ramipril', 'Amlodipine', 'Nifedipine', 'Diltiazem', 'Verapamil',
    'Atenolol', 'Metoprolol', 'Propranolol', 'Carvedilol', 'Bisoprolol', 'Nebivolol',
    'Furosemide', 'Lasix', 'Hydrochlorothiazide', 'HCTZ', 'Spironolactone',
    'Digoxin', 'Nitroglycerin', 'Isosorbide',
    
    // Diabetes
    'Metformin', 'Glucophage', 'Glyburide', 'Glipizide', 'Glimepiride',
    'Sitagliptin', 'Januvia', 'Linagliptin', 'Saxagliptin', 'Empagliflozin',
    'Jardiance', 'Dapagliflozin', 'Farxiga', 'Liraglutide', 'Victoza',
    'Semaglutide', 'Ozempic', 'Wegovy', 'Insulin', 'Lantus', 'Humalog',
    'Novolog', 'Levemir', 'Tresiba',
    
    // Cholesterol
    'Atorvastatin', 'Lipitor', 'Simvastatin', 'Zocor', 'Rosuvastatin', 'Crestor',
    'Pravastatin', 'Lovastatin', 'Ezetimibe', 'Zetia', 'Fenofibrate', 'Gemfibrozil',
    'Cholestyramine', 'Colesevelam', 'Evolocumab', 'Repatha', 'Alirocumab',
    
    // Gastrointestinal
    'Omeprazole', 'Prilosec', 'Esomeprazole', 'Nexium', 'Lansoprazole', 'Prevacid',
    'Pantoprazole', 'Protonix', 'Rabeprazole', 'Ranitidine', 'Zantac', 'Famotidine',
    'Pepcid', 'Sucralfate', 'Bismuth', 'Pepto-Bismol', 'Loperamide', 'Imodium',
    'Metoclopramide', 'Reglan', 'Ondansetron', 'Zofran', 'Promethazine', 'Phenergan',
    'Docusate', 'Colace', 'Senna', 'Miralax', 'Lactulose', 'Psyllium', 'Metamucil',
    
    // Psychiatric and neurological
    'Alprazolam', 'Xanax', 'Clonazepam', 'Klonopin', 'Lorazepam', 'Ativan',
    'Diazepam', 'Valium', 'Sertraline', 'Zoloft', 'Fluoxetine', 'Prozac',
    'Paroxetine', 'Paxil', 'Escitalopram', 'Lexapro', 'Citalopram', 'Celexa',
    'Venlafaxine', 'Effexor', 'Duloxetine', 'Cymbalta', 'Bupropion', 'Wellbutrin',
    'Mirtazapine', 'Remeron', 'Trazodone', 'Buspirone', 'Buspar',
    'Quetiapine', 'Seroquel', 'Olanzapine', 'Zyprexa', 'Risperidone', 'Risperdal',
    'Aripiprazole', 'Abilify', 'Lithium', 'Lamotrigine', 'Lamictal',
    'Carbamazepine', 'Tegretol', 'Valproic acid', 'Depakote', 'Levetiracetam', 'Keppra',
    'Topiramate', 'Topamax', 'Zolpidem', 'Ambien', 'Eszopiclone', 'Lunesta',
    
    // Hormonal and thyroid
    'Levothyroxine', 'Synthroid', 'Liothyronine', 'Cytomel', 'Methimazole',
    'Propylthiouracil', 'Prednisone', 'Prednisolone', 'Dexamethasone', 'Hydrocortisone',
    'Betamethasone', 'Methylprednisolone', 'Testosterone', 'Estradiol', 'Premarin',
    'Progesterone', 'Prometrium', 'Raloxifene', 'Evista', 'Tamoxifen',
    
    // Respiratory
    'Albuterol', 'ProAir', 'Ventolin', 'Budesonide', 'Pulmicort', 'Fluticasone',
    'Flovent', 'Advair', 'Symbicort', 'Montelukast', 'Singulair', 'Tiotropium',
    'Spiriva', 'Ipratropium', 'Atrovent', 'Theophylline', 'Guaifenesin', 'Mucinex',
    'Dextromethorphan', 'Benzonatate', 'Tessalon',
    
    // Allergy
    'Loratadine', 'Claritin', 'Cetirizine', 'Zyrtec', 'Fexofenadine', 'Allegra',
    'Desloratadine', 'Clarinex', 'Levocetirizine', 'Xyzal', 'Diphenhydramine',
    'Benadryl', 'Chlorpheniramine', 'Hydroxyzine', 'Atarax', 'Vistaril',
    'Montelukast', 'Singulair', 'Cromolyn', 'Azelastine', 'Astelin',
    
    // Birth control
    'Birth control pills', 'Yasmin', 'Yaz', 'Diane 35', 'Microgynon', 'Nordette',
    'Ortho Tri-Cyclen', 'Lo Loestrin', 'Sprintec', 'Plan B', 'Ella',
    'Depo-Provera', 'Nexplanon', 'Implanon', 'Mirena IUD', 'Skyla IUD',
    'Paragard IUD', 'NuvaRing', 'Xulane patch', 'Ortho Evra',
    
    // Vitamins and minerals
    'Vitamin A', 'Thiamine B1', 'Riboflavin B2', 'Niacin B3', 'Pantothenic acid B5',
    'Pyridoxine B6', 'Biotin B7', 'Folic acid B9', 'Cobalamin B12', 'Vitamin C',
    'Vitamin D', 'Vitamin D3', 'Vitamin E', 'Vitamin K', 'B Complex',
    'Multivitamin', 'Prenatal vitamins', 'Calcium', 'Calcium with D', 'Iron',
    'Ferrous sulfate', 'Magnesium', 'Zinc', 'Potassium', 'Selenium', 'Iodine',
    'Copper', 'Chromium', 'Manganese', 'Phosphorus',
    
    // Herbal and natural supplements
    'Omega 3', 'Fish oil', 'Krill oil', 'Probiotics', 'Prebiotics', 'Collagen',
    'Glucosamine', 'Chondroitin', 'MSM', 'Hyaluronic acid', 'Coenzyme Q10', 'CoQ10',
    'Resveratrol', 'Turmeric', 'Curcumin', 'Valerian root', 'Passionflower',
    'Ginseng', 'Ginkgo biloba', 'Echinacea', 'Garlic', 'Ginger', 'Cinnamon',
    'St. Johns Wort', 'Saw palmetto', 'Milk thistle', 'Green tea extract',
    'Garcinia cambogia', 'Spirulina', 'Chlorella', 'Maca root', 'Ashwagandha',
    'Rhodiola', 'Black cohosh', 'Evening primrose oil', 'Flaxseed oil',
    
    // Sports supplements
    'Whey protein', 'Casein protein', 'Plant protein', 'Creatine', 'L-carnitine',
    'L-arginine', 'L-glutamine', 'BCAA', 'Beta-alanine', 'Caffeine',
    'Pre-workout', 'Nitric oxide', 'HMB', 'CLA', 'L-citrulline',
    
    // Other medications
    'Warfarin', 'Coumadin', 'Clopidogrel', 'Plavix', 'Rivaroxaban', 'Xarelto',
    'Apixaban', 'Eliquis', 'Dabigatran', 'Pradaxa', 'Allopurinol', 'Colchicine',
    'Finasteride', 'Propecia', 'Proscar', 'Dutasteride', 'Avodart', 'Minoxidil',
    'Rogaine', 'Sildenafil', 'Viagra', 'Tadalafil', 'Cialis', 'Vardenafil',
    'Levitra', 'Tamsulosin', 'Flomax', 'Isotretinoin', 'Accutane', 'Adapalene',
    'Differin', 'Tretinoin', 'Retin-A', 'Modafinil', 'Provigil'
  ]
};

export default function MedicationsSelectionPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const medications = medicationsDatabase[language as 'es' | 'en'] || medicationsDatabase.en;

  useEffect(() => {
    // Filter suggestions based on search term
    if (searchTerm.trim()) {
      const filtered = medications
        .filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedMedications.includes(item)
        )
        .slice(0, 5); // Show max 5 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, selectedMedications, medications]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddMedication = (medication: string) => {
    if (!selectedMedications.includes(medication)) {
      setSelectedMedications([...selectedMedications, medication]);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleRemoveMedication = (medication: string) => {
    setSelectedMedications(selectedMedications.filter(c => c !== medication));
  };

  const handleContinue = () => {
    sessionStorage.setItem('current_medications', JSON.stringify(selectedMedications));
    router.push('/intake/allergies');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[87%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/medications" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <EonmedsLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Qué medicamentos o suplementos estás tomando?'
              : 'What medications or supplements are you currently taking?'}
          </h1>
          
          <p className="page-subtitle">
            {language === 'es'
              ? 'Incluye todos los medicamentos recetados, de venta libre, vitaminas y suplementos.'
              : 'Include all prescription medications, over-the-counter medications, vitamins, and supplements.'}
          </p>
          
          {/* Search input with autocomplete */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (filteredSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder={language === 'es' 
                ? 'Busca y selecciona tus medicamentos...'
                : 'Search and select your medications...'}
              className="w-full p-4 text-base md:text-lg border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-400"
            />
            
            {/* Autocomplete suggestions */}
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddMedication(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Selected medications */}
          {selectedMedications.length > 0 && (
            <div className="space-y-2">
              {selectedMedications.map((medication, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-base">{medication}</span>
                  <button
                    onClick={() => handleRemoveMedication(medication)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
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
      
      {/* Footer and Continue button */}
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

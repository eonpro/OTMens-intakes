'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EonmedsLogo from '@/components/EonmedsLogo';
import IntakePageLayout from '@/components/IntakePageLayout';
import CopyrightText from '@/components/CopyrightText';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function ContactInfoPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('US');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [consent, setConsent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', dialCode: '+1' }
  ];

  const selectedCountry = countries.find(c => c.code === country) || countries[0];

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation for US and Puerto Rico
  const validatePhone = (phone: string) => {
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (country === 'US' || country === 'PR') {
      // US and Puerto Rico phone: 10 digits
      return digitsOnly.length === 10;
    }
    return false;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    let formatted = digitsOnly;
    
    if (digitsOnly.length > 0) {
      if (digitsOnly.length <= 3) {
        formatted = digitsOnly;
      } else if (digitsOnly.length <= 6) {
        formatted = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
      } else {
        formatted = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 10)}`;
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (digitsOnly.length <= 10) {
      const formatted = formatPhoneNumber(digitsOnly);
      setPhone(formatted);
      // Clear error when user starts typing
      if (phoneError) {
        setPhoneError('');
      }
    }
  };

  const handleContinue = async () => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }


    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    
    // Set error messages if invalid
    if (!isEmailValid) {
      setEmailError(language === 'es' ? 'Por favor ingrese un email válido' : 'Please enter a valid email');
      return;
    }
    
    if (!isPhoneValid) {
      setPhoneError(language === 'es' ? 'Por favor ingrese un número de teléfono válido de 10 dígitos' : 'Please enter a valid 10-digit phone number');
      return;
    }
    
    if (!consent) {
      return;
    }

    // All validations passed, proceed with submission
    setIsSubmitting(true);
    
    try {
      // Save data to session storage
      const phoneDigitsOnly = phone.replace(/\D/g, '');
      const formattedPhone = '+1' + phoneDigitsOnly;
      
      sessionStorage.setItem('intake_contact', JSON.stringify({ 
        email, 
        phone: formattedPhone 
      }));
      
      
      // Collect all data available at this midpoint
      const nameData = sessionStorage.getItem('intake_name');
      const stateData = sessionStorage.getItem('intake_state');
      const dobData = sessionStorage.getItem('intake_dob');
      const addressData = sessionStorage.getItem('intake_address');
      const currentWeight = sessionStorage.getItem('intake_current_weight');
      const idealWeight = sessionStorage.getItem('intake_ideal_weight');
      const heightData = sessionStorage.getItem('intake_height');
      const goalsData = sessionStorage.getItem('intake_goals');
      const activityData = sessionStorage.getItem('intake_activity_level');
      const sexAssigned = sessionStorage.getItem('sex_assigned');
      
      // Parse data
      const parsedName = nameData ? JSON.parse(nameData) : {};
      const parsedState = stateData ? JSON.parse(stateData) : {};
      const parsedAddress = addressData ? JSON.parse(addressData) : {};
      const parsedHeight = heightData ? JSON.parse(heightData) : {};
      const parsedGoals = goalsData ? JSON.parse(goalsData) : [];
      const parsedDob = dobData ? JSON.parse(dobData) : {};
      
      // Calculate BMI - ensure height values are parsed as integers
      const weightLbs = currentWeight ? parseInt(currentWeight) : null;
      const heightFeet = parsedHeight.feet ? parseInt(parsedHeight.feet) : null;
      const heightInchesVal = parsedHeight.inches !== undefined && parsedHeight.inches !== '' 
        ? parseInt(parsedHeight.inches) 
        : 0;
      const heightInches = heightFeet 
        ? (heightFeet * 12) + heightInchesVal 
        : null;
      const bmi = weightLbs && heightInches 
        ? Math.round(((weightLbs / (heightInches * heightInches)) * 703) * 10) / 10 
        : null;
      
      // Format height string using parsed integer values for consistency with BMI calculation
      const heightString = heightFeet 
        ? `${heightFeet}'${heightInchesVal}"` 
        : '';
      
      // Format DOB
      const dobString = parsedDob.month && parsedDob.day && parsedDob.year
        ? `${parsedDob.month} ${parsedDob.day}, ${parsedDob.year}`
        : '';
      
      // Get or create session ID
      let sessionId = sessionStorage.getItem('intake_session_id');
      if (!sessionId) {
        // Generate OTMENS-MMDDYY-XXXXXX format
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        const randomDigits = String(Math.floor(100000 + Math.random() * 900000));
        sessionId = `OTMENS-${month}${day}${year}-${randomDigits}`;
        sessionStorage.setItem('intake_session_id', sessionId);
      }
      
      // Build midpoint checkpoint data for Airtable
      const midpointData = {
        sessionId,
        firstName: parsedName.firstName || '',
        lastName: parsedName.lastName || '',
        email,
        phone: formattedPhone,
        dob: dobString,
        sex: sexAssigned || '',
        state: parsedState.state || parsedAddress.state || '',
        address: parsedAddress.fullAddress || parsedAddress.street || '',
        apartment: parsedAddress.unit || '',
        currentWeight: weightLbs,
        idealWeight: idealWeight ? parseInt(idealWeight) : null,
        height: heightString,
        bmi,
        goals: Array.isArray(parsedGoals) ? parsedGoals.join(', ') : '',
        activityLevel: activityData || '',
        qualified: false, // Not yet qualified at midpoint
        flowLanguage: localStorage.getItem('preferredLanguage') || 'en',
      };
      
      
      // Submit midpoint data to Airtable (fire and forget - don't block navigation)
      fetch('/api/airtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(midpointData),
      })
        .then(res => res.json())
        .then(result => {
          if (result.success && result.recordId) {
            // Store the record ID for later update
            sessionStorage.setItem('airtable_record_id', result.recordId);
            sessionStorage.setItem('midpoint_submitted', 'true');
          } else {
            console.error('❌ Midpoint save failed:', result.error);
          }
        })
        .catch(err => {
          console.error('❌ Midpoint submission error:', err);
        });
      
      // Mark checkpoint as completed
      const completedCheckpoints = JSON.parse(
        sessionStorage.getItem('completed_checkpoints') || '[]'
      );
      if (!completedCheckpoints.includes('personal-info')) {
        completedCheckpoints.push('personal-info');
        sessionStorage.setItem('completed_checkpoints', JSON.stringify(completedCheckpoints));
      }
      
      
      // Navigate to next page immediately (don't wait for Airtable)
      router.push('/intake/support-info');
    } catch (error) {
      console.error('Error during submission:', error);
      // Even if there's an error, try to navigate
      router.push('/intake/support-info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressBar = (
    <div className="w-full h-1 bg-gray-100">
      <div className="h-full w-[16%] bg-[#f5ecd8] transition-all duration-300"></div>
    </div>
  );

  const backButton = (
    <Link href="/intake/dob" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </Link>
  );

  const continueButton = (
    <button 
      onClick={handleContinue}
      disabled={!email || !phone || !consent || isSubmitting}
      className={`continue-button ${
        (!email || !phone || !consent || isSubmitting) ? '!bg-gray-400 !cursor-not-allowed' : ''
      }`}
    >
      <span className="text-white">{isSubmitting ? (language === 'es' ? 'Procesando...' : 'Processing...') : (language === 'es' ? 'Continuar' : 'Continue')}</span>
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  );

  const copyrightText = <CopyrightText />;

  return (
    <IntakePageLayout
      progressBar={progressBar}
      backButton={backButton}
      button={continueButton}
      copyright={copyrightText}
    >
      <div className="max-w-md lg:max-w-2xl mx-auto w-full">
        {/* Logo - inside max-w wrapper for proper alignment */}
        <EonmedsLogo inline={true} />
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="page-title">
              {language === 'es' ? '¿Cómo podemos contactarte?' : 'How can we contact you?'}
            </h1>
            <p className="page-subtitle text-sm">
              {language === 'es' 
                ? 'Usamos esta información para mantenerte informado sobre tu tratamiento, enviarte actualizaciones importantes y ayudarte a mantenerte conectado con tu proveedor.'
                : 'We use this information to keep you informed about your treatment, send you important updates, and help you stay connected with your provider.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className={`input-field ${emailError ? '!border-red-500' : ''}`}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Phone Input with Country Code */}
            <div>
              <div className="flex space-x-2 w-full overflow-hidden">
                <div className="relative flex-shrink-0">
                  <button 
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="input-field flex items-center space-x-2 !w-auto"
                  >
                    <span className="text-2xl">{selectedCountry.flag}</span>
                    <span className="text-[16px] md:text-base font-medium">+1</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showCountryDropdown && (
                    <div className="absolute z-10 mt-2 w-48 bg-[#eae3db] border border-[#d2c7bb] rounded-2xl shadow-lg">
                      {countries.map(c => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCountry(c.code);
                            setShowCountryDropdown(false);
                            setPhone(''); // Reset phone when country changes
                            setPhoneError('');
                          }}
                          className={`w-full flex items-center space-x-3 p-3 hover:bg-[#d2c7bb]/50 first:rounded-t-2xl last:rounded-b-2xl ${
                            country === c.code ? 'bg-[#d2c7bb]/30' : ''
                          }`}
                        >
                          <span className="text-2xl">{c.flag}</span>
                          <span className="text-sm">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <input
                  type="tel"
                  placeholder="000 000 0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  inputMode="numeric"
                  className={`input-field flex-1 min-w-0 ${phoneError ? '!border-red-500' : ''}`}
                />
              </div>
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start">
              <button
                type="button"
                onClick={() => setConsent(!consent)}
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  consent ? 'bg-white' : 'bg-transparent'
                }`}
                style={{ border: '1.5px solid #413d3d' }}
              >
                {consent && (
                  <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="ml-3 text-sm text-gray-600 leading-relaxed">
                {language === 'es'
                  ? <>Acepto la <a href="#" className="text-[#cab172] underline">Política de Privacidad</a> y autorizo recibir comunicaciones importantes por correo electrónico y mensajes de texto (SMS) de EONMeds/EONPro y afiliados con respecto a mi tratamiento.</>
                  : <>I accept the <a href="#" className="text-[#cab172] underline">Privacy Policy</a> and I authorize receiving important communications via email and text messages (SMS) from EONMeds/EONPro and affiliates regarding my treatment.</>
                }
              </div>
            </div>
          </div>

          {/* SMS Disclosure */}
          <div className="info-container">
            <p className="text-xs leading-relaxed">
              {language === 'es'
                ? 'Para ayudar a garantizar la seguridad del paciente, necesitamos verificar tu número de teléfono. Al proporcionarlo y continuar, consientes recibir mensajes de texto de EONPro para verificación y otros usos legalmente permitidos relacionados con tu cuenta y nuestros servicios. Esto puede incluir confirmaciones de pedidos, actualizaciones de envío y mensajes de tu proveedor. Pueden aplicarse tarifas de mensajes y datos. La frecuencia de los mensajes puede variar. Responde AYUDA para asistencia o STOP para cancelar la suscripción. Pueden aplicarse tarifas estándar de mensajes y datos. Estos mensajes pueden incluir recordatorios médicos, actualizaciones de tratamiento, promociones y otra información relacionada con tu atención.'
                : 'To help ensure patient safety, we need to verify your phone number. By providing it and continuing, you consent to receive text messages from EONPro for verification and other legally permitted uses related to your account and our services. This may include order confirmations, shipping updates, and messages from your provider. Message and data rates may apply. Message frequency may vary. Reply HELP for assistance or STOP to unsubscribe. Standard message and data rates may apply. These messages may include medical reminders, treatment updates, promotions, and other information related to your care.'}
            </p>
          </div>
        </div>
      </div>
    </IntakePageLayout>
  );
}

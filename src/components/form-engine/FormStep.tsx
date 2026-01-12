'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { FormStep as FormStepType, Language, FieldOption } from '@/types/form';
import { useIntakeStore, useIntakeActions } from '@/store/intakeStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { OptionButton, TextField, SelectField, CheckboxField } from './fields';
import OTMensLogo from '@/components/OTMensLogo';
import { getNextStep, getPreviousStep } from '@/config/forms/weightloss-intake';

interface FormStepProps {
  config: FormStepType;
  basePath?: string;
}

export default function FormStep({ config, basePath = '/intake' }: FormStepProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  
  // Store hooks
  const responses = useIntakeStore((state) => state.responses);
  const { setResponse, setResponses, markStepCompleted, setCurrentStep } = useIntakeActions();
  
  // Local state for form values (syncs with store on navigation)
  const [localValues, setLocalValues] = useState<Record<string, any>>(() => {
    // Initialize from store
    const initial: Record<string, any> = {};
    config.fields.forEach(field => {
      initial[field.id] = responses[field.storageKey] ?? field.defaultValue ?? '';
    });
    return initial;
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get localized text
  const getText = useCallback((localizedString: { en: string; es: string } | undefined) => {
    if (!localizedString) return '';
    return isSpanish ? localizedString.es : localizedString.en;
  }, [isSpanish]);

  // Handle single-select option click
  const handleSingleSelect = useCallback((fieldId: string, storageKey: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [fieldId]: value }));
    setResponse(storageKey, value);
    
    if (config.autoAdvance) {
      markStepCompleted(config.id);
      const nextStepId = getNextStep(config.id, { ...responses, [storageKey]: value });
      if (nextStepId) {
        setCurrentStep(nextStepId);
        router.push(`${basePath}/${nextStepId}`);
      }
    }
  }, [config, responses, setResponse, markStepCompleted, setCurrentStep, router, basePath]);

  // Handle multi-select option toggle
  const handleMultiSelect = useCallback((fieldId: string, storageKey: string, value: string) => {
    setLocalValues(prev => {
      const currentValues = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      return { ...prev, [fieldId]: newValues };
    });
  }, []);

  // Handle text input change
  const handleTextChange = useCallback((fieldId: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  }, [errors]);

  // Handle checkbox change
  const handleCheckboxChange = useCallback((fieldId: string, checked: boolean) => {
    setLocalValues(prev => ({ ...prev, [fieldId]: checked }));
  }, []);

  // Validate form
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    config.fields.forEach(field => {
      const value = localValues[field.id];
      
      field.validation?.forEach(rule => {
        const errorMsg = getText(rule.message);
        
        switch (rule.type) {
          case 'required':
            if (!value || (Array.isArray(value) && value.length === 0)) {
              newErrors[field.id] = errorMsg;
            }
            break;
          case 'minLength':
            if (typeof value === 'string' && value.length < (rule.value as number)) {
              newErrors[field.id] = errorMsg;
            }
            break;
          case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              newErrors[field.id] = errorMsg;
            }
            break;
          case 'phone':
            if (value && !/^(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/.test(value)) {
              newErrors[field.id] = errorMsg;
            }
            break;
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [config.fields, localValues, getText]);

  // Handle continue button click
  const handleContinue = useCallback(() => {
    if (!validate()) return;
    
    // Save all values to store
    const storageUpdates: Record<string, any> = {};
    config.fields.forEach(field => {
      storageUpdates[field.storageKey] = localValues[field.id];
    });
    setResponses(storageUpdates);
    
    // Mark step completed and navigate
    markStepCompleted(config.id);
    const nextStepId = getNextStep(config.id, { ...responses, ...storageUpdates });
    if (nextStepId) {
      setCurrentStep(nextStepId);
      router.push(`${basePath}/${nextStepId}`);
    }
  }, [config, localValues, responses, validate, setResponses, markStepCompleted, setCurrentStep, router, basePath]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    const prevStepId = getPreviousStep(config.id);
    if (prevStepId) {
      setCurrentStep(prevStepId);
      router.push(`${basePath}/${prevStepId}`);
    }
  }, [config.id, setCurrentStep, router, basePath]);

  // Render field based on type
  const renderField = (field: typeof config.fields[0]) => {
    const value = localValues[field.id];
    const error = errors[field.id];

    switch (field.type) {
      case 'radio':
        return (
          <div className="space-y-3" key={field.id}>
            {field.options?.map((option: FieldOption) => (
              <OptionButton
                key={option.id}
                label={getText(option.label)}
                description={getText(option.description)}
                selected={value === option.value}
                onClick={() => handleSingleSelect(field.id, field.storageKey, option.value)}
              />
            ))}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'checkbox':
        if (field.options) {
          // Multi-select checkboxes
          return (
            <div className="space-y-3" key={field.id}>
              {field.options.map((option: FieldOption) => (
                <OptionButton
                  key={option.id}
                  label={getText(option.label)}
                  description={getText(option.description)}
                  selected={Array.isArray(value) && value.includes(option.value)}
                  onClick={() => handleMultiSelect(field.id, field.storageKey, option.value)}
                  showCheckbox
                />
              ))}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          );
        }
        // Single checkbox (agreement type)
        return (
          <CheckboxField
            key={field.id}
            id={field.id}
            label={getText(field.label)}
            checked={!!value}
            onChange={(checked) => handleCheckboxChange(field.id, checked)}
            error={error}
          />
        );

      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <TextField
            key={field.id}
            id={field.id}
            label={getText(field.label)}
            placeholder={getText(field.placeholder)}
            value={value || ''}
            onChange={(val) => handleTextChange(field.id, val)}
            type={field.type === 'phone' ? 'tel' : field.type}
            error={error}
          />
        );

      case 'select':
        return (
          <SelectField
            key={field.id}
            id={field.id}
            label={getText(field.label)}
            placeholder={getText(field.placeholder)}
            value={value || ''}
            onChange={(val) => handleTextChange(field.id, val)}
            options={field.options?.map(opt => ({
              value: opt.value,
              label: getText(opt.label),
            })) || []}
            error={error}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div 
          className="h-full bg-[#f5ecd8] transition-all duration-300"
          style={{ width: `${config.progressPercent}%` }}
        />
      </div>
      
      {/* Back button */}
      {config.prevStep && (
        <div className="px-6 lg:px-8 pt-6">
          <button 
            onClick={handleBack}
            className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          {/* Title */}
          <div>
            <h1 className="page-title">
              {getText(config.title)}
            </h1>
            {config.subtitle && (
              <p className="page-subtitle mt-3">
                {getText(config.subtitle)}
              </p>
            )}
          </div>
          
          {/* Fields */}
          <div className="space-y-4">
            {config.fields.map(renderField)}
          </div>
        </div>
      </div>
      
      {/* Continue button (if not auto-advance) */}
      {config.showContinueButton && (
        <div className="px-6 lg:px-8 pb-6 max-w-md lg:max-w-2xl mx-auto w-full">
          <button 
            onClick={handleContinue}
            className="continue-button"
          >
            <span>{isSpanish ? 'Continuar' : 'Continue'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Copyright footer */}
          <div className="mt-6 text-center">
            <p className="copyright-text">
              {isSpanish ? (
                <>
                  © 2025 Overtime Men's Health. Todos los derechos reservados.<br/>
                  Proceso exclusivo y protegido. Copiar o reproducir sin autorización está prohibido.
                </>
              ) : (
                <>
                  © 2025 Overtime Men's Health. All rights reserved.<br/>
                  Exclusive and protected process. Copying or reproduction without authorization is prohibited.
                </>
              )}
            </p>
          </div>
        </div>
      )}
      
      {/* Copyright for auto-advance pages */}
      {!config.showContinueButton && (
        <div className="px-6 lg:px-8 pb-6 max-w-md lg:max-w-2xl mx-auto w-full">
          <p className="copyright-text text-center">
            {isSpanish ? (
              <>
                © 2025 Overtime Men's Health. Todos los derechos reservados.<br/>
                Proceso exclusivo y protegido. Copiar o reproducir sin autorización está prohibido.
              </>
            ) : (
              <>
                © 2025 Overtime Men's Health. All rights reserved.<br/>
                Exclusive and protected process. Copying or reproduction without authorization is prohibited.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}


'use client';

import { useParams, notFound } from 'next/navigation';
import { FormStep } from '@/components/form-engine';
import { getStepById } from '@/config/forms/weightloss-intake';

/**
 * DYNAMIC INTAKE PAGE
 * 
 * This is the new enterprise-grade approach:
 * - Single page handles ALL intake steps
 * - Configuration-driven (no hardcoded UI)
 * - Easy to add/modify/remove steps
 * - Scalable and maintainable
 * 
 * Usage:
 * /v2/intake/goals
 * /v2/intake/medication-preference
 * /v2/intake/consent
 * etc.
 */
export default function DynamicIntakePage() {
  const params = useParams();
  const stepId = params.stepId as string;
  
  // Get step configuration
  const stepConfig = getStepById(stepId);
  
  // 404 if step not found
  if (!stepConfig) {
    notFound();
  }
  
  return (
    <FormStep 
      config={stepConfig} 
      basePath="/v2/intake"
    />
  );
}


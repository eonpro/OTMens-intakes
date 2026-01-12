'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConditionsPage() {
  const router = useRouter();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const conditions = [
    'Diabetes (Type 1 or Type 2)',
    'High Blood Pressure',
    'Heart Disease',
    'Thyroid Conditions',
    'Kidney Disease',
    'Liver Disease',
    'Pancreatitis',
    'Gallbladder Disease',
    'Eating Disorder',
    'Depression or Anxiety',
    'None of the above'
  ];

  const toggleCondition = (condition: string) => {
    if (condition === 'None of the above') {
      setSelectedConditions(['None of the above']);
    } else {
      setSelectedConditions(prev => {
        const filtered = prev.filter(c => c !== 'None of the above');
        return prev.includes(condition)
          ? filtered.filter(c => c !== condition)
          : [...filtered, condition];
      });
    }
  };

  const handleBack = () => {
    router.push('/intake/health');
  };

  const handleContinue = () => {
    router.push('/intake/review');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[60%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>

      {/* Back button */}
      <div className="px-6 pt-6">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-md mx-auto w-full">
        <div className="space-y-8">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="page-title">
              Do you have any of these conditions?
            </h1>
            <p className="page-subtitle">
              Select all that apply. This helps ensure your safety.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {conditions.map((condition) => (
              <button
                key={condition}
                onClick={() => toggleCondition(condition)}
                className={`w-full p-3 rounded-2xl border text-left transition-all ${
                  selectedConditions.includes(condition)
                    ? 'border-[#cab172] bg-[#e8f4eb]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                    selectedConditions.includes(condition)
                      ? 'border-[#cab172] bg-[#e8f4eb]0'
                      : 'border-gray-300'
                  }`}>
                    {selectedConditions.includes(condition) && (
                      <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base">{condition}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleContinue}
          className="w-full bg-black text-white py-4 px-8 rounded-full text-lg font-medium flex items-center justify-between hover:bg-gray-900 transition-colors"
        >
          <span>Continue</span>
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-gray-400">
          © 2025 Overtime Men's Health. All rights reserved.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HealthPage() {
  const router = useRouter();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [medications, setMedications] = useState('');

  const handleBack = () => {
    router.push('/intake/contact');
  };

  const handleContinue = () => {
    if (height && weight) {
      router.push('/intake/conditions');
    }
  };

  const calculateBMI = () => {
    if (height && weight) {
      const heightInches = parseFloat(height);
      const weightLbs = parseFloat(weight);
      if (heightInches > 0 && weightLbs > 0) {
        const bmi = (weightLbs / (heightInches * heightInches)) * 703;
        return bmi.toFixed(1);
      }
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[40%] bg-[#f5ecd8] transition-all duration-300"></div>
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
              Let's calculate your BMI
            </h1>
            <p className="page-subtitle">
              This helps us determine the right treatment options for you.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <p className="text-gray-400 text-sm">Health Metrics</p>
            
            <div className="space-y-4">
              <div>
                <input
                  type="number"
                  placeholder="Height (inches)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-gray-200 text-base md:text-lg focus:outline-none focus:border-gray-400 transition-colors"
                />
                <p className="text-sm text-gray-400 mt-1 ml-2">For example: 70 inches = 5'10"</p>
              </div>
              
              <input
                type="number"
                placeholder="Current Weight (lbs)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-200 text-base md:text-lg focus:outline-none focus:border-gray-400 transition-colors"
              />
              
              <input
                type="number"
                placeholder="Target Weight (lbs) - Optional"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-200 text-base md:text-lg focus:outline-none focus:border-gray-400 transition-colors"
              />

              {calculateBMI() && (
                <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                  <p className="text-sm text-gray-600">Your BMI</p>
                  <p className="text-2xl font-semibold text-[#cab172]">{calculateBMI()}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {parseFloat(calculateBMI()) < 18.5 && 'Underweight'}
                    {parseFloat(calculateBMI()) >= 18.5 && parseFloat(calculateBMI()) < 25 && 'Normal weight'}
                    {parseFloat(calculateBMI()) >= 25 && parseFloat(calculateBMI()) < 30 && 'Overweight'}
                    {parseFloat(calculateBMI()) >= 30 && 'Obese'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 mt-8">
              <p className="text-gray-400 text-sm">Current Medications</p>
              <textarea
                placeholder="List any medications you're currently taking (Optional)"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-2xl border border-gray-200 text-lg focus:outline-none focus:border-gray-400 transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleContinue}
          disabled={!height || !weight}
          className={`w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-between transition-all ${
            height && weight
              ? 'bg-black text-white hover:bg-gray-900'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
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
          © 2025 EONPro, LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
}

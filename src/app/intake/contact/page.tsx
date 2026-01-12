'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  const handleBack = () => {
    router.push('/intake/name');
  };

  const handleContinue = () => {
    if (email && phone && dob) {
      router.push('/intake/health');
    }
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneLength = phoneNumber.length;
    if (phoneLength < 4) return phoneNumber;
    if (phoneLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[30%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>

      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
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
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="page-title">
              How can we reach you?
            </h1>
            <p className="page-subtitle">
              We'll use this information to communicate about your treatment.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <p className="text-gray-400 text-sm">Contact Information</p>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-200 text-base md:text-lg font-medium focus:outline-none focus:border-gray-400 transition-colors"
              />
              
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full p-4 rounded-2xl border border-gray-200 text-base md:text-lg font-medium focus:outline-none focus:border-gray-400 transition-colors"
              />
              
              <input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-200 text-base md:text-lg font-medium focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 lg:px-8 pb-8">
        <button
          onClick={handleContinue}
          disabled={!email || !phone || !dob}
          className={`w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-between transition-all ${
            email && phone && dob
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
      <div className="px-6 lg:px-8 py-4 text-center">
        <p className="text-xs text-gray-400">
          © 2025 Overtime Men's Health. All rights reserved.
        </p>
      </div>
    </div>
  );
}

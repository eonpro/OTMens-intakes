'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back button */}
      <div className="px-6 pt-6">
        <Link href="/intake/contact-info" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 bg-[#cab172] rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-semibold">Intake Complete!</h1>
        
        <p className="text-lg text-gray-600">
          Thank you for completing your medical intake. A licensed provider will review your information 
          and determine the best treatment plan for you.
        </p>
        
        <div className="bg-[#f5ecd8] rounded-2xl p-6 space-y-4 text-left">
          <h2 className="text-xl font-semibold">Next Steps:</h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex">
              <span className="font-medium mr-2">1.</span>
              <span>Your information will be reviewed by a licensed healthcare provider</span>
            </li>
            <li className="flex">
              <span className="font-medium mr-2">2.</span>
              <span>If approved, you'll receive a prescription</span>
            </li>
            <li className="flex">
              <span className="font-medium mr-2">3.</span>
              <span>Your medication will be shipped within 2-3 business days</span>
            </li>
            <li className="flex">
              <span className="font-medium mr-2">4.</span>
              <span>A dedicated support representative will be assigned to your case</span>
            </li>
          </ol>
        </div>
        
        <button 
          onClick={() => router.push('/')}
          className="w-full bg-black text-white py-4 px-8 rounded-full text-lg font-medium hover:bg-gray-900"
        >
          Go to Dashboard
        </button>
      </div>
      </div>
    </div>
  );
}

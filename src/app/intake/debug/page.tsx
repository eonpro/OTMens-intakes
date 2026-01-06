'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collectIntakeData, submitIntake } from '@/lib/api';

export default function DebugPage() {
  const router = useRouter();
  const [apiStatus, setApiStatus] = useState<Record<string, unknown> | null>(null);
  const [testStatus, setTestStatus] = useState<Record<string, unknown> | null>(null);
  const [sessionData, setSessionData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  // Check if debug is allowed (dev mode only)
  useEffect(() => {
    // Only allow in development or with special query param
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugKey = new URLSearchParams(window.location.search).get('key') === 'eon-debug-2025';

    if (!isDev && !hasDebugKey) {
      router.push('/');
      return;
    }

    setIsAllowed(true);
    refreshSessionData();
  }, [router]);

  const refreshSessionData = () => {
    // Get all sessionStorage keys that start with 'intake_' or common keys
    const keys = [
      'intake_session_id', 'intake_name', 'intake_contact', 'intake_dob',
      'intake_state', 'intake_address', 'intake_current_weight', 'intake_ideal_weight',
      'intake_height', 'intake_goals', 'intake_sex', 'activity_level',
      'chronic_conditions', 'digestive_conditions', 'current_medications', 'allergies',
      'mental_health_conditions', 'glp1_history', 'glp1_type', 'medication_preference',
      'family_conditions', 'kidney_conditions', 'taking_medications',
      'personal_diabetes_t2', 'personal_gastroparesis', 'personal_pancreatitis',
      'personal_thyroid_cancer', 'personal_men', 'pregnancy_breastfeeding',
      'privacyPolicyAccepted', 'termsOfUseAccepted', 'telehealthConsentAccepted',
      'submission_status', 'submission_error', 'submitted_intake_id'
    ];

    const data: Record<string, any> = {};
    keys.forEach(key => {
      const value = sessionStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });
    setSessionData(data);
  };

  const checkApiStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/airtable');
      const data = await response.json();
      setApiStatus(data);
    } catch (error) {
      setApiStatus({ error: String(error) });
    }
    setLoading(false);
  };

  const runConnectionTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/airtable/test');
      const data = await response.json();
      setTestStatus(data);
    } catch (error) {
      setTestStatus({ error: String(error) });
    }
    setLoading(false);
  };

  const testSubmission = async () => {
    setLoading(true);
    try {
      const intakeData = collectIntakeData();
      console.log('Collected intake data:', intakeData);
      
      const result = await submitIntake(intakeData);
      console.log('Submission result:', result);
      
      setTestStatus({
        type: 'submission',
        collectedData: {
          sessionId: intakeData.sessionId,
          hasPersonalInfo: !!intakeData.personalInfo?.firstName,
          hasAddress: !!intakeData.address,
          hasMedicalProfile: !!intakeData.medicalProfile,
          hasConsents: !!intakeData.consents?.privacyPolicyAccepted
        },
        result
      });
      
      refreshSessionData();
    } catch (error) {
      setTestStatus({ type: 'submission', error: String(error) });
    }
    setLoading(false);
  };

  // Don't render until we verify access
  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Airtable Integration Debug</h1>
        
        {/* API Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">1. API Configuration</h2>
          <button 
            onClick={checkApiStatus}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Check API Status
          </button>
          {apiStatus && (
            <pre className="mt-4 bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(apiStatus, null, 2)}
            </pre>
          )}
        </div>

        {/* Connection Test */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">2. Connection Test</h2>
          <button 
            onClick={runConnectionTest}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Test Airtable Connection
          </button>
          {testStatus && testStatus.type !== 'submission' && (
            <pre className="mt-4 bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(testStatus, null, 2)}
            </pre>
          )}
        </div>

        {/* Session Data */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">3. Current Session Data</h2>
          <button 
            onClick={refreshSessionData}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mb-4"
          >
            Refresh Session Data
          </button>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm max-h-96 overflow-y-auto">
            {JSON.stringify(sessionData, null, 2) || 'No session data found'}
          </pre>
        </div>

        {/* Test Submission */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">4. Test Submission</h2>
          <p className="text-gray-600 mb-4">
            This will collect all current session data and attempt to submit it to Airtable.
          </p>
          <button 
            onClick={testSubmission}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Test Submit to Airtable
          </button>
          {testStatus && testStatus.type === 'submission' && (
            <pre className="mt-4 bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(testStatus, null, 2)}
            </pre>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Check API Status - verify environment variables are set</li>
            <li>Test Connection - verify Airtable credentials work</li>
            <li>Complete at least the first few intake steps to have data</li>
            <li>Check Session Data - verify form data is being stored</li>
            <li>Test Submission - try sending data to Airtable</li>
          </ol>
          <p className="mt-4 text-yellow-700">
            <strong>Note:</strong> Open browser DevTools (F12) → Console to see detailed logs.
          </p>
        </div>
      </div>
    </div>
  );
}


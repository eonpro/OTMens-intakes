import { NextRequest, NextResponse } from 'next/server';

// Test endpoint for Airtable integration debugging
// GET /api/airtable/test - Check configuration and test connection
// PROTECTED: Only available in development or with debug key

const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Intake Submissions';

export async function GET(request: NextRequest) {
  // Security: Block in production unless debug key is provided
  const { searchParams } = new URL(request.url);
  const debugKey = searchParams.get('key');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && debugKey !== 'eon-debug-2025') {
    return NextResponse.json(
      { error: 'Not authorized', message: 'Debug endpoint only available in development' },
      { status: 403 }
    );
  }
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    configuration: {
      AIRTABLE_PAT: AIRTABLE_PAT ? `✓ Set (${AIRTABLE_PAT.substring(0, 10)}...)` : '✗ Not set',
      AIRTABLE_BASE_ID: AIRTABLE_BASE_ID ? `✓ Set (${AIRTABLE_BASE_ID})` : '✗ Not set',
      AIRTABLE_TABLE_NAME: AIRTABLE_TABLE_NAME,
    },
    connection: 'Not tested',
    tableSchema: null,
    error: null,
  };

  // Check if configuration is complete
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
    diagnostics.error = 'Missing environment variables. Set AIRTABLE_PAT and AIRTABLE_BASE_ID in Vercel.';
    return NextResponse.json(diagnostics, { status: 500 });
  }

  try {
    // Test 1: Try to fetch table schema/records to verify connection
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?maxRecords=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      diagnostics.connection = `✗ Failed (${response.status})`;
      diagnostics.error = errorData;
      return NextResponse.json(diagnostics, { status: response.status });
    }

    const data = await response.json();
    diagnostics.connection = '✓ Connected successfully';
    diagnostics.recordCount = data.records?.length || 0;

    // Test 2: Get table schema by checking existing record fields
    if (data.records && data.records.length > 0) {
      diagnostics.existingFields = Object.keys(data.records[0].fields || {});
    } else {
      diagnostics.existingFields = 'No records found - table may be empty';
    }

    // Test 3: Try to create a test record (will be deleted)
    const testRecord = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Session ID': `TEST-${Date.now()}`,
            'First Name': 'TEST_DELETE_ME',
          }
        }),
      }
    );

    if (testRecord.ok) {
      const testResult = await testRecord.json();
      diagnostics.writeTest = '✓ Can create records';
      diagnostics.testRecordId = testResult.id;
      
      // Delete the test record
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${testResult.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_PAT}`,
          },
        }
      );
      diagnostics.testRecordDeleted = true;
    } else {
      const writeError = await testRecord.json();
      diagnostics.writeTest = `✗ Cannot create records (${testRecord.status})`;
      diagnostics.writeError = writeError;
    }

    return NextResponse.json(diagnostics);

  } catch (error) {
    diagnostics.connection = '✗ Connection error';
    diagnostics.error = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(diagnostics, { status: 500 });
  }
}


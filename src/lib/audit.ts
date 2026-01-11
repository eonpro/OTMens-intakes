// ============================================================================
// AUDIT LOGGING UTILITY
// For HIPAA compliance: tracks access to PHI and system events
// ============================================================================

export type AuditEventType =
  | 'SESSION_START'
  | 'SESSION_END'
  | 'SESSION_TIMEOUT'
  | 'PHI_ACCESS'
  | 'PHI_UPDATE'
  | 'PHI_DELETE'
  | 'CONSENT_ACCEPTED'
  | 'CONSENT_REVOKED'
  | 'FORM_SUBMITTED'
  | 'FORM_STEP_COMPLETED'
  | 'API_REQUEST'
  | 'API_ERROR'
  | 'AUTH_ATTEMPT'
  | 'AUTH_SUCCESS'
  | 'AUTH_FAILURE';

export interface AuditEvent {
  timestamp: string;
  eventType: AuditEventType;
  sessionId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  details?: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
}

// In-memory buffer for audit events (client-side)
const auditBuffer: AuditEvent[] = [];
const MAX_BUFFER_SIZE = 50;

// Helper to check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Get session ID from storage
function getSessionId(): string {
  if (!isBrowser) return 'server';
  return sessionStorage.getItem('intake_session_id') || 'unknown';
}

// Get client info for audit trail
function getClientInfo(): { userAgent: string; ipAddress: string } {
  if (!isBrowser) {
    return { userAgent: 'server', ipAddress: 'server' };
  }
  return {
    userAgent: navigator.userAgent,
    ipAddress: 'client', // IP is determined server-side
  };
}

/**
 * Log an audit event
 * In production, this should send to a secure audit log service
 */
export function logAuditEvent(
  eventType: AuditEventType,
  options: {
    resource?: string;
    action?: string;
    details?: Record<string, unknown>;
    success?: boolean;
    errorMessage?: string;
    userId?: string;
  } = {}
): void {
  const { userAgent, ipAddress } = getClientInfo();

  const event: AuditEvent = {
    timestamp: new Date().toISOString(),
    eventType,
    sessionId: getSessionId(),
    userId: options.userId,
    ipAddress,
    userAgent,
    resource: options.resource,
    action: options.action,
    details: options.details,
    success: options.success ?? true,
    errorMessage: options.errorMessage,
  };

  // Add to buffer
  auditBuffer.push(event);

  // Keep buffer size manageable
  if (auditBuffer.length > MAX_BUFFER_SIZE) {
    auditBuffer.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Audit]', eventType, options.resource || '', options.action || '');
  }

  // Store in sessionStorage for persistence during session
  if (isBrowser) {
    try {
      const existingLogs = JSON.parse(sessionStorage.getItem('audit_log') || '[]');
      existingLogs.push(event);
      // Keep only last 100 events in storage
      const trimmedLogs = existingLogs.slice(-100);
      sessionStorage.setItem('audit_log', JSON.stringify(trimmedLogs));
    } catch {
      // Storage full or unavailable, continue without storing
    }
  }

  // In production, send to server endpoint
  if (process.env.NODE_ENV === 'production' && isBrowser) {
    // Queue for batch sending (don't block UI)
    queueAuditFlush();
  }
}

// Debounced flush to send audit events to server
let flushTimeout: NodeJS.Timeout | null = null;

function queueAuditFlush(): void {
  if (flushTimeout) return;

  flushTimeout = setTimeout(() => {
    flushTimeout = null;
    flushAuditEvents();
  }, 5000); // Batch every 5 seconds
}

async function flushAuditEvents(): Promise<void> {
  if (auditBuffer.length === 0) return;

  const eventsToSend = [...auditBuffer];

  try {
    // Send to audit endpoint (implement on server)
    // await fetch('/api/audit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ events: eventsToSend }),
    // });

    // Clear sent events from buffer
    auditBuffer.length = 0;
  } catch {
    // Failed to send, keep in buffer for retry
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Log when a user accesses PHI data
 */
export function logPHIAccess(resource: string, details?: Record<string, unknown>): void {
  logAuditEvent('PHI_ACCESS', { resource, details });
}

/**
 * Log when PHI is updated
 */
export function logPHIUpdate(resource: string, details?: Record<string, unknown>): void {
  logAuditEvent('PHI_UPDATE', { resource, details });
}

/**
 * Log when a consent is accepted
 */
export function logConsentAccepted(consentType: string): void {
  logAuditEvent('CONSENT_ACCEPTED', {
    resource: 'consent',
    action: 'accept',
    details: { consentType },
  });
}

/**
 * Log when a form step is completed
 */
export function logFormStepCompleted(stepId: string): void {
  logAuditEvent('FORM_STEP_COMPLETED', {
    resource: 'intake-form',
    action: 'complete-step',
    details: { stepId },
  });
}

/**
 * Log when full form is submitted
 */
export function logFormSubmitted(recordId?: string): void {
  logAuditEvent('FORM_SUBMITTED', {
    resource: 'intake-form',
    action: 'submit',
    details: { recordId },
  });
}

/**
 * Log session start
 */
export function logSessionStart(): void {
  logAuditEvent('SESSION_START', {
    resource: 'session',
    action: 'start',
  });
}

/**
 * Log session timeout
 */
export function logSessionTimeout(): void {
  logAuditEvent('SESSION_TIMEOUT', {
    resource: 'session',
    action: 'timeout',
    details: { reason: 'inactivity' },
  });
}

/**
 * Log API request
 */
export function logAPIRequest(
  endpoint: string,
  method: string,
  success: boolean,
  errorMessage?: string
): void {
  logAuditEvent('API_REQUEST', {
    resource: endpoint,
    action: method,
    success,
    errorMessage,
  });
}

/**
 * Get all audit events from current session
 */
export function getAuditLog(): AuditEvent[] {
  if (!isBrowser) return [];

  try {
    return JSON.parse(sessionStorage.getItem('audit_log') || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear audit log (for testing or session end)
 */
export function clearAuditLog(): void {
  if (!isBrowser) return;
  sessionStorage.removeItem('audit_log');
  auditBuffer.length = 0;
}

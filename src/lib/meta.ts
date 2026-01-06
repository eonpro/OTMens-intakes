// ============================================================
// META PIXEL & IDENTITY TRACKING
// ============================================================

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// UUID v4 generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get URL parameter
function getParam(name: string): string {
  if (!isBrowser) return '';
  return new URLSearchParams(window.location.search).get(name) || '';
}

// Normalize value - trim and filter invalid values
function normalize(v: string | null | undefined): string {
  if (!v) return '';
  const s = String(v).trim();
  if (!s || s.startsWith('@')) return '';
  return s;
}

// Build fbc from fbclid
function buildFbcFromFbclid(fbclid: string): string {
  if (!fbclid) return '';
  return `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`;
}

// ============================================================
// META IDENTITY INTERFACE
// ============================================================

export interface MetaIdentity {
  lead_id: string;
  meta_event_id: string;
  fbp: string;
  fbc: string;
  fbclid: string;
  lang: string;
}

// ============================================================
// INITIALIZE META IDENTITY
// Call this on page load (landing page)
// ============================================================

export function initMetaIdentity(): MetaIdentity {
  if (!isBrowser) {
    return {
      lead_id: '',
      meta_event_id: '',
      fbp: '',
      fbc: '',
      fbclid: '',
      lang: 'es',
    };
  }

  // Try to get from URL params first, then localStorage
  let lead_id = normalize(getParam('lead_id')) || normalize(localStorage.getItem('lead_id'));
  let meta_event_id = normalize(getParam('meta_event_id')) || normalize(localStorage.getItem('meta_event_id'));
  let fbp = normalize(getParam('fbp')) || normalize(localStorage.getItem('fbp'));
  let fbc = normalize(getParam('fbc')) || normalize(localStorage.getItem('fbc'));
  let fbclid = normalize(getParam('fbclid')) || normalize(localStorage.getItem('fbclid'));
  const lang = normalize(getParam('lang')) || normalize(localStorage.getItem('preferredLanguage')) || 'es';

  // Generate lead_id if not present
  if (!lead_id) {
    lead_id = uuidv4();
  }

  // Default meta_event_id to lead_id
  if (!meta_event_id) {
    meta_event_id = lead_id;
  }

  // Build fbc from fbclid if fbc is missing
  if (!fbc && fbclid) {
    fbc = buildFbcFromFbclid(fbclid);
  }

  // Persist to localStorage
  localStorage.setItem('lead_id', lead_id);
  localStorage.setItem('meta_event_id', meta_event_id);
  if (fbp) localStorage.setItem('fbp', fbp);
  if (fbc) localStorage.setItem('fbc', fbc);
  if (fbclid) localStorage.setItem('fbclid', fbclid);
  localStorage.setItem('preferredLanguage', lang);

  return { lead_id, meta_event_id, fbp, fbc, fbclid, lang };
}

// ============================================================
// GET CURRENT META IDENTITY
// Call this anywhere you need the identity values
// ============================================================

export function getMetaIdentity(): MetaIdentity {
  if (!isBrowser) {
    return {
      lead_id: '',
      meta_event_id: '',
      fbp: '',
      fbc: '',
      fbclid: '',
      lang: 'es',
    };
  }

  return {
    lead_id: localStorage.getItem('lead_id') || '',
    meta_event_id: localStorage.getItem('meta_event_id') || '',
    fbp: localStorage.getItem('fbp') || '',
    fbc: localStorage.getItem('fbc') || '',
    fbclid: localStorage.getItem('fbclid') || '',
    lang: localStorage.getItem('preferredLanguage') || 'es',
  };
}

// ============================================================
// TRACK META EVENT
// Fire Meta Pixel events
// ============================================================

declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: Record<string, unknown>) => void;
  }
}

export function trackMetaEvent(
  event: 'PageView' | 'CompleteRegistration' | 'Lead' | 'InitiateCheckout' | string,
  params?: Record<string, unknown>
): void {
  if (!isBrowser) return;

  if (typeof window.fbq === 'function') {
    if (params) {
      window.fbq('track', event, params);
    } else {
      window.fbq('track', event);
    }
  }
}

// ============================================================
// BUILD CHECKOUT URL
// Generates the checkout URL with all tracking params
// ============================================================

export interface CheckoutParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  intakeId?: string;
  lang?: 'en' | 'es'; // Explicit language override
}

function enc(v: string | undefined | null): string {
  return encodeURIComponent(v || '');
}

export function buildCheckoutUrl(params: CheckoutParams): string {
  const identity = getMetaIdentity();

  const queryParams = new URLSearchParams();

  // Language - use explicit param if provided, otherwise fall back to stored identity
  const lang = params.lang || identity.lang || 'es';
  queryParams.set('lang', lang);

  // User data
  if (params.firstName) queryParams.set('firstName', params.firstName);
  if (params.lastName) queryParams.set('lastName', params.lastName);
  if (params.email) queryParams.set('email', params.email);
  if (params.phone) queryParams.set('phone', params.phone);
  if (params.dob) queryParams.set('dob', params.dob);

  // Airtable reference
  if (params.intakeId) queryParams.set('ref', params.intakeId);

  // Meta tracking params
  queryParams.set('lead_id', identity.lead_id);
  queryParams.set('meta_event_id', identity.meta_event_id);
  if (identity.fbp) queryParams.set('fbp', identity.fbp);
  if (identity.fbc) queryParams.set('fbc', identity.fbc);
  if (identity.fbclid) queryParams.set('fbclid', identity.fbclid);

  return `https://checkout.eonmeds.com/?${queryParams.toString()}`;
}

// ============================================================
// REDIRECT TO CHECKOUT
// Fire CompleteRegistration event and redirect
// ============================================================

export function redirectToCheckout(params: CheckoutParams): void {
  if (!isBrowser) return;

  // Fire CompleteRegistration event
  trackMetaEvent('CompleteRegistration');

  // Build URL and redirect
  const url = buildCheckoutUrl(params);

  // Set flag for seamless redirect
  sessionStorage.setItem('checkout_redirect_in_progress', 'true');

  // Clear beforeunload handlers
  window.onbeforeunload = null;

  // Redirect
  window.location.href = url;
}


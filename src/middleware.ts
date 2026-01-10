import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================================
// SECURITY MIDDLEWARE
// Handles: Security Headers, CORS, Rate Limiting
// ============================================================================

// Allowed origins for CORS (production and development)
const ALLOWED_ORIGINS = [
  'https://otmens-intake.vercel.app',
  'https://otmens-intakes.vercel.app',
  'https://www.otmenshealth.com',
  'https://otmenshealth.com',
  'https://checkout.otmenshealth.com',
  // Add your production domains here
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

// Development origins
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000');
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute per IP

// In-memory rate limit store (use Redis in production for multi-instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 60 * 1000);
}

// Get client IP from request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

// Check rate limit
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || record.resetTime < now) {
    // Create new record
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW };
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetTime: record.resetTime };
}

// Security headers
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
};

// Content Security Policy (adjust as needed)
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.wixstatic.com https://lottie.host https://use.typekit.net https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://use.typekit.net https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://static.wixstatic.com https://*.wixstatic.com https://lottie.host",
  "font-src 'self' https://use.typekit.net https://fonts.gstatic.com",
  "frame-src 'self' https://lottie.host",
  "connect-src 'self' https://api.airtable.com https://intakeq.com https://api.pdf.co https://www.facebook.com https://connect.facebook.net",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin') || '';
  const method = request.method;
  
  // Handle API routes
  if (pathname.startsWith('/api/')) {
    const ip = getClientIP(request);
    
    // Rate limiting for API routes
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests', 
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000) 
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetTime),
          },
        }
      );
    }
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
      const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development';
      
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': isAllowedOrigin ? origin : ALLOWED_ORIGINS[0],
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Add CORS and rate limit headers to response
    const response = NextResponse.next();
    const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development';
    
    response.headers.set('Access-Control-Allow-Origin', isAllowedOrigin ? origin || ALLOWED_ORIGINS[0] : ALLOWED_ORIGINS[0]);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime));
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
  
  // For non-API routes, add security headers
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add CSP header
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));
  
  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all paths except static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

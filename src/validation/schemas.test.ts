import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  phoneSchema,
  nameSchema,
  dobSchema,
  weightSchema,
  validateStep,
  validateField,
} from './schemas';

// ============================================================================
// VALIDATION SCHEMA TESTS
// ============================================================================

describe('Email Validation', () => {
  it('should accept valid email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.org',
      'first.last@subdomain.domain.com',
    ];

    validEmails.forEach((email) => {
      const error = validateField(emailSchema, email);
      expect(error).toBeNull();
    });
  });

  it('should reject invalid email addresses', () => {
    const invalidEmails = ['', 'notanemail', 'missing@domain', '@nodomain.com'];

    invalidEmails.forEach((email) => {
      const error = validateField(emailSchema, email);
      expect(error).not.toBeNull();
    });
  });
});

describe('Phone Validation', () => {
  it('should accept valid US phone numbers', () => {
    const validPhones = [
      '1234567890',
      '(123) 456-7890',
      '123-456-7890',
      '+1 123 456 7890',
    ];

    validPhones.forEach((phone) => {
      const error = validateField(phoneSchema, phone);
      expect(error).toBeNull();
    });
  });

  it('should reject invalid phone numbers', () => {
    const invalidPhones = ['123', 'abcdefghij', ''];

    invalidPhones.forEach((phone) => {
      const error = validateField(phoneSchema, phone);
      expect(error).not.toBeNull();
    });
  });
});

describe('Name Validation', () => {
  it('should accept valid names', () => {
    const validNames = ['John', 'Mary Jane', "O'Connor", 'García-López'];

    validNames.forEach((name) => {
      const error = validateField(nameSchema, name);
      expect(error).toBeNull();
    });
  });

  it('should reject names that are too short', () => {
    const error = validateField(nameSchema, 'A');
    expect(error).toBe('Name must be at least 2 characters');
  });

  it('should reject names with invalid characters', () => {
    const error = validateField(nameSchema, 'John123');
    expect(error).toBe('Name can only contain letters, spaces, hyphens, and apostrophes');
  });
});

describe('Date of Birth Validation', () => {
  it('should accept valid dates for adults', () => {
    const validDate = '1990-01-15';
    const error = validateField(dobSchema, validDate);
    expect(error).toBeNull();
  });

  it('should reject dates for minors', () => {
    const today = new Date();
    const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
    const minorDate = tenYearsAgo.toISOString().split('T')[0];
    
    const error = validateField(dobSchema, minorDate);
    expect(error).toBe('You must be at least 18 years old');
  });
});

describe('Weight Validation', () => {
  it('should accept valid weights', () => {
    const validWeights = [100, 150, 200, 350];

    validWeights.forEach((weight) => {
      const error = validateField(weightSchema, weight);
      expect(error).toBeNull();
    });
  });

  it('should reject weights below minimum', () => {
    const error = validateField(weightSchema, 30);
    expect(error).toBe('Weight must be at least 50 lbs');
  });

  it('should reject weights above maximum', () => {
    const error = validateField(weightSchema, 900);
    expect(error).toBe('Weight must be less than 800 lbs');
  });
});

describe('validateStep Function', () => {
  it('should return success for valid contact info', () => {
    const result = validateStep('contact-info', {
      email: 'test@example.com',
      phone: '1234567890',
      consentToContact: true,
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it('should return errors for invalid contact info', () => {
    const result = validateStep('contact-info', {
      email: 'invalid',
      phone: '123',
      consentToContact: false,
    });

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should validate name step correctly', () => {
    const validResult = validateStep('name', {
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(validResult.success).toBe(true);

    const invalidResult = validateStep('name', {
      firstName: 'J',
      lastName: '',
    });
    expect(invalidResult.success).toBe(false);
  });
});

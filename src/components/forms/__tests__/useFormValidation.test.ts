import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../useFormValidation';
import type { FormData } from '../types';

describe('useFormValidation', () => {
  const validFormData: FormData = {
    email: 'test@example.com',
    password: 'Password123',
    confirmPassword: 'Password123',
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1990-01-01',
    country: 'us',
    phoneNumber: '+1234567890',
    bio: 'Test bio',
    newsletter: false,
    dataProcessing: true,
    accountType: 'personal',
  };

  it('returns empty errors for valid form data', () => {
    const { result } = renderHook(() => useFormValidation());

    act(() => {
      const errors = result.current.validateForm(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('email validation', () => {
    it('requires email', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, email: '' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.email).toBe('Email is required');
    });

    it('validates email format', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, email: 'invalid-email' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.email).toBe(
        'Please enter a valid email address',
      );
    });

    it('accepts valid email', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, email: 'test@example.com' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.email).toBeUndefined();
    });
  });

  describe('password validation', () => {
    it('requires password', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, password: '' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.password).toBe('Password is required');
    });

    it('requires minimum length', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, password: 'short' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.password).toBe(
        'Password must be at least 8 characters long',
      );
    });

    it('requires uppercase letter', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, password: 'lowercase123' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.password).toBe(
        'Password must contain at least one uppercase letter',
      );
    });

    it('requires lowercase letter', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, password: 'UPPERCASE123' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.password).toBe(
        'Password must contain at least one lowercase letter',
      );
    });

    it('requires number', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, password: 'NoNumbers' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.password).toBe(
        'Password must contain at least one number',
      );
    });
  });

  describe('confirm password validation', () => {
    it('requires confirm password', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, confirmPassword: '' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.confirmPassword).toBe(
        'Please confirm your password',
      );
    });

    it('requires passwords to match', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = {
        ...validFormData,
        confirmPassword: 'DifferentPassword123',
      };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.confirmPassword).toBe(
        'Passwords do not match',
      );
    });
  });

  describe('name validation', () => {
    it('requires first name', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, firstName: '' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.firstName).toBe('First name is required');
    });

    it('requires minimum length for names', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, firstName: 'A' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.firstName).toBe(
        'First name must be at least 2 characters long',
      );
    });

    it('validates name characters', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, firstName: 'John123' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.firstName).toBe(
        'First name can only contain letters, spaces, hyphens, and apostrophes',
      );
    });
  });

  describe('birth date validation', () => {
    it('requires birth date', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, birthDate: '' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.birthDate).toBe('Date of birth is required');
    });

    it('rejects future dates', () => {
      const { result } = renderHook(() => useFormValidation());
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formData = {
        ...validFormData,
        birthDate: tomorrow.toISOString().split('T')[0],
      };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.birthDate).toBe(
        'Birth date must be in the past',
      );
    });

    it('requires minimum age of 13', () => {
      const { result } = renderHook(() => useFormValidation());
      const tooYoung = new Date();
      tooYoung.setFullYear(tooYoung.getFullYear() - 12);
      const formData = {
        ...validFormData,
        birthDate: tooYoung.toISOString().split('T')[0],
      };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.birthDate).toBe(
        'You must be at least 13 years old to create an account',
      );
    });
  });

  describe('phone number validation', () => {
    it('allows empty phone number', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, phoneNumber: '' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.phoneNumber).toBeUndefined();
    });

    it('validates phone number format', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, phoneNumber: 'invalid-phone' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.phoneNumber).toBe(
        'Please enter a valid phone number',
      );
    });
  });

  describe('bio validation', () => {
    it('allows empty bio', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, bio: '' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.bio).toBeUndefined();
    });

    it('enforces character limit', () => {
      const { result } = renderHook(() => useFormValidation());
      const longBio = 'a'.repeat(501);
      const formData = { ...validFormData, bio: longBio };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.bio).toBe(
        'Bio must be 500 characters or less',
      );
    });
  });

  describe('account type validation', () => {
    it('requires account type', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, accountType: '' };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.accountType).toBe(
        'Please select an account type',
      );
    });
  });

  describe('data processing validation', () => {
    it('requires data processing consent', () => {
      const { result } = renderHook(() => useFormValidation());
      const formData = { ...validFormData, dataProcessing: false };

      act(() => {
        result.current.validateForm(formData);
      });

      expect(result.current.errors.dataProcessing).toBe(
        'You must agree to data processing to create an account',
      );
    });
  });

  describe('utility functions', () => {
    it('clears errors', () => {
      const { result } = renderHook(() => useFormValidation());
      const invalidFormData = { ...validFormData, email: '' };

      act(() => {
        result.current.validateForm(invalidFormData);
      });

      expect(Object.keys(result.current.errors)).toHaveLength(1);

      act(() => {
        result.current.clearErrors();
      });

      expect(Object.keys(result.current.errors)).toHaveLength(0);
    });

    it('sets custom errors', () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.setErrors({ customError: 'Custom error message' });
      });

      expect(result.current.errors.customError).toBe('Custom error message');
    });
  });
});

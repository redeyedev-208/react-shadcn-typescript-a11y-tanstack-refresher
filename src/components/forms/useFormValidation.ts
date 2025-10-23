import { useState } from 'react';
import type { FormData, FormErrors } from './types';

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8)
      return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password))
      return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password))
      return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password))
      return 'Password must contain at least one number';
    return '';
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string,
  ): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const validateName = (name: string, fieldName: string): string => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2)
      return `${fieldName} must be at least 2 characters long`;
    if (!/^[a-zA-Z\s'-]+$/.test(name))
      return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    return '';
  };

  const validateBirthDate = (birthDate: string): string => {
    if (!birthDate) return 'Date of birth is required';

    const today = new Date();
    const birth = new Date(birthDate);

    if (birth >= today) return 'Birth date must be in the past';

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    if (age < 13)
      return 'You must be at least 13 years old to create an account';
    if (age > 120) return 'Please enter a valid birth date';

    return '';
  };

  const validateCountry = (country: string): string => {
    if (!country) return 'Please select your country';
    return '';
  };

  const validatePhoneNumber = (phoneNumber: string): string => {
    if (phoneNumber && !/^[\d\s\-()+]+$/.test(phoneNumber)) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const validateBio = (bio: string): string => {
    if (bio.length > 500) return 'Bio must be 500 characters or less';
    return '';
  };

  const validateAccountType = (accountType: string): string => {
    if (!accountType) return 'Please select an account type';
    return '';
  };

  const validateDataProcessing = (dataProcessing: boolean): string => {
    if (!dataProcessing)
      return 'You must agree to data processing to create an account';
    return '';
  };

  const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;

    const birthDateError = validateBirthDate(formData.birthDate);
    if (birthDateError) newErrors.birthDate = birthDateError;

    const countryError = validateCountry(formData.country);
    if (countryError) newErrors.country = countryError;

    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;

    const bioError = validateBio(formData.bio);
    if (bioError) newErrors.bio = bioError;

    const accountTypeError = validateAccountType(formData.accountType);
    if (accountTypeError) newErrors.accountType = accountTypeError;

    const dataProcessingError = validateDataProcessing(formData.dataProcessing);
    if (dataProcessingError) newErrors.dataProcessing = dataProcessingError;

    setErrors(newErrors);
    return newErrors;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateForm,
    clearErrors,
    setErrors,
  };
}

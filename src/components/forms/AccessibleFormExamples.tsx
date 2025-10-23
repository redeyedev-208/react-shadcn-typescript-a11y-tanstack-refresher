import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmailPasswordSection } from './components/EmailPasswordSection';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { AccountTypeSection } from './components/AccountTypeSection';
import { ConsentSection } from './components/ConsentSection';
import { useFormValidation } from './useFormValidation';
import type { FormData } from './types';

const initialFormData: FormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  country: '',
  phoneNumber: '',
  bio: '',
  newsletter: false,
  dataProcessing: false,
  accountType: '',
};

export function AccessibleFormExamples() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    userId?: number;
  } | null>(null);

  const { errors, validateForm, clearErrors } = useFormValidation();

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    clearErrors();
    setSubmissionResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      // Focus on the first field with an error
      const firstErrorField = Object.keys(validationErrors)[0];
      const firstErrorElement = document.getElementById(firstErrorField);
      if (firstErrorElement) {
        firstErrorElement.focus();
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to JSON Server
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          country: formData.country,
          phoneNumber: formData.phoneNumber,
          bio: formData.bio,
          accountType: formData.accountType,
          newsletter: formData.newsletter,
          dataProcessing: formData.dataProcessing,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSubmissionResult({
        success: true,
        message: 'Registration successful! Your account has been created.',
        userId: result.id,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Registration failed:', error);
      setSubmissionResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Registration failed. Please try again later.',
      });
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    if (submissionResult?.success) {
      resetForm();
    }
  };

  return (
    <>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle>User Registration Form</CardTitle>
          <CardDescription>
            Create your account with this accessible registration form. All
            fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className='space-y-8'
            noValidate
            role='form'
          >
            <EmailPasswordSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <PersonalInfoSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <AccountTypeSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <ConsentSection
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />

            <div className='flex flex-col sm:flex-row gap-3'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='flex-1'
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Button
                type='button'
                variant='outline'
                onClick={resetForm}
                disabled={isSubmitting}
                className='flex-1 sm:flex-initial'
              >
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success/Error Modal */}
      <Dialog
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle
              className={
                submissionResult?.success
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-destructive'
              }
            >
              {submissionResult?.success
                ? 'Registration Successful!'
                : 'Registration Failed'}
            </DialogTitle>
            <DialogDescription>
              {submissionResult?.message}
              {submissionResult?.success && submissionResult.userId && (
                <span className='block mt-2 font-medium'>
                  Your user ID is: #{submissionResult.userId}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='sm:justify-start'>
            <Button
              type='button'
              variant={submissionResult?.success ? 'default' : 'outline'}
              onClick={handleModalClose}
            >
              {submissionResult?.success ? 'Continue' : 'Try Again'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

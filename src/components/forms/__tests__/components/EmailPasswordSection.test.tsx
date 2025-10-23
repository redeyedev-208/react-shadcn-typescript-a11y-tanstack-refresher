import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailPasswordSection } from '../../components/EmailPasswordSection';
import type { FormData, FormErrors } from '../../types';
import '@testing-library/jest-dom';

describe('EmailPasswordSection', () => {
  const mockOnInputChange = jest.fn();

  const defaultFormData: FormData = {
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

  const defaultErrors: FormErrors = {};

  let currentFormData: FormData;

  beforeEach(() => {
    mockOnInputChange.mockClear();
    currentFormData = { ...defaultFormData };
  });

  it('renders all form fields', () => {
    render(
      <EmailPasswordSection
        formData={defaultFormData}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />,
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('has proper fieldset and legend for accessibility', () => {
    render(
      <EmailPasswordSection
        formData={defaultFormData}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />,
    );

    const fieldset = screen.getByRole('group', {
      name: /account credentials/i,
    });
    expect(fieldset).toBeInTheDocument();
  });

  describe('email field', () => {
    it('calls onInputChange when email changes', async () => {
      const user = userEvent.setup();

      let currentFormData = { ...defaultFormData };
      const testOnInputChange = (
        field: keyof FormData,
        value: string | boolean,
      ) => {
        mockOnInputChange(field, value);
        currentFormData = { ...currentFormData, [field]: value };
        rerender(
          <EmailPasswordSection
            formData={currentFormData}
            errors={defaultErrors}
            onInputChange={testOnInputChange}
          />,
        );
      };

      const { rerender } = render(
        <EmailPasswordSection
          formData={currentFormData}
          errors={defaultErrors}
          onInputChange={testOnInputChange}
        />,
      );

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'test@example.com');

      expect(mockOnInputChange).toHaveBeenCalledWith(
        'email',
        expect.any(String),
      );

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('displays email error when present', () => {
      const errors = { email: 'Email is required' };
      render(
        <EmailPasswordSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('has proper accessibility attributes', () => {
      render(
        <EmailPasswordSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
      expect(emailInput).toHaveAttribute('required');
    });
  });

  describe('password field', () => {
    it('calls onInputChange when password changes', async () => {
      const testOnInputChange = (
        field: keyof FormData,
        value: string | boolean,
      ) => {
        if (field === 'password' && typeof value === 'string') {
          currentFormData.password = value;
          rerender(
            <EmailPasswordSection
              formData={currentFormData}
              errors={defaultErrors}
              onInputChange={testOnInputChange}
            />,
          );
        }
        mockOnInputChange(field, value);
      };

      const user = userEvent.setup();
      const { rerender } = render(
        <EmailPasswordSection
          formData={currentFormData}
          errors={defaultErrors}
          onInputChange={testOnInputChange}
        />,
      );

      const passwordInput = screen.getByLabelText(/^password/i);
      await user.type(passwordInput, 'Password123');

      expect(mockOnInputChange).toHaveBeenCalledWith('password', 'Password123');
    });

    it('displays password strength indicator', () => {
      const formDataWithPassword = {
        ...defaultFormData,
        password: 'Password123',
      };
      render(
        <EmailPasswordSection
          formData={formDataWithPassword}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(/password strength:\s*strong/i),
      ).toBeInTheDocument();
    });

    it('shows weak password strength for simple passwords', () => {
      const formDataWithWeakPassword = { ...defaultFormData, password: 'weak' };
      render(
        <EmailPasswordSection
          formData={formDataWithWeakPassword}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(/password strength:\s*weak/i),
      ).toBeInTheDocument();
    });

    it('displays password error when present', () => {
      const errors = { password: 'Password is required' };
      render(
        <EmailPasswordSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('has proper accessibility attributes', () => {
      render(
        <EmailPasswordSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const passwordInput = screen.getByLabelText(/^password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('autoComplete', 'new-password');
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('aria-describedby');
    });
  });

  describe('confirm password field', () => {
    it('calls onInputChange when confirm password changes', async () => {
      const testOnInputChange = (
        field: keyof FormData,
        value: string | boolean,
      ) => {
        if (field === 'confirmPassword' && typeof value === 'string') {
          currentFormData.confirmPassword = value;
          rerender(
            <EmailPasswordSection
              formData={currentFormData}
              errors={defaultErrors}
              onInputChange={testOnInputChange}
            />,
          );
        }
        mockOnInputChange(field, value);
      };

      const user = userEvent.setup();
      const { rerender } = render(
        <EmailPasswordSection
          formData={currentFormData}
          errors={defaultErrors}
          onInputChange={testOnInputChange}
        />,
      );

      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      await user.type(confirmPasswordInput, 'Password123');

      expect(mockOnInputChange).toHaveBeenCalledWith(
        'confirmPassword',
        'Password123',
      );
    });

    it('displays confirm password error when present', () => {
      const errors = { confirmPassword: 'Passwords do not match' };
      render(
        <EmailPasswordSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('has proper accessibility attributes', () => {
      render(
        <EmailPasswordSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute(
        'autoComplete',
        'new-password',
      );
      expect(confirmPasswordInput).toHaveAttribute('required');
    });
  });

  describe('password strength calculations', () => {
    it('calculates weak strength correctly', () => {
      const formDataWithWeakPassword = { ...defaultFormData, password: 'weak' };
      render(
        <EmailPasswordSection
          formData={formDataWithWeakPassword}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(/password strength:\s*weak/i),
      ).toBeInTheDocument();
    });

    it('calculates fair strength correctly', () => {
      const formDataWithFairPassword = {
        ...defaultFormData,
        password: 'password',
      };
      render(
        <EmailPasswordSection
          formData={formDataWithFairPassword}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(/password strength:\s*fair/i),
      ).toBeInTheDocument();
    });

    it('calculates good strength correctly', () => {
      const formDataWithGoodPassword = {
        ...defaultFormData,
        password: 'Password',
      };
      render(
        <EmailPasswordSection
          formData={formDataWithGoodPassword}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(/password strength:\s*good/i),
      ).toBeInTheDocument();
    });

    it('calculates strong strength correctly', () => {
      const formDataWithStrongPassword = {
        ...defaultFormData,
        password: 'Password123',
      };
      render(
        <EmailPasswordSection
          formData={formDataWithStrongPassword}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(/password strength:\s*strong/i),
      ).toBeInTheDocument();
    });
  });

  describe('error accessibility', () => {
    it('has proper aria-live attributes for errors', () => {
      const errors = { email: 'Email is required' };
      render(
        <EmailPasswordSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      const errorElement = screen.getByText('Email is required');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });
  });
});

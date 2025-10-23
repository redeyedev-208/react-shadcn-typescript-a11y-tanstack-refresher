import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PersonalInfoSection } from '../../components/PersonalInfoSection';
import type { FormData, FormErrors } from '../../types';
import '@testing-library/jest-dom';

describe('PersonalInfoSection', () => {
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

  beforeEach(() => {
    mockOnInputChange.mockClear();
  });

  it('renders all form fields', () => {
    render(
      <PersonalInfoSection
        formData={defaultFormData}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />,
    );

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
  });

  it('has proper fieldset and legend for accessibility', () => {
    render(
      <PersonalInfoSection
        formData={defaultFormData}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />,
    );

    const fieldset = screen.getByRole('group', {
      name: /personal information/i,
    });
    expect(fieldset).toBeInTheDocument();
  });

  describe('name fields', () => {
    it('calls onInputChange when first name changes', async () => {
      const user = userEvent.setup();

      let currentFormData = { ...defaultFormData };
      const testOnInputChange = (
        field: keyof FormData,
        value: string | boolean,
      ) => {
        mockOnInputChange(field, value);
        currentFormData = { ...currentFormData, [field]: value };
        rerender(
          <PersonalInfoSection
            formData={currentFormData}
            errors={defaultErrors}
            onInputChange={testOnInputChange}
          />,
        );
      };

      const { rerender } = render(
        <PersonalInfoSection
          formData={currentFormData}
          errors={defaultErrors}
          onInputChange={testOnInputChange}
        />,
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.type(firstNameInput, 'John');

      expect(mockOnInputChange).toHaveBeenCalledWith('firstName', 'J');
      expect(mockOnInputChange).toHaveBeenCalledWith('firstName', 'Jo');
      expect(mockOnInputChange).toHaveBeenCalledWith('firstName', 'Joh');
      expect(mockOnInputChange).toHaveBeenCalledWith('firstName', 'John');

      expect(firstNameInput).toHaveValue('John');
    });

    it('calls onInputChange when last name changes', async () => {
      const user = userEvent.setup();

      let currentFormData = { ...defaultFormData };
      const testOnInputChange = (
        field: keyof FormData,
        value: string | boolean,
      ) => {
        mockOnInputChange(field, value);
        currentFormData = { ...currentFormData, [field]: value };
        rerender(
          <PersonalInfoSection
            formData={currentFormData}
            errors={defaultErrors}
            onInputChange={testOnInputChange}
          />,
        );
      };

      const { rerender } = render(
        <PersonalInfoSection
          formData={currentFormData}
          errors={defaultErrors}
          onInputChange={testOnInputChange}
        />,
      );

      const lastNameInput = screen.getByLabelText(/last name/i);
      await user.type(lastNameInput, 'Doe');

      expect(mockOnInputChange).toHaveBeenCalledWith('lastName', 'D');
      expect(mockOnInputChange).toHaveBeenCalledWith('lastName', 'Do');
      expect(mockOnInputChange).toHaveBeenCalledWith('lastName', 'Doe');

      expect(lastNameInput).toHaveValue('Doe');
    });

    it('displays name errors when present', () => {
      const errors = {
        firstName: 'First name is required',
        lastName: 'Last name is required',
      };
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
    });
  });

  describe('birth date field', () => {
    it('calls onInputChange when birth date changes', async () => {
      const user = userEvent.setup();
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const birthDateInput = screen.getByLabelText(/date of birth/i);
      await user.type(birthDateInput, '1990-01-01');

      expect(mockOnInputChange).toHaveBeenCalledWith('birthDate', '1990-01-01');
    });

    it('displays age calculation', () => {
      const formDataWithBirthDate = {
        ...defaultFormData,
        birthDate: '1990-01-01',
      };
      render(
        <PersonalInfoSection
          formData={formDataWithBirthDate}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByText(/age:/i)).toBeInTheDocument();
      expect(screen.getByText(/years old/i)).toBeInTheDocument();
    });

    it('has maximum date constraint', () => {
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const birthDateInput = screen.getByLabelText(/date of birth/i);
      const today = new Date().toISOString().split('T')[0];
      expect(birthDateInput).toHaveAttribute('max', today);
    });

    it('displays birth date error when present', () => {
      const errors = { birthDate: 'Date of birth is required' };
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
    });
  });

  describe('country select', () => {
    it('displays country selector with placeholder', () => {
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByText('Select your country')).toBeInTheDocument();
    });

    it('displays country error when present', () => {
      const errors = { country: 'Please select your country' };
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText('Please select your country'),
      ).toBeInTheDocument();
    });
  });

  describe('phone number field', () => {
    it('is marked as optional', () => {
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByLabelText(/phone number \(optional\)/i),
      ).toBeInTheDocument();
    });

    it('calls onInputChange when phone number changes', async () => {
      const user = userEvent.setup();

      let currentFormData = { ...defaultFormData };
      const testOnInputChange = (
        field: keyof FormData,
        value: string | boolean,
      ) => {
        mockOnInputChange(field, value);
        currentFormData = { ...currentFormData, [field]: value };
        rerender(
          <PersonalInfoSection
            formData={currentFormData}
            errors={defaultErrors}
            onInputChange={testOnInputChange}
          />,
        );
      };

      const { rerender } = render(
        <PersonalInfoSection
          formData={currentFormData}
          errors={defaultErrors}
          onInputChange={testOnInputChange}
        />,
      );

      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.type(phoneInput, '+1234567890');

      expect(mockOnInputChange).toHaveBeenCalledWith(
        'phoneNumber',
        expect.any(String),
      );

      expect(phoneInput).toHaveValue('+1234567890');
    });

    it('has proper input type and attributes', () => {
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const phoneInput = screen.getByLabelText(/phone number/i);
      expect(phoneInput).toHaveAttribute('type', 'tel');
      expect(phoneInput).toHaveAttribute('autoComplete', 'tel');
      expect(phoneInput).toHaveAttribute('placeholder', '+1 (555) 123-4567');
    });
  });

  describe('bio field', () => {
    it('is marked as optional', () => {
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByLabelText(/bio \(optional\)/i)).toBeInTheDocument();
    });

    it('calls onInputChange when bio changes', async () => {
      const user = userEvent.setup();

      let currentFormData = { ...defaultFormData };
      const testOnInputChange = (
        field: keyof FormData,
        value: string | boolean,
      ) => {
        mockOnInputChange(field, value);
        currentFormData = { ...currentFormData, [field]: value };
        rerender(
          <PersonalInfoSection
            formData={currentFormData}
            errors={defaultErrors}
            onInputChange={testOnInputChange}
          />,
        );
      };

      const { rerender } = render(
        <PersonalInfoSection
          formData={currentFormData}
          errors={defaultErrors}
          onInputChange={testOnInputChange}
        />,
      );

      const bioInput = screen.getByLabelText(/bio/i);
      await user.type(bioInput, 'Test bio');

      expect(mockOnInputChange).toHaveBeenCalledWith('bio', expect.any(String));
      expect(bioInput).toHaveValue('Test bio');
    });

    it('displays character count', () => {
      const formDataWithBio = { ...defaultFormData, bio: 'Test bio' };
      render(
        <PersonalInfoSection
          formData={formDataWithBio}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByText('8/500 characters')).toBeInTheDocument();
    });

    it('has proper attributes', () => {
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const bioInput = screen.getByLabelText(/bio/i);
      expect(bioInput).toHaveAttribute('rows', '4');
      expect(bioInput).toHaveAttribute('maxLength', '500');
      expect(bioInput).toHaveAttribute(
        'placeholder',
        'Tell us a bit about yourself...',
      );
    });
  });

  describe('accessibility features', () => {
    it('has proper ARIA attributes for required fields', () => {
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const birthDateInput = screen.getByLabelText(/date of birth/i);

      expect(firstNameInput).toHaveAttribute('required');
      expect(lastNameInput).toHaveAttribute('required');
      expect(birthDateInput).toHaveAttribute('required');
    });

    it('has proper autocomplete attributes', () => {
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);

      expect(firstNameInput).toHaveAttribute('autoComplete', 'given-name');
      expect(lastNameInput).toHaveAttribute('autoComplete', 'family-name');
    });

    it('has proper error accessibility attributes', () => {
      const errors = { firstName: 'First name is required' };
      render(
        <PersonalInfoSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      const errorElement = screen.getByText('First name is required');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
      expect(errorElement).toHaveAttribute('role', 'alert');

      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
    });
  });
});

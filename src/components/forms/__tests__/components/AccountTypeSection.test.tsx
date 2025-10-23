import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountTypeSection } from '../../components/AccountTypeSection';
import type { FormData, FormErrors } from '../../types';
import '@testing-library/jest-dom';

describe('AccountTypeSection', () => {
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

  it('renders all account type options', () => {
    render(
      <AccountTypeSection
        formData={defaultFormData}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />,
    );

    expect(screen.getByLabelText(/personal account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/business account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enterprise account/i)).toBeInTheDocument();
  });

  it('has proper fieldset and legend for accessibility', () => {
    render(
      <AccountTypeSection
        formData={defaultFormData}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />,
    );

    const fieldset = screen.getByRole('group', { name: /account type/i });
    expect(fieldset).toBeInTheDocument();
  });

  it('displays account type descriptions', () => {
    render(
      <AccountTypeSection
        formData={defaultFormData}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />,
    );

    expect(
      screen.getByText(/for individual use and personal projects/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/for companies and organizations/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/for large organizations with advanced features/i),
    ).toBeInTheDocument();
  });

  describe('radio group functionality', () => {
    it('calls onInputChange when personal account is selected', async () => {
      const user = userEvent.setup();
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const personalRadio = screen.getByLabelText(/personal account/i);
      await user.click(personalRadio);

      expect(mockOnInputChange).toHaveBeenCalledWith('accountType', 'personal');
    });

    it('calls onInputChange when business account is selected', async () => {
      const user = userEvent.setup();
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const businessRadio = screen.getByLabelText(/business account/i);
      await user.click(businessRadio);

      expect(mockOnInputChange).toHaveBeenCalledWith('accountType', 'business');
    });

    it('calls onInputChange when enterprise account is selected', async () => {
      const user = userEvent.setup();
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const enterpriseRadio = screen.getByLabelText(/enterprise account/i);
      await user.click(enterpriseRadio);

      expect(mockOnInputChange).toHaveBeenCalledWith(
        'accountType',
        'enterprise',
      );
    });

    it('shows selected account type', () => {
      const formDataWithSelection = {
        ...defaultFormData,
        accountType: 'business',
      };
      render(
        <AccountTypeSection
          formData={formDataWithSelection}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const businessRadio = screen.getByLabelText(/business account/i);
      expect(businessRadio).toBeChecked();
    });
  });

  describe('error handling', () => {
    it('displays error when account type is not selected', () => {
      const errors = { accountType: 'Please select an account type' };
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText('Please select an account type'),
      ).toBeInTheDocument();
    });

    it('has proper error accessibility attributes', () => {
      const errors = { accountType: 'Please select an account type' };
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      const errorElement = screen.getByText('Please select an account type');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
      expect(errorElement).toHaveAttribute('role', 'alert');

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-invalid', 'true');
      expect(radioGroup).toHaveAttribute(
        'aria-describedby',
        'accountType-error',
      );
    });
  });

  describe('accessibility features', () => {
    it('has proper radio group structure', () => {
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });

    it('has proper labels and values', () => {
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const personalRadio = screen.getByRole('radio', {
        name: /personal account/i,
      });
      const businessRadio = screen.getByRole('radio', {
        name: /business account/i,
      });
      const enterpriseRadio = screen.getByRole('radio', {
        name: /enterprise account/i,
      });

      expect(personalRadio).toHaveAttribute('value', 'personal');
      expect(businessRadio).toHaveAttribute('value', 'business');
      expect(enterpriseRadio).toHaveAttribute('value', 'enterprise');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const personalRadio = screen.getByRole('radio', {
        name: /personal account/i,
      });

      await user.tab();
      expect(personalRadio).toHaveFocus();

      await user.keyboard('{ArrowDown}');

      const businessRadio = screen.getByRole('radio', {
        name: /business account/i,
      });
      expect(businessRadio).toHaveFocus();
    });

    it('has clickable labels', async () => {
      const user = userEvent.setup();
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const personalLabel = screen.getByText('Personal Account');
      await user.click(personalLabel);

      expect(mockOnInputChange).toHaveBeenCalledWith('accountType', 'personal');
    });
  });

  describe('required field indicator', () => {
    it('displays required asterisk', () => {
      render(
        <AccountTypeSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(screen.getByText(/select account type \*/i)).toBeInTheDocument();
    });
  });
});

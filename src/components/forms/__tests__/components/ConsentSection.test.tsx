import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsentSection } from '../../components/ConsentSection';
import type { FormData, FormErrors } from '../../types';
import '@testing-library/jest-dom';

describe('ConsentSection', () => {
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

  it('renders all consent checkboxes', () => {
    render(
      <ConsentSection
        formData={defaultFormData}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />,
    );

    expect(
      screen.getByLabelText(/subscribe to newsletter/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/i agree to data processing/i),
    ).toBeInTheDocument();
  });

  it('has proper fieldset and legend for accessibility', () => {
    render(
      <ConsentSection
        formData={defaultFormData}
        errors={defaultErrors}
        onInputChange={mockOnInputChange}
      />,
    );

    const fieldset = screen.getByRole('group', { name: /privacy & consent/i });
    expect(fieldset).toBeInTheDocument();
  });

  describe('newsletter subscription', () => {
    it('is marked as optional', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(/subscribe to newsletter \(optional\)/i),
      ).toBeInTheDocument();
    });

    it('calls onInputChange when newsletter checkbox is toggled', async () => {
      const user = userEvent.setup();
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const newsletterCheckbox = screen.getByLabelText(
        /subscribe to newsletter/i,
      );
      await user.click(newsletterCheckbox);

      expect(mockOnInputChange).toHaveBeenCalledWith('newsletter', true);
    });

    it('displays newsletter description', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(/get updates about new features, security updates/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/you can unsubscribe at any time/i),
      ).toBeInTheDocument();
    });

    it('reflects checkbox state', () => {
      const formDataWithNewsletter = { ...defaultFormData, newsletter: true };
      render(
        <ConsentSection
          formData={formDataWithNewsletter}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const newsletterCheckbox = screen.getByLabelText(
        /subscribe to newsletter/i,
      );
      expect(newsletterCheckbox).toBeChecked();
    });
  });

  describe('data processing consent', () => {
    it('is marked as required', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(/i agree to data processing \*/i),
      ).toBeInTheDocument();
    });

    it('calls onInputChange when data processing checkbox is toggled', async () => {
      const user = userEvent.setup();
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const dataProcessingCheckbox = screen.getByLabelText(
        /i agree to data processing/i,
      );
      await user.click(dataProcessingCheckbox);

      expect(mockOnInputChange).toHaveBeenCalledWith('dataProcessing', true);
    });

    it('displays privacy policy and terms links', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      const termsLink = screen.getByRole('link', { name: /terms of service/i });

      expect(privacyLink).toBeInTheDocument();
      expect(termsLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '#privacy');
      expect(termsLink).toHaveAttribute('href', '#terms');
    });

    it('displays detailed description', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(
          /i understand and agree that my personal data will be processed/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/this consent is required to create your account/i),
      ).toBeInTheDocument();
    });

    it('reflects checkbox state', () => {
      const formDataWithConsent = { ...defaultFormData, dataProcessing: true };
      render(
        <ConsentSection
          formData={formDataWithConsent}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const dataProcessingCheckbox = screen.getByLabelText(
        /i agree to data processing/i,
      );
      expect(dataProcessingCheckbox).toBeChecked();
    });

    it('has required attribute', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const dataProcessingCheckbox = screen.getByLabelText(
        /i agree to data processing/i,
      );

      expect(dataProcessingCheckbox).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('error handling', () => {
    it('displays error when data processing consent is not given', () => {
      const errors = {
        dataProcessing:
          'You must agree to data processing to create an account',
      };
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen.getByText(
          'You must agree to data processing to create an account',
        ),
      ).toBeInTheDocument();
    });

    it('has proper error accessibility attributes', () => {
      const errors = {
        dataProcessing:
          'You must agree to data processing to create an account',
      };
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={errors}
          onInputChange={mockOnInputChange}
        />,
      );

      const errorElement = screen.getByText(
        'You must agree to data processing to create an account',
      );
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
      expect(errorElement).toHaveAttribute('role', 'alert');

      const dataProcessingCheckbox = screen.getByLabelText(
        /i agree to data processing/i,
      );
      expect(dataProcessingCheckbox).toHaveAttribute('aria-invalid', 'true');
      expect(dataProcessingCheckbox).toHaveAttribute(
        'aria-describedby',
        'dataProcessing-description dataProcessing-error',
      );
    });
  });

  describe('accessibility features', () => {
    it('has proper checkbox roles', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
    });

    it('has proper label associations', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const newsletterCheckbox = screen.getByLabelText(
        /subscribe to newsletter/i,
      );
      const dataProcessingCheckbox = screen.getByLabelText(
        /i agree to data processing/i,
      );

      expect(newsletterCheckbox).toHaveAttribute('id', 'newsletter');
      expect(dataProcessingCheckbox).toHaveAttribute('id', 'dataProcessing');
    });

    it('has descriptive text with proper IDs', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      expect(
        screen
          .getByText(/get updates about new features/i)
          .closest('[id="newsletter-description"]'),
      ).toBeTruthy();
      expect(
        screen
          .getByText(/i understand and agree/i)
          .closest('[id="dataProcessing-description"]'),
      ).toBeTruthy();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const newsletterCheckbox = screen.getByLabelText(
        /subscribe to newsletter/i,
      );

      await user.tab();
      expect(newsletterCheckbox).toHaveFocus();

      await user.keyboard(' ');
      expect(mockOnInputChange).toHaveBeenCalledWith('newsletter', true);
    });

    it('has clickable labels', async () => {
      const user = userEvent.setup();
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const newsletterLabel = screen.getByText(
        'Subscribe to Newsletter (Optional)',
      );
      await user.click(newsletterLabel);

      expect(mockOnInputChange).toHaveBeenCalledWith('newsletter', true);
    });
  });

  describe('link accessibility', () => {
    it('has proper focus styles for links', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      const termsLink = screen.getByRole('link', { name: /terms of service/i });

      expect(privacyLink).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary',
        'focus:ring-offset-2',
      );
      expect(termsLink).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary',
        'focus:ring-offset-2',
      );
    });

    it('has proper hover styles for links', () => {
      render(
        <ConsentSection
          formData={defaultFormData}
          errors={defaultErrors}
          onInputChange={mockOnInputChange}
        />,
      );

      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      const termsLink = screen.getByRole('link', { name: /terms of service/i });

      expect(privacyLink).toHaveClass('underline', 'hover:no-underline');
      expect(termsLink).toHaveClass('underline', 'hover:no-underline');
    });
  });
});

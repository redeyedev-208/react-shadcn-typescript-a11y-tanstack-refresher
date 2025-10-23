import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessibleFormExamples } from '../AccessibleFormExamples';
import '@testing-library/jest-dom';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
  await user.type(screen.getByLabelText(/^password/i), 'Password123');
  await user.type(screen.getByLabelText(/confirm password/i), 'Password123');
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

  const countrySelect = screen.getByRole('combobox', { name: /country/i });
  await user.click(countrySelect);

  await user.keyboard('{ArrowDown}');
  await user.keyboard('{Enter}');

  await user.click(screen.getByRole('radio', { name: /personal account/i }));

  await user.click(screen.getByLabelText(/i agree to data processing/i));
};
describe('AccessibleFormExamples', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all sections', () => {
    render(<AccessibleFormExamples />);

    expect(screen.getByText('User Registration Form')).toBeInTheDocument();
    expect(
      screen.getByText(
        /create your account with this accessible registration form/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', { name: /account credentials/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /personal information/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /account type/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /privacy & consent/i }),
    ).toBeInTheDocument();
  });

  it('renders form action buttons', () => {
    render(<AccessibleFormExamples />);

    expect(
      screen.getByRole('button', { name: /create account/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /reset form/i }),
    ).toBeInTheDocument();
  });

  describe('form submission', () => {
    it('submits form successfully with valid data', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 123, message: 'Success' }),
      } as Response);

      render(<AccessibleFormExamples />);

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"email":"test@example.com"'),
      });

      await waitFor(() => {
        expect(
          screen.getByText('Registration Successful!'),
        ).toBeInTheDocument();
      });
    });

    it('shows validation errors for empty form submission', async () => {
      const user = userEvent.setup();
      render(<AccessibleFormExamples />);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      expect(mockFetch).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toHaveFocus();
      });
    });

    it('handles server errors gracefully', async () => {
      const user = userEvent.setup();

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<AccessibleFormExamples />);

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Registration Failed')).toBeInTheDocument();
      });

      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();

      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ id: 123 }),
                } as Response),
              100,
            ),
          ),
      );

      render(<AccessibleFormExamples />);

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      expect(screen.getByText('Creating Account...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(
          screen.getByText('Registration Successful!'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('form reset functionality', () => {
    it('resets all form fields when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(<AccessibleFormExamples />);

      await user.type(
        screen.getByLabelText(/email address/i),
        'test@example.com',
      );
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.click(screen.getByLabelText(/subscribe to newsletter/i));

      const resetButton = screen.getByRole('button', { name: /reset form/i });
      await user.click(resetButton);

      expect(screen.getByLabelText(/email address/i)).toHaveValue('');
      expect(screen.getByLabelText(/first name/i)).toHaveValue('');
      expect(
        screen.getByLabelText(/subscribe to newsletter/i),
      ).not.toBeChecked();
    });

    it('resets form after successful submission', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 123 }),
      } as Response);

      render(<AccessibleFormExamples />);

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Registration Successful!'),
        ).toBeInTheDocument();
      });

      const continueButton = screen.getByRole('button', { name: /continue/i });
      await user.click(continueButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toHaveValue('');
        expect(screen.getByLabelText(/first name/i)).toHaveValue('');
      });
    });
  });

  describe('success modal', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 }),
      } as Response);
    });

    it('displays user ID in success modal', async () => {
      const user = userEvent.setup();
      render(<AccessibleFormExamples />);

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Registration Successful!'),
        ).toBeInTheDocument();
        expect(screen.getByText(/your user id is: #123/i)).toBeInTheDocument();
      });
    });

    it('can be closed without resetting form on error', async () => {
      const user = userEvent.setup();

      mockFetch.mockRejectedValueOnce(new Error('Server error'));

      render(<AccessibleFormExamples />);

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Registration Failed')).toBeInTheDocument();
      });

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      await user.click(tryAgainButton);

      expect(screen.getByLabelText(/email address/i)).toHaveValue(
        'test@example.com',
      );
    });
  });

  describe('accessibility features', () => {
    it('has proper form attributes', () => {
      render(<AccessibleFormExamples />);

      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('noValidate');
    });

    it('focuses on first error field when validation fails', async () => {
      const user = userEvent.setup();
      render(<AccessibleFormExamples />);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        const emailField = screen.getByLabelText(/email address/i);
        expect(emailField).toHaveFocus();
      });
    });

    it('scrolls to first error field on validation failure', async () => {
      const user = userEvent.setup();

      const mockScrollIntoView = Element.prototype.scrollIntoView as jest.Mock;
      mockScrollIntoView.mockClear();

      render(<AccessibleFormExamples />);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'center',
        });
      });
    });

    it('has proper heading structure', () => {
      render(<AccessibleFormExamples />);

      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('User Registration Form');
    });

    it('maintains focus management in modal', async () => {
      const user = userEvent.setup();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 123 }),
      } as Response);

      render(<AccessibleFormExamples />);

      await fillValidForm(user);

      const submitButton = screen.getByRole('button', {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('responsive behavior', () => {
    it('has responsive button layout classes', () => {
      render(<AccessibleFormExamples />);

      const buttonContainer = screen.getByRole('button', {
        name: /create account/i,
      }).parentElement;
      expect(buttonContainer).toHaveClass(
        'flex',
        'flex-col',
        'sm:flex-row',
        'gap-3',
      );
    });

    it('has responsive form layout', () => {
      render(<AccessibleFormExamples />);

      const card = screen
        .getByText('User Registration Form')
        .closest('.max-w-2xl');
      expect(card).toHaveClass('max-w-2xl', 'mx-auto');
    });
  });
});

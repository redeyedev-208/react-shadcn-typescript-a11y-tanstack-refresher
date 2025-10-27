import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageToggle } from '@/components/LanguageToggle';
import { LanguageProvider } from '@/contexts/LanguageContext';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

const mockChangeLanguage = jest.fn();

jest.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    currentLanguage: 'en',
    changeLanguage: mockChangeLanguage,
    isRTL: false,
  }),
}));

jest.mock('@/contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='language-provider'>{children}</div>
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('LanguageToggle', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
  });

  it('renders the language toggle button', () => {
    renderWithProvider(<LanguageToggle />);

    const button = screen.getByRole('button', { name: /select language/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('🇺🇸 English');
  });

  it('displays current language flag and name', () => {
    renderWithProvider(<LanguageToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🇺🇸');
    expect(button).toHaveTextContent('English');
  });

  it('opens dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LanguageToggle />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    expect(screen.getAllByText('🇺🇸')[0]).toBeInTheDocument();
    expect(screen.getByText('🇪🇸')).toBeInTheDocument();
    expect(screen.getByText('🇫🇷')).toBeInTheDocument();
    expect(screen.getByText('🇩🇪')).toBeInTheDocument();
    expect(screen.getByText('🇨🇳')).toBeInTheDocument();
  });

  it('calls changeLanguage when a language option is selected', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LanguageToggle />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    const spanishOption = screen.getByText('Español');
    await user.click(spanishOption);

    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });

  it('highlights current language in dropdown', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LanguageToggle />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    const currentLanguageItem = screen
      .getByText('English')
      .closest('[role="menuitem"]');
    expect(currentLanguageItem).toHaveClass('bg-accent');
  });

  it('has proper accessibility attributes', () => {
    renderWithProvider(<LanguageToggle />);

    const button = screen.getByRole('button', { name: /select language/i });
    expect(button).toHaveAttribute('aria-label', 'Select language');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LanguageToggle />);

    const button = screen.getByRole('button', { name: /select language/i });

    button.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Español')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Español')).not.toBeInTheDocument();
    });
  });

  it('displays only flag on small screens', () => {
    renderWithProvider(<LanguageToggle />);

    const hiddenSpan = document.querySelector('.hidden.sm\\:inline');
    expect(hiddenSpan).toBeInTheDocument();
    expect(hiddenSpan).toHaveClass('hidden', 'sm:inline');

    const visibleSpan = document.querySelector('.sm\\:hidden');
    expect(visibleSpan).toBeInTheDocument();
    expect(visibleSpan).toHaveClass('sm:hidden');
  });

  it('handles language change errors gracefully', async () => {
    const user = userEvent.setup();

    // Mock console.error to prevent error output during test
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Mock changeLanguage to throw an error
    mockChangeLanguage.mockRejectedValueOnce(
      new Error('Failed to change language'),
    );

    renderWithProvider(<LanguageToggle />);

    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);

    const spanishOption = screen.getByText('Español');
    await user.click(spanishOption);

    // Should handle the error gracefully (line 30)
    await waitFor(() => {
      expect(mockChangeLanguage).toHaveBeenCalledWith('es');
    });

    // Error should be logged to console
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to change language:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});

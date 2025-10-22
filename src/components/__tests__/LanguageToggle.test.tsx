import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageToggle } from '@/components/LanguageToggle';
import { LanguageProvider } from '@/contexts/LanguageContext';
import '@testing-library/jest-dom';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock the useLanguage hook
const mockChangeLanguage = jest.fn();
jest.mock('@/contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="language-provider">{children}</div>
  ),
  useLanguage: () => ({
    currentLanguage: 'en',
    changeLanguage: mockChangeLanguage,
    isRTL: false,
  }),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  );
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
    
    // Check if all language options are visible
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
    
    // Click on Spanish option
    const spanishOption = screen.getByText('Español');
    await user.click(spanishOption);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('es');
  });

  it('highlights current language in dropdown', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LanguageToggle />);
    
    const button = screen.getByRole('button', { name: /select language/i });
    await user.click(button);
    
    // The current language (English) should have accent background
    const currentLanguageItem = screen.getByText('English').closest('[role="menuitem"]');
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
    
    // Focus the button and press Enter to open
    button.focus();
    await user.keyboard('{Enter}');
    
    // Should show dropdown options
    expect(screen.getByText('Español')).toBeInTheDocument();
    
    // Test Escape key to close
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText('Español')).not.toBeInTheDocument();
    });
  });

  it('displays only flag on small screens', () => {
    renderWithProvider(<LanguageToggle />);
    
    // Check that the hidden text element exists
    const hiddenSpan = document.querySelector('.hidden.sm\\:inline');
    expect(hiddenSpan).toBeInTheDocument();
    expect(hiddenSpan).toHaveClass('hidden', 'sm:inline');
    
    // Check visible flag for small screens
    const visibleSpan = document.querySelector('.sm\\:hidden');
    expect(visibleSpan).toBeInTheDocument();
    expect(visibleSpan).toHaveClass('sm:hidden');
  });
});
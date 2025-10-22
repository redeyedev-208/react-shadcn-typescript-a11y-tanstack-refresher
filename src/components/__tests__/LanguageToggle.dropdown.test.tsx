import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageToggle } from '@/components/LanguageToggle';

// Mock the i18next module
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </LanguageProvider>
  );
};

describe('LanguageToggle Dropdown Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens dropdown when clicked and shows all language options', async () => {
    const user = userEvent.setup();
    
    // Mock console.log to capture debug logs
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    renderWithProviders(<LanguageToggle />);
    
    // Find the language toggle button
    const toggleButton = screen.getByLabelText('Select language');
    expect(toggleButton).toBeInTheDocument();
    
    // Click the button to open dropdown
    await user.click(toggleButton);
    
    // Check that debug log was called
    expect(consoleSpy).toHaveBeenCalledWith('Language toggle clicked, current:', 'en');
    
    // Wait for dropdown to appear and check all language options
    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Español')).toBeInTheDocument();
      expect(screen.getByText('Français')).toBeInTheDocument();
      expect(screen.getByText('Deutsch')).toBeInTheDocument();
      expect(screen.getByText('中文')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('changes language when dropdown option is clicked', async () => {
    const user = userEvent.setup();
    
    // Mock console.log to capture debug logs
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    renderWithProviders(<LanguageToggle />);
    
    // Open dropdown
    const toggleButton = screen.getByLabelText('Select language');
    await user.click(toggleButton);
    
    // Wait for dropdown and click Spanish
    await waitFor(() => {
      expect(screen.getByText('Español')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Español'));
    
    // Check that language change was initiated
    expect(consoleSpy).toHaveBeenCalledWith('Changing language to:', 'es');
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Language changed to:', 'es');
    });
    
    consoleSpy.mockRestore();
  });

  it('displays current language correctly in button', () => {
    renderWithProviders(<LanguageToggle />);
    
    // Should show default English
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    expect(screen.getByText(/English/)).toBeInTheDocument();
  });

  it('dropdown button has correct ARIA attributes', () => {
    renderWithProviders(<LanguageToggle />);
    
    const toggleButton = screen.getByLabelText('Select language');
    
    expect(toggleButton).toHaveAttribute('aria-haspopup', 'menu');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('dropdown opens with keyboard navigation', async () => {
    renderWithProviders(<LanguageToggle />);
    
    const toggleButton = screen.getByLabelText('Select language');
    
    // Focus and press Enter to open dropdown
    toggleButton.focus();
    fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });
});
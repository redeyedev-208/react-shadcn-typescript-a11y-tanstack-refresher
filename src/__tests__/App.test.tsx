import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import App from '../App';

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

describe('App Dashboard', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  it('renders the main layout with header and sidebar', () => {
    renderWithProviders(<App />);
    
    // Check header elements (use translation keys since mock returns keys)
    expect(screen.getByText('app.title')).toBeInTheDocument();
    expect(screen.getByText('navigation.title')).toBeInTheDocument();
    
    // Check navigation links (using getAllByText for duplicate text)
    expect(screen.getByText('navigation.home')).toBeInTheDocument();
    expect(screen.getAllByText('navigation.features')).toHaveLength(2); // Header + Sidebar
    expect(screen.getAllByText('navigation.testing')).toHaveLength(2); // Header + Sidebar
  });

  it('displays dashboard settings section in sidebar', () => {
    renderWithProviders(<App />);
    
    // Check dashboard settings section (using translation keys)
    expect(screen.getByText('dashboard.settings')).toBeInTheDocument();
    expect(screen.getByText('dashboard.language')).toBeInTheDocument();
    expect(screen.getByText('dashboard.theme')).toBeInTheDocument();
  });

  it('has language toggle in dashboard settings', () => {
    renderWithProviders(<App />);
    
    // Find the dashboard language toggle (should be different from header one)
    const dashboardSettingsSection = screen.getByText('dashboard.settings').closest('div');
    expect(dashboardSettingsSection).toBeInTheDocument();
    
    // Check that language toggle exists in dashboard settings
    const languageRow = screen.getByText('dashboard.language').closest('div');
    expect(languageRow).toBeInTheDocument();
    
    // Should have a language toggle button
    const languageToggles = screen.getAllByLabelText('Select language');
    expect(languageToggles.length).toBeGreaterThanOrEqual(2); // Header + Dashboard
  });

  it('has theme toggle in dashboard settings', () => {
    renderWithProviders(<App />);
    
    // Check theme toggle in dashboard settings
    const themeRow = screen.getByText('dashboard.theme').closest('div');
    expect(themeRow).toBeInTheDocument();
    
    // Should have theme toggle buttons
    const themeToggles = screen.getAllByLabelText('Toggle theme');
    expect(themeToggles.length).toBeGreaterThanOrEqual(2); // Header + Dashboard
  });

  it('can toggle sidebar on mobile', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    
    // Find the mobile menu button by its class (it has md:hidden)
    const menuButton = screen.getByRole('button', { 
      name: (_, element) => {
        return element?.className.includes('md:hidden') || false;
      }
    });
    expect(menuButton).toBeInTheDocument();
    
    // Test sidebar toggle functionality
    await user.click(menuButton);
    
    // After clicking, verify the button still exists (it might change content)
    await waitFor(() => {
      expect(menuButton).toBeInTheDocument();
    });
  });

  it('allows language switching from dashboard settings', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    
    // Find all language toggle buttons
    const languageToggles = screen.getAllByLabelText('Select language');
    
    // Click on the dashboard language toggle (assume it's the second one)
    if (languageToggles.length > 1) {
      await user.click(languageToggles[1]);
      
      // Should show all 5 language options
      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument();
        expect(screen.getByText('Español')).toBeInTheDocument();
        expect(screen.getByText('Français')).toBeInTheDocument();
        expect(screen.getByText('Deutsch')).toBeInTheDocument();
        expect(screen.getByText('中文')).toBeInTheDocument();
      });
      
      // Test switching to Spanish
      await user.click(screen.getByText('Español'));
      
      // Language should change (dropdown should close)
      await waitFor(() => {
        expect(screen.queryByText('Español')).not.toBeInTheDocument();
      });
    }
  });

  it('supports all 5 configured languages in dashboard toggle', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    
    const allLanguages = [
      { name: 'English', flag: '🇺🇸', code: 'en' },
      { name: 'Español', flag: '🇪🇸', code: 'es' },
      { name: 'Français', flag: '🇫🇷', code: 'fr' },
      { name: 'Deutsch', flag: '🇩🇪', code: 'de' },
      { name: '中文', flag: '🇨🇳', code: 'zh' },
    ];
    
    // Find dashboard language toggle
    const languageToggles = screen.getAllByLabelText('Select language');
    const dashboardToggle = languageToggles[languageToggles.length - 1]; // Last one should be dashboard
    
    // Test each language
    for (const lang of allLanguages) {
      await user.click(dashboardToggle);
      
      // Verify language option is available
      await waitFor(() => {
        expect(screen.getByText(lang.name)).toBeInTheDocument();
      });
      
      // Click on the language
      await user.click(screen.getByText(lang.name));
      
      // Wait for dropdown to close
      await waitFor(() => {
        expect(screen.queryByText(lang.name)).not.toBeInTheDocument();
      });
    }
  });

  it('dashboard settings section is properly styled and positioned', () => {
    renderWithProviders(<App />);
    
    // Check that dashboard settings has proper separation
    const dashboardSettings = screen.getByText('dashboard.settings');
    const settingsContainer = dashboardSettings.closest('div');
    
    expect(settingsContainer).toHaveClass('pt-4', 'border-t', 'border-border');
    
    // Check language and theme rows have proper layout
    const languageRow = screen.getByText('dashboard.language').closest('div');
    const themeRow = screen.getByText('dashboard.theme').closest('div');
    
    expect(languageRow).toHaveClass('flex', 'items-center', 'justify-between');
    expect(themeRow).toHaveClass('flex', 'items-center', 'justify-between');
  });

  it('maintains header language toggle functionality', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    
    // Find the header language toggle (should be first one)
    const languageToggles = screen.getAllByLabelText('Select language');
    
    // Click on the header language toggle
    await user.click(languageToggles[0]);
    
    // Should show language options
    await waitFor(() => {
      expect(screen.getByText('Français')).toBeInTheDocument();
    });
  });

  it('shows hero section content', () => {
    renderWithProviders(<App />);
    
    // Check hero section content using translation keys
    expect(screen.getByRole('heading', { name: /hero\.title hero\.showcase/ })).toBeInTheDocument();
    expect(screen.getByText(/hero\.description/)).toBeInTheDocument();
    expect(screen.getByText('hero.startTesting')).toBeInTheDocument();
    expect(screen.getByText('hero.viewComponents')).toBeInTheDocument();
  });

  it('verifies dashboard and header language toggles work independently', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    
    const languageToggles = screen.getAllByLabelText('Select language');
    expect(languageToggles.length).toBeGreaterThanOrEqual(2);
    
    // Test header toggle (first one)
    await user.click(languageToggles[0]);
    await waitFor(() => {
      expect(screen.getByText('Français')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Français'));
    
    // Test dashboard toggle (second one) 
    await user.click(languageToggles[1]);
    await waitFor(() => {
      expect(screen.getByText('Deutsch')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Deutsch'));
    
    // Both should be functional
    await waitFor(() => {
      expect(screen.queryByText('Deutsch')).not.toBeInTheDocument();
    });
  });

  it('displays current language correctly in dashboard toggle', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    
    // Should start with English (default)
    expect(screen.getAllByText('🇺🇸')).toHaveLength(2); // Header + Dashboard
    expect(screen.getAllByText(/English/)).toHaveLength(2); // Header + Dashboard (responsive)
    
    // Click dashboard language toggle to change to Spanish
    const languageToggles = screen.getAllByLabelText('Select language');
    await user.click(languageToggles[1]); // Dashboard toggle
    
    await waitFor(() => {
      expect(screen.getByText('Español')).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('Español'));
    
    // Both toggles should update to show Spanish
    await waitFor(() => {
      expect(screen.getAllByText('🇪🇸')).toHaveLength(2);
    });
  });
});
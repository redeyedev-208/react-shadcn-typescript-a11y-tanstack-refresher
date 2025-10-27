import React from 'react';
import { render, screen } from '@testing-library/react';
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
      <ThemeProvider>{component}</ThemeProvider>
    </LanguageProvider>,
  );
};

describe('App Simple Coverage Tests', () => {
  it('renders About section content', () => {
    renderWithProviders(<App />);

    // Check About section heading exists
    expect(screen.getByText('About This Project')).toBeInTheDocument();

    // Check main content sections exist
    expect(screen.getByText(/Goals & Objectives/)).toBeInTheDocument();
    expect(screen.getByText(/Technical Excellence/)).toBeInTheDocument();

    // Check some key content is present to cover About section lines
    const accessibilityText = screen.getAllByText(
      /Accessibility Champions Programs/,
    );
    expect(accessibilityText.length).toBeGreaterThan(0);
    expect(
      screen.getByText(/WCAG 2\.2 AA\/AAA compliance/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Modern React development/)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive testing/)).toBeInTheDocument();
  });
});

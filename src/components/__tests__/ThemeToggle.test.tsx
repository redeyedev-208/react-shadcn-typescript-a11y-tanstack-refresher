import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@testing-library/jest-dom';

// Mock the useTheme hook
const mockSetTheme = jest.fn();
jest.mock('@/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('renders the theme toggle button', () => {
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it('displays sun and moon icons', () => {
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    
    // Both icons should be present but styled differently based on theme
    const sunIcon = button.querySelector('svg');
    expect(sunIcon).toBeInTheDocument();
  });

  it('opens dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    // Check if all theme options are visible
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('calls setTheme when light option is selected', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    const lightOption = screen.getByText('Light');
    await user.click(lightOption);
    
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('calls setTheme when dark option is selected', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    const darkOption = screen.getByText('Dark');
    await user.click(darkOption);
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme when system option is selected', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    const systemOption = screen.getByText('System');
    await user.click(systemOption);
    
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('has proper accessibility attributes', () => {
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    
    // Focus the button and press Enter to open
    button.focus();
    await user.keyboard('{Enter}');
    
    // Should show dropdown options
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    
    // Test Escape key to close
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByText('Light')).not.toBeInTheDocument();
    });
  });

  it('has screen reader text for accessibility', () => {
    renderWithProvider(<ThemeToggle />);
    
    const screenReaderText = screen.getByText('Toggle theme');
    expect(screenReaderText).toHaveClass('sr-only');
  });

  it('displays theme icons with proper styling classes', () => {
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    const sunIcon = button.querySelector('svg');
    
    expect(sunIcon).toHaveClass('h-4', 'w-4', 'rotate-0', 'scale-100', 'transition-all', 'dark:-rotate-90', 'dark:scale-0');
  });
});
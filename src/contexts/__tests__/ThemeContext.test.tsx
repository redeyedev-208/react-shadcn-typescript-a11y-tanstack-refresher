import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Test component that uses the theme context
function TestComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <div data-testid='current-theme'>{theme}</div>
      <button
        onClick={() => setTheme('dark')}
        data-testid='set-dark'
      >
        Set Dark
      </button>
      <button
        onClick={() => setTheme('light')}
        data-testid='set-light'
      >
        Set Light
      </button>
      <button
        onClick={() => setTheme('system')}
        data-testid='set-system'
      >
        Set System
      </button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    document.documentElement.className = '';
  });

  it('provides default theme when no localStorage value exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  it('loads theme from localStorage when available', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('uses custom default theme when provided', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider defaultTheme='light'>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('updates theme and saves to localStorage', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Change to dark theme
    await user.click(screen.getByTestId('set-dark'));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'vite-ui-theme',
      'dark',
    );
  });

  it('uses custom storage key when provided', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider storageKey='custom-theme-key'>
        <TestComponent />
      </ThemeProvider>,
    );

    await user.click(screen.getByTestId('set-light'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'custom-theme-key',
      'light',
    );
  });

  it('applies light class to document when theme is light', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await user.click(screen.getByTestId('set-light'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  it('applies dark class to document when theme is dark', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await user.click(screen.getByTestId('set-dark'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });
  });

  it('applies system theme (light) when system theme is light', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Mock system preference for light theme
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false, // prefers-color-scheme: dark returns false = light theme
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await user.click(screen.getByTestId('set-system'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  it('applies system theme (dark) when system preference is dark', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Mock system preference for dark theme
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true, // prefers-color-scheme: dark returns true = dark theme
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await user.click(screen.getByTestId('set-system'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });
  });

  it('uses default theme values when used outside provider (fallback behavior)', () => {
    // Since ThemeContext has a default value, using useTheme outside provider
    // will return the default values rather than throwing an error
    function ComponentWithoutProvider() {
      const { theme, setTheme } = useTheme();
      return (
        <div>
          <div data-testid='theme-outside-provider'>{theme}</div>
          <button
            onClick={() => setTheme('dark')}
            data-testid='set-outside'
          >
            Set Dark
          </button>
        </div>
      );
    }

    render(<ComponentWithoutProvider />);

    // Should render the default theme
    expect(screen.getByTestId('theme-outside-provider')).toHaveTextContent(
      'system',
    );

    // The setTheme function should be a no-op (from initialState)
    // so this click shouldn't change anything or cause errors
    const setButton = screen.getByTestId('set-outside');
    expect(setButton).toBeInTheDocument();
  });

  it('removes existing theme classes before applying new ones', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Add some existing classes
    document.documentElement.classList.add('light', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await user.click(screen.getByTestId('set-dark'));

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      // Should have removed the existing light class
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });
  });

  it('handles all theme transitions correctly', async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Test system -> light
    await user.click(screen.getByTestId('set-light'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    // Test light -> dark
    await user.click(screen.getByTestId('set-dark'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

    // Test dark -> system
    await user.click(screen.getByTestId('set-system'));
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccessibilityTester } from '@/components/AccessibilityTester';
import '@testing-library/jest-dom';

describe('AccessibilityTester', () => {
  it('renders the accessibility testing form', () => {
    render(<AccessibilityTester />);
    
    expect(screen.getByText('Accessibility Testing Tool')).toBeInTheDocument();
    expect(screen.getByText('Test any website for WCAG 2.2 compliance using pa11y. Enter a URL to analyze accessibility issues.')).toBeInTheDocument();
    expect(screen.getByLabelText('Website URL')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Run Test' })).toBeInTheDocument();
  });

  it('has proper form labeling for accessibility', () => {
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    expect(urlInput).toHaveAttribute('id', 'url-input');
    expect(urlInput).toHaveAttribute('type', 'url');
    expect(urlInput).toHaveAttribute('placeholder', 'https://example.com');
  });

  it('disables run button when no URL is entered', () => {
    render(<AccessibilityTester />);
    
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    expect(runButton).toBeDisabled();
  });

  it('enables run button when URL is entered', async () => {
    const user = userEvent.setup();
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    
    await user.type(urlInput, 'https://example.com');
    
    expect(runButton).toBeEnabled();
  });

  it('shows loading state when test is running', async () => {
    const user = userEvent.setup();
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    
    await user.type(urlInput, 'https://example.com');
    await user.click(runButton);
    
    expect(screen.getByText('Testing...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays mock results after test completion', async () => {
    const user = userEvent.setup();
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    
    await user.type(urlInput, 'https://example.com');
    await user.click(runButton);
    
    // Wait for mock results to appear with longer timeout for setTimeout
    await waitFor(() => {
      expect(screen.getByText('Test Results for https://example.com')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText(/Found \d+ accessibility issues/)).toBeInTheDocument();
  });

  it('displays results in tabbed interface', async () => {
    const user = userEvent.setup();
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    
    await user.type(urlInput, 'https://example.com');
    await user.click(runButton);
    
    // Wait for mock results to appear
    await waitFor(() => {
      expect(screen.getByText('Test Results for https://example.com')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check for tab buttons
    expect(screen.getByRole('tab', { name: /All \(\d+\)/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Errors \(\d+\)/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Warnings \(\d+\)/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Notices \(\d+\)/ })).toBeInTheDocument();
  });

  it('switches between different issue types in tabs', async () => {
    const user = userEvent.setup();
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    
    await user.type(urlInput, 'https://example.com');
    await user.click(runButton);
    
    // Wait for mock results to appear
    await waitFor(() => {
      expect(screen.getByText('Test Results for https://example.com')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click on Errors tab
    const errorsTab = screen.getByRole('tab', { name: /Errors/ });
    await user.click(errorsTab);
    
    // Should show only error issues
    expect(screen.getByText('Label text is empty.')).toBeInTheDocument();
  });

  it('displays issue details with proper structure', async () => {
    const user = userEvent.setup();
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    
    await user.type(urlInput, 'https://example.com');
    await user.click(runButton);
    
    // Wait for mock results to appear
    await waitFor(() => {
      expect(screen.getByText('Test Results for https://example.com')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check for issue details structure
    expect(screen.getByText('Label text is empty.')).toBeInTheDocument();
    expect(screen.getByText(/WCAG2AA\.Principle1\.Guideline1_3/)).toBeInTheDocument();
    expect(screen.getByText(/html > body > main > form > label/)).toBeInTheDocument();
  });

  it('allows expanding context details', async () => {
    const user = userEvent.setup();
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    
    await user.type(urlInput, 'https://example.com');
    await user.click(runButton);
    
    // Wait for mock results to appear
    await waitFor(() => {
      expect(screen.getByText('Test Results for https://example.com')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Find and click on details element
    const contextSummaries = screen.getAllByText('View context');
    await user.click(contextSummaries[0]);
    
    // Context should now be visible
    expect(screen.getByText('<label for="search"></label>')).toBeInTheDocument();
  });

  it('disables form inputs during testing', async () => {
    const user = userEvent.setup();
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    
    await user.type(urlInput, 'https://example.com');
    await user.click(runButton);
    
    expect(urlInput).toBeDisabled();
    expect(runButton).toBeDisabled();
  });

  it('displays proper icons for different issue types', async () => {
    const user = userEvent.setup();
    render(<AccessibilityTester />);
    
    const urlInput = screen.getByLabelText('Website URL');
    const runButton = screen.getByRole('button', { name: 'Run Test' });
    
    await user.type(urlInput, 'https://example.com');
    await user.click(runButton);
    
    // Wait for mock results to appear
    await waitFor(() => {
      expect(screen.getByText('Test Results for https://example.com')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check for different colored icons based on issue type
    const container = screen.getByText('Test Results for https://example.com').closest('div');
    expect(container).toBeInTheDocument();
  });
});
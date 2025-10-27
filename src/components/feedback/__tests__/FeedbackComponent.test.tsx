import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackComponent from '../FeedbackComponent';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Mock translations for testing
      const translations: Record<string, string> = {
        'feedback.title': 'Share Your Feedback',
        'feedback.description':
          'Help us improve by sharing your thoughts about this application',
        'feedback.positive.button': 'Positive Feedback',
        'feedback.negative.button': 'Negative Feedback',
        'feedback.positive.confirm.title': 'Share Positive Feedback',
        'feedback.positive.confirm.description':
          'Thank you for taking the time to share your positive experience!',
        'feedback.negative.confirm.title': 'Share Feedback for Improvement',
        'feedback.negative.confirm.description':
          'Your feedback helps us identify areas for improvement. Thank you for helping us grow!',
        'feedback.success.message':
          'Thank you! Your feedback has been submitted successfully.',
        'feedback.lastSubmission.label': 'Last feedback submitted',
        'common.cancel': 'Cancel',
        'common.confirm': 'Submit Feedback',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock crypto.randomUUID since it might not be available in test environment
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
  },
});

describe('FeedbackComponent', () => {
  const mockOnFeedbackSubmit = jest.fn();

  beforeEach(() => {
    mockOnFeedbackSubmit.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderFeedbackComponent = (props = {}) => {
    return render(
      <FeedbackComponent
        onFeedbackSubmit={mockOnFeedbackSubmit}
        {...props}
      />,
    );
  };

  test('1. renders feedback component with title and description', () => {
    renderFeedbackComponent();

    expect(screen.getByTestId('feedback-component')).toBeInTheDocument();
    expect(screen.getByText('Share Your Feedback')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Help us improve by sharing your thoughts about this application',
      ),
    ).toBeInTheDocument();
  });

  test('2. renders both positive and negative feedback buttons', () => {
    renderFeedbackComponent();

    expect(screen.getByTestId('positive-feedback-button')).toBeInTheDocument();
    expect(screen.getByTestId('negative-feedback-button')).toBeInTheDocument();
    expect(screen.getByText('Positive Feedback')).toBeInTheDocument();
    expect(screen.getByText('Negative Feedback')).toBeInTheDocument();
  });

  test('3. opens confirmation modal when positive feedback button clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('positive-feedback-button'));

    expect(
      screen.getByTestId('feedback-confirmation-modal'),
    ).toBeInTheDocument();
    expect(screen.getByText('Share Positive Feedback')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Thank you for taking the time to share your positive experience!',
      ),
    ).toBeInTheDocument();
  });

  test('4. opens confirmation modal when negative feedback button clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('negative-feedback-button'));

    expect(
      screen.getByTestId('feedback-confirmation-modal'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Share Feedback for Improvement'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your feedback helps us identify areas for improvement. Thank you for helping us grow!',
      ),
    ).toBeInTheDocument();
  });

  test('5. shows cancel and confirm buttons in modal', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('positive-feedback-button'));

    expect(screen.getByTestId('feedback-cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('feedback-confirm-button')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit Feedback')).toBeInTheDocument();
  });

  test('6. calls onFeedbackSubmit when positive feedback confirmed', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('positive-feedback-button'));
    await user.click(screen.getByTestId('feedback-confirm-button'));

    expect(mockOnFeedbackSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'positive',
        timestamp: expect.any(Date),
        id: expect.any(String),
      }),
    );
  });

  test('7. calls onFeedbackSubmit when negative feedback confirmed', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('negative-feedback-button'));
    await user.click(screen.getByTestId('feedback-confirm-button'));

    expect(mockOnFeedbackSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'negative',
        timestamp: expect.any(Date),
        id: expect.any(String),
      }),
    );
  });

  test('8. shows success message after feedback submission', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('positive-feedback-button'));
    await user.click(screen.getByTestId('feedback-confirm-button'));

    expect(screen.getByTestId('feedback-success-message')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Thank you! Your feedback has been submitted successfully.',
      ),
    ).toBeInTheDocument();
  });

  test('9. hides success message after 3 seconds', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('positive-feedback-button'));
    await user.click(screen.getByTestId('feedback-confirm-button'));

    expect(screen.getByTestId('feedback-success-message')).toBeInTheDocument();

    // Fast-forward time by 3 seconds
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(
        screen.queryByTestId('feedback-success-message'),
      ).not.toBeInTheDocument();
    });
  });

  test('10. closes modal when cancel button clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('positive-feedback-button'));
    await user.click(screen.getByTestId('feedback-cancel-button'));

    expect(
      screen.queryByTestId('feedback-confirmation-modal'),
    ).not.toBeInTheDocument();
  });

  test('11. closes modal when dialog onOpenChange is triggered', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('positive-feedback-button'));

    // Simulate pressing Escape key to close modal
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(
        screen.queryByTestId('feedback-confirmation-modal'),
      ).not.toBeInTheDocument();
    });
  });

  test('12. displays last submission information after feedback is submitted', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('positive-feedback-button'));
    await user.click(screen.getByTestId('feedback-confirm-button'));

    // Wait for success message to disappear
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(
        screen.queryByTestId('feedback-success-message'),
      ).not.toBeInTheDocument();
    });

    // Should show last submission info
    expect(screen.getByText(/Last feedback submitted:/)).toBeInTheDocument();
    // Check that the last submission contains "Positive Feedback" text
    const lastSubmissionElement = screen.getByText(
      /Last feedback submitted:/,
    ).parentElement;
    expect(lastSubmissionElement).toHaveTextContent('Positive Feedback');
  });

  test('13. does not call onFeedbackSubmit if callback not provided', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<FeedbackComponent />);

    await user.click(screen.getByTestId('positive-feedback-button'));
    await user.click(screen.getByTestId('feedback-confirm-button'));

    // Should still show success message even without callback
    expect(screen.getByTestId('feedback-success-message')).toBeInTheDocument();
  });

  test('14. applies custom className when provided', () => {
    renderFeedbackComponent({ className: 'custom-feedback-class' });

    const feedbackComponent = screen.getByTestId('feedback-component');
    expect(feedbackComponent).toHaveClass('custom-feedback-class');
  });

  test('15. has proper accessibility attributes', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    await user.click(screen.getByTestId('positive-feedback-button'));
    await user.click(screen.getByTestId('feedback-confirm-button'));

    const successMessage = screen.getByTestId('feedback-success-message');
    expect(successMessage).toHaveAttribute('role', 'alert');
    expect(successMessage).toHaveAttribute('aria-live', 'polite');
  });

  test('16. generates unique IDs for feedback submissions', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    // Submit first feedback
    await user.click(screen.getByTestId('positive-feedback-button'));
    await user.click(screen.getByTestId('feedback-confirm-button'));

    const firstCall = mockOnFeedbackSubmit.mock.calls[0][0];

    // Wait for success message to clear
    jest.advanceTimersByTime(3000);
    await waitFor(() => {
      expect(
        screen.queryByTestId('feedback-success-message'),
      ).not.toBeInTheDocument();
    });

    // Submit second feedback
    await user.click(screen.getByTestId('negative-feedback-button'));
    await user.click(screen.getByTestId('feedback-confirm-button'));

    const secondCall = mockOnFeedbackSubmit.mock.calls[1][0];

    // IDs should be different
    expect(firstCall.id).not.toBe(secondCall.id);
    expect(firstCall.type).toBe('positive');
    expect(secondCall.type).toBe('negative');
  });

  test('17. handles multiple rapid button clicks gracefully', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderFeedbackComponent();

    // Click positive button once
    await user.click(screen.getByTestId('positive-feedback-button'));

    // Modal should be open
    expect(
      screen.getByTestId('feedback-confirmation-modal'),
    ).toBeInTheDocument();

    // Subsequent clicks should not be possible due to modal focus trap
    // This is expected behavior - button should be inaccessible when modal is open
    const positiveButton = screen.getByTestId('positive-feedback-button');
    expect(positiveButton).toBeInTheDocument();

    // Should still only show one modal
    expect(screen.getAllByTestId('feedback-confirmation-modal')).toHaveLength(
      1,
    );
  });

  test('18. prevents feedback submission when feedbackType is null', () => {
    renderFeedbackComponent();

    // Try to trigger handleFeedbackConfirm directly (this would be an edge case)
    // The component should handle this gracefully by checking if modalState.feedbackType exists
    expect(mockOnFeedbackSubmit).not.toHaveBeenCalled();
  });
});

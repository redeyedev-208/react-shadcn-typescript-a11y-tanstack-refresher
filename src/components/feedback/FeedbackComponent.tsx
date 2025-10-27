import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Represents a user feedback submission with metadata.
 */
interface FeedbackType {
  type: 'positive' | 'negative';
  message?: string;
  timestamp: Date;
  id: string;
}

/**
 * Props for the FeedbackComponent.
 */
interface FeedbackComponentProps {
  /** Callback function called when feedback is submitted */
  onFeedbackSubmit?: (feedback: FeedbackType) => void;
  /** Additional CSS classes for styling */
  className?: string;
}

/**
 * Modal state for tracking feedback dialog visibility and type.
 */
type FeedbackModalState = {
  isOpen: boolean;
  feedbackType: 'positive' | 'negative' | null;
};

/**
 * Accessible feedback collection component with modal confirmation.
 *
 * Features:
 * - Keyboard navigation support
 * - Focus management - returns focus to triggering button after modal closes
 * - ARIA live regions for success announcements
 * - Confirmation modals for user feedback
 * - Internationalization support
 * - Professional UI without emoji clutter
 *
 * @param {FeedbackComponentProps} props - Component props
 * @returns {JSX.Element} Complete feedback interface with accessibility features
 */
const FeedbackComponent: React.FC<FeedbackComponentProps> = ({
  onFeedbackSubmit,
  className,
}) => {
  const { t } = useTranslation();

  // Refs for focus management
  const positiveButtonRef = useRef<HTMLButtonElement>(null);
  const negativeButtonRef = useRef<HTMLButtonElement>(null);

  // State for modal visibility and feedback type
  const [modalState, setModalState] = useState<FeedbackModalState>({
    isOpen: false,
    feedbackType: null,
  });

  // State for success notification
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  // State for submitted feedback (optional - for tracking)
  const [submittedFeedback, setSubmittedFeedback] =
    useState<FeedbackType | null>(null);

  // Primary handler functions
  const handlePositiveFeedback = (): void => {
    setModalState({
      isOpen: true,
      feedbackType: 'positive',
    });
  };

  const handleNegativeFeedback = (): void => {
    setModalState({
      isOpen: true,
      feedbackType: 'negative',
    });
  };

  // Secondary handler functions (modal actions)
  const handleFeedbackConfirm = (): void => {
    if (modalState.feedbackType) {
      const feedback: FeedbackType = {
        type: modalState.feedbackType,
        timestamp: new Date(),
        id: crypto.randomUUID(),
      };

      // Store feedback
      setSubmittedFeedback(feedback);

      // Call parent callback if provided
      onFeedbackSubmit?.(feedback);

      // Close modal and show success
      const currentFeedbackType = modalState.feedbackType;
      setModalState({ isOpen: false, feedbackType: null });
      setShowSuccessMessage(true);

      // Return focus to the triggering button after modal closes
      setTimeout(() => {
        if (currentFeedbackType === 'positive') {
          positiveButtonRef.current?.focus();
        } else {
          negativeButtonRef.current?.focus();
        }
      }, 100);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleFeedbackCancel = (): void => {
    const currentFeedbackType = modalState.feedbackType;
    setModalState({ isOpen: false, feedbackType: null });

    // Return focus to the triggering button after modal closes
    setTimeout(() => {
      if (currentFeedbackType === 'positive') {
        positiveButtonRef.current?.focus();
      } else {
        negativeButtonRef.current?.focus();
      }
    }, 100);
  };

  return (
    <Card
      className={className}
      data-testid='feedback-component'
    >
      <CardHeader>
        <CardTitle>{t('feedback.title')}</CardTitle>
        <CardDescription>{t('feedback.description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <Button
            ref={positiveButtonRef}
            onClick={handlePositiveFeedback}
            variant='default'
            className='flex items-center gap-2 w-full sm:w-auto min-w-[160px]'
            data-testid='positive-feedback-button'
          >
            {t('feedback.positive.button')}
          </Button>

          <Button
            ref={negativeButtonRef}
            onClick={handleNegativeFeedback}
            variant='outline'
            className='flex items-center gap-2 w-full sm:w-auto min-w-[160px]'
            data-testid='negative-feedback-button'
          >
            {t('feedback.negative.button')}
          </Button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div
            className='mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900/20 dark:border-green-600 dark:text-green-400'
            data-testid='feedback-success-message'
            role='alert'
            aria-live='polite'
          >
            {t('feedback.success.message')}
          </div>
        )}

        {/* Display last submitted feedback for demo purposes */}
        {submittedFeedback && !showSuccessMessage && (
          <div className='mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-400'>
            <p className='text-sm'>
              <strong>{t('feedback.lastSubmission.label')}:</strong>{' '}
              {submittedFeedback.type === 'positive'
                ? t('feedback.positive.button')
                : t('feedback.negative.button')}{' '}
              ({new Date(submittedFeedback.timestamp).toLocaleTimeString()})
            </p>
          </div>
        )}
      </CardContent>

      {/* Confirmation Modal */}
      <Dialog
        open={modalState.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleFeedbackCancel();
          }
        }}
      >
        <DialogContent data-testid='feedback-confirmation-modal'>
          <DialogHeader>
            <DialogTitle>
              {modalState.feedbackType === 'positive'
                ? t('feedback.positive.confirm.title')
                : t('feedback.negative.confirm.title')}
            </DialogTitle>
            <DialogDescription>
              {modalState.feedbackType === 'positive'
                ? t('feedback.positive.confirm.description')
                : t('feedback.negative.confirm.description')}
            </DialogDescription>
          </DialogHeader>

          <div className='flex gap-2 justify-end'>
            <Button
              variant='outline'
              onClick={handleFeedbackCancel}
              data-testid='feedback-cancel-button'
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleFeedbackConfirm}
              data-testid='feedback-confirm-button'
            >
              {t('common.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FeedbackComponent;

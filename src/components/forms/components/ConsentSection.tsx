import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { FormFieldProps } from '../types';

export function ConsentSection({
  formData,
  errors,
  onInputChange,
}: FormFieldProps) {
  return (
    <fieldset>
      <legend className='text-lg font-medium mb-4'>Privacy & Consent</legend>

      <div className='space-y-4'>
        <div className='flex items-start space-x-2'>
          <Checkbox
            id='newsletter'
            checked={formData.newsletter}
            onCheckedChange={(checked) =>
              onInputChange('newsletter', checked as boolean)
            }
            aria-describedby='newsletter-description'
          />
          <div className='flex-1'>
            <Label
              htmlFor='newsletter'
              className='font-normal cursor-pointer leading-relaxed'
            >
              Subscribe to Newsletter (Optional)
            </Label>
            <div
              id='newsletter-description'
              className='text-sm text-muted-foreground mt-1'
            >
              Get updates about new features, security updates, and product
              announcements. You can unsubscribe at any time.
            </div>
          </div>
        </div>

        <div className='flex items-start space-x-2'>
          <Checkbox
            id='dataProcessing'
            checked={formData.dataProcessing}
            onCheckedChange={(checked) =>
              onInputChange('dataProcessing', checked as boolean)
            }
            aria-describedby='dataProcessing-description dataProcessing-error'
            aria-invalid={errors.dataProcessing ? 'true' : 'false'}
            required
            aria-required='true'
            data-required='true'
          />
          <div className='flex-1'>
            <Label
              htmlFor='dataProcessing'
              className='font-normal cursor-pointer leading-relaxed'
            >
              I agree to data processing *
            </Label>
            <div
              id='dataProcessing-description'
              className='text-sm text-muted-foreground mt-1'
            >
              I understand and agree that my personal data will be processed
              according to the{' '}
              <a
                href='#privacy'
                className='text-primary underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href='#terms'
                className='text-primary underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
              >
                Terms of Service
              </a>
              . This consent is required to create your account and provide our
              services.
            </div>
            {errors.dataProcessing && (
              <div
                id='dataProcessing-error'
                className='text-sm text-destructive mt-1'
                role='alert'
                aria-live='polite'
              >
                {errors.dataProcessing}
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
}

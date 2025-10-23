import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FormFieldProps } from '../types';

export function AccountTypeSection({
  formData,
  errors,
  onInputChange,
}: FormFieldProps) {
  return (
    <fieldset>
      <legend className='text-lg font-medium mb-4'>Account Type</legend>

      <div>
        <Label className='text-base'>Select Account Type *</Label>
        <RadioGroup
          value={formData.accountType}
          onValueChange={(value) => onInputChange('accountType', value)}
          className='mt-2'
          aria-describedby='accountType-error'
          aria-invalid={errors.accountType ? 'true' : 'false'}
        >
          <div className='flex items-center space-x-2'>
            <RadioGroupItem
              value='personal'
              id='personal'
            />
            <Label
              htmlFor='personal'
              className='font-normal cursor-pointer'
            >
              Personal Account
              <div className='text-sm text-muted-foreground'>
                For individual use and personal projects
              </div>
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <RadioGroupItem
              value='business'
              id='business'
            />
            <Label
              htmlFor='business'
              className='font-normal cursor-pointer'
            >
              Business Account
              <div className='text-sm text-muted-foreground'>
                For companies and organizations
              </div>
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <RadioGroupItem
              value='enterprise'
              id='enterprise'
            />
            <Label
              htmlFor='enterprise'
              className='font-normal cursor-pointer'
            >
              Enterprise Account
              <div className='text-sm text-muted-foreground'>
                For large organizations with advanced features
              </div>
            </Label>
          </div>
        </RadioGroup>

        {errors.accountType && (
          <div
            id='accountType-error'
            className='text-sm text-destructive mt-1'
            role='alert'
            aria-live='polite'
          >
            {errors.accountType}
          </div>
        )}
      </div>
    </fieldset>
  );
}

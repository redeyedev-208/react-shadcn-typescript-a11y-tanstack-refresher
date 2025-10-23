import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { FormFieldProps } from '../types';

export function PersonalInfoSection({
  formData,
  errors,
  onInputChange,
}: FormFieldProps) {
  const getAgeFromDate = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = getAgeFromDate(formData.birthDate);

  return (
    <fieldset>
      <legend className='text-lg font-medium mb-4'>Personal Information</legend>

      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='firstName'>First Name *</Label>
            <Input
              id='firstName'
              type='text'
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              aria-describedby='firstName-error'
              aria-invalid={errors.firstName ? 'true' : 'false'}
              autoComplete='given-name'
              required
            />
            {errors.firstName && (
              <div
                id='firstName-error'
                className='text-sm text-destructive mt-1'
                role='alert'
                aria-live='polite'
              >
                {errors.firstName}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor='lastName'>Last Name *</Label>
            <Input
              id='lastName'
              type='text'
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              aria-describedby='lastName-error'
              aria-invalid={errors.lastName ? 'true' : 'false'}
              autoComplete='family-name'
              required
            />
            {errors.lastName && (
              <div
                id='lastName-error'
                className='text-sm text-destructive mt-1'
                role='alert'
                aria-live='polite'
              >
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor='birthDate'>Date of Birth *</Label>
          <Input
            id='birthDate'
            type='date'
            value={formData.birthDate}
            onChange={(e) => onInputChange('birthDate', e.target.value)}
            aria-describedby='birth-age-info birthDate-error'
            aria-invalid={errors.birthDate ? 'true' : 'false'}
            required
            max={new Date().toISOString().split('T')[0]}
          />
          {formData.birthDate && (
            <div
              id='birth-age-info'
              className='text-sm text-muted-foreground mt-1'
              aria-live='polite'
            >
              Age: {age} years old
            </div>
          )}
          {errors.birthDate && (
            <div
              id='birthDate-error'
              className='text-sm text-destructive mt-1'
              role='alert'
              aria-live='polite'
            >
              {errors.birthDate}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='country'>Country *</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => onInputChange('country', value)}
          >
            <SelectTrigger
              id='country'
              aria-describedby='country-error'
              aria-invalid={errors.country ? 'true' : 'false'}
            >
              <SelectValue placeholder='Select your country' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='us'>United States</SelectItem>
              <SelectItem value='ca'>Canada</SelectItem>
              <SelectItem value='uk'>United Kingdom</SelectItem>
              <SelectItem value='de'>Germany</SelectItem>
              <SelectItem value='fr'>France</SelectItem>
              <SelectItem value='es'>Spain</SelectItem>
              <SelectItem value='it'>Italy</SelectItem>
              <SelectItem value='nl'>Netherlands</SelectItem>
              <SelectItem value='se'>Sweden</SelectItem>
              <SelectItem value='no'>Norway</SelectItem>
              <SelectItem value='dk'>Denmark</SelectItem>
              <SelectItem value='fi'>Finland</SelectItem>
              <SelectItem value='au'>Australia</SelectItem>
              <SelectItem value='nz'>New Zealand</SelectItem>
              <SelectItem value='jp'>Japan</SelectItem>
              <SelectItem value='kr'>South Korea</SelectItem>
              <SelectItem value='sg'>Singapore</SelectItem>
              <SelectItem value='other'>Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <div
              id='country-error'
              className='text-sm text-destructive mt-1'
              role='alert'
              aria-live='polite'
            >
              {errors.country}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='phoneNumber'>Phone Number (Optional)</Label>
          <Input
            id='phoneNumber'
            type='tel'
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            aria-describedby='phoneNumber-error'
            aria-invalid={errors.phoneNumber ? 'true' : 'false'}
            autoComplete='tel'
            placeholder='+1 (555) 123-4567'
          />
          {errors.phoneNumber && (
            <div
              id='phoneNumber-error'
              className='text-sm text-destructive mt-1'
              role='alert'
              aria-live='polite'
            >
              {errors.phoneNumber}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='bio'>Bio (Optional)</Label>
          <Textarea
            id='bio'
            value={formData.bio}
            onChange={(e) => onInputChange('bio', e.target.value)}
            aria-describedby='bio-length bio-error'
            aria-invalid={errors.bio ? 'true' : 'false'}
            placeholder='Tell us a bit about yourself...'
            rows={4}
            maxLength={500}
          />
          <div
            id='bio-length'
            className='text-sm text-muted-foreground mt-1'
            aria-live='polite'
          >
            {formData.bio.length}/500 characters
          </div>
          {errors.bio && (
            <div
              id='bio-error'
              className='text-sm text-destructive mt-1'
              role='alert'
              aria-live='polite'
            >
              {errors.bio}
            </div>
          )}
        </div>
      </div>
    </fieldset>
  );
}

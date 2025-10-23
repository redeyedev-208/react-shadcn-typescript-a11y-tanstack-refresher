import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { FormFieldProps } from '../types';

export function EmailPasswordSection({
  formData,
  errors,
  onInputChange,
}: FormFieldProps) {
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '' };

    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 25;
    else feedback.push('at least 8 characters');

    if (/[A-Z]/.test(password)) score += 25;
    else feedback.push('uppercase letter');

    if (/[a-z]/.test(password)) score += 25;
    else feedback.push('lowercase letter');

    if (/[0-9]/.test(password)) score += 25;
    else feedback.push('number');

    let strengthText = '';
    if (score <= 25) strengthText = 'Weak';
    else if (score <= 50) strengthText = 'Fair';
    else if (score <= 75) strengthText = 'Good';
    else strengthText = 'Strong';

    return { strength: score, text: strengthText };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <fieldset>
      <legend className='text-lg font-medium mb-4'>Account Credentials</legend>

      <div className='space-y-4'>
        <div>
          <Label htmlFor='email'>Email Address *</Label>
          <Input
            id='email'
            type='email'
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            aria-describedby='email-error'
            aria-invalid={errors.email ? 'true' : 'false'}
            autoComplete='email'
            required
          />
          {errors.email && (
            <div
              id='email-error'
              className='text-sm text-destructive mt-1'
              role='alert'
              aria-live='polite'
            >
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='password'>Password *</Label>
          <Input
            id='password'
            type='password'
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            aria-describedby='password-strength password-error'
            aria-invalid={errors.password ? 'true' : 'false'}
            autoComplete='new-password'
            required
          />
          {formData.password && (
            <div
              id='password-strength'
              className='mt-2'
              aria-live='polite'
            >
              <div className='text-sm text-muted-foreground mb-1'>
                Password strength: {passwordStrength.text}
              </div>
              <div className='w-full bg-muted rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all ${
                    passwordStrength.strength <= 25
                      ? 'bg-destructive'
                      : passwordStrength.strength <= 50
                      ? 'bg-yellow-500'
                      : passwordStrength.strength <= 75
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
            </div>
          )}
          {errors.password && (
            <div
              id='password-error'
              className='text-sm text-destructive mt-1'
              role='alert'
              aria-live='polite'
            >
              {errors.password}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor='confirmPassword'>Confirm Password *</Label>
          <Input
            id='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            aria-describedby='confirm-password-error'
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            autoComplete='new-password'
            required
          />
          {errors.confirmPassword && (
            <div
              id='confirm-password-error'
              className='text-sm text-destructive mt-1'
              role='alert'
              aria-live='polite'
            >
              {errors.confirmPassword}
            </div>
          )}
        </div>
      </div>
    </fieldset>
  );
}

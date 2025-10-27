import { render, screen } from '@testing-library/react';
import { Badge, badgeVariants } from '../badge';

describe('Badge', () => {
  it('renders badge with default variant', () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('renders badge with secondary variant', () => {
    render(<Badge variant='secondary'>Secondary Badge</Badge>);

    const badge = screen.getByText('Secondary Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  it('renders badge with destructive variant', () => {
    render(<Badge variant='destructive'>Destructive Badge</Badge>);

    const badge = screen.getByText('Destructive Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground');
  });

  it('renders badge with outline variant', () => {
    render(<Badge variant='outline'>Outline Badge</Badge>);

    const badge = screen.getByText('Outline Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-foreground');
  });

  it('applies custom className', () => {
    render(<Badge className='custom-class'>Custom Badge</Badge>);

    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('forwards props to the div element', () => {
    render(
      <Badge
        data-testid='badge-test'
        title='Test Badge'
      >
        Badge
      </Badge>,
    );

    const badge = screen.getByTestId('badge-test');
    expect(badge).toHaveAttribute('title', 'Test Badge');
  });

  it('has proper default styles', () => {
    render(<Badge>Styled Badge</Badge>);

    const badge = screen.getByText('Styled Badge');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
    );
  });
});

describe('badgeVariants', () => {
  it('generates correct class names for default variant', () => {
    const classes = badgeVariants();
    expect(classes).toContain('bg-primary');
    expect(classes).toContain('text-primary-foreground');
  });

  it('generates correct class names for secondary variant', () => {
    const classes = badgeVariants({ variant: 'secondary' });
    expect(classes).toContain('bg-secondary');
    expect(classes).toContain('text-secondary-foreground');
  });

  it('generates correct class names for destructive variant', () => {
    const classes = badgeVariants({ variant: 'destructive' });
    expect(classes).toContain('bg-destructive');
    expect(classes).toContain('text-destructive-foreground');
  });

  it('generates correct class names for outline variant', () => {
    const classes = badgeVariants({ variant: 'outline' });
    expect(classes).toContain('text-foreground');
  });
});

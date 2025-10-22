import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test to verify Jest setup
describe('Jest Setup', () => {
  it('should work with basic functionality', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello Jest';
    document.body.appendChild(div);
    
    expect(div.textContent).toBe('Hello Jest');
  });

  it('should work with testing library', () => {
    render(<div>Hello Testing Library</div>);
    expect(screen.getByText('Hello Testing Library')).toBeInTheDocument();
  });
});
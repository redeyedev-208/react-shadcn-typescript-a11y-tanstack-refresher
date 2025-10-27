import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from '../select';

describe('Select Components', () => {
  describe('Basic Select functionality', () => {
    it('renders select trigger with placeholder', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select an option' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
            <SelectItem value='option2'>Option 2</SelectItem>
          </SelectContent>
        </Select>,
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('opens and displays select items when clicked', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select an option' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
            <SelectItem value='option2'>Option 2</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('selects an option when clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      render(
        <Select onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder='Select an option' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='option1'>Option 1</SelectItem>
            <SelectItem value='option2'>Option 2</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Option 1'));

      expect(onValueChange).toHaveBeenCalledWith('option1');
    });
  });

  describe('SelectContent with different positions', () => {
    it('renders content with default popper position', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='test'>Test Item</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      const content = screen.getByRole('listbox');
      expect(content).toBeInTheDocument();
    });

    it('renders content with item-aligned position', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select' />
          </SelectTrigger>
          <SelectContent position='item-aligned'>
            <SelectItem value='test'>Test Item</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      const content = screen.getByRole('listbox');
      expect(content).toBeInTheDocument();
    });
  });

  describe('SelectTrigger', () => {
    it('applies custom className', () => {
      render(
        <Select>
          <SelectTrigger className='custom-trigger'>
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('forwards props correctly', () => {
      render(
        <Select>
          <SelectTrigger
            data-testid='custom-trigger'
            aria-label='Custom select'
          >
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );

      const trigger = screen.getByTestId('custom-trigger');
      expect(trigger).toHaveAttribute('aria-label', 'Custom select');
    });
  });

  describe('SelectItem', () => {
    it('applies custom className to items', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value='custom'
              className='custom-item'
            >
              Custom Item
            </SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      const item = screen.getByText('Custom Item');
      expect(item.closest('[role="option"]')).toHaveClass('custom-item');
    });

    it('handles disabled items', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value='disabled'
              disabled
            >
              Disabled Item
            </SelectItem>
            <SelectItem value='enabled'>Enabled Item</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      const disabledItem = screen.getByText('Disabled Item');
      expect(disabledItem.closest('[role="option"]')).toHaveAttribute(
        'data-disabled',
        '',
      );
    });
  });

  describe('SelectLabel and SelectGroup', () => {
    it('renders grouped select with labels', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value='apple'>Apple</SelectItem>
              <SelectItem value='banana'>Banana</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value='carrot'>Carrot</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('Fruits')).toBeInTheDocument();
      expect(screen.getByText('Vegetables')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Carrot')).toBeInTheDocument();
    });

    it('renders labels in select groups', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Custom Label</SelectLabel>
              <SelectItem value='test'>Test</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('SelectSeparator', () => {
    it('renders separator with custom className', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='item1'>Item 1</SelectItem>
            <SelectSeparator
              className='custom-separator'
              data-testid='select-separator'
            />
            <SelectItem value='item2'>Item 2</SelectItem>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      const separator = screen.getByTestId('select-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass('custom-separator');
    });
  });

  describe('Scroll buttons', () => {
    it('renders select with many items', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => (
              <SelectItem
                key={i}
                value={`item${i}`}
              >
                Item {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      // Should render items successfully
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 5')).toBeInTheDocument();
    });
  });

  describe('Complex select usage', () => {
    it('handles complex select with all components', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      render(
        <Select onValueChange={onValueChange}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Choose a category' />
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value='apple'>Apple</SelectItem>
              <SelectItem value='banana'>Banana</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value='carrot'>Carrot</SelectItem>
              <SelectItem
                value='lettuce'
                disabled
              >
                Lettuce (Out of stock)
              </SelectItem>
            </SelectGroup>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Apple'));

      expect(onValueChange).toHaveBeenCalledWith('apple');
    });
  });
});

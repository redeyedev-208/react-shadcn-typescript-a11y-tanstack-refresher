import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '../dropdown-menu';

describe('DropdownMenu Components', () => {
  describe('DropdownMenu basic functionality', () => {
    it('renders trigger and opens menu on click', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button', { name: 'Open Menu' });
      expect(trigger).toBeInTheDocument();

      await user.click(trigger);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders menu items with inset prop', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
            <DropdownMenuItem>Regular Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      const insetItem = screen.getByText('Inset Item');
      const regularItem = screen.getByText('Regular Item');

      expect(insetItem).toBeInTheDocument();
      expect(regularItem).toBeInTheDocument();

      // Check that inset class is applied
      expect(insetItem.closest('[role="menuitem"]')).toHaveClass('pl-8');
    });
  });

  describe('DropdownMenuCheckboxItem', () => {
    it('renders checkbox items with checked state', async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={true}
              onCheckedChange={onCheckedChange}
            >
              Checked Item
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={onCheckedChange}
            >
              Unchecked Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      const checkedItem = screen.getByText('Checked Item');
      const uncheckedItem = screen.getByText('Unchecked Item');

      expect(checkedItem).toBeInTheDocument();
      expect(uncheckedItem).toBeInTheDocument();

      // Click on unchecked item to trigger change
      await user.click(uncheckedItem);
      expect(onCheckedChange).toHaveBeenCalled();
    });
  });

  describe('DropdownMenuRadioGroup and RadioItem', () => {
    it('renders radio items and handles selection', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value='option1'
              onValueChange={onValueChange}
            >
              <DropdownMenuRadioItem value='option1'>
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value='option2'>
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      const option1 = screen.getByText('Option 1');
      const option2 = screen.getByText('Option 2');

      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();

      // Click on option 2 to trigger change
      await user.click(option2);
      expect(onValueChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('DropdownMenuLabel with inset', () => {
    it('renders label with and without inset', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
            <DropdownMenuLabel>Regular Label</DropdownMenuLabel>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      const insetLabel = screen.getByText('Inset Label');
      const regularLabel = screen.getByText('Regular Label');

      expect(insetLabel).toBeInTheDocument();
      expect(regularLabel).toBeInTheDocument();

      // Check that inset class is applied
      expect(insetLabel).toHaveClass('pl-8');
      expect(regularLabel).not.toHaveClass('pl-8');
    });
  });

  describe('DropdownMenuSub components', () => {
    it('renders sub menu with trigger', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      const subMenuTrigger = screen.getByText('Sub Menu');
      expect(subMenuTrigger).toBeInTheDocument();
    });

    it('renders sub menu trigger with inset', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset>
                Inset Sub Menu
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      const insetSubTrigger = screen.getByText('Inset Sub Menu');
      expect(insetSubTrigger).toBeInTheDocument();
      expect(insetSubTrigger).toHaveClass('pl-8');
    });
  });

  describe('DropdownMenuShortcut', () => {
    it('renders shortcut component', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Cut
              <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Copy
              <DropdownMenuShortcut className='custom-shortcut'>
                ⌘C
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      const cutShortcut = screen.getByText('⌘X');
      const copyShortcut = screen.getByText('⌘C');

      expect(cutShortcut).toBeInTheDocument();
      expect(copyShortcut).toBeInTheDocument();
      expect(copyShortcut).toHaveClass('custom-shortcut');
    });
  });

  describe('DropdownMenuSeparator', () => {
    it('renders separator component', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();

      // Separator should be present (though it might not have accessible text)
      const separator = document.querySelector('[role="separator"]');
      expect(separator).toBeInTheDocument();
    });
  });

  describe('DropdownMenuGroup', () => {
    it('renders grouped menu items', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>Open Menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Group Item 1</DropdownMenuItem>
              <DropdownMenuItem>Group Item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      expect(screen.getByText('Group Item 1')).toBeInTheDocument();
      expect(screen.getByText('Group Item 2')).toBeInTheDocument();
    });
  });
});

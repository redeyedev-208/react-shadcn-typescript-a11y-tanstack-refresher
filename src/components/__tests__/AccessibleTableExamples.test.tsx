import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AccessibleTableExamples } from '../tables/AccessibleTableExamples';
import { useUsers } from '../../hooks/useUsers';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      // Mock translations for testing
      const translations: Record<string, string> = {
        'table.userManagement': 'User Management Table',
        'table.description':
          'TanStack Table integration with ShadCN components for accessible data presentation with real-time pagination',
        'table.caption': 'A list of users from JSON Server API',
        'table.columns.name': 'Name',
        'table.columns.email': 'Email',
        'table.columns.role': 'Role',
        'table.columns.status': 'Status',
        'table.columns.actions': 'Actions',
        'table.states.loading': 'Loading users...',
        'table.states.error': 'Error loading user data',
        'table.states.errorMessage': `Error: ${
          params?.message || 'Unknown error'
        }`,
        'table.states.failed': 'Failed to load users',
        'userModal.view.title': '[TEST] User Details',
        'userModal.view.description': `[TEST] View info about ${params?.name}`,
        'userModal.view.fields.name': '[TEST] Name',
        'userModal.view.fields.email': '[TEST] Email',
        'userModal.view.fields.role': '[TEST] Role',
        'userModal.view.fields.status': '[TEST] Status',
        'userModal.view.fields.id': '[TEST] ID',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../hooks/useUsers');
const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;

jest.mock('lucide-react', () => ({
  Edit: () => <div data-testid='edit-icon'>Edit</div>,
  Trash2: () => <div data-testid='trash-icon'>Trash</div>,
  Eye: () => <div data-testid='eye-icon'>Eye</div>,
  ChevronLeft: () => <div data-testid='chevron-left'>Previous</div>,
  ChevronRight: () => <div data-testid='chevron-right'>Next</div>,
  ChevronsLeft: () => <div data-testid='chevrons-left'>First</div>,
  ChevronsRight: () => <div data-testid='chevrons-right'>Last</div>,
  ChevronDown: () => <div data-testid='chevron-down'>Down</div>,
  ChevronUp: () => <div data-testid='chevron-up'>Up</div>,
  Check: () => <div data-testid='check'>Check</div>,
  X: () => <div data-testid='close-icon'>Close</div>,
}));

// Mock Dialog components for View Modal testing
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => {
    console.log('Dialog render:', { open });

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          (e.key === 'Escape' || e.code === 'Escape') &&
          open &&
          onOpenChange
        ) {
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(false);
        }
      };

      const handleDialogClose = () => {
        if (open && onOpenChange) {
          onOpenChange(false);
        }
      };

      if (open) {
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('dialog-close', handleDialogClose);
        return () => {
          document.removeEventListener('keydown', handleKeyDown, true);
          document.removeEventListener('dialog-close', handleDialogClose);
        };
      }
    }, [open, onOpenChange]);

    return open ? (
      <div
        data-testid='dialog'
        onClick={(e) => {
          if (e.target === e.currentTarget && onOpenChange) {
            onOpenChange(false);
          }
        }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <div>Dialog is open: {String(open)}</div>
        {children}
      </div>
    ) : (
      <div>Dialog is closed: {String(open)}</div>
    );
  },
  DialogContent: ({
    children,
    'data-testid': dataTestId,
    ...props
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
    [key: string]: unknown;
  }) => (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='User Details Modal'
      data-testid={dataTestId || 'dialog-content'}
      className='sm:max-w-[425px]'
      {...props}
    >
      {children}
      <button
        type='button'
        data-testid='dialog-close'
        aria-label='Close'
        onClick={() => {
          // This will be handled by the Dialog component's onOpenChange
          const event = new CustomEvent('dialog-close');
          document.dispatchEvent(event);
        }}
      >
        <span className='sr-only'>Close</span>
      </button>
    </div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='dialog-header'>{children}</div>
  ),
  DialogTitle: ({
    children,
    'data-testid': dataTestId,
    ...props
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
    [key: string]: unknown;
  }) => (
    <h2
      data-testid={dataTestId || 'dialog-title'}
      {...props}
    >
      {children}
    </h2>
  ),
  DialogDescription: ({
    children,
    'data-testid': dataTestId,
    ...props
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
    [key: string]: unknown;
  }) => (
    <p
      data-testid={dataTestId || 'dialog-description'}
      {...props}
    >
      {children}
    </p>
  ),
}));

// Mock Badge component for status/role display
jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
    'data-testid': dataTestId,
    ...props
  }: {
    children: React.ReactNode;
    variant?: string;
    'data-testid'?: string;
    [key: string]: any;
  }) => (
    <span
      data-testid={dataTestId || 'badge'}
      data-variant={variant}
      {...props}
    >
      {children}
    </span>
  ),
}));

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: any;
  }) => (
    <button
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock Badge component
jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    'data-testid': dataTestId,
    ...props
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
    [key: string]: unknown;
  }) => (
    <span
      data-testid={dataTestId || 'badge'}
      {...props}
    >
      {children}
    </span>
  ),
}));

// Helper function to create mock users data
const createMockUsersData = (page = 1, limit = 10, total = 30) => {
  const startIndex = (page - 1) * limit + 1;
  const users = Array.from(
    { length: Math.min(limit, total - (page - 1) * limit) },
    (_, index) => ({
      id: `${startIndex + index}`,
      name: `User ${startIndex + index}`,
      firstName: `User`,
      lastName: `${startIndex + index}`,
      email: `user${startIndex + index}@example.com`,
      role: 'Editor',
      status: 'Active' as const,
    }),
  );

  return {
    users,
    total,
    page,
    limit,
  };
};

describe('AccessibleTableExamples', () => {
  beforeEach(() => {
    mockUseUsers.mockReturnValue({
      data: createMockUsersData(1, 10, 30),
      isLoading: false,
      error: null,
      isError: false,
      refetch: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<AccessibleTableExamples />);
      expect(screen.getByText('User Management Table')).toBeInTheDocument();
    });

    it('renders table with user data', () => {
      render(<AccessibleTableExamples />);
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    });

    it('shows loading state when data is loading', () => {
      mockUseUsers.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isError: false,
        refetch: jest.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<AccessibleTableExamples />);
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });

    it('shows error state when data fails to load', () => {
      mockUseUsers.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
        isError: true,
        refetch: jest.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<AccessibleTableExamples />);
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  describe('Pagination Controls', () => {
    it('displays correct pagination information', () => {
      render(<AccessibleTableExamples />);

      expect(screen.getByText('1-10 of 30')).toBeInTheDocument();

      expect(screen.getByText('Rows per page')).toBeInTheDocument();
    });

    it('displays navigation buttons with correct initial states', () => {
      render(<AccessibleTableExamples />);

      const firstButton = screen.getByLabelText('Go to first page');
      const prevButton = screen.getByLabelText('Go to previous page');
      const nextButton = screen.getByLabelText('Go to next page');
      const lastButton = screen.getByLabelText('Go to last page');

      expect(firstButton).toBeDisabled();
      expect(prevButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();
      expect(lastButton).not.toBeDisabled();
    });

    it('has accessible ARIA labeling for pagination controls', () => {
      render(<AccessibleTableExamples />);

      expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();

      const rowsPerPageLabel = screen.getByText('Rows per page');
      expect(rowsPerPageLabel).toHaveAttribute('id', 'rows-per-page-label');
    });

    it('shows correct pagination for different page sizes', async () => {
      const user = userEvent.setup();

      render(<AccessibleTableExamples />);
      expect(screen.getByText('1-10 of 30')).toBeInTheDocument();

      mockUseUsers.mockImplementation(
        (page = 1, limit = 10) =>
          ({
            data: createMockUsersData(page, limit, 30),
            isLoading: false,
            error: null,
            isError: false,
            refetch: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any),
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: '5' }));

      expect(mockUseUsers).toHaveBeenLastCalledWith(1, 5);
    });

    it('simulates real pagination navigation like in TanStack devtools', async () => {
      const user = userEvent.setup();

      mockUseUsers.mockImplementation(
        (page = 1, limit = 5) =>
          ({
            data: createMockUsersData(page, limit, 30),
            isLoading: false,
            error: null,
            isError: false,
            refetch: jest.fn(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any),
      );

      render(<AccessibleTableExamples />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: '5' }));

      expect(mockUseUsers).toHaveBeenLastCalledWith(1, 5);

      const nextButton = screen.getByLabelText('Go to next page');
      await user.click(nextButton);

      expect(mockUseUsers).toHaveBeenLastCalledWith(2, 5);
    });
  });

  describe('Page Size Selection', () => {
    it('displays page size dropdown with correct options', async () => {
      const user = userEvent.setup();
      render(<AccessibleTableExamples />);

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      // Should show all page size options
      await waitFor(() => {
        expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: '10' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: '15' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: '25' })).toBeInTheDocument();
      });
    });

    it('updates pagination when page size changes', async () => {
      const user = userEvent.setup();

      // Mock different page sizes being called
      mockUseUsers.mockImplementation((page, limit = 10) => {
        return {
          data: createMockUsersData(page, limit, 30),
          isLoading: false,
          error: null,
          isError: false,
          refetch: jest.fn(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      });

      render(<AccessibleTableExamples />);

      expect(screen.getByText('1-10 of 30')).toBeInTheDocument();

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      await waitFor(() => {
        const option5 = screen.getByRole('option', { name: '5' });
        expect(option5).toBeInTheDocument();
      });

      const option5 = screen.getByRole('option', { name: '5' });
      await user.click(option5);

      expect(mockUseUsers).toHaveBeenCalledWith(1, 5);
    });

    it('simulates complete TanStack devtools workflow - all page sizes', async () => {
      const user = userEvent.setup();

      // Mock responsive implementation that tracks calls
      const calls: Array<{ page: number; limit: number }> = [];
      mockUseUsers.mockImplementation((page = 1, limit = 10) => {
        calls.push({ page, limit });
        return {
          data: createMockUsersData(page, limit, 30),
          isLoading: false,
          error: null,
          isError: false,
          refetch: jest.fn(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      });

      render(<AccessibleTableExamples />);

      const trigger = screen.getByRole('combobox');

      await user.click(trigger);
      await waitFor(() => screen.getByRole('option', { name: '5' }));
      await user.click(screen.getByRole('option', { name: '5' }));

      expect(calls).toContainEqual({ page: 1, limit: 5 });

      await user.click(trigger);
      await waitFor(() => screen.getByRole('option', { name: '15' }));
      await user.click(screen.getByRole('option', { name: '15' }));

      expect(calls).toContainEqual({ page: 1, limit: 15 });

      await user.click(trigger);
      await waitFor(() => screen.getByRole('option', { name: '25' }));
      await user.click(screen.getByRole('option', { name: '25' }));

      expect(calls).toContainEqual({ page: 1, limit: 25 });
    });
  });

  describe('Integration Tests', () => {
    it('handles pagination with different data sizes', () => {
      // Test with small dataset
      mockUseUsers.mockReturnValue({
        data: createMockUsersData(1, 10, 3),
        isLoading: false,
        error: null,
        isError: false,
        refetch: jest.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<AccessibleTableExamples />);

      expect(screen.getByText('1-3 of 3')).toBeInTheDocument();

      expect(screen.getByLabelText('Go to first page')).toBeDisabled();
      expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
      expect(screen.getByLabelText('Go to next page')).toBeDisabled();
      expect(screen.getByLabelText('Go to last page')).toBeDisabled();
    });

    it('displays correct user data for current page', () => {
      render(<AccessibleTableExamples />);

      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 10')).toBeInTheDocument();

      expect(screen.queryByText('User 11')).not.toBeInTheDocument();
    });
  });

  describe('View User Modal (i18n)', () => {
    it('does not show modal by default', () => {
      render(<AccessibleTableExamples />);

      expect(screen.queryByText('[TEST] User Details')).not.toBeInTheDocument();
    });

    it('opens modal when view button is clicked', async () => {
      const user = userEvent.setup();
      render(<AccessibleTableExamples />);

      const viewButtons = screen.getAllByLabelText(/View .* details/);
      expect(viewButtons).toHaveLength(10);

      await user.click(viewButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('user-modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toBeInTheDocument();
      });
    });

    it('displays correct user information in modal', async () => {
      const user = userEvent.setup();
      render(<AccessibleTableExamples />);

      const viewButton = screen.getByLabelText("View User 1's details");
      expect(viewButton).toBeInTheDocument();

      await user.click(viewButton);

      const userTexts = screen.getAllByText('User 1');
      expect(userTexts.length).toBeGreaterThan(0);

      const emailTexts = screen.getAllByText('user1@example.com');
      expect(emailTexts.length).toBeGreaterThan(0);

      const editorTexts = screen.getAllByText('Editor');
      expect(editorTexts.length).toBeGreaterThan(0);

      const activeTexts = screen.getAllByText('Active');
      expect(activeTexts.length).toBeGreaterThan(0);
    });

    it('shows correct badge variants for role and status', async () => {
      const user = userEvent.setup();

      mockUseUsers.mockReset();

      mockUseUsers.mockReturnValue({
        data: {
          users: [
            {
              id: '1',
              name: 'Admin User',
              firstName: 'Admin',
              lastName: 'User',
              email: 'admin@example.com',
              role: 'Admin',
              status: 'Active',
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        },
        isLoading: false,
        error: null,
        isError: false,
        refetch: jest.fn(),
      } as any);

      render(<AccessibleTableExamples />);

      const viewButton = screen.getByLabelText("View Admin User's details");
      await user.click(viewButton);

      await waitFor(() => {
        expect(screen.getByTestId('user-modal')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-role-badge')).toBeInTheDocument();
        expect(screen.getByTestId('user-status-badge')).toBeInTheDocument();

        expect(screen.getByTestId('user-role-badge')).toHaveTextContent(
          'Admin',
        );
        expect(screen.getByTestId('user-status-badge')).toHaveTextContent(
          'Active',
        );
      });
    });

    it('closes modal when escape is pressed', async () => {
      const user = userEvent.setup();
      render(<AccessibleTableExamples />);

      const viewButton = screen.getByLabelText("View User 1's details");
      await user.click(viewButton);

      await waitFor(() => {
        expect(screen.getByTestId('user-modal')).toBeInTheDocument();
      });

      // Press escape to close
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByTestId('user-modal')).not.toBeInTheDocument();
      });
    });

    it('closes modal when clicking outside', async () => {
      const user = userEvent.setup();
      render(<AccessibleTableExamples />);

      // Open modal
      const viewButton = screen.getByLabelText("View User 1's details");
      await user.click(viewButton);

      await waitFor(() => {
        expect(screen.getByTestId('user-modal')).toBeInTheDocument();
      });

      const dialogOverlay = screen.getByTestId('dialog');
      await user.click(dialogOverlay);

      await waitFor(() => {
        expect(screen.queryByTestId('user-modal')).not.toBeInTheDocument();
      });
    });

    it('handles different users correctly', async () => {
      const user = userEvent.setup();
      render(<AccessibleTableExamples />);

      const viewButton5 = screen.getByLabelText("View User 5's details");
      await user.click(viewButton5);

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
        expect(
          screen.getByText('[TEST] View info about User 5'),
        ).toBeInTheDocument();
        const userTexts = screen.getAllByText('User 5');
        expect(userTexts.length).toBeGreaterThan(0);
        const emailTexts = screen.getAllByText('user5@example.com');
        expect(emailTexts.length).toBeGreaterThan(0);
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(
          screen.queryByText('[TEST] Modal Title'),
        ).not.toBeInTheDocument();
      });

      const viewButton10 = screen.getByLabelText("View User 10's details");
      await user.click(viewButton10);

      await waitFor(() => {
        expect(
          screen.getByText('[TEST] View info about User 10'),
        ).toBeInTheDocument();
        // Use getAllByText for elements that appear in both table and modal
        const userTexts = screen.getAllByText('User 10');
        expect(userTexts.length).toBeGreaterThan(0);
        const emailTexts = screen.getAllByText('user10@example.com');
        expect(emailTexts.length).toBeGreaterThan(0);
      });
    });

    it('maintains accessibility with proper ARIA labels', async () => {
      const user = userEvent.setup();
      render(<AccessibleTableExamples />);

      // Open modal
      const viewButton = screen.getByLabelText("View User 1's details");
      await user.click(viewButton);

      expect(viewButton).toHaveAttribute('aria-label', "View User 1's details");

      const userTexts = screen.getAllByText('User 1');
      expect(userTexts.length).toBeGreaterThan(0);
    });

    it('opens correct user modal after pagination', async () => {
      const user = userEvent.setup();

      // Mock implementation that returns different users based on page
      mockUseUsers.mockImplementation((page = 1, limit = 10) => {
        const startIndex = (page - 1) * limit + 1;
        const users = Array.from(
          { length: Math.min(limit, 30 - (page - 1) * limit) },
          (_, index) => ({
            id: `${startIndex + index}`,
            name: `Page${page}User ${startIndex + index}`,
            firstName: `Page${page}User`,
            lastName: `${startIndex + index}`,
            email: `page${page}user${startIndex + index}@example.com`,
            role: 'Editor',
            status: 'Active' as const,
          }),
        );

        return {
          data: { users, total: 30, page, limit },
          isLoading: false,
          error: null,
          isError: false,
          refetch: jest.fn(),
        } as any;
      });

      render(<AccessibleTableExamples />);

      const nextButton = screen.getByLabelText('Go to next page');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Page2User 11')).toBeInTheDocument();
      });

      // Click view button for first user on page 2
      const viewButton = screen.getByLabelText("View Page2User 11's details");
      await user.click(viewButton);

      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
        expect(
          screen.getByText('[TEST] View info about Page2User 11'),
        ).toBeInTheDocument();
        // Use getAllByText and check the one inside the modal
        const userTexts = screen.getAllByText('Page2User 11');
        expect(userTexts.length).toBeGreaterThan(0);
        const emailTexts = screen.getAllByText('page2user11@example.com');
        expect(emailTexts.length).toBeGreaterThan(0);
      });
    });
  });
});

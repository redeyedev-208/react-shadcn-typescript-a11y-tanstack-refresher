import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TableActions, type TableActionsProps } from './TableActions';
import { Pagination } from '@/components/ui/pagination';
import { useUsers } from '../../hooks/useUsers';
import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Accessible data table component demonstrating WCAG 2.2 compliance patterns.
 *
 * Features:
 * - Screen reader optimized table structure with proper headers and captions
 * - Keyboard navigation with focus management for modal interactions
 * - Real-time pagination with TanStack Query integration
 * - CRUD operations with accessible view, edit, and delete modals
 * - Focus restoration after modal interactions
 * - Loading and error states with proper ARIA announcements
 *
 * @returns {JSX.Element} Complete accessible data table with CRUD functionality
 */
export function AccessibleTableExamples() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    TableActionsProps['user'] | null
  >(null);

  // Focus management - store reference to the button that triggered the modal
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Edit functionality state
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<
    TableActionsProps['user'] | null
  >(null);

  // Delete functionality state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<
    TableActionsProps['user'] | null
  >(null);

  // Helper function to store the currently focused element
  const storeFocusedElement = useCallback(() => {
    lastFocusedElementRef.current = document.activeElement as HTMLElement;
  }, []);

  // Helper function to restore focus to the stored element
  const restoreFocus = useCallback(() => {
    if (lastFocusedElementRef.current) {
      // Small delay to ensure modal is fully closed before restoring focus
      setTimeout(() => {
        lastFocusedElementRef.current?.focus();
        lastFocusedElementRef.current = null;
      }, 100);
    }
  }, []);

  const { data, isLoading, error, isError } = useUsers(
    currentPage,
    itemsPerPage,
  );

  const handleView = (user: TableActionsProps['user']) => {
    storeFocusedElement();
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user: TableActionsProps['user']) => {
    storeFocusedElement();
    setSelectedUserToEdit(user);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    // Production implementation would call an API to update the user
    // For demonstration purposes, we just close the modal and refresh data
    setShowEditModal(false);
    setSelectedUserToEdit(null);
    restoreFocus();
    // In production: refetch() to refresh the table data
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setSelectedUserToEdit(null);
    restoreFocus();
  };

  const handleDelete = (user: TableActionsProps['user']) => {
    storeFocusedElement();
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      // TODO: Here you would typically call an API to delete the user
      // For now, we'll just close the modal
      setShowDeleteModal(false);
      setUserToDelete(null);
      restoreFocus();
      // Optional: Call refetch() to refresh the table data if available
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
    restoreFocus();
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Calculate pagination values
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('table.userManagement')}</CardTitle>
          <CardDescription>{t('table.states.loading')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            data-testid='loading-state'
            className='flex justify-center items-center h-32'
          >
            <p>{t('table.states.loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('table.userManagement')}</CardTitle>
          <CardDescription>{t('table.states.error')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            data-testid='error-state'
            className='flex justify-center items-center h-32 text-red-600'
          >
            <p>
              {t('table.states.errorMessage', {
                message: error?.message || t('table.states.failed'),
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convert API data to component-friendly format
  const users =
    data?.users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role as 'Admin' | 'Editor' | 'Viewer',
      status: user.status,
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('table.userManagement')}</CardTitle>
        <CardDescription>{t('table.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>{t('table.caption')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.columns.name')}</TableHead>
              <TableHead>{t('table.columns.email')}</TableHead>
              <TableHead>{t('table.columns.role')}</TableHead>
              <TableHead>{t('table.columns.status')}</TableHead>
              <TableHead>{t('table.columns.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <TableActions
                    user={user}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Industry-standard pagination in table footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={[5, 10, 15, 25]}
        />
      </CardContent>

      {/* View User Modal - React pattern: modal in parent */}
      <Dialog
        open={showViewModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowViewModal(false);
            setSelectedUser(null);
            restoreFocus();
          }
        }}
      >
        <DialogContent
          className='sm:max-w-[425px]'
          data-testid='user-modal'
        >
          <DialogHeader>
            <DialogTitle data-testid='modal-title'>
              {t('userModal.view.title')}
            </DialogTitle>
            <DialogDescription data-testid='modal-description'>
              {t('userModal.view.description', { name: selectedUser?.name })}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div
              className='grid gap-4 py-4'
              data-testid='user-details'
            >
              <div className='grid grid-cols-3 items-center gap-4'>
                <span
                  className='font-medium'
                  data-testid='name-label'
                >
                  {t('userModal.view.fields.name')}:
                </span>
                <span
                  className='col-span-2'
                  data-testid='user-name'
                >
                  {selectedUser.name}
                </span>
              </div>

              <div className='grid grid-cols-3 items-center gap-4'>
                <span
                  className='font-medium'
                  data-testid='email-label'
                >
                  {t('userModal.view.fields.email')}:
                </span>
                <span
                  className='col-span-2 text-blue-600'
                  data-testid='user-email'
                >
                  {selectedUser.email}
                </span>
              </div>

              <div className='grid grid-cols-3 items-center gap-4'>
                <span
                  className='font-medium'
                  data-testid='role-label'
                >
                  {t('userModal.view.fields.role')}:
                </span>
                <div className='col-span-2'>
                  <Badge
                    variant={
                      selectedUser.role === 'Admin' ? 'default' : 'secondary'
                    }
                    data-testid='user-role-badge'
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div className='grid grid-cols-3 items-center gap-4'>
                <span
                  className='font-medium'
                  data-testid='status-label'
                >
                  {t('userModal.view.fields.status')}:
                </span>
                <div className='col-span-2'>
                  <Badge
                    variant={
                      selectedUser.status === 'Active'
                        ? 'default'
                        : 'destructive'
                    }
                    data-testid='user-status-badge'
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              <div className='grid grid-cols-3 items-center gap-4'>
                <span
                  className='font-medium'
                  data-testid='id-label'
                >
                  {t('userModal.view.fields.id')}:
                </span>
                <span
                  className='col-span-2 font-mono text-sm'
                  data-testid='user-id'
                >
                  {selectedUser.id}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog
        open={showEditModal}
        onOpenChange={(open) => {
          if (!open) {
            handleEditCancel();
          }
        }}
      >
        <DialogContent
          className='sm:max-w-[425px]'
          data-testid='edit-user-modal'
        >
          <DialogHeader>
            <DialogTitle data-testid='edit-modal-title'>
              {t('userModal.edit.title')}
            </DialogTitle>
            <DialogDescription data-testid='edit-modal-description'>
              {t('userModal.edit.description', {
                name: selectedUserToEdit?.name,
              })}
            </DialogDescription>
          </DialogHeader>

          {selectedUserToEdit && (
            <div
              className='grid gap-4 py-4'
              data-testid='edit-user-form'
            >
              <div className='grid grid-cols-4 items-center gap-4'>
                <label
                  htmlFor='edit-name'
                  className='text-right'
                >
                  {t('userModal.view.fields.name')}:
                </label>
                <input
                  id='edit-name'
                  defaultValue={selectedUserToEdit.name}
                  className='col-span-3 px-3 py-2 border rounded-md'
                  data-testid='edit-name-input'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <label
                  htmlFor='edit-email'
                  className='text-right'
                >
                  {t('userModal.view.fields.email')}:
                </label>
                <input
                  id='edit-email'
                  type='email'
                  defaultValue={selectedUserToEdit.email}
                  className='col-span-3 px-3 py-2 border rounded-md'
                  data-testid='edit-email-input'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <label
                  htmlFor='edit-role'
                  className='text-right'
                >
                  {t('userModal.view.fields.role')}:
                </label>
                <select
                  id='edit-role'
                  defaultValue={selectedUserToEdit.role}
                  className='col-span-3 px-3 py-2 border rounded-md'
                  data-testid='edit-role-select'
                >
                  <option value='Admin'>Admin</option>
                  <option value='Editor'>Editor</option>
                  <option value='Viewer'>Viewer</option>
                </select>
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <label
                  htmlFor='edit-status'
                  className='text-right'
                >
                  {t('userModal.view.fields.status')}:
                </label>
                <select
                  id='edit-status'
                  defaultValue={selectedUserToEdit.status}
                  className='col-span-3 px-3 py-2 border rounded-md'
                  data-testid='edit-status-select'
                >
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                </select>
              </div>

              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  variant='outline'
                  onClick={handleEditCancel}
                  data-testid='edit-cancel-button'
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={() => handleEditSave()}
                  data-testid='edit-save-button'
                >
                  {t('common.save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onOpenChange={(open) => {
          if (!open) {
            handleDeleteCancel();
          }
        }}
      >
        <DialogContent
          className='sm:max-w-[425px]'
          data-testid='delete-confirmation-modal'
        >
          <DialogHeader>
            <DialogTitle data-testid='delete-modal-title'>
              {t('userModal.delete.title')}
            </DialogTitle>
            <DialogDescription data-testid='delete-modal-description'>
              {t('userModal.delete.description', { name: userToDelete?.name })}
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <p
              className='text-sm text-muted-foreground'
              data-testid='delete-warning'
            >
              {t('userModal.delete.warning')}
            </p>
          </div>

          <div className='flex justify-end gap-2 pt-4'>
            <Button
              variant='outline'
              onClick={handleDeleteCancel}
              data-testid='delete-cancel-button'
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteConfirm}
              data-testid='delete-confirm-button'
            >
              {t('common.delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

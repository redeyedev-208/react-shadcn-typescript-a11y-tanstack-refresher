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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export function AccessibleTableExamples() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    TableActionsProps['user'] | null
  >(null);

  const { data, isLoading, error, isError } = useUsers(
    currentPage,
    itemsPerPage,
  );

  const handleView = (user: TableActionsProps['user']) => {
    console.log('View user:', user);
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user: TableActionsProps['user']) => {
    console.log('Edit user:', user);
    // TODO: Open edit user form or navigate to edit page
  };

  const handleDelete = (user: TableActionsProps['user']) => {
    console.log('Delete user:', user);
    // TODO: Show confirmation dialog and handle deletion
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
        onOpenChange={setShowViewModal}
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
    </Card>
  );
}

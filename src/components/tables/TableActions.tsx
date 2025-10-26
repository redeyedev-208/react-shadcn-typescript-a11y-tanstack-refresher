import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';

// TypeScript interface for TableActions props
export interface TableActionsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    status: 'Active' | 'Inactive';
  };
  onView: (user: TableActionsProps['user']) => void;
  onEdit: (user: TableActionsProps['user']) => void;
  onDelete: (user: TableActionsProps['user']) => void;
}

export function TableActions({
  user,
  onView,
  onEdit,
  onDelete,
}: TableActionsProps) {
  return (
    <div
      className='flex gap-2'
      data-testid={`table-actions-${user.name.toLowerCase().replace(' ', '-')}`}
      data-component='TableActions'
    >
      <Button
        variant='outline'
        size='sm'
        onClick={() => onView(user)}
        aria-label={`View ${user.name}'s details`}
      >
        <Eye className='h-4 w-4' />
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onEdit(user)}
        aria-label={`Edit ${user.name}'s information`}
      >
        <Edit className='h-4 w-4' />
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onDelete(user)}
        aria-label={`Delete ${user.name}'s account`}
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  );
}

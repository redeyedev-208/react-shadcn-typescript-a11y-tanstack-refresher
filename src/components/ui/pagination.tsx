import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 15, 25, 50],
}: PaginationProps) {
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className='flex items-center justify-between px-2 py-4'>
      <div className='flex items-center space-x-2'>
        <p
          id='rows-per-page-label'
          className='text-sm font-medium'
        >
          Rows per page
        </p>
        <Select
          value={`${itemsPerPage}`}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger
            className='h-8 w-[70px]'
            aria-labelledby='rows-per-page-label'
          >
            <SelectValue placeholder={itemsPerPage} />
          </SelectTrigger>
          <SelectContent side='top'>
            {itemsPerPageOptions.map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={`${pageSize}`}
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          {totalItems > 0 ? (
            <>
              {startItem}-{endItem} of {totalItems}
            </>
          ) : (
            '0 of 0'
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            aria-label='Go to first page'
          >
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            aria-label='Go to previous page'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            aria-label='Go to next page'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            aria-label='Go to last page'
          >
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}

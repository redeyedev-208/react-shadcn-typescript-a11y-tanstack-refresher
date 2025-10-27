import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    onPageChange: jest.fn(),
    onItemsPerPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination with correct information', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByText('Rows per page')).toBeInTheDocument();
    expect(screen.getByText('1-10 of 50')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
  });

  it('handles empty dataset correctly', () => {
    render(
      <Pagination
        {...defaultProps}
        totalItems={0}
        totalPages={0}
        currentPage={1}
      />,
    );

    expect(screen.getByText('0 of 0')).toBeInTheDocument();
  });

  it('disables previous and first page buttons on first page', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={1}
      />,
    );

    expect(screen.getByLabelText('Go to first page')).toBeDisabled();
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
    expect(screen.getByLabelText('Go to next page')).not.toBeDisabled();
    expect(screen.getByLabelText('Go to last page')).not.toBeDisabled();
  });

  it('disables next and last page buttons on last page', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={5}
        totalPages={5}
      />,
    );

    expect(screen.getByLabelText('Go to first page')).not.toBeDisabled();
    expect(screen.getByLabelText('Go to previous page')).not.toBeDisabled();
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
    expect(screen.getByLabelText('Go to last page')).toBeDisabled();
  });

  it('navigates to first page when first button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();

    render(
      <Pagination
        {...defaultProps}
        currentPage={3}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByLabelText('Go to first page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('navigates to previous page when previous button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();

    render(
      <Pagination
        {...defaultProps}
        currentPage={3}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByLabelText('Go to previous page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('navigates to next page when next button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();

    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByLabelText('Go to next page'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('navigates to last page when last button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();

    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByLabelText('Go to last page'));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('changes items per page when select value changes', async () => {
    const user = userEvent.setup();
    const onItemsPerPageChange = jest.fn();

    render(
      <Pagination
        {...defaultProps}
        onItemsPerPageChange={onItemsPerPageChange}
      />,
    );

    // Click on the select trigger to open dropdown
    const selectTrigger = screen.getByRole('combobox');
    await user.click(selectTrigger);

    // Select 25 items per page
    const option25 = screen.getByRole('option', { name: '25' });
    await user.click(option25);

    expect(onItemsPerPageChange).toHaveBeenCalledWith(25);
  });

  it('uses custom items per page options', () => {
    const customOptions = [5, 15, 30];

    render(
      <Pagination
        {...defaultProps}
        itemsPerPageOptions={customOptions}
      />,
    );

    // The component should render with custom options available
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays correct range for middle pages', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={3}
        totalItems={50}
        itemsPerPage={10}
      />,
    );

    expect(screen.getByText('21-30 of 50')).toBeInTheDocument();
  });

  it('displays correct range when on last page with fewer items', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={5}
        totalItems={47}
        itemsPerPage={10}
      />,
    );

    expect(screen.getByText('41-47 of 47')).toBeInTheDocument();
  });

  it('handles single page scenario', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={1}
        totalPages={1}
        totalItems={5}
        itemsPerPage={10}
      />,
    );

    expect(screen.getByText('1-5 of 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to first page')).toBeDisabled();
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
    expect(screen.getByLabelText('Go to last page')).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<Pagination {...defaultProps} />);

    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toHaveAttribute(
      'aria-labelledby',
      'rows-per-page-label',
    );

    const rowsPerPageLabel = screen.getByText('Rows per page');
    expect(rowsPerPageLabel).toHaveAttribute('id', 'rows-per-page-label');
  });

  it('handles edge case when currentPage is greater than totalPages', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={10}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
      />,
    );

    // Should still show some reasonable display
    expect(screen.getByText(/of 50/)).toBeInTheDocument();
  });

  it('handles very large numbers correctly', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={100}
        totalPages={200}
        totalItems={2000}
        itemsPerPage={10}
      />,
    );

    expect(screen.getByText('991-1000 of 2000')).toBeInTheDocument();
  });

  it('handles when itemsPerPage is larger than totalItems', () => {
    render(
      <Pagination
        {...defaultProps}
        currentPage={1}
        totalPages={1}
        totalItems={5}
        itemsPerPage={20}
      />,
    );

    expect(screen.getByText('1-5 of 5')).toBeInTheDocument();
  });
});

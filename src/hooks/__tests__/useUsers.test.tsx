import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useUsers } from '../useUsers';
import '@testing-library/jest-dom';

// Mock fetch globally
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true,
});

// Create wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUsers hook', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('fetches users successfully with default pagination', async () => {
    const mockUsers = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'Active' as const,
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'Editor',
        status: 'Active' as const,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    } as Response);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      users: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
    });
  });

  it('fetches users with custom pagination', async () => {
    const mockUsers = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      firstName: `User`,
      lastName: `${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'Editor',
      status: 'Active' as const,
    }));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    } as Response);

    const { result } = renderHook(() => useUsers(2, 5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Should return users 6-10 (page 2, limit 5)
    expect(result.current.data?.users).toHaveLength(5);
    expect(result.current.data?.page).toBe(2);
    expect(result.current.data?.limit).toBe(5);
    expect(result.current.data?.total).toBe(15);
    expect(result.current.data?.users[0].id).toBe('6');
  });

  it('handles fetch error correctly', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('Network error');
  });

  it('handles HTTP error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(
      'Failed to fetch users',
    );
  });

  it('handles empty user list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      users: [],
      total: 0,
      page: 1,
      limit: 10,
    });
  });

  it('handles pagination beyond available data', async () => {
    const mockUsers = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'Admin',
        status: 'Active' as const,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUsers),
    } as Response);

    // Request page 5 with limit 10, but only 1 user exists
    const { result } = renderHook(() => useUsers(5, 10), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.users).toEqual([]);
    expect(result.current.data?.total).toBe(1);
    expect(result.current.data?.page).toBe(5);
    expect(result.current.data?.limit).toBe(10);
  });
});

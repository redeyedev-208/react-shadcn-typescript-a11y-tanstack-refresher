import { useQuery } from '@tanstack/react-query';

// Updated interface to match your JSON server data
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

const fetchUsers = async (page = 1, limit = 10): Promise<UsersResponse> => {
  // For JSON Server v1.0+, we need to make two calls or use a different approach
  // First, get all users to calculate total
  const allUsersResponse = await fetch('http://localhost:3001/users');
  if (!allUsersResponse.ok) {
    throw new Error('Failed to fetch users');
  }
  const allUsers = await allUsersResponse.json();
  const total = allUsers.length;

  // Then get paginated results
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = allUsers.slice(startIndex, endIndex);

  return {
    users: paginatedUsers,
    total,
    page,
    limit,
  };
};

export const useUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => fetchUsers(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

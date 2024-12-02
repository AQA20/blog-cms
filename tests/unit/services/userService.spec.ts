import { describe, it, expect, type Mock } from 'vitest';
import apiClient from '@/services/api';
import { loginUser } from '@/services/userService';
import { User, UserRawData } from '@/types/User';

// Mock apiClient to isolate test behavior
vi.mock('@/services/api', () => ({
  // default because apiClient is export as default
  default: {
    post: vi.fn(),
  },
}));

// Define a CustomError type for testing purposes
class CustomError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

describe('fetchUser', () => {
  const mockUserData: UserRawData = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: Date.now().toString(),
    userRoles: [
      {
        id: 1,
        name: 'admin',
        permissions: [{ id: 1, name: 'all_permissions' }],
      },
    ],
  };

  const normalizedUserData: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    roles: [
      {
        id: 1,
        name: 'admin',
        permissions: [{ id: 1, name: 'all_permissions' }],
      },
    ],
  };

  it('should return normalized user data when login is successful', async () => {
    // Mock the API response
    (apiClient.post as Mock).mockResolvedValue({
      data: { data: mockUserData },
    });

    const result = await loginUser('john@example.com', 'password123');
    expect(result).toEqual(normalizedUserData);
    expect(apiClient.post).toHaveBeenCalledWith('/login', {
      email: 'john@example.com',
      password: 'password123',
    });
  });

  it('should throw an error when API response fails', async () => {
    const errorMessage = 'Invalid credentials';
    (apiClient.post as Mock).mockRejectedValue(new Error(errorMessage));

    await expect(
      loginUser('john@example.com', 'wrongpassword'),
    ).rejects.toThrow(errorMessage);
  });

  it('should call handleAsyncError and handle custom errors', async () => {
    (apiClient.post as Mock).mockRejectedValue(
      new CustomError('Custom error', 400),
    );
    await expect(
      loginUser('invalid@example.com', 'password123'),
    ).rejects.toThrow('Custom error - 400');
  });
});

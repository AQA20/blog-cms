import { User, UserRawData } from '@/types/User';
import apiClient from '@/services/apiClient';
import { handleAsyncError } from '@/lib/utils';

const normalizeUserData = (rawData: UserRawData): User => {
  return {
    id: rawData.id,
    name: rawData.name,
    email: rawData.email,
    roles: rawData.userRoles,
  };
};

export const loginUser = handleAsyncError(
  async (email: string, password: string) => {
    const {
      data: { data },
    } = await apiClient.post('/login', {
      email,
      password,
    });
    return normalizeUserData(data);
  },
);

export const fetchUser = handleAsyncError(async (): Promise<User> => {
  const {
    data: { data },
  } = await apiClient.get('/profile');

  return normalizeUserData(data);
});

export const logoutUser = handleAsyncError(async () => {
  await apiClient.post('/logout');
});

export const refreshToken = handleAsyncError(async (): Promise<User> => {
  const {
    data: { data },
  } = await apiClient.post('/token/refresh');

  return data;
});

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchUser, refreshToken } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setUser } from '@/app/store/slices/userSlice';
import { User } from '@/types/User';
import { REVALIDATE_TOKEN_INTERVAL } from '@/lib/constants';
import { LoadingIndicator } from '@/components/LoadingIndicator/LoadingIndicator';

const PUBLIC_ROUTES = ['/'];

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  const handleAuthSuccess = (userData: User) => {
    dispatch(setUser(userData));
  };

  const { isLoading } = useQuery<User, Error>({
    queryKey: ['check-auth'],
    queryFn: async () => {
      try {
        const user = await fetchUser();
        handleAuthSuccess(user);
        return user;
      } catch (error) {
        try {
          const refreshedUser = await refreshToken();
          handleAuthSuccess(refreshedUser);
          return refreshedUser;
        } catch {
          if (!isPublicRoute) {
            router.replace('/');
          }
          dispatch(setUser(null));
          throw error;
        }
      }
    },
    retry: false, // failed queries will not retry by default
    gcTime: 0, // Prevent caching
    staleTime: 0, // Ensure fresh data on each fetch
    refetchInterval: REVALIDATE_TOKEN_INTERVAL,
    refetchIntervalInBackground: true,
  });

  // Always render public routes immediately
  if (isPublicRoute) {
    return children;
  }

  // Show nothing during initial authentication check
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // User is authenticated
  return children;
};

export default AuthProvider;

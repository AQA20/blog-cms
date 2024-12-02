'use client';

import React from 'react';
import { LoginForm } from '@/components/LoginForm/LoginForm';
import { Logo } from '@/components/Logo';
import { LoadingIndicator } from '@/components/LoadingIndicator/LoadingIndicator';
import { useThemeMode } from '@/hooks/useThemeMode';

const Page = () => {
  const { currentTheme, resolvedTheme } = useThemeMode();

  if (!resolvedTheme) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Logo fill={currentTheme === 'light' ? 'black' : 'white'} />
      <br />
      <LoginForm />
    </div>
  );
};

export default Page;

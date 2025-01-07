import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import userReducer from '@/slices/userSlice';
import { vi, afterEach } from 'vitest';
import { checkEnvVariables } from './checkEnvVariables';
import { checkServerStatus } from './checkServerStatus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockUseRouter } from './__mocks__/next/navigation';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import '@testing-library/jest-dom';

checkEnvVariables();
// Ecma2023 allows you to call await without being wrapped in an async function
await checkServerStatus();

// Create a test store factory
export const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState,
  });

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

// Utility function to render with Redux provider
export function renderWithProviders(
  ui: React.ReactElement,
  preloadedState = {},
) {
  const store = createTestStore(preloadedState);
  const queryClient = createTestQueryClient();
  return render(
    <RouterContext.Provider value={mockUseRouter()}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </Provider>
      ,
    </RouterContext.Provider>,
  );
}

// Mock console.error globally to suppress error logs in terminal
vi.spyOn(console, 'error').mockImplementation(() => null);

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetModules();
  vi.clearAllMocks();
});

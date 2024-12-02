import { vi } from 'vitest';
import { NextRouter } from 'next/router';

// Store the mock instance
export let routerMock: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  back: vi.fn(),
  beforePopState: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
  reload: vi.fn(),
  replace: vi.fn(),
  forward: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  defaultLocale: 'en',
  domainLocales: [],
  isPreview: false,
};

vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
  notFound: vi.fn(() => 'Not Found'),
}));

// Utility to create and update the router mock
export const mockUseRouter = (
  overrides: Partial<NextRouter> = {},
): NextRouter => {
  // Update the existing routerMock with new overrides
  routerMock = {
    ...routerMock,
    ...overrides,
  };

  return routerMock;
};

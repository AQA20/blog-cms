import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/'];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch user data
async function fetchUser(request: NextRequest) {
  const response = await fetch(`${API_URL}/profile`, {
    headers: { cookie: request.headers.get('cookie') || '' }, // Forward cookies from the request
    credentials: 'include', // Include cookies for session
  });
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

// Refresh the token
async function refreshToken(request: NextRequest) {
  const response = await fetch(`${API_URL}/token/refresh`, {
    method: 'POST',
    headers: { cookie: request.headers.get('cookie') || '' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to refresh token');
  return response.json();
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

let user: unknown = null;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // If the user is already authenticated and tries to access the login page
  if (pathname === '/' && user) {
    // Redirect authenticated user to the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow public routes to proceed
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    // Attempt to fetch the user profile
    user = await fetchUser(request);
    return NextResponse.next();
  } catch (error) {
    console.error('User fetch failed:', getErrorMessage(error));
    console.info('Tying to refresh token');
    try {
      // Attempt to refresh the token and retry fetching the user
      await refreshToken(request);
      console.info('Token was successfully refreshed!');
      return NextResponse.next();
    } catch (refreshError) {
      user = null;
      console.error('Token refresh failed:', getErrorMessage(refreshError));
      // Redirect to login if refresh also fails
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes
     * - Static files
     * - Images
     * - Favicon
     * - Public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

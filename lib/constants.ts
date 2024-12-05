import { ToastVariant } from '@/types/ToastVariant';

export const LOGIN_PASSWORD_MIN_LEN = 1;
export const HTTP_STATUS_OK = 200;
const minutes = 15;
const seconds = 60;
const ms = 1000;
export const REVALIDATE_TOKEN_INTERVAL = minutes * seconds * ms; // time in ms
export const FIRST_PAGE = 1;
export const MAX_TAGS = 5;

export const DEFAULT_TITLES = {
  success: 'Successful!',
  error: 'Uh oh! Something went wrong.',
};

export const DEFAULT_VARIANTS: Record<'success' | 'error', ToastVariant> = {
  success: 'default',
  error: 'destructive',
};

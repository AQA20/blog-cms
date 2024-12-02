import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { notFound } from 'next/navigation';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define a custom error type that may include message and statusCode
interface CustomError extends Error {
  statusCode?: number;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Check if it's an instance of CustomError
    if ((error as CustomError).statusCode !== undefined) {
      return `${error.message} - ${(error as CustomError).statusCode}`;
    }
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

// Wrapper function to handle asynchronous errors (Instead of repeating
// try/catch block in each asynchronous function)
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
export const handleAsyncError = <T extends (...args: any[]) => any>(
  func: T,
) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await func(...args);
    } catch (error) {
      console.error('error', error);
      const err = getErrorMessage(error);

      // Type guard for CustomError
      if (err === 'Article is not found') {
        return notFound();
      }
      throw new Error(err);
    }
  };
};

export const validateHTML = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return !doc.querySelector('parsererror'); // Valid if no parsing errors
};

export const stripHTMLTags = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || ''; // Extract only text content without tags
};

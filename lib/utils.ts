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

// Helper function to extract image elements from HTML
export const extractImageElements = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const imgElements = Array.from(doc.getElementsByTagName('img'));
  return imgElements.map((img) => img.outerHTML);
};

export const extractImgUrlFromHtml = (html: string): string[] => {
  return Array.from(
    // Extract image URLs from the new content.
    // <img: Matches the literal string <img, indicating the start of an image tag.
    // [^>]+: A character class [^>] that matches any character except >. The + quantifier means one or more occurrences. This part matches any attributes within the <img> tag that are not the closing angle bracket.
    // src=": Matches the literal string src=", which is the start of the image source attribute.
    // ([^">]+): A capturing group (...) that matches one or more + characters that are not " or >. This captures the URL of the image.
    // ": Matches the closing double quote of the src attribute.
    // /g: The global flag g indicates that the search should find all matches in the string, not just the first one.
    html.matchAll(/<img[^>]+src="([^">]+)"/g), // Returns iterable object
    (m) => m[1], // A mapping function to access the first capturing group
  );
};

export const extractFilenameFromCloudFrontUrl = (url: string): string => {
  const regex = /cloudfront.net\/(.+)\?/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

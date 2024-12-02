import { describe, it, expect, vi } from 'vitest';
import { handleAsyncError } from '@/lib/utils';
import { notFound } from 'next/navigation';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => 'Not Found'),
}));

// Define a CustomError type for testing purposes
class CustomError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

describe('handleAsyncError', () => {
  it('should return the result of the original function if it succeeds', async () => {
    const mockFunc = vi.fn().mockResolvedValue('success');
    const wrappedFunc = handleAsyncError(mockFunc);

    const result = await wrappedFunc();
    expect(result).toEqual('success');
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it('should call notFound() if error message is "Article is not found"', async () => {
    const mockFunc = vi
      .fn()
      .mockRejectedValue(new CustomError('Article is not found'));
    const wrappedFunc = handleAsyncError(mockFunc);

    const result = await wrappedFunc();
    expect(notFound).toHaveBeenCalledTimes(1);
    expect(result).toEqual('Not Found');
  });

  it('should throw a custom error message if CustomError with statusCode is thrown', async () => {
    const mockFunc = vi
      .fn()
      .mockRejectedValue(new CustomError('Custom error message', 404));
    const wrappedFunc = handleAsyncError(mockFunc);

    await expect(wrappedFunc()).rejects.toThrow('Custom error message - 404');
  });

  it('should throw original error message if error is an instance of Error', async () => {
    const mockFunc = vi.fn().mockRejectedValue(new Error('Regular error'));
    const wrappedFunc = handleAsyncError(mockFunc);

    await expect(wrappedFunc()).rejects.toThrow('Regular error');
  });

  it('should throw "Unknown error" if the error is not an instance of Error', async () => {
    const mockFunc = vi.fn().mockRejectedValue('Unknown error');
    const wrappedFunc = handleAsyncError(mockFunc);

    await expect(wrappedFunc()).rejects.toThrow('Unknown error');
  });
});

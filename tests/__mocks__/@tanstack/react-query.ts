import { vi, type Mock } from 'vitest';
import { useMutation } from '@tanstack/react-query';

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
}));

// Mutation mock helpers
export const mockMutationSuccess = (data: unknown) => {
  (useMutation as Mock).mockReturnValue({
    mutate: vi.fn((variables, options) => options?.onSuccess(data)),
    isPending: false,
    isError: false,
    isSuccess: true,
  });
};

export const mockMutationError = (errorMessage: string) => {
  (useMutation as Mock).mockReturnValue({
    mutate: vi.fn((variables, options) =>
      options?.onError(new Error(errorMessage)),
    ),
    isPending: false,
    isError: false,
    isSuccess: true,
    error: new Error(errorMessage),
  });
};

export const mockMutationPending = () => {
  (useMutation as Mock).mockReturnValue({
    mutate: vi.fn(),
    isPending: true,
    isError: false,
    isSuccess: false,
  });
};

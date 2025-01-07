import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/LoginForm/LoginForm';
import { renderWithProviders } from '@/setup';
import {
  mockMutationSuccess,
  mockMutationError,
  mockMutationPending,
} from '@/mocks/@tanstack/react-query';
import { mockUseRouter } from '@/mocks/next/navigation';
import envConfig from '@/envConfig';

const { EMAIL, PASSWORD } = envConfig;

describe('LoginForm', () => {
  it('should dispatch login action and navigate to /dashboard on successful login', async () => {
    // Arrange: Mock the mutation to simulate a successful login
    const mockUser = { name: 'John Doe', email: EMAIL, password: PASSWORD };
    // Predefined value for the redux store
    const preloadedState = {
      user: { user: mockUser },
    };

    const { replace } = mockUseRouter();

    mockMutationSuccess(mockUser);

    // Render the LoginForm component with the app providers
    renderWithProviders(<LoginForm />, preloadedState);

    // Fill in the email and password fields
    fireEvent.input(screen.getByPlaceholderText('Email'), {
      target: { value: EMAIL },
    });
    fireEvent.input(screen.getByPlaceholderText('Password'), {
      target: { value: PASSWORD },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert: Verify navigation to /dashboard
    // Wait for the mutation and subsequent effects to complete
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should handle error on failed login', async () => {
    mockMutationError('Invalid credentials');
    renderWithProviders(<LoginForm />);
    // Fill in the form with incorrect credentials
    fireEvent.input(screen.getByPlaceholderText('Email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.input(screen.getByPlaceholderText('Password'), {
      target: { value: 'WrongPassword23!' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      // Verify that the error message is displayed
      expect(screen.getByText(/Invalid credentials/)).toBeInTheDocument(); // Check if error message is shown
    });
  });

  it('should disable the button and show loading icon when mutation is pending', async () => {
    mockMutationPending();

    renderWithProviders(<LoginForm />);

    // Fill in the email and password fields
    fireEvent.input(screen.getByPlaceholderText('Email'), {
      target: { value: EMAIL },
    });
    fireEvent.input(screen.getByPlaceholderText('Password'), {
      target: { value: PASSWORD },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      // Assert: The login button should be disabled and loading icon should be shown
      expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
      expect(
        screen.getByRole('button').querySelector('.animate-spin'),
      ).toBeInTheDocument();
    });
  });
});

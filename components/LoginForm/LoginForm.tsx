'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginUser } from '@/services/userService';
import { useAppDispatch } from '@/store';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/slices/userSlice';
import { LOGIN_PASSWORD_MIN_LEN } from '@/lib/constants';
import { User } from '@/types/User';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(LOGIN_PASSWORD_MIN_LEN, 'Password cannot be empty'),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  // Use the typed dispatch hook
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Define the mutation using react-query's useMutation hook
  const mutation = useMutation<User, Error, z.infer<typeof formSchema>>({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Perform the API call with the form values
      const response = await loginUser(values.email, values.password);
      return response;
    },
    onSuccess: (data) => {
      // Dispatch the Redux action to update the user state on success
      dispatch(login(data));
      router.replace('/dashboard');
    },
    onError: (error) => {
      console.error('Error logging in:', error.message);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    mutation.mutate(values);
  }

  console.log('log from LoginFrom')
  useEffect(() => {
    if (process.env.NEXT_ENVIRONMENT === 'testing') {
      form?.setValue('email', 'test@500kalima.com');
      form?.setValue('password', 'Qzbs2+Clw%fK4p6');
    }
  }, [form]);

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 px-8 md:max-w-md md:px-0 lg:w-1/4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mutation.isError && (
          <div className="text-destructive">
            An error occurred: {mutation.error.message}
          </div>
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  );
}

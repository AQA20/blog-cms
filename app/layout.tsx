import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import ClientQueryProvider from '@/providers/ClientQueryProvider';
import StoreProvider from '@/providers/storeProvider';
import AuthProvider from '@/providers/AuthProvider';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/ThemeProvider';

const notoSans = localFont({
  src: './fonts/NotoSans.ttf',
  variable: '--font-noto-sans',
  weight: '400 500 600 700',
});

export const metadata: Metadata = {
  title: '500Kalima CMS',
  description: 'CMS for 500Kalima website',
};

//? In TypeScript, the Readonly<T> utility type is used to make all properties of
// a given type T immutable. When applied to an object type, it ensures that the
// properties of that object cannot be reassigned after they are initialized.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} antialiased`}>
        {/* Wrap the app with StoreProvider and QueryClientProvider */}
        <StoreProvider>
          <ClientQueryProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </AuthProvider>
            <Toaster />
          </ClientQueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

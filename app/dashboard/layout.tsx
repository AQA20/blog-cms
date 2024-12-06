'use client';

import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar/AppSidebar';
import Navbar from '@/components/Navbar/Navbar';
import { useAppStore } from '@/hooks/useAppStore';
import { LayoutDashboard } from 'lucide-react';
import { SidebarItem } from '../types/SidebarItem';
import { logoutUser } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { logout } from '../store/slices/userSlice';
import { FormSubmitProvider } from '@/providers/FormSubmitProvider';

// Menu items.
const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
];

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { dispatch, useSelect } = useAppStore();

  const { user } = useSelect((state) => state.user);

  const handleLogout = async () => {
    router.replace('/');
    await logoutUser();
    dispatch(logout());
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        items={sidebarItems}
        username={user?.name || ''}
        email={user?.email || ''}
        onLogout={handleLogout}
      />

      <main className="w-full">
        <FormSubmitProvider>
          <Navbar />
          <div className="mt-12 p-2 pt-6 sm:p-4">{children}</div>
        </FormSubmitProvider>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;

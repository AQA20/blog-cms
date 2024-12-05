'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, PencilIcon, Sun, Moon, Loader2 } from 'lucide-react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation';
import { NavbarItems } from '@/components/Navbar/NavbarItems';
import { useThemeMode } from '@/hooks/useThemeMode';
import { LoadingIndicator } from '@/components/LoadingIndicator/LoadingIndicator';
import { useAppStore } from '@/hooks/useAppStore';
import { useFormSubmit } from '@/providers/FormSubmitProvider';

const Navbar = () => {
  const { open, isMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const { currentTheme, setTheme, resolvedTheme } = useThemeMode();
  const { useSelect } = useAppStore();
  const { isLoading } = useSelect((state) => state.articleForm);
  const { submitFn } = useFormSubmit();

  const navItems = () => {
    if (pathname === '/dashboard/article/new') {
      return <h1 className="ml-2 text-title-l">Add New Article</h1>;
    } else if (pathname.match(/\/dashboard\/article\/edit\/\d+/)) {
      return <h1 className="ml-2 text-title-l">Edit Article</h1>;
    }
    return <NavbarItems />;
  };

  const navButton = () => {
    if (pathname === '/dashboard/article/new') {
      return (
        <Button onClick={() => submitFn()} disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          {!isLoading && <PencilIcon />}
          {!isMobile && 'Add Article'}
        </Button>
      );
    } else if (pathname.match(/\/dashboard\/article\/edit\/\d+/)) {
      return (
        <Button onClick={() => submitFn()} disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          {!isLoading && <Edit />}
          {!isMobile && 'Edit Article'}
        </Button>
      );
    }
    return (
      <Button onClick={() => router.push('/dashboard/article/new')}>
        <Plus /> {!isMobile && 'Create Article'}
      </Button>
    );
  };

  if (!resolvedTheme) return <LoadingIndicator />;

  return (
    <nav
      className={clsx(
        'fixed top-0 z-20 flex h-14 items-center border-b-2 bg-sidebar pl-3 pr-4',
        {
          'w-[calc(100%-16rem)]': !isMobile && open,
          'w-[calc(100%-3rem)]': !isMobile && !open,
          'w-full': isMobile,
        },
      )}
    >
      <SidebarTrigger />
      <div className="flex w-full items-center justify-between">
        {navItems()}
        <div className="flex gap-2">
          {navButton()}
          {currentTheme === 'light' ? (
            <Button
              variant="outline"
              className="border-transparent bg-transparent shadow-none"
              size="icon"
              onClick={() => setTheme('dark')}
            >
              <Moon
                onClick={() => setTheme('dark')}
                className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme('light')}
              className="border-transparent bg-transparent shadow-none"
            >
              <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

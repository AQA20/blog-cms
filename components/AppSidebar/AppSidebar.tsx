'use client';

import React from 'react';
import { LogOutIcon } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import DashboardLogo from '@/components/DashboardLogo';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarItem } from '@/types/SidebarItem';
import { usePathname } from 'next/navigation';
import { useThemeMode } from '@/hooks/useThemeMode';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  items: SidebarItem[];
  username: string;
  email: string;
  onLogout: () => void | Promise<void>;
}

const AppSidebar: React.FC<Props> = ({ items, username, email, onLogout }) => {
  const { open } = useSidebar();
  const pathname = usePathname();
  const { currentTheme, resolvedTheme } = useThemeMode();

  const activeClass = (url: string) => {
    return url === pathname ? 'bg-secondary' : '';
  };

  if (!resolvedTheme) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="logo-menu-item" className="my-3">
                <Link href="/dashboard" className="block w-fit">
                  <DashboardLogo
                    fill={currentTheme === 'dark' ? 'white' : 'black'}
                  />
                </Link>
              </SidebarMenuItem>

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={`hover:bg-secondary active:bg-secondary ${activeClass(item.url)}`}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon style={{ width: 20, height: 20 }} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center space-x-4">
              <Avatar className="h-[32px] w-[32px] rounded-md">
                <AvatarImage src="" alt="user" />
                <AvatarFallback>
                  {username.charAt(0).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              {open && (
                <>
                  <div className="flex-1">
                    <p className="text-body-m text-foreground">{username}</p>
                    <p className="text-body-s text-foreground">{email}</p>
                  </div>
                  <LogOutIcon
                    className="-scale-x-100 transform cursor-pointer"
                    name="Logout Icon"
                    onClick={onLogout}
                  />
                </>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

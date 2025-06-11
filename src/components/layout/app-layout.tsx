
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapIcon, Leaf, Newspaper, Bot, PanelLeft } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/mapa', label: 'Mapa', icon: MapIcon },
  { href: '/cultivos', label: 'Cultivos', icon: Leaf },
  { href: '/articulos', label: 'Artículos', icon: Newspaper },
  { href: '/deteccion-ia', label: 'Detección con IA', icon: Bot },
];

function AppName() {
  const { state, isMobile } = useSidebar();
  if (state === 'collapsed' && !isMobile) {
    return (
      <Link href="/" className="flex items-center justify-center">
        <Leaf className="h-7 w-7 text-primary" />
      </Link>
    );
  }
  return (
    <Link href="/" className="flex items-center gap-2">
      <Leaf className="h-7 w-7 text-primary" />
      <span className="text-xl font-semibold font-headline text-foreground">AgriNavigate</span>
    </Link>
  );
}


export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarHeader className="p-3">
             <div className="flex items-center justify-between">
                <AppName />
                <div className="md:hidden"> {/* Mobile trigger inside header, only shows on mobile */}
                   <SidebarTrigger className="text-foreground hover:text-primary" />
                </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      className={cn(
                        "w-full justify-start gap-3",
                        "group-data-[collapsible=icon]:justify-center" 
                      )}
                      isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                      tooltip={{children: item.label, className: "font-body"}}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="group-data-[collapsible=icon]:sr-only">{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-14 items-center gap-4 border-b bg-background/90 px-4 sticky top-0 z-30 backdrop-blur-sm">
                <div className="hidden md:block"> {/* Desktop trigger */}
                  <SidebarTrigger className="text-foreground hover:text-primary" />
                </div>
                {/* Optional: Add breadcrumbs or page-specific actions here */}
                <div className="flex-1">
                  {/* Could add a dynamic page title here if desired */}
                </div>
            </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

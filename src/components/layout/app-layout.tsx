
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Leaf, BookOpen, Lightbulb, Menu, Search, Bot } from 'lucide-react'; // Added Bot
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/mapa', label: 'Mapa Interactivo', icon: Map },
  { href: '/cultivos', label: 'Cultivos', icon: Leaf },
  { href: '/guias', label: 'Guías Educativas', icon: BookOpen },
  { href: '/test', label: 'Test Interactivo', icon: Lightbulb },
  { href: '/deteccion-ia', label: 'Detección IA', icon: Bot }, // Added Detección IA
];

function AppName() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Leaf className="h-7 w-7 text-primary" />
      <span className="text-xl font-semibold text-foreground">Cultiva Colombia</span>
    </Link>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/95 px-4 shadow-sm backdrop-blur-sm md:px-6">
        <div className="flex w-full items-center justify-between gap-4">
          {/* Left side: App Name (Desktop) and Mobile Menu Trigger + App Icon (Mobile) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <div className="p-4 border-b">
                  <AppName />
                </div>
                <div className="p-4">
                  <form className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Buscar..." className="w-full pl-10 h-10 rounded-md" />
                  </form>
                </div>
                <nav className="flex-grow grid gap-1 px-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all hover:bg-muted hover:text-primary",
                        (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))
                          ? "bg-muted text-secondary" // Changed text-primary to text-secondary
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            
            {/* Desktop App Name */}
            <div className="hidden md:block">
              <AppName />
            </div>
            {/* Mobile App Icon (if AppName component is too large for mobile header) */}
            <div className="md:hidden">
               <Link href="/" className="flex items-center">
                   <Leaf className="h-7 w-7 text-primary" />
               </Link>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex md:items-center md:gap-3 lg:gap-5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-secondary", // Changed hover:text-primary to hover:text-secondary
                  (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))
                    ? "text-secondary border-b-2 border-secondary pb-0.5" // Changed text-primary and border-primary
                    : "text-foreground/70"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Desktop Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="h-9 rounded-md pl-9 md:w-[150px] lg:w-[230px] xl:w-[280px]"
            />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}

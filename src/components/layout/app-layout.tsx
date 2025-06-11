
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Leaf, BookOpen, Lightbulb, Menu } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/mapa', label: 'Mapa Interactivo', icon: Map },
  { href: '/cultivos', label: 'Cultivos', icon: Leaf },
  { href: '/guias', label: 'Guías Educativas', icon: BookOpen },
  { href: '/test', label: 'Test Interactivo', icon: Lightbulb },
];

function AppName() {
  return (
    <Link href="/" className="flex items-center gap-2 mr-6">
      <Leaf className="h-7 w-7 text-primary" />
      <span className="text-xl font-semibold text-foreground">Cultivando Saberes</span>
    </Link>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 px-4 shadow-sm backdrop-blur-sm md:px-6">
        <div className="flex w-full items-center justify-between">
          <div className="hidden md:flex">
             <AppName />
          </div>
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground",
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                    ? "text-foreground font-semibold border-b-2 border-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium pt-8">
                  <AppName />
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground",
                        pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                          ? "bg-muted text-foreground"
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
             <div className="md:hidden ml-4">
                <Link href="/" className="flex items-center gap-2">
                    <Leaf className="h-7 w-7 text-primary" />
                    <span className="text-lg font-semibold text-foreground sr-only sm:not-sr-only">Cultivando Saberes</span>
                </Link>
            </div>
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

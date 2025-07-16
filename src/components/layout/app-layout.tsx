
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Map, Leaf, BookOpen, Lightbulb, Menu, Search, Bot, LogOut, LayoutDashboard, UserPlus, LogIn, BookText } from 'lucide-react'; 
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home, protected: false },
  { href: '/mapa', label: 'Mapa', icon: Map, protected: false },
  { href: '/cultivos', label: 'Cultivos', icon: Leaf, protected: false },
  { href: '/guias', label: 'Guías', icon: BookOpen, protected: false },
  { href: '/glosario', label: 'Glosario', icon: BookText, protected: false },
  { href: '/test', label: 'Test', icon: Lightbulb, protected: false },
  { href: '/deteccion-ia', label: 'Detección IA', icon: Bot, protected: false },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, protected: true },
];

function AppName() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Leaf className="h-7 w-7 text-primary" />
      <span className="text-xl font-nunito font-semibold text-foreground">Cultiva Colombia</span>
    </Link>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const displayedNavItems = navItems.filter(item => !item.protected || (item.protected && user));

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/95 px-4 shadow-sm backdrop-blur-sm md:px-6">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 md:hidden text-foreground hover:bg-primary/20">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <SheetHeader className="p-4 border-b">
                   <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
                  <AppName />
                </SheetHeader>
                <nav className="flex-grow grid gap-1 p-4">
                  {displayedNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-nunito font-medium transition-all hover:bg-muted hover:text-primary",
                        (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))
                          ? "bg-muted text-primary font-semibold" 
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                   {user && (
                    <Button variant="ghost" onClick={handleSignOut} className="justify-start gap-3 px-3 py-3 text-base font-nunito font-medium text-muted-foreground hover:bg-muted hover:text-primary">
                      <LogOut className="h-5 w-5" />
                      Cerrar Sesión
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            
            <div className="hidden md:block">
              <AppName />
            </div>
            <div className="md:hidden">
               <Link href="/" className="flex items-center">
                   <Leaf className="h-7 w-7 text-primary" />
               </Link>
            </div>
          </div>

          <nav className="hidden md:flex md:items-center md:gap-3 lg:gap-5">
            {displayedNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-nunito font-semibold transition-colors hover:text-primary", 
                  (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))
                    ? "text-primary border-b-2 border-primary pb-0.5" 
                    : "text-foreground/70"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!loading && (
              user ? (
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Registrarse
                    </Link>
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
      <footer className="border-t bg-background/95">
        <div className="container mx-auto px-6 py-4 text-center text-xs text-muted-foreground">
            <p>
                © {new Date().getFullYear()} Cultiva Colombia. Todos los derechos reservados.
            </p>
            <p className="mt-1">
                Imágenes de cultivos por <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Freepik</a>. 
                Imagen de Árbol de Pan por <a href="https://pixabay.com/es/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Pixabay/PublicDomainPictures</a>.
            </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

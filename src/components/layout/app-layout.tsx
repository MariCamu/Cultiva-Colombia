
"use client";

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Map, Leaf, BookOpen, Lightbulb, Menu, Search, Bot, LogOut, LayoutDashboard, UserPlus, LogIn, BookText } from 'lucide-react'; 
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from '@/context/auth-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { ThemeToggle } from './theme-toggle';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


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
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const displayedNavItems = navItems.filter(item => !item.protected || (item.protected && user));

  const authButtons = user ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Cerrar Sesión</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro que quieres cerrar sesión?</AlertDialogTitle>
          <AlertDialogDescription>
            Podrás volver a iniciar sesión en cualquier momento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut}>Cerrar Sesión</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : isMobile ? (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon">
            <Link href="/login">
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Iniciar Sesión</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Iniciar Sesión</p></TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild size="icon">
            <Link href="/signup">
              <UserPlus className="h-5 w-5" />
              <span className="sr-only">Registrarse</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Registrarse</p></TooltipContent>
      </Tooltip>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="ghost">
        <Link href="/login">Iniciar Sesión</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">Registrarse</Link>
      </Button>
    </div>
  );

  return (
    <TooltipProvider>
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/95 px-4 shadow-sm backdrop-blur-sm md:px-6">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                      onClick={() => setIsSheetOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-nunito font-medium transition-all hover:bg-muted hover:text-primary",
                        (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)))
                          ? "bg-muted text-primary font-semibold" 
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-6 w-6" />
                      {item.label}
                    </Link>
                  ))}
                   {user && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" className="justify-start gap-3 px-3 py-3 text-base font-nunito font-medium text-muted-foreground hover:bg-muted hover:text-primary">
                           <LogOut className="h-6 w-6" />
                           Cerrar Sesión
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro que quieres cerrar sesión?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setIsSheetOpen(false)}>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { handleSignOut(); setIsSheetOpen(false); }}>Cerrar Sesión</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
            {!loading && authButtons}
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
                Orégano por Helga (<a href="https://pixabay.com/es/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Pixabay</a>), 
                Hierbabuena por R. E. Beck (<a href="https://pixabay.com/es/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Pixabay</a>), 
                Árbol de Pan por PublicDomainPictures (<a href="https://pixabay.com/es/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Pixabay</a>).
            </p>
        </div>
      </footer>
      <Toaster />
    </div>
    </TooltipProvider>
  );
}

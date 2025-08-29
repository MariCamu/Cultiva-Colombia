import type { Metadata } from 'next';
import { Nunito, Baloo_2 } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
});

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-baloo',
});

export const metadata: Metadata = {
  title: 'Cultiva Colombia',
  description: 'Plataforma educativa interactiva sobre cultivos en Colombia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          nunito.variable,
          baloo.variable
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

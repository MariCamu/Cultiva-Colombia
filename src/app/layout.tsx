import type { Metadata } from 'next';
import { Nunito, Baloo_2 } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/components/theme-provider';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
});

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400'], // Baloo 2 has various weights, 400 is regular
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
    <html lang="es" className={`${nunito.variable} ${baloo.variable}`} suppressHydrationWarning>
      <head />
      <body className={`antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppLayout>{children}</AppLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

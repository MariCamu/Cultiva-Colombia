import type { Metadata } from 'next';
import { Nunito, Merriweather } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-merriweather',
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
    <html lang="es" className={`${nunito.variable} ${merriweather.variable}`}>
      <head />
      <body className={`antialiased font-sans`}> {/* font-sans will default to Merriweather via tailwind.config.ts */}
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

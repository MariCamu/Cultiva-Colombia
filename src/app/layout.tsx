import type { Metadata } from 'next';
import { Nunito, Baloo_2 } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';

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
    <html lang="es" className={`${nunito.variable} ${baloo.variable}`}>
      <head />
      <body className={`antialiased font-sans`}> {/* font-sans will default to Baloo 2 via tailwind.config.ts */}
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

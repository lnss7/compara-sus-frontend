import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono)',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CrossSUS • Cruzador de Dados da Saúde SMS Porto Alegre',
  description: 'Cruzamento e higienização client-side de bases e-SUS e SIAPS com conformidade 100% LGPD.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background font-body-md text-on-surface antialiased">
        <Sidebar />
        <div className="pl-[280px]">
          <Header />
          <main className="relative pt-16 min-h-screen bg-surface px-gutter pb-gutter">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

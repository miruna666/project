import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/NavBar';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'Aplicație cu Albine 🐝',
  description: 'Un joc educativ și dulce!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={geist.className}>
      <body
        style={{
          margin: 0,
          paddingTop: '100px', // spațiu permanent pt navbar
          backgroundColor: '#fffbe6',
          fontFamily: 'var(--font-geist)',
          minHeight: '100vh',
        }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}

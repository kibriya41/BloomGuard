import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/lib/queryClient';
import { AuthProvider } from '@/lib/authContext';

export const metadata: Metadata = {
  title: 'BloomGuard - AI-Powered Indoor Plant Care Platform',
  description: 'Manage your plant collections, identify plants using AI, receive personalized care recommendations, and track plant health over time.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <AuthProvider>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}

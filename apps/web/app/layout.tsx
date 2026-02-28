import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Provider } from '@/components/ui/provider';
import Navbar from '@/components/layout/navbar/Navbar';

import {
  ClientFooter,
  ClientToaster,
} from '@/components/layout/ClientComponents';
import { Box, Flex } from '@chakra-ui/react';
import MaintenancePage from '@/components/layout/MaintenancePage';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Zagotours',
    template: '%s | Zagotours',
  },
  description:
    'Making adventure tourism safe for young travelers 18-35 again. Find and book thrilling trips vetted against our safety standards. ',
  keywords: ['travel', 'tours', 'your other keywords'],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Zagotours',
    description: 'Your custom description here.',
    url: 'https://zagotours.com',
    siteName: 'Zagotours',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
    return <MaintenancePage />;
  }

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <Provider>
          <Flex direction='column' minH='100dvh' position='relative'>
            <Box as='header' position='sticky' top='0' zIndex='1000'>
              <Navbar />
            </Box>

            <Box as='main' flex='1 0 auto' w='full' position='relative'>
              {children}
            </Box>

            <ClientFooter />
          </Flex>
          <ClientToaster />
        </Provider>
      </body>
    </html>
  );
}

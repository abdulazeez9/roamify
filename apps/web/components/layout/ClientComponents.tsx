'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const Footer = dynamic(() => import('./Footer/Footer'), { ssr: false });

const Toaster = dynamic(() => import('../ui/toaster').then((m) => m.Toaster), {
  ssr: false,
});

export function ClientFooter() {
  return <Footer />;
}

export function ClientToaster() {
  useEffect(() => {
    const handleToast = (event: any) => {
      const { title, type, description } = event.detail;

      import('../ui/toaster').then((m) => {
        m.toaster.create({
          title,
          description,
          type,
        });
      });
    };

    window.addEventListener('app:toast', handleToast);
    return () => window.removeEventListener('app:toast', handleToast);
  }, []);

  return <Toaster />;
}

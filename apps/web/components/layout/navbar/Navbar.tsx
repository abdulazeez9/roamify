'use client';

import dynamic from 'next/dynamic';
import { DesktopNav } from '../../ui/navigation/navbar/DesktopNav';

const MobileNav = dynamic(
  () =>
    import('../../ui/navigation/navbar/MobileNav').then((mod) => mod.MobileNav),
  { ssr: false },
);

export default function Navbar() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import UnderConstructionPopup from './UnderConstructionPopup';

const navLinks = [
  { label: 'Exclusive Content', href: '/exclusive' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Terms', href: '/terms' }
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);

  const handleUnderConstruction = () => {
    const hasTerms =
      document.cookie.includes('termsAgreed=true') && document.cookie.includes('ageConfirmed=true');
    if (!hasTerms) {
      router.push('/terms');
      return;
    }
    setPopupOpen(true);
  };

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <header className="w-full bg-cream/80 backdrop-blur border-b border-fuchsia/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-plum">
          SloaneX
        </Link>
        <nav className="flex items-center gap-3">
          <button type="button" className="link-pill" onClick={handleUnderConstruction}>
            Sign Up
          </button>
          {navLinks.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNavigate(link.href)}
              className={
                pathname === link.href
                  ? 'link-pill bg-fuchsia text-cream'
                  : 'link-pill'
              }
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
      <UnderConstructionPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
    </header>
  );
}

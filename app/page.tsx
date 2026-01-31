'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UnderConstructionPopup from '../components/UnderConstructionPopup';

export default function HomePage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const router = useRouter();

  const handleAction = () => {
    const hasTerms =
      document.cookie.includes('termsAgreed=true') && document.cookie.includes('ageConfirmed=true');
    if (!hasTerms) {
      router.push('/terms');
      return;
    }
    setPopupOpen(true);
  };

  return (
    <section className="flex flex-col gap-10">
      <div className="relative overflow-hidden rounded-3xl border border-fuchsia/40 bg-gradient-to-r from-fuchsia/30 via-cream to-lavender/40 p-6 shadow-soft">
        <div className="h-48 w-full rounded-2xl bg-[url('https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute -bottom-12 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full border-4 border-cream bg-[url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=500&auto=format&fit=crop')] bg-cover bg-center shadow-soft" />
      </div>

      <div className="mt-10 flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-extrabold text-fuchsia">SloaneX</h1>
        <p className="max-w-2xl text-lg text-plum">
          A curated archive of exclusive photo and video drops, handcrafted with a bold fashion
          aesthetic. Join the private lounge for first access to every new release.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button type="button" className="btn-primary" onClick={handleAction}>
            Sign Up
          </button>
          <button type="button" className="btn-secondary" onClick={handleAction}>
            Login
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {['Exclusive galleries', 'Secure media delivery', 'Personalized updates'].map((item) => (
          <div key={item} className="card-surface p-6 text-center">
            <h3 className="text-xl font-semibold text-plum">{item}</h3>
            <p className="mt-2 text-sm text-plum/80">
              Experience handpicked visuals, secure viewing, and insider alerts crafted just for
              SloaneX members.
            </p>
          </div>
        ))}
      </div>

      <UnderConstructionPopup isOpen={popupOpen} onClose={() => setPopupOpen(false)} />
    </section>
  );
}

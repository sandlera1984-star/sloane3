'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const TERMS_TEXT = `
Welcome to SloaneX. These Terms of Agreement govern your access to and use of the SloaneX website and any content, products, or services provided through it.

1. Eligibility and Age Verification
You must be at least 18 years old (or the age of majority in your jurisdiction, if higher) to access this site. You are solely responsible for ensuring that your access and use of SloaneX is legal in your jurisdiction.

2. Adult Content Notice
SloaneX contains mature, adult-oriented content. By continuing, you acknowledge that you are an adult, that you are not offended by such material, and that you access the content voluntarily.

3. License and Personal Use Only
All content is licensed for your personal, non-commercial viewing only. You may not copy, distribute, record, scrape, reproduce, or create derivative works from the content. Any unauthorized use is strictly prohibited.

4. Acceptable Use
You agree not to use SloaneX for any unlawful purpose or in any way that violates these Terms. Minors are strictly prohibited from accessing or attempting to access the site.

5. Intellectual Property and DMCA
All content, trademarks, and materials on SloaneX are the exclusive property of SloaneX or its licensors. If you believe content infringes your copyright, please submit a DMCA-style takedown notice with sufficient detail to the contact address provided below.

6. Privacy Notice
We collect limited information to operate the service, including account details and usage data. See our Privacy Policy for more details: [Privacy Policy link placeholder].

7. As-Is / As-Available
SloaneX is provided on an “as-is” and “as-available” basis. We do not guarantee that the service will be uninterrupted, error-free, or secure.

8. Disclaimers and Limitation of Liability
To the fullest extent permitted by law, SloaneX disclaims all warranties, express or implied. We are not liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the service. Nothing in these Terms limits liability where such limitation is not permitted by law.

9. Indemnification
You agree to indemnify and hold harmless SloaneX and its affiliates from any claims, damages, liabilities, and expenses arising from your use of the service or violation of these Terms.

10. Termination
We may suspend or terminate access to the service at any time for violations of these Terms or to protect the service and its users.

11. Governing Law
These Terms are governed by the laws of Ontario, Canada, without regard to conflict of law principles.

12. Contact
For questions or notices, contact: [Contact email placeholder] | [Mailing address placeholder].

13. Changes to Terms
We may update these Terms from time to time. Continued use after changes constitutes acceptance of the updated Terms.
`;

export default function TermsPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const isBottom =
        Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight;
      if (isBottom) {
        setScrolledToBottom(true);
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (agreed && ageConfirmed) {
      document.cookie = `termsAgreed=true; path=/; max-age=${60 * 60 * 24 * 365}`;
      document.cookie = `ageConfirmed=true; path=/; max-age=${60 * 60 * 24 * 365}`;
      router.push('/');
    }
  }, [agreed, ageConfirmed, router]);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-fuchsia">Terms</h1>
        <p className="mt-2 text-plum">
          Please read the full agreement below. You must confirm both items to continue.
        </p>
      </div>

      <div className="card-surface p-6">
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto rounded-2xl border border-fuchsia/40 bg-white/90 p-4 text-sm text-plum"
        >
          {TERMS_TEXT.split('\n').map((line, index) => (
            <p key={index} className="mb-3 leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          {scrolledToBottom && (
            <button
              type="button"
              className={agreed ? 'btn-outline opacity-60' : 'btn-primary'}
              onClick={() => setAgreed(true)}
              disabled={agreed}
            >
              I agree
            </button>
          )}
          <button
            type="button"
            className={ageConfirmed ? 'btn-outline opacity-60' : 'btn-secondary'}
            onClick={() => setAgeConfirmed(true)}
            disabled={ageConfirmed}
          >
            I am over 18 years of age
          </button>
        </div>
      </div>
    </section>
  );
}

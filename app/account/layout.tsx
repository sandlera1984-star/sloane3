import Link from 'next/link';
import { getSessionUser } from '../../lib/auth';

export default async function AccountLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="card-surface p-5">
        <h2 className="text-lg font-semibold text-fuchsia">Member Area</h2>
        <p className="mt-2 text-xs text-plum/80">
          Status: {user?.isApprovedMember ? 'Approved' : 'Pending'}
        </p>
        <nav className="mt-4 flex flex-col gap-2">
          <Link href="/account/access" className="link-pill text-center">
            Access
          </Link>
          <Link href="/account/support" className="link-pill text-center">
            Support
          </Link>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}

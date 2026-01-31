import Link from 'next/link';
import { getSessionUser } from '../../../lib/auth';

export default async function AccessPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <section className="card-surface p-8 text-center">
        <h1 className="text-3xl font-bold text-fuchsia">Access</h1>
        <p className="mt-3 text-plum">Please log in to view access status.</p>
        <Link href="/login" className="btn-primary mt-6 inline-flex">
          Go to Login
        </Link>
      </section>
    );
  }

  return (
    <section className="card-surface p-8 text-center">
      <h1 className="text-3xl font-bold text-fuchsia">Access</h1>
      <p className="mt-4 text-lg text-plum">
        Status:{' '}
        <span className="font-semibold text-fuchsia">
          {user.isApprovedMember ? 'Approved' : 'Pending'}
        </span>
      </p>
    </section>
  );
}

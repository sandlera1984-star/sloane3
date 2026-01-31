import Link from 'next/link';
import { getSessionUser } from '../../lib/auth';
import NotificationToggle from '../../components/NotificationToggle';

export default async function NotificationsPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <section className="card-surface p-8 text-center">
        <h1 className="text-3xl font-bold text-fuchsia">Notifications</h1>
        <p className="mt-3 text-plum">Log in to manage notifications.</p>
        <Link href="/login" className="btn-primary mt-6 inline-flex">
          Go to Login
        </Link>
      </section>
    );
  }

  if (!user.isApprovedMember) {
    return (
      <section className="card-surface p-8 text-center">
        <h1 className="text-3xl font-bold text-fuchsia">Notifications</h1>
        <p className="mt-3 text-plum">
          Notifications unlock once your membership is approved.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-fuchsia">Notifications</h1>
        <p className="mt-2 text-plum">Manage your update preferences.</p>
      </header>
      <NotificationToggle initialValue={user.notifyOptIn} />
    </section>
  );
}

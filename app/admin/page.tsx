import Link from 'next/link';
import { getSessionUser } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import AdminDashboard from '../../components/AdminDashboard';

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <section className="card-surface p-8 text-center">
        <h1 className="text-3xl font-bold text-fuchsia">Admin</h1>
        <p className="mt-3 text-plum">Log in to access admin tools.</p>
        <Link href="/login" className="btn-primary mt-6 inline-flex">
          Go to Login
        </Link>
      </section>
    );
  }

  if (!user.isAdmin) {
    return (
      <section className="card-surface p-8 text-center">
        <h1 className="text-3xl font-bold text-fuchsia">Admin</h1>
        <p className="mt-3 text-plum">You do not have admin access.</p>
      </section>
    );
  }

  const content = await prisma.content.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-fuchsia">Admin Dashboard</h1>
        <p className="mt-2 text-plum">Upload new content and manage members.</p>
      </header>
      <AdminDashboard
        content={content.map((item) => ({
          id: item.id,
          title: item.title,
          isLocked: item.isLocked,
          isPublished: item.isPublished,
          createdAt: item.createdAt.toISOString()
        }))}
        users={users.map((item) => ({
          id: item.id,
          email: item.email,
          isApprovedMember: item.isApprovedMember,
          isAdmin: item.isAdmin
        }))}
      />
    </section>
  );
}

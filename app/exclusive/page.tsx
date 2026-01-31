import Link from 'next/link';
import { getSessionUser } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

export default async function ExclusivePage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <section className="card-surface p-8 text-center">
        <h1 className="text-3xl font-bold text-fuchsia">Exclusive Content</h1>
        <p className="mt-3 text-plum">Please log in to view the gallery.</p>
        <Link href="/login" className="btn-primary mt-6 inline-flex">
          Go to Login
        </Link>
      </section>
    );
  }

  const content = await prisma.content.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <section className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-fuchsia">Exclusive Content</h1>
        <p className="mt-2 text-plum">
          Your private gallery of fashion-forward photo and video drops.
        </p>
      </header>

      {!user.isApprovedMember && (
        <div className="card-surface p-6 text-center">
          <p className="text-plum">
            Your membership is pending approval. Content is blurred until approval is granted.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {content.map((item) => (
          <div key={item.id} className="card-surface overflow-hidden">
            <div className="relative">
              <img
                src={item.thumbnailUrl ?? item.blobUrl}
                alt={item.title}
                className={`h-56 w-full object-cover ${
                  user.isApprovedMember ? '' : 'blur-md'
                }`}
              />
              {item.isLocked && !user.isApprovedMember && (
                <div className="absolute inset-0 flex items-center justify-center bg-plum/40 text-cream">
                  Awaiting approval
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-plum">{item.title}</h3>
              {item.description && <p className="mt-2 text-sm text-plum/80">{item.description}</p>}
              <div className="mt-4 flex items-center gap-3">
                {user.isApprovedMember ? (
                  <a className="btn-primary" href={`/api/media/${item.id}`}>
                    View Media
                  </a>
                ) : (
                  <span className="text-sm text-fuchsia">Approval required</span>
                )}
                {item.isLocked && (
                  <span className="text-xs uppercase tracking-[0.2em] text-fuchsia">Locked</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

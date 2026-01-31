'use client';

import { useState } from 'react';

type ContentItem = {
  id: string;
  title: string;
  isLocked: boolean;
  isPublished: boolean;
  createdAt: string;
};

type UserItem = {
  id: string;
  email: string;
  isApprovedMember: boolean;
  isAdmin: boolean;
};

type AdminDashboardProps = {
  content: ContentItem[];
  users: UserItem[];
};

export default function AdminDashboard({ content, users }: AdminDashboardProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/content', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      setMessage('Content uploaded.');
      event.currentTarget.reset();
    } else {
      const payload = await response.json();
      setMessage(payload.error ?? 'Upload failed.');
    }

    setLoading(false);
  };

  const togglePublish = async (id: string, isPublished: boolean, notify = false) => {
    await fetch('/api/admin/content/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isPublished: !isPublished, notify })
    });
  };

  const toggleApproval = async (id: string, isApprovedMember: boolean) => {
    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isApprovedMember: !isApprovedMember })
    });
  };

  return (
    <div className="space-y-8">
      <section className="card-surface p-6">
        <h2 className="text-2xl font-semibold text-fuchsia">Upload Content</h2>
        <form className="mt-4 grid gap-4" onSubmit={handleUpload}>
          <input className="input-field" name="title" placeholder="Title" required />
          <textarea className="input-field h-24" name="description" placeholder="Description" />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-plum">
              Media file
              <input className="mt-2 w-full" name="file" type="file" required />
            </label>
            <label className="text-sm text-plum">
              Thumbnail file
              <input className="mt-2 w-full" name="thumbnail" type="file" required />
            </label>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-plum">
              <input type="checkbox" name="isLocked" defaultChecked />
              Locked
            </label>
            <label className="flex items-center gap-2 text-sm text-plum">
              <input type="checkbox" name="isPublished" />
              Publish now
            </label>
            <label className="flex items-center gap-2 text-sm text-plum">
              <input type="checkbox" name="notify" />
              Send notifications
            </label>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
          {message && <p className="text-sm text-fuchsia">{message}</p>}
        </form>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-2xl font-semibold text-fuchsia">Content Library</h2>
        <div className="mt-4 space-y-3">
          {content.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-plum">{item.title}</p>
                <p className="text-xs text-plum/70">
                  {item.isLocked ? 'Locked' : 'Free'} ·{' '}
                  {item.isPublished ? 'Published' : 'Draft'}
                </p>
              </div>
              {item.isPublished ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => togglePublish(item.id, item.isPublished)}
                >
                  Unpublish
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => togglePublish(item.id, item.isPublished)}
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => togglePublish(item.id, item.isPublished, true)}
                  >
                    Publish + Notify
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-2xl font-semibold text-fuchsia">User Management</h2>
        <div className="mt-4 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-plum">{user.email}</p>
                <p className="text-xs text-plum/70">
                  {user.isAdmin ? 'Admin' : 'Member'} ·{' '}
                  {user.isApprovedMember ? 'Approved' : 'Pending'}
                </p>
              </div>
              {!user.isAdmin && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => toggleApproval(user.id, user.isApprovedMember)}
                >
                  {user.isApprovedMember ? 'Revoke' : 'Approve'}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

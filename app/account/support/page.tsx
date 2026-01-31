'use client';

import { useState } from 'react';

export default function SupportPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const issueText = String(formData.get('issue') ?? '');
    const wordCount = issueText.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount > 200) {
      setMessage('Please keep your issue under 200 words.');
      setLoading(false);
      return;
    }
    const response = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        issue: issueText
      })
    });

    if (response.ok) {
      setMessage('Thank you for your submission.');
      event.currentTarget.reset();
    } else {
      setMessage('Unable to submit at this time.');
    }

    setLoading(false);
  };

  return (
    <section className="mx-auto max-w-2xl card-surface p-8">
      <h1 className="text-3xl font-bold text-fuchsia">Support</h1>
      <p className="mt-2 text-sm text-plum">
        Need help? Submit your issue below. Please keep your message under 200 words.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input className="input-field" name="name" placeholder="Name" required />
        <input className="input-field" name="email" type="email" placeholder="Email" required />
        <textarea
          className="input-field h-32"
          name="issue"
          placeholder="Issue (max 200 words)"
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-fuchsia">{message}</p>}
    </section>
  );
}

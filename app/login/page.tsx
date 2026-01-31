'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password')
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? 'Login failed.');
      setLoading(false);
      return;
    }

    router.push('/exclusive');
  };

  return (
    <section className="mx-auto max-w-lg card-surface p-8">
      <h1 className="text-3xl font-bold text-fuchsia">Login</h1>
      <p className="mt-2 text-sm text-plum">
        Login is active for approved members. Use your email and password to continue.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input className="input-field" name="email" type="email" required placeholder="Email" />
        <input
          className="input-field"
          name="password"
          type="password"
          required
          placeholder="Password"
        />
        {error && <p className="text-sm text-fuchsia">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </section>
  );
}

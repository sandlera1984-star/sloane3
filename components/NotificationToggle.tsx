'use client';

import { useState } from 'react';

type NotificationToggleProps = {
  initialValue: boolean;
};

export default function NotificationToggle({ initialValue }: NotificationToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    setSaving(true);
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !enabled })
    });
    if (response.ok) {
      setEnabled(!enabled);
    }
    setSaving(false);
  };

  return (
    <div className="card-surface p-6">
      <h2 className="text-xl font-semibold text-plum">Release Notifications</h2>
      <p className="mt-2 text-sm text-plum/80">
        Get emails whenever new exclusive content is published.
      </p>
      <button type="button" className="btn-primary mt-4" onClick={handleToggle} disabled={saving}>
        {enabled ? 'Opt out' : 'Opt in'}
      </button>
    </div>
  );
}

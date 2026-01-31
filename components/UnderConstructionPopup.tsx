'use client';

import { useEffect } from 'react';

type UnderConstructionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UnderConstructionPopup({ isOpen, onClose }: UnderConstructionPopupProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div
        className="popup-circle"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Under construction"
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute right-6 top-6 text-fuchsia hover:text-cream transition"
          onClick={onClose}
        >
          ✕
        </button>
        <span>Under Construction</span>
      </div>
    </div>
  );
}

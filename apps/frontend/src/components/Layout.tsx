'use client';

import React from 'react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-divider">
      <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-text-primary">
            Events<span className="text-primary">.</span>
          </span>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-divider py-12 bg-white">
      <div className="mx-auto max-w-4xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-sm text-text-secondary">
          © 2026 VIBE UI Inc.
        </span>
      </div>
    </footer>
  );
}

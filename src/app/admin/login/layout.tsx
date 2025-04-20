'use client';

import { ReactNode } from 'react';

// Simple layout that just renders children
export default function RedirectLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
} 
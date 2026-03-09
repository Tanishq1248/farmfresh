'use client';

import { useEffect, useState, ReactNode } from 'react';

/**
 * ClientOnly component wrapper
 * Prevents hydration mismatch by only rendering content on the client
 * Useful for components with state-based conditional rendering
 */
export function ClientOnly({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return null on server to prevent hydration mismatch
  // Return children only after hydration on client
  return isClient ? <>{children}</> : null;
}

/**
 * NoSSR component - same as ClientOnly, alternative name
 * Use when you want explicit no-SSR behavior
 */
export const NoSSR = ClientOnly;

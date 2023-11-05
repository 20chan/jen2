'use client';

import { useSession } from 'next-auth/react';

export function AuthProxy({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      fallback ?? (
        <div>
          NOT AUTHENTICATED
        </div>
      )
    )
  }

  return <>{children}</>;
}
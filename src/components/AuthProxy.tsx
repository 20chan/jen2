'use client';

import { useSession } from 'next-auth/react';

export function AuthProxy({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        NOT AUTHENTICATED
      </div>
    )
  }

  return <>{children}</>;
}
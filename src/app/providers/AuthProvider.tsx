'use client';

import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

export interface AuthContextProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthContextProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
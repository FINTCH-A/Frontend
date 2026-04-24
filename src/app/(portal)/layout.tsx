/* eslint-disable react-hooks/set-state-in-effect */
// src/app/(portal)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { Header } from '@/components/shared/Header';
import { useAuthStore } from '@/store/auth.store';
import { cookieStorage } from '@/lib/cookies';
import { useTheme } from '@/hooks/useTheme';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  // Inicializar tema
  useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const token = cookieStorage.getAccessToken();
    if (!token) router.push('/login');
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <div className="animate-pulse">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <PortalSidebar />
      <Header />
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

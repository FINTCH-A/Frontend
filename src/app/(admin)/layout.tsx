/* eslint-disable react-hooks/set-state-in-effect */
// src/app/(admin)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Header } from '@/components/shared/Header';
import { useAuthStore } from '@/store/auth.store';
import { cookieStorage } from '@/lib/cookies';
import { useTheme } from '@/hooks/useTheme';

export default function AdminLayout({
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
        <div className="ml-55 pt-16 min-h-screen">
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <Header />
      <main className="ml-55 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

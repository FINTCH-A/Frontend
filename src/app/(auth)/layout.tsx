// src/app/(auth)/layout.tsx
'use client';

import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900 p-4 relative">
      {/* Grid decorativo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Blur decorativo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* 🌓 Theme Toggle - Posición superior derecha */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle variant="default" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </main>
  );
}

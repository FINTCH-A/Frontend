'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NotificationDropdown } from './NotificationDropdown';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/usuarios': 'Usuarios',
  '/solicitudes': 'Solicitudes',
  '/prestamos': 'Préstamos',
  '/cuotas': 'Cuotas',
  '/pagos': 'Pagos',
  '/credit-score': 'Credit Score',
  '/notificaciones': 'Notificaciones',
};

const newButtonMap: Record<string, string> = {
  '/usuarios': 'Nuevo Usuario',
  '/solicitudes': 'Nueva Solicitud',
  '/pagos': 'Registrar Pago',
};

interface HeaderProps {
  onNew?: () => void;
}

export function Header({ onNew }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = breadcrumbMap[pathname] ?? 'Dashboard';
  const newLabel = newButtonMap[pathname];

  return (
    <header className="h-16 fixed top-0 left-55 right-0 z-30 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border/60">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Inicio
        </Link>
        {pathname !== '/dashboard' && (
          <>
            <span className="text-border">/</span>
            <span className="font-semibold text-foreground">{pageTitle}</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* 🌓 Theme Toggle */}
        <ThemeToggle variant="header" />

        {/* 📢 Notificaciones con Dropdown */}
        <NotificationDropdown limit={5} />

        {/* Botón nuevo contextual */}
        {newLabel && onNew && (
          <Button
            onClick={onNew}
            size="sm"
            className="h-9 rounded-xl gap-2 font-semibold text-xs px-4"
          >
            <Plus className="h-3.5 w-3.5" />
            {newLabel}
          </Button>
        )}
      </div>
    </header>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link                from 'next/link';
import { usePathname }     from 'next/navigation';
import { motion }          from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  ListChecks,
  Wallet,
  BarChart3,
  Bell,
  Settings,
  Banknote,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn }              from '@/lib/utils';
import { useLogout }       from '@/features/auth/hooks/use-auth';
import { useAuthStore }    from '@/store/auth.store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials }     from '@/lib/utils';
import { Button }          from '@/components/ui/button';
import { Separator }       from '@/components/ui/separator';
import Image from 'next/image';

const navItems = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard',    href: '/dashboard',      icon: LayoutDashboard },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { label: 'Usuarios',     href: '/usuarios',       icon: Users },
      { label: 'Solicitudes',  href: '/solicitudes',    icon: FileText },
      { label: 'Préstamos',    href: '/prestamos',      icon: Banknote },
      // { label: 'Cuotas',       href: '/cuotas',         icon: ListChecks },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { label: 'Pagos',        href: '/pagos',          icon: Wallet },
      { label: 'Credit Score', href: '/credit-score',   icon: BarChart3 },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { label: 'Notificaciones', href: '/notificaciones', icon: Bell },
    ],
  },
];

export function AppSidebar() {
  const pathname          = usePathname();
  const { mutate: logout, isPending } = useLogout();
  const user              = useAuthStore((s) => s.user);

  return (
    <aside className="fixed left-0 top-0 h-screen w-55 flex flex-col bg-card border-r border-border/60 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border/60 shrink-0">
  <div className="flex items-center">
    <Image
      src="/logo.png"
      alt="Avante Microfinanzas"
      width={140}
      height={40}
      className="object-contain block dark:hidden"
      priority
    />
    <Image
      src="/logo-dark.png"
      alt="Avante Microfinanzas"
      width={140}
      height={40}
      className="object-contain hidden dark:block brightness-0 invert"
      priority
    />
  </div>
</div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navItems.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-2">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-primary text-white shadow-sm shadow-primary/30'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="h-3 w-3 ml-auto shrink-0 opacity-70" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="shrink-0 border-t border-border/60 p-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-muted transition-colors">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {user ? getInitials(user.firstName, user.lastName) : 'AV'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'Usuario'}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {user?.role ?? ''}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          disabled={isPending}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive mt-1 h-9 px-2.5 rounded-xl text-xs"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}

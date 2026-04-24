/* eslint-disable @typescript-eslint/no-unused-vars */
// frontend-avante/src/components/shared/NotificationDropdown.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck, Eye, Clock, Wallet, FileText, AlertTriangle, CreditCard, Users, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotificaciones, useMarkAsRead, useMarkAllAsRead } from '@/features/notificaciones/hooks/use-notificaciones';
import { Notification } from '@/features/notificaciones/types/notificaciones.types';

// Formatear tiempo relativo
const getTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

  if (diffMinutes < 1) return 'ahora mismo';
  if (diffMinutes < 60) return `hace ${diffMinutes} min`;
  if (diffMinutes < 1440) return `hace ${Math.floor(diffMinutes / 60)} h`;
  return `hace ${Math.floor(diffMinutes / 1440)} d`;
};

// Icono según tipo de notificación
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'LOAN_APPROVED':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'LOAN_REJECTED':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'PAYMENT_DUE':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'PAYMENT_RECEIVED':
      return <CreditCard className="h-4 w-4 text-emerald-500" />;
    case 'PAYMENT_OVERDUE':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'SYSTEM_ALERT':
      return <Megaphone className="h-4 w-4 text-blue-500" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

interface NotificationDropdownProps {
  limit?: number;
}

export function NotificationDropdown({ limit = 5 }: NotificationDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data, isLoading, refetch } = useNotificaciones(1, limit + 1, false);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = data?.data || [];
  const unreadCount = data?.meta?.unread || 0;
  const hasMore = (data?.meta?.total || 0) > limit;

  const displayNotifications = notifications.slice(0, limit);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead.mutateAsync(notification.id);
    }
    setOpen(false);

    // Redirigir según tipo
    if (notification.type === 'LOAN_APPROVED' || notification.type === 'LOAN_REJECTED') {
      router.push('/prestamos');
    } else if (notification.type.includes('PAYMENT')) {
      router.push('/pagos');
    } else {
      router.push('/notificaciones');
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push('/notificaciones');
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
    refetch();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm">Notificaciones</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={handleMarkAllAsRead} disabled={markAllAsRead.isPending}>
              <CheckCheck className="h-3 w-3" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* Lista */}
        <ScrollArea className="max-h-100">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayNotifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No hay notificaciones</p>
              <p className="text-xs text-muted-foreground">Cuando recibas notificaciones, aparecerán aquí</p>
            </div>
          ) : (
            <div className="divide-y">
              {displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative cursor-pointer transition-colors hover:bg-muted/50 ${!notification.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3 p-3">
                    <div className="shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{notification.title}</p>
                        {!notification.isRead && <div className="shrink-0 h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{getTimeAgo(notification.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs gap-1" onClick={handleViewAll}>
                <Eye className="h-3 w-3" />
                Ver todas las notificaciones
                {hasMore && <span className="text-muted-foreground ml-1">({data?.meta?.total})</span>}
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

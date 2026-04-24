/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState }  from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellOff, CheckCheck,
  RefreshCw, Loader2,
} from 'lucide-react';

import { Button }  from '@/components/ui/button';
import { Badge }   from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  useNotificaciones,
  useMarkAsRead,
  useMarkAllAsRead,
} from '../hooks/use-notificaciones';
import type {
  Notification,
  NotificationType,
} from '../types/notificaciones.types';
import { formatDateTime } from '@/lib/utils';

// ─── Type config ──────────────────────────────────────────────

const typeConfig: Record<
  NotificationType,
  { emoji: string; color: string }
> = {
  LOAN_APPROVED:    { emoji: '✅', color: 'text-emerald-600' },
  LOAN_REJECTED:    { emoji: '❌', color: 'text-red-600' },
  PAYMENT_DUE:      { emoji: '⏰', color: 'text-amber-600' },
  PAYMENT_RECEIVED: { emoji: '💚', color: 'text-emerald-600' },
  PAYMENT_OVERDUE:  { emoji: '🔴', color: 'text-red-600' },
  ACCOUNT_UPDATE:   { emoji: '🔔', color: 'text-blue-600' },
  SYSTEM_ALERT:     { emoji: '⚠️', color: 'text-amber-600' },
};

// ─── Notification card ────────────────────────────────────────

function NotificationCard({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead:       (id: number) => void;
}) {
  const tc = typeConfig[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
        notification.isRead
          ? 'border-border/40 bg-background hover:bg-muted/40'
          : 'border-primary/20 bg-primary/5 hover:bg-primary/10'
      }`}
      onClick={() => !notification.isRead && onRead(notification.id)}
    >
      {/* Icono */}
      <div className={`text-xl shrink-0 mt-0.5`}>
        {tc.emoji}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold truncate ${
            notification.isRead
              ? 'text-foreground'
              : 'text-foreground'
          }`}>
            {notification.title}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDateTime(notification.createdAt)}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        {!notification.isRead && (
          <p className="text-xs text-primary mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Clic para marcar como leída
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────

export function MainNotificaciones() {
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [page, setPage]             = useState(1);

  const { data, isLoading, refetch } = useNotificaciones(
    page,
    20,
    onlyUnread,
  );
  const markAsRead    = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  // ✅ Valores seguros para evitar errores de undefined
  const unreadCount = data?.meta?.unread ?? 0;
  const totalNotificaciones = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const currentPage = data?.meta?.page ?? 1;
  const currentLimit = data?.meta?.limit ?? 20;
  const hasNextPage = data?.meta?.hasNextPage ?? false;
  const hasPrevPage = data?.meta?.hasPrevPage ?? false;

  const handleRead = (id: number) => {
    markAsRead.mutate(id);
  };

  const handleMarkAll = () => {
    markAllAsRead.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              Notificaciones
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount} nuevas
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalNotificaciones} notificaciones en total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="rounded-xl"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAll}
              disabled={markAllAsRead.isPending}
              className="rounded-xl gap-2 text-sm"
            >
              {markAllAsRead.isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <CheckCheck className="h-4 w-4" />}
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </div>

      {/* Tabs filtro */}
      <Tabs
        value={onlyUnread ? 'unread' : 'all'}
        onValueChange={(v) => {
          setOnlyUnread(v === 'unread');
          setPage(1);
        }}
      >
        <TabsList className="rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">
            Todas
          </TabsTrigger>
          <TabsTrigger value="unread" className="rounded-lg gap-2">
            No leídas
            {unreadCount > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lista */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="p-4 space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border/40">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </div>
            ))
          ) : !data?.data || data.data.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-muted rounded-2xl">
                  {onlyUnread
                    ? <CheckCheck className="h-8 w-8 text-emerald-500" />
                    : <BellOff className="h-8 w-8 text-muted-foreground" />}
                </div>
                <p className="font-semibold text-foreground">
                  {onlyUnread
                    ? '¡Todo al día!'
                    : 'Sin notificaciones'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {onlyUnread
                    ? 'No tienes notificaciones sin leer'
                    : 'Aún no hay notificaciones en el sistema'}
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {data.data.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onRead={handleRead}
                />
              ))}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>

      {/* Pagination - ✅ Usando valores seguros */}
      {data && data.data && data.data.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {((currentPage - 1) * currentLimit) + 1}
            {' '}—{' '}
            {Math.min(currentPage * currentLimit, totalNotificaciones)}
            {' '}de {totalNotificaciones}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevPage}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl text-xs h-8"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl text-xs h-8"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

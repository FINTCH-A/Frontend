'use client';

import { useState }        from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellOff, CheckCheck, Loader2,
} from 'lucide-react';
import { Button }          from '@/components/ui/button';
import { Badge }           from '@/components/ui/badge';
import { Skeleton }        from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useMisNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/features/portal/hooks/use-portal';
import { formatDateTime } from '@/lib/utils';

export default function MisNotificacionesPage() {
  const [onlyUnread, setOnlyUnread] = useState(false);

  const { data, isLoading }  = useMisNotifications(1, onlyUnread);
  const markOne              = useMarkNotificationRead();
  const markAll              = useMarkAllNotificationsRead();

  const notifications = data?.data ?? [];
  const unread        = data?.meta?.unread ?? 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              Notificaciones
            </h1>
            {unread > 0 && (
              <Badge className="bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                {unread}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Avisos sobre tus préstamos y pagos
          </p>
        </div>
        {unread > 0 && (
          <Button
            variant="outline"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
            className="rounded-xl gap-2 text-sm"
          >
            {markAll.isPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <CheckCheck className="h-4 w-4" />}
            Marcar todas
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        value={onlyUnread ? 'unread' : 'all'}
        onValueChange={(v) => setOnlyUnread(v === 'unread')}
      >
        <TabsList className="rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">
            Todas
          </TabsTrigger>
          <TabsTrigger value="unread" className="rounded-lg gap-2">
            No leídas
            {unread > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary">
                {unread}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lista */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="p-4 space-y-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl border border-border/40"
              >
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-muted rounded-2xl">
                  {onlyUnread
                    ? <CheckCheck className="h-8 w-8 text-emerald-500" />
                    : <BellOff className="h-8 w-8 text-muted-foreground" />}
                </div>
                <p className="font-semibold text-foreground">
                  {onlyUnread ? '¡Todo al día!' : 'Sin notificaciones'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {onlyUnread
                    ? 'No tienes notificaciones sin leer'
                    : 'Los avisos de tus préstamos aparecerán aquí'}
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => !n.isRead && markOne.mutate(n.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                    n.isRead
                      ? 'border-border/40 bg-background hover:bg-muted/40'
                      : 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                  }`}
                >
                  <div className="text-xl shrink-0 mt-0.5 select-none">
                    {{
                      LOAN_APPROVED:    '✅',
                      LOAN_REJECTED:    '❌',
                      PAYMENT_DUE:      '⏰',
                      PAYMENT_RECEIVED: '💚',
                      PAYMENT_OVERDUE:  '🔴',
                      ACCOUNT_UPDATE:   '🔔',
                      SYSTEM_ALERT:     '⚠️',
                    }[n.type] ?? '🔔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(n.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    {!n.isRead && (
                      <p className="text-xs text-primary mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Clic para marcar como leída
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

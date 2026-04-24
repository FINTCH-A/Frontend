/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import {
  Users, Banknote, FileText,
  DollarSign, TrendingUp, Bell,
  RefreshCw, Activity, AlertCircle,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth.store';
import { useDashboardStats, useRecentActivity, useSystemAlerts } from '../hooks/use-dashboard';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

// ─── Stat card ────────────────────────────────────────────────

function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  color,
  bg,
  isLoading,
}: {
  label: string;
  value: string | number;
  trend?: string;
  icon: any;
  color: string;
  bg: string;
  isLoading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {label}
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-20 rounded" />
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  {trend && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {trend} vs mes anterior
                    </p>
                  )}
                </>
              )}
            </div>
            <div className={`p-3 rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Activity item ────────────────────────────────────────────

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'payment': return '💚';
    case 'application': return '📄';
    case 'loan': return '💰';
    case 'kyc': return '🪪';
    default: return '📌';
  }
};

const getActivityStyles = (type: string) => {
  switch (type) {
    case 'payment':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400';
    case 'application':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
    case 'loan':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

// ─── Main component ───────────────────────────────────────────

export function DashboardMain() {
  const user = useAuthStore((s) => s.user);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    data: activity,
    isLoading: activityLoading,
    refetch: refetchActivity,
  } = useRecentActivity(5);

  const {
    data: alerts,
    isLoading: alertsLoading,
  } = useSystemAlerts();

  const handleRefresh = () => {
    refetchStats();
    refetchActivity();
  };

  const statCards = [
    {
      label: 'Total Usuarios',
      value: stats?.totalUsers ?? 0,
      trend: stats?.userTrend,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-950/40',
    },
    {
      label: 'Préstamos Activos',
      value: stats?.activeLoans ?? 0,
      trend: stats?.loanTrend,
      icon: Banknote,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    },
    {
      label: 'Solicitudes Pendientes',
      value: stats?.pendingApplications ?? 0,
      trend: stats?.applicationTrend,
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-100 dark:bg-amber-950/40',
    },
    {
      label: 'Total Desembolsado',
      value: formatCurrency(stats?.totalDisbursed ?? 0),
      trend: stats?.disbursedTrend,
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-950/40',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bienvenido, {user?.firstName ?? 'Admin'} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aquí tienes el resumen de AvanteCreditos
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="rounded-xl gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Alertas del sistema */}
      {!alertsLoading && alerts && alerts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${
                alert.level === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400'
                  : alert.level === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400'
                  : 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400'
              }`}
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            trend={card.trend}
            icon={card.icon}
            color={card.color}
            bg={card.bg}
            isLoading={statsLoading}
          />
        ))}
      </div>

      {/* Actividad reciente + Alertas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Actividad reciente */}
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {activityLoading ? (
              <div className="p-4 space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : !activity || activity.length === 0 ? (
              <div className="py-12 text-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay actividad reciente
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {activity.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${getActivityStyles(item.type)}`}>
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.timeAgo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel de alertas detalladas */}
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Alertas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {alertsLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : !alerts || alerts.length === 0 ? (
              <div className="py-8 text-center">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-full w-fit mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Todo en orden
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  No hay alertas en el sistema
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      alert.level === 'error'
                        ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                        : alert.level === 'warning'
                        ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
                        : 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                    }`}
                  >
                    <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${
                      alert.level === 'error'
                        ? 'text-red-600'
                        : alert.level === 'warning'
                        ? 'text-amber-600'
                        : 'text-blue-600'
                    }`} />
                    <p className={`text-sm font-medium ${
                      alert.level === 'error'
                        ? 'text-red-700 dark:text-red-400'
                        : alert.level === 'warning'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-blue-700 dark:text-blue-400'
                    }`}>
                      {alert.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Accesos rápidos */}
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Accesos rápidos
              </p>
              <div className="space-y-2">
                <Link
                  href="/solicitudes"
                  className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Ver solicitudes pendientes
                  </span>
                  {stats?.pendingApplications && stats.pendingApplications > 0 && (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                      {stats.pendingApplications}
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/prestamos"
                  className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Ver préstamos activos
                  </span>
                  {stats?.activeLoans && stats.activeLoans > 0 && (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                      {stats.activeLoans}
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/usuarios"
                  className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-muted/40 transition-all group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Ver todos los usuarios
                  </span>
                  {stats?.totalUsers && stats.totalUsers > 0 && (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                      {stats.totalUsers}
                    </Badge>
                  )}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ui/user-detail-drawer.tsx
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Calendar, Shield, UserCheck, UserX, Clock, CreditCard } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { User } from '@/features/usuarios/types/usuarios.types';

interface UserDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Activo', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' },
  INACTIVE: { label: 'Inactivo', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  SUSPENDED: { label: 'Suspendido', color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400' },
  PENDING_VERIFICATION: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' },
};

const roleConfig: Record<string, { label: string; color: string }> = {
  ADMIN: { label: 'Administrador', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400' },
  ANALYST: { label: 'Analista', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400' },
  CUSTOMER: { label: 'Cliente', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
};

export function UserDetailDrawer({ open, onOpenChange, user }: UserDetailDrawerProps) {
  if (!user) return null;

  const status = statusConfig[user.status] || statusConfig.INACTIVE;
  const role = roleConfig[user.role] || roleConfig.CUSTOMER;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl p-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-2xl rounded-3xl border-0 overflow-y-auto m-2 mr-4"
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <SheetHeader className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Detalle del Usuario
              </SheetTitle>
              <Badge className={`${status.color} border px-3 py-1 text-xs font-semibold rounded-full`}>
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <SheetDescription className="text-sm text-muted-foreground">
                ID: #{user.id}
              </SheetDescription>
              <span className="text-xs text-muted-foreground">•</span>
              <SheetDescription className="text-sm text-muted-foreground">
                Registrado: {formatDate(user.createdAt)}
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Contenido */}
          <div className="space-y-6 mt-6">
            {/* Avatar y nombre */}
            <div className="flex items-center gap-4 p-4 bg-linear-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl border border-primary/20">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                <Badge className={`${role.color} border mt-1`}>
                  {role.label}
                </Badge>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="h-4 w-4" />
                Información de contacto
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Correo electrónico</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Teléfono
                  </p>
                  <p className="text-sm font-medium">{user.phone || 'No registrado'}</p>
                </div>
              </div>
            </div>

            {/* Información personal */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                Información personal
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">DNI</p>
                  <p className="text-sm font-medium font-mono">{user.dni}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fecha de nacimiento</p>
                  <p className="text-sm font-medium">{formatDate(user.dateOfBirth)}</p>
                </div>
              </div>
            </div>

            {/* Verificaciones */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Shield className="h-4 w-4" />
                Verificaciones
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email verificado
                  </p>
                  <Badge className={user.emailVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                    {user.emailVerified ? 'Verificado' : 'No verificado'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Teléfono verificado
                  </p>
                  <Badge className={user.phoneVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                    {user.phoneVerified ? 'Verificado' : 'No verificado'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Fechas importantes */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Clock className="h-4 w-4" />
                Actividad
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Último acceso</p>
                  <p className="text-sm font-medium">{user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Actualizado</p>
                  <p className="text-sm font-medium">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

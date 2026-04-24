/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { User, Mail, Phone, CreditCard, Calendar, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth.store';
import { getInitials, formatDate } from '@/lib/utils';

export default function MiPerfilPage() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  const items = [
    { icon: Mail,       label: 'Correo electrónico', value: user.email },
    { icon: Phone,      label: 'Teléfono',           value: (user as any).phone    ?? '—' },
    { icon: CreditCard, label: 'DNI',                value: (user as any).dni      ?? '—' },
    { icon: Calendar,   label: 'Miembro desde',      value: formatDate((user as any).createdAt ?? new Date().toISOString()) },
  ];

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>

      {/* Avatar card */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="p-6 text-center">
          <Avatar className="h-20 w-20 mx-auto mb-4">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-foreground">
            {user.firstName} {user.lastName}
          </h2>
          <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <Shield className="h-3 w-3" />
            Cliente verificado
          </span>
        </CardContent>
      </Card>

      {/* Datos */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Información de la cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border/40">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 py-3.5">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Cuenta protegida
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
              Tus datos están cifrados y protegidos. Nunca compartimos tu
              información con terceros.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

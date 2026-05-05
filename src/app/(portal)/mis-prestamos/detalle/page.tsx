/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(portal)/mis-prestamos/detalle/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, FileText, CreditCard, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { portalService } from '@/features/portal/services/portal.service';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mapeo de estados para mostrar texto amigable
const applicationStatusMap: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Borrador', className: 'bg-gray-100 text-gray-700' },
  PENDING: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
  SUBMITTED: { label: 'Enviada', className: 'bg-blue-100 text-blue-700' },
  IN_REVIEW: { label: 'En revisión', className: 'bg-purple-100 text-purple-700' },
  APPROVED: { label: 'Aprobada', className: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rechazada', className: 'bg-red-100 text-red-700' },
};

const loanStatusMap: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Activo', className: 'bg-green-100 text-green-700' },
  PAID: { label: 'Pagado', className: 'bg-blue-100 text-blue-700' },
  DEFAULTED: { label: 'En mora', className: 'bg-red-100 text-red-700' },
  PENDING: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
};

function DetalleContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  // Query para obtener detalles de la solicitud
  const { data: application, isLoading: appLoading, error: appError } = useQuery({
    queryKey: ['application', id],
    queryFn: () => portalService.getApplicationDetail(Number(id)),
    enabled: type === 'application' && !!id,
  });

  // Query para obtener detalles del préstamo
  const { data: loan, isLoading: loanLoading, error: loanError } = useQuery({
    queryKey: ['loan', id],
    queryFn: () => portalService.getLoanDetail(Number(id)),
    enabled: type === 'loan' && !!id,
  });

  const isLoading = appLoading || loanLoading;
  const error = appError || loanError;

  // Log para debug
  console.log('Data received:', { type, application, loan });

  // Función para obtener el estado correcto
  const getStatusBadge = () => {
    if (type === 'application') {
      const status = application?.status || 'PENDING';
      const config = applicationStatusMap[status] || applicationStatusMap.PENDING;
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}>
          {config.label}
        </span>
      );
    } else {
      const status = loan?.status || 'PENDING';
      const config = loanStatusMap[status] || loanStatusMap.PENDING;
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}>
          {config.label}
        </span>
      );
    }
  };

  // Función para obtener el monto
  const getAmount = () => {
    if (type === 'application') {
      return application?.requestedAmount || application?.amount || 0;
    } else {
      return loan?.amount || loan?.requestedAmount || 0;
    }
  };

  // Función para obtener el plazo
  const getTerm = () => {
    if (type === 'application') {
      return application?.requestedTerm || application?.term || 0;
    } else {
      return loan?.term || loan?.requestedTerm || 0;
    }
  };

  // Función para obtener la fecha
  const getDate = () => {
    if (type === 'application') {
      return application?.createdAt || application?.created_at || application?.date;
    } else {
      return loan?.createdAt || loan?.created_at || loan?.date;
    }
  };

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card className="rounded-2xl border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="text-red-600">Error al cargar los datos</p>
            <Button asChild className="mt-4">
              <Link href="/mis-prestamos">Volver</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <DetalleSkeleton />;
  }

  if (!application && !loan) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card className="rounded-2xl border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="text-red-600">No se encontró el {type === 'application' ? 'solicitud' : 'préstamo'}</p>
            <Button asChild className="mt-4">
              <Link href="/mis-prestamos">Volver</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const amount = getAmount();
  const term = getTerm();
  const date = getDate();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Button variant="ghost" asChild className="gap-2">
        <Link href="/mis-prestamos">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </Button>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {type === 'application' ? (
                <FileText className="h-5 w-5 text-amber-500" />
              ) : (
                <CreditCard className="h-5 w-5 text-green-500" />
              )}
              {type === 'application' ? 'Detalle de Solicitud' : 'Detalle de Préstamo'}
            </span>
            <Badge variant="outline">
              #{id}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monto</p>
              <p className="text-2xl font-bold">
                {amount > 0 ? formatCurrency(amount) : 'S/ 0.00'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado</p>
              {getStatusBadge()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Fecha
              </p>
              <p className="font-medium">
                {formatDate(date)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {type === 'application' ? 'Plazo solicitado' : 'Plazo (meses)'}
              </p>
              <p className="font-medium">
                {term > 0 ? `${term} meses` : 'No especificado'}
              </p>
            </div>
          </div>

          {type === 'application' && application?.purpose && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Finalidad</p>
              <p className="text-sm">{application.purpose}</p>
            </div>
          )}

          {type === 'loan' && (loan as any)?.interestRate && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tasa de interés</p>
              <p className="font-medium">{(loan as any).interestRate}%</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button className="w-full" asChild>
              <Link href="/mis-prestamos">
                Volver al listado
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetalleSkeleton() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-10 w-24" />
      <Card className="rounded-2xl">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function DetallePage() {
  return (
    <Suspense fallback={<DetalleSkeleton />}>
      <DetalleContent />
    </Suspense>
  );
}

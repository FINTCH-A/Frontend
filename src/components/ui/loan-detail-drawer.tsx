/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/loan-detail-drawer.tsx
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Clock, TrendingUp, CreditCard, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface LoanDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  type: 'loan' | 'application';
}

export function LoanDetailDrawer({ open, onOpenChange, data, type }: LoanDetailDrawerProps) {
  if (!data) return null;

  const isLoan = type === 'loan';

  // Mapeo de estados con soporte para modo oscuro
  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
    SUBMITTED: { label: 'Enviada', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
    IN_REVIEW: { label: 'En revisión', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
    APPROVED: { label: 'Aprobado', color: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400 border-green-200 dark:border-green-800' },
    REJECTED: { label: 'Rechazado', color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-800' },
    ACTIVE: { label: 'Activo', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
    PAID: { label: 'Pagado', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
    DEFAULTED: { label: 'En mora', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
    CANCELLED: { label: 'Cancelado', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700' },
  };

  const status = statusConfig[data.status] || { label: data.status || 'Desconocido', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700' };

  // Obtener valores según el tipo con manejo de valores nulos
  const getAmount = (): number => {
    if (isLoan) {
      return data.amount ?? 0;
    }
    return data.requestedAmount ?? 0;
  };

  const getTerm = (): number => {
    if (isLoan) {
      return data.term ?? 0;
    }
    return data.requestedTerm ?? 0;
  };

  const getTotalToPay = (): number | null => {
    if (isLoan && data.monthlyPayment && data.term) {
      return data.monthlyPayment * data.term;
    }
    return null;
  };

  const getMonthlyPayment = (): number | null => {
    if (isLoan && data.monthlyPayment) {
      return data.monthlyPayment;
    }
    return null;
  };

  const amount = getAmount();
  const term = getTerm();
  const totalToPay = getTotalToPay();
  const monthlyPayment = getMonthlyPayment();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg md:max-w-xl p-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-2xl rounded-3xl border-0 overflow-y-auto m-2 mr-4"
      >
        <div className="p-6 md:p-8">
          {/* Header con efecto glass */}
          <SheetHeader className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                {isLoan ? 'Detalle del Préstamo' : 'Detalle de Solicitud'}
              </SheetTitle>
              <Badge className={`${status.color} border px-3 py-1 text-xs font-semibold rounded-full`}>
                {status.label}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <SheetDescription className="text-sm text-muted-foreground">
                {data.loanCode ? `Código: ${data.loanCode}` : `#${data.id}`}
              </SheetDescription>
              <span className="text-xs text-muted-foreground">•</span>
              <SheetDescription className="text-sm text-muted-foreground">
                {formatDate(data.createdAt)}
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Contenido principal */}
          <div className="space-y-6 mt-6">

            {/* Sección de montos - Card destacada */}
            <div className="bg-linear-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-5 border border-primary/20 dark:border-primary/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {isLoan ? 'Monto del Préstamo' : 'Monto Solicitado'}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-primary">
                {formatCurrency(amount)}
              </p>

              {/* Monto solicitado original (si es préstamo) */}
              {isLoan && data.requestedAmount && data.requestedAmount !== data.amount && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Monto solicitado original</p>
                  <p className="text-sm font-medium line-through text-muted-foreground">
                    {formatCurrency(data.requestedAmount)}
                  </p>
                </div>
              )}

              {/* Cuota mensual */}
              {monthlyPayment !== null && monthlyPayment > 0 && (
                <div className="mt-3 pt-3 border-t border-primary/20 dark:border-primary/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Cuota mensual aproximada</span>
                    <span className="text-lg font-semibold text-primary">{formatCurrency(monthlyPayment)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Grid de información principal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {isLoan ? 'Monto aprobado' : 'Monto solicitado'}
                </p>
                <p className="text-base font-semibold dark:text-gray-200">
                  {formatCurrency(amount)}
                </p>
              </div>

              {totalToPay !== null && totalToPay > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Total a pagar
                  </p>
                  <p className="text-base font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(totalToPay)}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Plazo
                </p>
                <p className="text-base font-semibold dark:text-gray-200">
                  {term > 0 ? `${term} meses` : 'No especificado'}
                </p>
              </div>

              {isLoan && data.interestRate && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Tasa anual
                  </p>
                  <p className="text-base font-semibold text-green-600 dark:text-green-400">
                    {data.interestRate}%
                  </p>
                </div>
              )}

              {isLoan && data.interestType && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tipo de interés</p>
                  <p className="text-sm font-medium dark:text-gray-300">
                    {data.interestType === 'FIXED' ? 'Fijo' : 'Variable'}
                  </p>
                </div>
              )}

              {isLoan && data.amortization && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Amortización</p>
                  <p className="text-sm font-medium dark:text-gray-300">
                    {data.amortization === 'FRENCH' ? 'Francesa' : 'Alemana'}
                  </p>
                </div>
              )}
            </div>

            {/* Separador */}
            <div className="border-b border-gray-200 dark:border-gray-800" />

            {/* Fechas importantes */}
            <div className="grid grid-cols-2 gap-4">
              {isLoan && data.disbursedAt && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fecha de desembolso
                  </p>
                  <p className="text-sm font-medium dark:text-gray-300">{formatDate(data.disbursedAt)}</p>
                </div>
              )}
              {isLoan && data.dueDate && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fecha de vencimiento
                  </p>
                  <p className="text-sm font-medium dark:text-gray-300">{formatDate(data.dueDate)}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Creado el
                </p>
                <p className="text-sm font-medium dark:text-gray-300">{formatDate(data.createdAt)}</p>
              </div>
              {isLoan && data.loanApplicationId && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    ID Solicitud
                  </p>
                  <p className="text-sm font-medium dark:text-gray-300">#{data.loanApplicationId}</p>
                </div>
              )}
            </div>

            {/* Información de pago si existe */}
            {data.paymentMethod && (
              <>
                <div className="border-b border-gray-200 dark:border-gray-800" />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CreditCard className="h-4 w-4" />
                    Método de pago
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Tipo</p>
                      <p className="text-sm font-medium dark:text-gray-300">
                        {data.paymentMethod.type === 'DIGITAL_WALLET' ? 'Billetera digital' : 'Cuenta bancaria'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Proveedor</p>
                      <p className="text-sm font-medium dark:text-gray-300">{data.paymentMethod.provider}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-xs text-muted-foreground">Número de cuenta</p>
                      <p className="text-sm font-medium dark:text-gray-300">{data.paymentMethod.accountNumber}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

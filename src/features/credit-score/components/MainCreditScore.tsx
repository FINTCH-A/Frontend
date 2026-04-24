/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState }  from 'react';
import { motion }    from 'framer-motion';
import {
  BarChart3, Search, Plus,
  RefreshCw, TrendingUp,
  TrendingDown, Minus,
  AlertTriangle, CheckCircle,
} from 'lucide-react';

import { Button }   from '@/components/ui/button';
import { Input }    from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { CreditScoreForm }                               from './CreditScoreForm';
import { useCreditScoreLatest, useCreditScoreHistory, useEvaluateCreditScore } from '../hooks/use-credit-score';
import type { CreditScore } from '../types/credit-score.types';
import { formatDate, formatCurrency } from '@/lib/utils';

// ─── Score helpers ────────────────────────────────────────────

function getScoreConfig(score: number) {
  if (score >= 750) return { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', bar: 'bg-emerald-500' };
  if (score >= 650) return { color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/30',     bar: 'bg-amber-500' };
  if (score >= 550) return { color: 'text-orange-600',  bg: 'bg-orange-50 dark:bg-orange-950/30',   bar: 'bg-orange-500' };
  return               { color: 'text-red-600',         bg: 'bg-red-50 dark:bg-red-950/30',         bar: 'bg-red-500' };
}

const riskConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  LOW:      { label: 'Riesgo Bajo',     className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400', icon: <CheckCircle className="h-3 w-3" /> },
  MEDIUM:   { label: 'Riesgo Medio',    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',         icon: <Minus className="h-3 w-3" /> },
  HIGH:     { label: 'Riesgo Alto',     className: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',     icon: <TrendingDown className="h-3 w-3" /> },
  VERY_HIGH:{ label: 'Riesgo Muy Alto', className: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',                 icon: <AlertTriangle className="h-3 w-3" /> },
};

// ─── Score card ───────────────────────────────────────────────

function ScoreCard({ score }: { score: CreditScore }) {
  const config = getScoreConfig(score.score);
  const risk   = riskConfig[score.riskLevel] ?? riskConfig['MEDIUM'];
  const pct    = ((score.score - 300) / (950 - 300)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-5 border border-border/60 ${config.bg}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium">
            Score crediticio actual
          </p>
          <p className={`text-5xl font-bold mt-1 ${config.color}`}>
            {score.score}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            de 950 puntos
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${risk.className}`}>
          {risk.icon}
          {risk.label}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="h-2.5 bg-background/60 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${config.bar}`}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>300</span>
          <span>550</span>
          <span>700</span>
          <span>850</span>
          <span>950</span>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Historial pagos',
            value: score.paymentHistory
              ? `${(score.paymentHistory * 100).toFixed(0)}%`
              : '—',
          },
          {
            label: 'Ratio deuda',
            value: score.debtRatio
              ? `${(score.debtRatio * 100).toFixed(0)}%`
              : '—',
          },
          {
            label: 'Máx. préstamo',
            value: score.maxLoanAmount
              ? formatCurrency(score.maxLoanAmount)
              : '—',
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-background/60 rounded-xl p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Info adicional */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Evaluado: {formatDate(score.evaluatedAt)}</span>
        {score.expiresAt && (
          <span className={score.isExpired ? 'text-red-500 font-semibold' : ''}>
            {score.isExpired ? '⚠️ Expirado' : `Expira: ${formatDate(score.expiresAt)}`}
          </span>
        )}
      </div>

      {score.notes && (
        <div className="mt-3 p-3 bg-background/60 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Notas del analista</p>
          <p className="text-xs text-foreground">{score.notes}</p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────

export function MainCreditScore() {
  const [userId,      setUserId]      = useState<number>(0);
  const [inputId,     setInputId]     = useState('');
  const [searched,    setSearched]    = useState(false);
  const [evalOpen,    setEvalOpen]    = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  const latestQuery  = useCreditScoreLatest(userId);
  const historyQuery = useCreditScoreHistory(userId, historyPage);
  const evalMutation = useEvaluateCreditScore();

  const handleSearch = () => {
    const id = parseInt(inputId);
    if (!isNaN(id) && id > 0) {
      setUserId(id);
      setSearched(true);
      setHistoryPage(1);
    }
  };

  const handleEvaluate = (formData: any) => {
    evalMutation.mutate(
      { userId, data: formData },
      { onSuccess: () => setEvalOpen(false) },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Credit Score
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Evaluación crediticia de clientes
          </p>
        </div>
        {searched && userId > 0 && (
          <Button
            onClick={() => setEvalOpen(true)}
            className="rounded-xl gap-2 font-semibold"
          >
            <Plus className="h-4 w-4" />
            Nueva Evaluación
          </Button>
        )}
      </div>

      {/* Búsqueda */}
      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Ingresa el ID del usuario (ej: 3)"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9 rounded-xl border-border/70"
              />
            </div>
            <Button onClick={handleSearch} className="rounded-xl shrink-0">
              Buscar
            </Button>
            {searched && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  latestQuery.refetch();
                  historyQuery.refetch();
                }}
                className="rounded-xl shrink-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {searched && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score actual */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Score actual — Usuario #{userId}
            </h2>

            {latestQuery.isLoading ? (
              <Card className="rounded-2xl border border-border/60">
                <CardContent className="p-5 space-y-4">
                  <Skeleton className="h-12 w-24 rounded-lg" />
                  <Skeleton className="h-2.5 w-full rounded-full" />
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : latestQuery.isError ? (
              <Card className="rounded-2xl border border-border/60">
                <CardContent className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-muted rounded-2xl">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-foreground">
                      Sin evaluación crediticia
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Este usuario no tiene un score registrado
                    </p>
                    <Button
                      onClick={() => setEvalOpen(true)}
                      size="sm"
                      className="rounded-xl mt-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear primera evaluación
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : latestQuery.data ? (
              <ScoreCard score={latestQuery.data} />
            ) : null}
          </div>

          {/* Historial */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Historial de evaluaciones
            </h2>

            <Card className="rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                {historyQuery.isLoading ? (
                  <div className="p-4 space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-3.5 w-20 rounded" />
                          <Skeleton className="h-3 w-32 rounded" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : !historyQuery.data || historyQuery.data.data.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      Sin historial disponible
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-border/40">
                      {historyQuery.data.data.map((cs, i) => {
                        const config = getScoreConfig(cs.score);
                        const risk   = riskConfig[cs.riskLevel];
                        const isLatest = i === 0 && historyPage === 1;

                        return (
                          <motion.div
                            key={cs.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/40 transition-colors"
                          >
                            {/* Score circle */}
                            <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                              <span className={`text-sm font-bold ${config.color}`}>
                                {cs.score}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">
                                  {cs.score} pts
                                </p>
                                {isLatest && (
                                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                                    Actual
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(cs.evaluatedAt)}
                                {cs.isExpired && (
                                  <span className="ml-2 text-red-500">
                                    • Expirado
                                  </span>
                                )}
                              </p>
                            </div>

                            {risk && (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${risk.className}`}>
                                {risk.icon}
                                {risk.label}
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {historyQuery.data.meta.totalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
                        <p className="text-xs text-muted-foreground">
                          {historyQuery.data.meta.total} evaluaciones
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!historyQuery.data.meta.hasPrevPage}
                            onClick={() => setHistoryPage((p) => p - 1)}
                            className="rounded-xl text-xs h-8"
                          >
                            Anterior
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!historyQuery.data.meta.hasNextPage}
                            onClick={() => setHistoryPage((p) => p + 1)}
                            className="rounded-xl text-xs h-8"
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Estado inicial */}
      {!searched && (
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardContent className="py-20 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-5 bg-primary/10 rounded-2xl">
                <BarChart3 className="h-10 w-10 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-lg">
                Consulta el score crediticio
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Ingresa el ID del usuario para ver su evaluación crediticia
                e historial de scores
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog nueva evaluación */}
      <Dialog open={evalOpen} onOpenChange={setEvalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              Nueva evaluación — Usuario #{userId}
            </DialogTitle>
          </DialogHeader>
          <CreditScoreForm
            userId={userId}
            onSubmit={handleEvaluate}
            isPending={evalMutation.isPending}
            onCancel={() => setEvalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

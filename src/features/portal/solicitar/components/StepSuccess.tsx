/* eslint-disable react-hooks/purity */
// src/features/portal/solicitar/components/StepSuccess.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, Home, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface StepSuccessProps {
  applicationId: number;
}

export function StepSuccess({ applicationId }: StepSuccessProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
          <CheckCircle2 className="relative h-20 w-20 text-green-500 mx-auto" strokeWidth={1.5} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">¡Solicitud enviada!</h2>
        <p className="text-muted-foreground">
          Tu solicitud ha sido registrada con éxito. En breve recibirás una respuesta.
        </p>
      </div>

      <Card className="rounded-2xl border border-border/60 bg-muted/30">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">N° de solicitud:</span>
            <span className="font-mono font-semibold">SOL-{applicationId}-{Date.now().toString().slice(-6)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estado:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
              <Clock className="h-3 w-3" />
              En evaluación
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Nuestro equipo evaluará tu solicitud en las próximas 24-48 horas.
          Te notificaremos por correo electrónico y SMS cuando haya una respuesta.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.push('/portal/mis-prestamos')}
          className="flex-1 gap-2 rounded-xl"
        >
          <FileText className="h-4 w-4" />
          Ver mis préstamos
        </Button>
        <Button
          onClick={() => router.push('/portal')}
          className="flex-1 gap-2 rounded-xl"
        >
          <Home className="h-4 w-4" />
          Ir al inicio
        </Button>
      </div>
    </motion.div>
  );
}

'use client';

import Link from 'next/link';
import { Shield, Clock, BadgeCheck, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-primary/5" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 px-8 md:px-16 max-w-170 reveal">
        <p className="text-primary text-sm font-medium uppercase mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-primary"></span>
          Microfinanzas con propósito
        </p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-foreground">
          Créditos que
          <br />
          <span className="text-primary">impulsan tu</span>
          <br />
          negocio
        </h1>
        <p className="text-muted-foreground max-w-125 mb-10 leading-relaxed">
          Financiamiento rápido y accesible para emprendedores y pequeños negocios.
          Sin requisitos complicados, con tasas competitivas y desembolso en 24 horas.
        </p>

        <div className="flex gap-4 flex-wrap">
          {/* Botones principales */}
          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            Solicitar crédito
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-all"
          >
            Iniciar Sesión
          </Link>
        </div>

        {/* Botón adicional para registro rápido */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            ¿Nuevo aquí?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Crea tu cuenta gratis
            </Link>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-12 left-8 md:left-16 right-8 md:right-16 flex gap-8 flex-wrap z-10 reveal">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">+5,000 clientes atendidos</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Desembolso en 24h</span>
        </div>
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Aprobación rápida</span>
        </div>
      </div>
    </section>
  );
}

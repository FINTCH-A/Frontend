'use client';

import { Building2, Users, TrendingUp, ShieldCheck, Clock, Phone } from 'lucide-react';

const services = [
  { icon: Building2, title: 'Crédito PyME', desc: 'Financiamiento para pequeñas y medianas empresas con tasas preferenciales.' },
  { icon: Users, title: 'Crédito Emprendedor', desc: 'Impulsa tu negocio desde cero con montos desde S/1,000.' },
  { icon: TrendingUp, title: 'Crédito Expansión', desc: 'Para negocios que quieren crecer y necesitan capital de trabajo.' },
  { icon: ShieldCheck, title: 'Seguro incluido', desc: 'Protección gratuita en todos nuestros créditos.' },
  { icon: Clock, title: 'Aprobación 24h', desc: 'Respuesta rápida y desembolso al día siguiente.' },
  { icon: Phone, title: 'Asesoría personalizada', desc: 'Ejecutivos dedicados para acompañarte.' },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 px-8 md:px-16 bg-muted/30">
      <div className="text-center max-w-2xl mx-auto mb-16 reveal">
        <p className="text-primary text-sm font-medium mb-3">Nuestros servicios</p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Soluciones financieras<br />para <span className="text-primary">cada necesidad</span>
        </h2>
        <p className="text-muted-foreground mt-4">Ofrecemos productos diseñados para emprendedores y pequeños negocios</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto reveal">
        {services.map((service, idx) => (
          <div key={idx} className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all hover:-translate-y-1">
            <service.icon className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

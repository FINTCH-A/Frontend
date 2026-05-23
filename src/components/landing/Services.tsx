// src/components/landing/Services.tsx
'use client';

import Image from 'next/image';
import { CreditCard, TrendingUp, Users } from 'lucide-react';

const services = [
  {
    title: 'Créditos Rápidos',
    description: 'Aprobación en 24 horas y desembolso inmediato',
    image: '/giblin 1.jpeg',
    icon: <CreditCard className="h-6 w-6" />,
  },
  {
    title: 'Expansión de Negocio',
    description: 'Financiamiento para hacer crecer tu empresa',
    image: '/giblin 2.png',
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    title: 'Asesoría Financiera',
    description: 'Acompañamiento personalizado para tu éxito',
    image: '/tocache.jpeg',
    icon: <Users className="h-6 w-6" />,
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-muted/30">
      <div className="container mx-auto px-8 md:px-16">
        <div className="text-center mb-12 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Soluciones financieras diseñadas para impulsar tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="reveal bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all">
              <div className="relative h-48">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

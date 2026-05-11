'use client';

import { DollarSign, PiggyBank, Briefcase, Home } from 'lucide-react';

const products = [
  {
    icon: DollarSign,
    title: 'Crédito Express',
    amount: 'Hasta S/5,000',
    rate: 'Tasa desde 1.5% mensual',
    term: 'Plazo hasta 12 meses',
    features: ['Sin aval', 'Aprobación inmediata', 'Desembolso 24h']
  },
  {
    icon: PiggyBank,
    title: 'Crédito Negocio',
    amount: 'Hasta S/30,000',
    rate: 'Tasa desde 1.2% mensual',
    term: 'Plazo hasta 36 meses',
    features: ['Garantía flexible', 'Cuotas fijas', 'Seguro gratis']
  },
  {
    icon: Briefcase,
    title: 'Crédito PyME',
    amount: 'Hasta S/100,000',
    rate: 'Tasa desde 1.0% mensual',
    term: 'Plazo hasta 60 meses',
    features: ['Línea revolvente', 'Tasa preferencial', 'Asesor dedicado']
  },
  {
    icon: Home,
    title: 'Crédito Hipotecario',
    amount: 'Hasta S/500,000',
    rate: 'Tasa desde 0.9% mensual',
    term: 'Plazo hasta 20 años',
    features: ['Tasa fija', 'Seguro desgravamen', 'Evaluación gratuita']
  },
];

export default function Products() {
  return (
    <section id="productos" className="py-24 px-8 md:px-16 bg-background">
      <div className="text-center max-w-2xl mx-auto mb-16 reveal">
        <p className="text-primary text-sm font-medium mb-3">Nuestros productos</p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Créditos que se <span className="text-primary">adaptan a ti</span>
        </h2>
        <p className="text-muted-foreground mt-4">Encuentra el financiamiento ideal para tu negocio</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto reveal">
        {products.map((product, idx) => (
          <div key={idx} className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all hover:-translate-y-1">
            <product.icon className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">{product.title}</h3>
            <p className="text-2xl font-bold text-primary mb-2">{product.amount}</p>
            <p className="text-sm text-muted-foreground">{product.rate}</p>
            <p className="text-sm text-muted-foreground mb-4">{product.term}</p>
            <ul className="space-y-1">
              {product.features.map((feature, i) => (
                <li key={i} className="text-xs text-muted-foreground">✓ {feature}</li>
              ))}
            </ul>
            <button className="w-full mt-4 bg-primary/10 text-primary py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all">
              Solicitar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

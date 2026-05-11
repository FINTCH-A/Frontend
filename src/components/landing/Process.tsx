'use client';

import { ClipboardList, FileCheck, Clock, Banknote } from 'lucide-react';

const steps = [
  { icon: ClipboardList, step: '1', title: 'Completa el formulario', desc: 'Datos básicos y monto deseado' },
  { icon: FileCheck, step: '2', title: 'Evaluación rápida', desc: 'Revisamos tu historial y capacidad de pago' },
  { icon: Clock, step: '3', title: 'Aprobación', desc: 'Respuesta en menos de 24 horas' },
  { icon: Banknote, step: '4', title: 'Desembolso', desc: 'El dinero en tu cuenta al día siguiente' },
];

export default function Process() {
  return (
    <section id="proceso" className="py-24 px-8 md:px-16 bg-muted/30">
      <div className="text-center max-w-2xl mx-auto mb-16 reveal">
        <p className="text-primary text-sm font-medium mb-3">Cómo funciona</p>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Crédito en <span className="text-primary">4 pasos simples</span>
        </h2>
        <p className="text-muted-foreground mt-4">Proceso ágil sin papeleo innecesario</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto reveal">
        {steps.map((step) => (
          <div key={step.step} className="text-center">
            <div className="relative inline-block">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                {step.step}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

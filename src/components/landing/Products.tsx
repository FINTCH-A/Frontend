// src/components/landing/Products.tsx
'use client';

import Image from 'next/image';

const locations = [
  {
    name: 'Equipo 1',
    description: 'Sucursal principal',
    image: '/Equipo2.jpg',
  },
  {
    name: 'Equipo 2',
    description: 'Agencia secundaria',
    image: '/Equipo3.jpg',
  },
  {
    name: 'Equipo 3',
    description: 'Oficina comercial',
    image: '/giblin1.jpg',
  },
  {
    name: 'Equipo 4',
    description: 'Punto de atención',
    image: '/Equipo1.jpg',
  },
];

export default function Products() {
  return (
    <section id="productos" className="py-24">
      <div className="container mx-auto px-8 md:px-16">
        <div className="text-center mb-12 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestras Ubicaciones</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos cerca de ti, en las mejores zonas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, idx) => (
            <div key={idx} className="reveal group">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-lg">{location.name}</h3>
                  <p className="text-sm text-white/80">{location.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

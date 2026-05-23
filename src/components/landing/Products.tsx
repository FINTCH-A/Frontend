// src/components/landing/Products.tsx
'use client';

import Image from 'next/image';

const locations = [
  {
    name: 'El Tambo',
    description: 'Sucursal principal',
    image: '/el tambo-horizontal.jpeg',
  },
  {
    name: 'El Tambo B',
    description: 'Agencia secundaria',
    image: '/el tambo b.jpeg',
  },
  {
    name: 'Giblin',
    description: 'Oficina comercial',
    image: '/giblin 1.jpeg',
  },
  {
    name: 'Tocache',
    description: 'Punto de atención',
    image: '/tocache.jpeg',
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

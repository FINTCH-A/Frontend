'use client';

const colors = [
  { name: 'Celeste', gradient: 'from-sky-300 to-sky-500' },
  { name: 'Azul Noche', gradient: 'from-blue-900 to-slate-800' },
  { name: 'Verde Musgo', gradient: 'from-emerald-700 to-green-800' },
  { name: 'Menta', gradient: 'from-teal-300 to-emerald-400' },
  { name: 'Bronce', gradient: 'from-amber-700 to-orange-800' },
  { name: 'Ámbar', gradient: 'from-amber-400 to-orange-500' },
  { name: 'Coral', gradient: 'from-red-400 to-orange-500' },
  { name: 'Violeta', gradient: 'from-purple-600 to-indigo-800' },
  { name: 'Humo', gradient: 'from-gray-300 to-gray-400' },
  { name: 'Grafito', gradient: 'from-gray-600 to-gray-800' },
  { name: 'Marfil', gradient: 'from-amber-50 to-yellow-100' },
  { name: 'Incoloro', gradient: 'from-gray-100 to-gray-200' },
];

const features = [
  {
    title: 'Espesores desde 4mm hasta 25mm',
    desc: 'Gama completa de espesores estándar y fabricación bajo pedido en espesores especiales.',
  },
  {
    title: 'Radios de curvatura personalizados',
    desc: 'Capacidad de doblar planchas desde 300mm de radio hasta geometrías de gran formato.',
  },
  {
    title: 'Dimensiones hasta 3,000 × 6,000mm',
    desc: 'Planchas de gran formato para fachadas, vitrinas y espacios comerciales.',
  },
  {
    title: 'Tratamientos de superficie',
    desc: 'Antirreflejo, bajo emisivo (Low-E), autolimpiante, impresión digital, grabado ácido.',
  },
  {
    title: 'Certificaciones internacionales',
    desc: 'Cumplimos ISO 12543, EN 572 y ASTM C1048. Uso certificado en construcción.',
  },
];

export default function Catalog() {
  return (
    <section id="catalogo" className="py-24 px-8 md:px-16 bg-background">
      <div className="catalog-layout grid md:grid-cols-2 gap-16 items-start">
        <div className="reveal">
          <p className="text-primary text-sm tracking-wide uppercase mb-3.5 flex items-center gap-4">
            <span className="w-7.5 h-px bg-primary"></span>
            Colores Disponibles
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight text-foreground">
            Cualquier <em className="not-italic text-primary">color</em>
            Cualquier <em className="not-italic text-primary">color</em>
            <br />que imagines
          </h2>
          <p className="text-muted-foreground text-sm mt-4 max-w-90 leading-relaxed">
            Nuestra gama incluye tonos neutros, clásicos y colores especiales. Producimos bajo pedido en cualquier
            tonalidad Pantone o RAL.
          </p>

          <div className="color-grid grid grid-cols-4 gap-2 mt-8">
            {colors.map((color) => (
              <div
                key={color.name}
                className="aspect-square relative cursor-pointer overflow-hidden rounded-lg border border-border hover:border-primary hover:scale-105 transition-all"
              >
                <div
                  className={`w-full h-full flex items-end p-2 bg-linear-to-br ${color.gradient}`}
                >
                  <span className="text-[0.6rem] tracking-wide uppercase bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-foreground text-xs">
                    {color.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal">
          <p className="text-primary text-sm tracking-wide uppercase mb-3.5 flex items-center gap-4">
            <span className="w-7.5 h-px bg-primary"></span>
            Especificaciones
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight text-foreground">
            Tecnología de<br /><em className="not-italic text-primary">precisión</em> europea
          </h2>

          <div className="catalog-features flex flex-col gap-6 mt-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 items-start pb-6 border-b border-border">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">{feature.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', amount: '', business: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', amount: '', business: '' });
  };

  return (
    <section id="contacto" className="py-24 px-8 md:px-16 bg-background">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="reveal">
          <p className="text-primary text-sm font-medium mb-3">Contáctanos</p>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            ¿Necesitas <span className="text-primary">financiamiento?</span>
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Completa el formulario y un asesor se comunicará contigo en menos de 2 horas.
            ¡Sin compromiso!
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div><p className="text-sm text-muted-foreground">Llámanos</p><p className="text-foreground font-medium">(01) 123 4567</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div><p className="text-sm text-muted-foreground">Email</p><p className="text-foreground font-medium">hola@avante.pe</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <div><p className="text-sm text-muted-foreground">WhatsApp</p><p className="text-foreground font-medium">+51 964 123 456</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div><p className="text-sm text-muted-foreground">Oficina principal</p><p className="text-foreground font-medium">Av. Javier Prado 123, Lima</p></div>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 rounded-xl border border-border reveal">
          <h3 className="text-xl font-semibold text-foreground mb-4">Solicita tu crédito</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Nombre completo" className="w-full p-3 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Correo electrónico" className="w-full p-3 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input type="tel" placeholder="Teléfono / WhatsApp" className="w-full p-3 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
            <select className="w-full p-3 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required>
              <option value="">Monto deseado</option>
              <option>Hasta S/5,000</option>
              <option>S/5,000 - S/30,000</option>
              <option>S/30,000 - S/100,000</option>
              <option>Más de S/100,000</option>
            </select>
            <input type="text" placeholder="Tipo de negocio" className="w-full p-3 bg-background border border-border rounded-lg text-foreground focus:border-primary outline-none" value={formData.business} onChange={(e) => setFormData({...formData, business: e.target.value})} />
            <button type="submit" className={`w-full py-3 rounded-lg font-medium transition-all ${submitted ? 'bg-success text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
              {submitted ? '✓ Solicitud enviada' : 'Solicitar crédito'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

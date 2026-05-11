import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card py-10 px-8 md:px-16 border-t border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
        <div>
          <Link href="/" className="text-xl font-bold text-foreground">Avante<span className="text-primary">Fintech</span></Link>
          <p className="text-xs text-muted-foreground mt-1">Microfinanzas para emprendedores</p>
        </div>

        {/* Acceso rápido a autenticación */}
        <div className="flex gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <LogIn className="h-3 w-3" />
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <UserPlus className="h-3 w-3" />
            Registrarse
          </Link>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Avante Fintech. Todos los derechos reservados.
        </div>

        <div className="flex gap-6">
          <a href="#servicios" className="text-xs text-muted-foreground hover:text-primary transition-colors">Servicios</a>
          <a href="#productos" className="text-xs text-muted-foreground hover:text-primary transition-colors">Productos</a>
          <a href="#contacto" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}

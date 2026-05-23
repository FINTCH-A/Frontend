// src/components/landing/Navbar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-100 py-4 px-8 md:px-16 transition-all duration-300 ${
        scrolled
          ? 'bg-background/98 backdrop-blur-sm border-b border-border'
          : 'bg-linear-to-b from-background/95 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo para modo claro */}
          <Image
            src="/logo.png"
            alt="Avante Fintech"
            width={140}
            height={40}
            className="block dark:hidden"
            priority
          />
          {/* Logo para modo oscuro */}
          <Image
            src="/logo-dark.png"
            alt="Avante Fintech"
            width={140}
            height={40}
            className="hidden dark:block"
            priority
          />
        </Link>

        <ul className="hidden md:flex gap-8 list-none items-center">
          <li><a href="#servicios" className="text-muted-foreground text-sm hover:text-primary transition-colors">Servicios</a></li>
          <li><a href="#productos" className="text-muted-foreground text-sm hover:text-primary transition-colors">Productos</a></li>
          <li><a href="#proceso" className="text-muted-foreground text-sm hover:text-primary transition-colors">Cómo funciona</a></li>
          <li>
            <Link href="/login" className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors">
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </Link>
          </li>
          <li>
            <Link href="/register" className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Registrarse
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// src/components/ui/theme-toggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  variant?: 'default' | 'sidebar' | 'header';
  className?: string;
}

export function ThemeToggle({ variant = 'default', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={className} disabled>
        <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  const variantStyles = {
    default: 'rounded-full w-9 h-9 bg-secondary/50 hover:bg-secondary',
    sidebar: 'rounded-lg w-8 h-8 bg-transparent hover:bg-muted',
    header: 'rounded-full w-9 h-9 bg-muted/50 hover:bg-muted',
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`${variantStyles[variant]} ${className}`}
      aria-label="Cambiar tema"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400 hover:text-yellow-300 transition-colors" />
      )}
    </Button>
  );
}

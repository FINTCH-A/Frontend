import { clsx, type ClassValue } from 'clsx';
import { twMerge }               from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style:    'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Fecha no disponible';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }

    return new Intl.DateTimeFormat('es-PE', {
      day:   '2-digit',
      month: '2-digit',
      year:  'numeric',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'Fecha no disponible';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }

    return new Intl.DateTimeFormat('es-PE', {
      day:    '2-digit',
      month:  '2-digit',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Fecha inválida';
  }
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatDistanceToNow(date: string | Date | null | undefined): string {
  if (!date) return 'Fecha no disponible';

  try {
    const past = typeof date === 'string' ? new Date(date) : date;

    // Verificar si la fecha es válida
    if (isNaN(past.getTime())) {
      return 'Fecha inválida';
    }

    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffMinutes < 1) return 'ahora mismo';
    if (diffMinutes < 60) return `hace ${diffMinutes} min`;
    if (diffMinutes < 1440) return `hace ${Math.floor(diffMinutes / 60)} h`;
    if (diffMinutes < 43200) return `hace ${Math.floor(diffMinutes / 1440)} d`;
    return `hace ${Math.floor(diffMinutes / 43200)} meses`;
  } catch (error) {
    console.error('Error formatting distance:', error);
    return 'Fecha inválida';
  }
}

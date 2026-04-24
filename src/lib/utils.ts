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

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatDistanceToNow(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

  if (diffMinutes < 1) return 'ahora mismo';
  if (diffMinutes < 60) return `hace ${diffMinutes} min`;
  if (diffMinutes < 1440) return `hace ${Math.floor(diffMinutes / 60)} h`;
  if (diffMinutes < 43200) return `hace ${Math.floor(diffMinutes / 1440)} d`;
  return `hace ${Math.floor(diffMinutes / 43200)} meses`;
}

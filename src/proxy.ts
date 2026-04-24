import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login'];

const ADMIN_ROUTES = [
  '/dashboard',
  '/usuarios',
  '/solicitudes',
  '/prestamos',
  '/cuotas',
  '/pagos',
  '/credit-score',
  '/notificaciones',   // ← solo admin
];

const PORTAL_ROUTES = [
  '/mis-prestamos',
  '/solicitar',
  '/mis-cuotas',
  '/mis-pagos',
  '/mi-perfil',
  '/mis-notificaciones', // ← solo cliente
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar assets y rutas internas
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')   ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('avante_access_token')?.value;
  const userRole    = request.cookies.get('avante_user_role')?.value;

  const isPublic      = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute  = ADMIN_ROUTES.some((r)  => pathname.startsWith(r));
  const isPortalRoute = PORTAL_ROUTES.some((r) => pathname.startsWith(r));

  // Sin token → login
  if (!accessToken && (isAdminRoute || isPortalRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Con token en login → redirigir según rol
  if (accessToken && isPublic) {
    if (userRole === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/mis-prestamos', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Cliente intentando entrar al admin → portal
  if (accessToken && isAdminRoute && userRole === 'CUSTOMER') {
    return NextResponse.redirect(new URL('/mis-prestamos', request.url));
  }

  // Admin/Analyst intentando entrar al portal → admin
  if (accessToken && isPortalRoute && userRole && userRole !== 'CUSTOMER') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

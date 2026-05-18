import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static images (JPG, PNG, webp, svg etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|tiff|svg|webp|mp4|webm)).*)',
  ],
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();

  // Definición de los dominios del sistema para producción y entornos locales
  const adminHost = 'admin.minervaalcarazjoyeria.mx';
  const localAdminHost = 'admin.localhost';

  // Si proviene del subdominio admin, reescribimos internamente hacia /admin/*
  if (hostname === adminHost || hostname === localAdminHost) {
    // Si la ruta ya empieza con /admin, no duplicamos la reescritura
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

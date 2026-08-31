import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();

  // Definición de los dominios del sistema para producción y entornos locales
  const adminHost = 'admin.minervaalcarazjoyeria.mx';
  const localAdminHost = 'admin.localhost';
  const isAdminDomain = hostname === adminHost || hostname === localAdminHost;

  // Supabase SSR Client for Middleware
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Determine actual path logic depending on subdomain vs normal path
  let effectivePath = url.pathname;
  let isInternalRewrite = false;

  if (isAdminDomain && !url.pathname.startsWith('/admin')) {
    effectivePath = `/admin${url.pathname}`;
    isInternalRewrite = true;
  }

  // --- AUTHENTICATION & MULTI-PROFILE LOGIC ---
  if (effectivePath.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser();
    const erpProfileId = request.cookies.get('erp_profile_id')?.value;
    
    const isAuthRoute = effectivePath === '/admin/login' || effectivePath === '/admin/register' || effectivePath === '/admin/verify';
    const isSelectProfileRoute = effectivePath === '/admin/select-profile';

    // 1. If not logged in and trying to access private dashboard
    if (!user && !isAuthRoute) {
      url.pathname = isAdminDomain ? '/login' : '/admin/login';
      return NextResponse.redirect(url);
    }

    // 2. If logged in but on login/register pages
    if (user && isAuthRoute) {
      url.pathname = isAdminDomain ? '/select-profile' : '/admin/select-profile';
      return NextResponse.redirect(url);
    }

    // 3. If logged in, not on select-profile, but NO profile selected
    if (user && !isAuthRoute && !isSelectProfileRoute && !erpProfileId) {
      url.pathname = isAdminDomain ? '/select-profile' : '/admin/select-profile';
      return NextResponse.redirect(url);
    }
    
    // 4. If logged in, has profile selected, but tries to go to select-profile
    if (user && isSelectProfileRoute && erpProfileId) {
      url.pathname = isAdminDomain ? '/' : '/admin';
      return NextResponse.redirect(url);
    }
  }

  // Rewrite for subdomain if needed
  if (isInternalRewrite) {
    url.pathname = effectivePath;
    const rewriteResponse = NextResponse.rewrite(url);
    
    // Carry over any cookies set by Supabase
    supabaseResponse.cookies.getAll().forEach(cookie => {
      rewriteResponse.cookies.set(cookie.name, cookie.value);
    });
    return rewriteResponse;
  }

  return supabaseResponse;
}

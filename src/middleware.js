import { createSupabaseServerClient } from './lib/supabase-server.js';

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ['/dashboard', '/trimestre', '/resumen', '/certificado', '/ajustes'];

/**
 * Middleware de Astro para verificar autenticación y proteger rutas
 */
export async function onRequest({ request, redirect }, next) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Crear headers de respuesta para manejo de cookies
  const responseHeaders = new Headers();

  // Crear cliente Supabase con soporte de cookies
  const supabase = createSupabaseServerClient(request, responseHeaders);

  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Verificar sesión en rutas protegidas
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      // No hay sesión válida - redirigir a login con parámetro de destino
      return redirect('/login?redirect=' + encodeURIComponent(pathname));
    }
  }

  // Si está en la página de login y ya tiene sesión, redirigir a dashboard
  if (pathname === '/login') {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      return redirect('/dashboard');
    }
  }

  // Continuar a la página solicitada
  const response = await next();

  // Aplicar cambios de cookies de la respuesta
  for (const [key, value] of responseHeaders.entries()) {
    response.headers.append(key, value);
  }

  return response;
}

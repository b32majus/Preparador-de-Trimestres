import { createServerClient } from '@supabase/ssr';

/**
 * Crea un cliente Supabase para operaciones server-side con soporte de cookies
 * @param {Request} request - Objeto request de Astro
 * @param {Headers} responseHeaders - Headers de respuesta para establecer cookies
 * @returns {Object} Cliente Supabase configurado
 */
export function createSupabaseServerClient(request, responseHeaders) {
  return createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
    {
      cookies: {
        get(key) {
          return getCookie(request, key);
        },
        set(key, value, options) {
          setCookie(responseHeaders, key, value, options);
        },
        remove(key, options) {
          removeCookie(responseHeaders, key, options);
        }
      }
    }
  );
}

/**
 * Extrae una cookie específica del request
 * @param {Request} request - Objeto request
 * @param {string} name - Nombre de la cookie
 * @returns {string|undefined} Valor de la cookie o undefined
 */
function getCookie(request, name) {
  const cookies = request.headers.get('cookie');
  if (!cookies) return undefined;

  const cookie = cookies
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined;
}

/**
 * Establece una cookie en los headers de respuesta
 * @param {Headers} headers - Headers de respuesta
 * @param {string} name - Nombre de la cookie
 * @param {string} value - Valor de la cookie
 * @param {Object} options - Opciones de la cookie
 */
function setCookie(headers, name, value, options = {}) {
  const cookieParts = [
    `${name}=${encodeURIComponent(value)}`,
    options.path ? `Path=${options.path}` : 'Path=/',
    options.maxAge ? `Max-Age=${options.maxAge}` : '',
    options.httpOnly ? 'HttpOnly' : '',
    options.secure ? 'Secure' : '',
    options.sameSite ? `SameSite=${options.sameSite}` : 'SameSite=Lax'
  ]
    .filter(Boolean)
    .join('; ');

  headers.append('Set-Cookie', cookieParts);
}

/**
 * Elimina una cookie estableciendo su Max-Age a 0
 * @param {Headers} headers - Headers de respuesta
 * @param {string} name - Nombre de la cookie
 * @param {Object} options - Opciones de la cookie
 */
function removeCookie(headers, name, options = {}) {
  setCookie(headers, name, '', { ...options, maxAge: 0 });
}

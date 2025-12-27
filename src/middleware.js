/**
 * Middleware vacío para modo estático
 * La autenticación se maneja del lado del cliente con AuthGuard
 */
export async function onRequest(context, next) {
  return next();
}

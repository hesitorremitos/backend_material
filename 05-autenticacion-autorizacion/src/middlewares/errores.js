import { env } from '../config/env.js';
import { traducirError } from '../errors/traducir.js';

export function manejarErrores(err, c) {
  const e = traducirError(err);
  const status = e.status ?? 500;
  const cuerpo = { error: e.message };
  if (status >= 500) {
    console.error(err);
    cuerpo.error = 'Error interno del servidor';
    if (env.NODE_ENV === 'development') {
      cuerpo.detalle = err.message;
    }
  }
  return c.json(cuerpo, status);
}

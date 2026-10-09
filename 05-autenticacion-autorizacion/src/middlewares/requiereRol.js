import { HttpError } from '../errors/HttpError.js';

export function requiereRol(rol) {
  return async (c, next) => {
    if (c.get('usuario').rol !== rol) {
      throw new HttpError(403, 'No tienes permiso');
    }
    await next();
  };
}

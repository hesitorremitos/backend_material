import { HttpError } from './HttpError.js';

export function traducirError(err) {
  if (err.code === 'P2002') {
    return new HttpError(409, 'El registro ya existe');
  }
  if (err.code === 'P2003') {
    return new HttpError(400, 'La relación no existe');
  }
  if (err.code === 'P2025') {
    return new HttpError(404, 'Registro no encontrado');
  }
  return err;
}

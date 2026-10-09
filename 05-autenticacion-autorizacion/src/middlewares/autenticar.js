import { prisma } from '../db.js';
import { publico } from '../esquemas.js';
import { HttpError } from '../errors/HttpError.js';

export async function autenticar(c, next) {
  const header = c.req.header('Authorization') ?? '';
  const [tipo, token] = header.split(' ');
  if (tipo !== 'Bearer' || !token) {
    throw new HttpError(401, 'Falta el token');
  }
  const sesion = await prisma.sesion.findUnique({
    where: { token },
    include: { usuario: { select: publico } },
  });
  if (!sesion) {
    throw new HttpError(401, 'Sesión inválida');
  }
  await prisma.sesion.update({
    where: { id: sesion.id },
    data: { ultimo_acceso: new Date() },
  });
  c.set('usuario', sesion.usuario);
  c.set('sesionId', sesion.id);
  await next();
}

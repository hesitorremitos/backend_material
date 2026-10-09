import { Hono } from 'hono';
import { prisma } from '../db.js';
import { HttpError } from '../errors/HttpError.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = new Hono();

// solo el dueño de la sesión o un admin
router.delete('/:id', autenticar, async (c) => {
  const s = await prisma.sesion.findUnique({
    where: { id: Number(c.req.param('id')) },
  });
  if (!s) {
    throw new HttpError(404, 'Sesión no encontrada');
  }
  const yo = c.get('usuario');
  if (s.usuario_id !== yo.id && yo.rol !== 'admin') {
    throw new HttpError(403, 'No tienes permiso');
  }
  await prisma.sesion.delete({ where: { id: s.id } });
  return c.body(null, 204);
});

export default router;

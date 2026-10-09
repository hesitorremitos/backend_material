import { Hono } from 'hono';
import { prisma } from '../db.js';
import { HttpError } from '../errors/HttpError.js';
import { autenticar } from '../middlewares/autenticar.js';
import { requiereRol } from '../middlewares/requiereRol.js';

const router = new Hono();

// solo admin; sus sesiones se borran por onDelete: Cascade
const soloAdmin = [autenticar, requiereRol('admin')];
router.delete('/:id', ...soloAdmin, async (c) => {
  const id = Number(c.req.param('id'));
  const r = await prisma.usuario.deleteMany({ where: { id } });
  if (r.count === 0) {
    throw new HttpError(404, 'Usuario no encontrado');
  }
  return c.body(null, 204);
});

// dispositivos conectados: el propio usuario o un admin
router.get('/:id/sesiones', autenticar, async (c) => {
  const id = Number(c.req.param('id'));
  const yo = c.get('usuario');
  if (yo.id !== id && yo.rol !== 'admin') {
    throw new HttpError(403, 'No tienes permiso');
  }
  const lista = await prisma.sesion.findMany({
    where: { usuario_id: id },
    select: {
      id: true, dispositivo: true,
      direccion: true, ultimo_acceso: true,
    },
  });
  return c.json(lista);
});

export default router;

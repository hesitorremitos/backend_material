import { Hono } from 'hono';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getConnInfo } from '@hono/node-server/conninfo';
import { prisma } from '../db.js';
import { registroSchema, loginSchema } from '../esquemas.js';
import { publico } from '../esquemas.js';
import { HttpError } from '../errors/HttpError.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = new Hono();

router.post('/registro', async (c) => {
  const r = registroSchema.safeParse(await c.req.json());
  if (!r.success) {
    const detalles = r.error.issues;
    return c.json({ error: 'Datos inválidos', detalles }, 400);
  }
  const { nombre, email, password } = r.data;
  const hash = await bcrypt.hash(password, 10);
  const u = await prisma.usuario.create({
    data: { nombre, email, password: hash },
    select: publico,
  });
  return c.json(u, 201);
});

router.post('/login', async (c) => {
  const r = loginSchema.safeParse(await c.req.json());
  if (!r.success) {
    const detalles = r.error.issues;
    return c.json({ error: 'Datos inválidos', detalles }, 400);
  }
  const { email, password, dispositivo } = r.data;
  const u = await prisma.usuario
    .findUnique({ where: { email } });
  const ok = u
    && await bcrypt.compare(password, u.password);
  if (!ok) {
    throw new HttpError(401, 'Credenciales inválidas');
  }
  const token = crypto.randomBytes(32).toString('hex');
  const direccion = getConnInfo(c).remote.address;
  await prisma.sesion.create({ data: {
    token, dispositivo, direccion,
    ultimo_acceso: new Date(), usuario_id: u.id,
  } });
  return c.json({ token }, 201);
});

router.get('/perfil', autenticar, (c) => {
  return c.json(c.get('usuario'));
});

router.delete('/logout', autenticar, async (c) => {
  const id = c.get('sesionId');
  await prisma.sesion.delete({ where: { id } });
  return c.body(null, 204);
});

export default router;

export function noEncontrado(c) {
  return c.json({ error: 'Ruta no encontrada' }, 404);
}

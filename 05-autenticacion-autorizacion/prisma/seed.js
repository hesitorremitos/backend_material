import bcrypt from 'bcryptjs';
import { prisma } from '../src/db.js';

// Datos de prueba: un admin y un usuario normal.
// El registro publico solo crea rol usuario, por eso el admin se siembra aqui.
const cuentas = [
  { nombre: 'Admin', email: 'admin@demo.com', password: 'admin12345', rol: 'admin' },
  { nombre: 'Ana', email: 'ana@demo.com', password: 'ana12345', rol: 'usuario' },
];

for (const c of cuentas) {
  // upsert por email para poder correr el seed varias veces sin duplicar
  const hash = await bcrypt.hash(c.password, 10);
  const u = await prisma.usuario.upsert({
    where: { email: c.email },
    update: { nombre: c.nombre, password: hash, rol: c.rol },
    create: { nombre: c.nombre, email: c.email, password: hash, rol: c.rol },
  });
  console.log(`Listo: ${u.email} (${u.rol})`);
}

await prisma.$disconnect();

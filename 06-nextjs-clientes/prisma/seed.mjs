import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const datos = [
  { nombre: "Ana Quispe", email: "ana@example.com", telefono: "70000001" },
  { nombre: "Luis Mamani", email: "luis@example.com", telefono: null },
];
for (const d of datos) {
  await prisma.cliente.upsert({ where: { email: d.email }, update: {}, create: d });
}
console.log("Seed OK:", await prisma.cliente.count(), "clientes");
await prisma.$disconnect();

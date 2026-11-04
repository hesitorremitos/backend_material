"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/lib/validacion";

// Camino B: Server Action — se ejecuta en el servidor, llamada desde un <form action={...}>
export async function crearClienteAction(formData: FormData) {
  const parsed = clienteSchema.safeParse({
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    telefono: formData.get("telefono"),
  });
  if (!parsed.success) return;

  const { nombre, email, telefono } = parsed.data;
  try {
    await prisma.cliente.create({ data: { nombre, email, telefono: telefono ?? null } });
  } catch {
    return; // p.ej. email duplicado (P2002)
  }
  revalidatePath("/clientes");
}

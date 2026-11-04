"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Camino B: Server Action — se ejecuta en el servidor, llamada desde un <form action={...}>
export async function crearClienteAction(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim() || null;
  if (!nombre || !email.includes("@")) return;
  try {
    await prisma.cliente.create({ data: { nombre, email, telefono } });
  } catch {
    return; // p.ej. email duplicado (P2002)
  }
  revalidatePath("/clientes");
}

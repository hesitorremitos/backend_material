import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clientes — listar
export async function GET() {
  const clientes = await prisma.cliente.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(clientes);
}

// POST /api/clientes — crear
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const telefono = typeof body?.telefono === "string" && body.telefono.trim() ? body.telefono.trim() : null;

  if (!nombre || !email.includes("@")) {
    return NextResponse.json({ error: "nombre y email válidos son obligatorios" }, { status: 400 });
  }
  try {
    const cliente = await prisma.cliente.create({ data: { nombre, email, telefono } });
    return NextResponse.json(cliente, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "El email ya existe" }, { status: 409 });
    throw e;
  }
}

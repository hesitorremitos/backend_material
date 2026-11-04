import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clienteSchema, mensajeErrorZod } from "@/lib/cliente-schema";

// GET /api/clientes — listar
export async function GET() {
  const clientes = await prisma.cliente.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(clientes);
}

// POST /api/clientes — crear
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = clienteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: mensajeErrorZod(parsed.error) }, { status: 400 });
  }

  const { nombre, email, telefono } = parsed.data;
  try {
    const cliente = await prisma.cliente.create({
      data: { nombre, email, telefono: telefono ?? null },
    });
    return NextResponse.json(cliente, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "El email ya existe" }, { status: 409 });
    throw e;
  }
}

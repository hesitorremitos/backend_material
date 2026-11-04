import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/clientes/:id
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(cliente);
}

// PATCH /api/clientes/:id
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const data: { nombre?: string; email?: string; telefono?: string | null } = {};
  if (typeof body.nombre === "string" && body.nombre.trim()) data.nombre = body.nombre.trim();
  if (typeof body.email === "string" && body.email.includes("@")) data.email = body.email.trim();
  if ("telefono" in body) data.telefono = body.telefono || null;
  try {
    const cliente = await prisma.cliente.update({ where: { id }, data });
    return NextResponse.json(cliente);
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    if (e?.code === "P2002") return NextResponse.json({ error: "El email ya existe" }, { status: 409 });
    throw e;
  }
}

// DELETE /api/clientes/:id
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    await prisma.cliente.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    if (e?.code === "P2025") return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    throw e;
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clienteUpdateSchema, mensajeErrorZod } from "@/lib/cliente-schema";

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
  const body = await req.json().catch(() => null);
  const parsed = clienteUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: mensajeErrorZod(parsed.error) }, { status: 400 });
  }
  try {
    const cliente = await prisma.cliente.update({ where: { id }, data: parsed.data });
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

import { prisma } from "@/lib/prisma";
import { crearClienteAction } from "./actions";
import FormularioCliente from "./FormularioCliente";
import AccionesCliente from "./AccionesCliente";

export const dynamic = "force-dynamic";

// Server Component: lee directo con Prisma (sin fetch)
export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <h1>Clientes ({clientes.length})</h1>
      <table cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead><tr><th align="left">Nombre</th><th align="left">Email</th><th align="left">Teléfono</th><th /></tr></thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{c.nombre}</td><td>{c.email}</td><td>{c.telefono ?? "—"}</td>
              <td><AccionesCliente id={c.id} nombre={c.nombre} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Camino A — Formulario con fetch a la API</h2>
      <FormularioCliente />

      <h2>Camino B — Acción de servidor</h2>
      <form action={crearClienteAction} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input name="nombre" placeholder="Nombre" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="telefono" placeholder="Teléfono (opcional)" />
        <button type="submit">Crear (Accion de servidor)</button>
      </form>
    </>
  );
}

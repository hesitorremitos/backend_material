export default function Home() {
  return (
    <>
      <h1>CRUD de Clientes</h1>
      <p>Next.js App Router + Prisma + SQLite. Hay dos caminos para modificar datos:</p>
      <ul>
        <li><b>Camino A — Route Handlers (API REST):</b> un Client Component hace <code>fetch</code> a
          <code> /api/clientes</code> (POST) y <code>/api/clientes/[id]</code> (PATCH/DELETE). Sirve también para apps móviles o Postman.</li>
        <li><b>Camino B — Server Action:</b> un formulario llama directamente a una función <code>&quot;use server&quot;</code>
          en <code>app/clientes/actions.ts</code>, que usa Prisma y luego <code>revalidatePath</code>. Sin escribir una API.</li>
      </ul>
      <p>La lectura (listado) se hace en un Server Component con <code>prisma.cliente.findMany()</code>.</p>
    </>
  );
}

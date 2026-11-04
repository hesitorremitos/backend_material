# CRUD de Clientes — Next.js App Router + Prisma + SQLite

Ejemplo de clase (DESARROLLO WEB BACKEND).

## Cómo ejecutar

Desde la raíz del repositorio, entra a `06-nextjs-clientes/` y copia el ejemplo de entorno (no se versiona un `.env` real):

```bash
cd 06-nextjs-clientes
cp .env.example .env   # DATABASE_URL="file:./dev.db"
npm install
npx prisma db push     # crea la BD SQLite (prisma/dev.db) desde el schema
npm run seed           # inserta 2 clientes
npm run dev            # http://localhost:3000
```

## Mapa de arquitectura
```
app/
  layout.tsx                    Layout con navegación
  page.tsx                      Inicio: explica los dos caminos
  clientes/
    page.tsx                    Server Component: prisma.cliente.findMany() + formularios
    FormularioCliente.tsx       Client Component -> POST /api/clientes        (Camino A)
    AccionesCliente.tsx         Client Component -> PATCH / DELETE por id     (Camino A)
    actions.ts                  "use server" crearClienteAction + revalidatePath (Camino B)
  api/clientes/
    route.ts                    GET (listar), POST (crear)
    [id]/route.ts               GET (uno), PATCH (editar), DELETE (eliminar)
lib/prisma.ts                   PrismaClient singleton
prisma/schema.prisma            Modelo Cliente
prisma/seed.mjs                 Datos de ejemplo
```

**Lectura:** Server Component → Prisma directamente (sin API).
**Camino A (API REST):** navegador → `fetch` → Route Handler → Prisma → JSON; luego `router.refresh()`.
**Camino B (Server Action):** `<form action={crearClienteAction}>` → función en el servidor → Prisma → `revalidatePath("/clientes")`.

## Probar la API
```bash
curl http://localhost:3000/api/clientes
curl -X POST http://localhost:3000/api/clientes -H "Content-Type: application/json" \
  -d '{"nombre":"Carla","email":"carla@example.com"}'
curl -X PATCH http://localhost:3000/api/clientes/<id> -H "Content-Type: application/json" -d '{"telefono":"7000"}'
curl -X DELETE http://localhost:3000/api/clientes/<id>
```
Ver `VERIFICACION.md` para los resultados reales.

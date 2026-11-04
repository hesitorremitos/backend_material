# VERIFICACIÓN — 06-nextjs-clientes

Fecha: 2026-11-04 (hora de Bolivia, UTC-4). Node v24.22.1, Next 16.4.5, React 19.3, Prisma 6.19.3, TypeScript 5, SQLite.

## Comandos
```bash
npm install
npx prisma db push      # crea prisma/dev.db y genera el cliente
npm run seed            # -> "Seed OK: 2 clientes"
npx next build          # OK: / (estática), /clientes, /api/clientes, /api/clientes/[id] (dinámicas)
npx next start -p 3456
```

## Resultados curl
```
$ curl -s http://localhost:3456/api/clientes
[{"id":"cmw28cr7u0001a2gncxfx9ggn","nombre":"Luis Mamani","email":"luis@example.com","telefono":null,"createdAt":"2026-11-04T14:46:49.290Z"},{"id":"cmw28cr7o0000a2gnbeplbtyh","nombre":"Ana Quispe","email":"ana@example.com","telefono":"70000001","createdAt":"2026-11-04T14:46:49.285Z"}]
$ curl -s -X POST http://localhost:3456/api/clientes -H "Content-Type: application/json" -d {"nombre":"Carla Rojas","email":"carla@example.com","telefono":"71112233"}
{"id":"cmw28d59d0000a2ryngor2yab","nombre":"Carla Rojas","email":"carla@example.com","telefono":"71112233","createdAt":"2026-11-04T14:47:07.490Z"} [HTTP 201]
$ POST duplicado
{"error":"El email ya existe"} [HTTP 409]
$ POST invalido
{"error":"nombre y email válidos son obligatorios"} [HTTP 400]
$ GET http://localhost:3456/api/clientes/cmw28d59d0000a2ryngor2yab
{"id":"cmw28d59d0000a2ryngor2yab","nombre":"Carla Rojas","email":"carla@example.com","telefono":"71112233","createdAt":"2026-11-04T14:47:07.490Z"} [HTTP 200]
$ PATCH http://localhost:3456/api/clientes/cmw28d59d0000a2ryngor2yab {telefono:79999999}
{"id":"cmw28d59d0000a2ryngor2yab","nombre":"Carla Rojas","email":"carla@example.com","telefono":"79999999","createdAt":"2026-11-04T14:47:07.490Z"} [HTTP 200]
$ DELETE http://localhost:3456/api/clientes/cmw28d59d0000a2ryngor2yab
[HTTP 204]
$ GET http://localhost:3456/api/clientes/cmw28d59d0000a2ryngor2yab (tras borrar)
{"error":"No encontrado"} [HTTP 404]
$ GET /clientes (HTML)
[HTTP 200]
Accion de servidor
Ana Quispe
Clientes (<!-- -->2
```

Notas: la Server Action (Camino B) compila y se renderiza en /clientes (botón "Crear (Accion de servidor)");
no se probó con curl porque requiere el ID de acción interno de Next — probarla desde el navegador.

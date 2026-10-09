# 05 - Autenticación y autorización (Hono + Prisma + MySQL)

Ejemplo de la clase: registro, login con token Bearer contra la tabla `sesiones`, perfil, logout y reglas de autorización (rol admin y regla de dueño). Stack: Hono 4, Prisma 6 y MySQL (Laragon), en JavaScript ESM.

## Requisitos

- Node.js 20 o superior.
- Laragon con MySQL encendido.
- Base de datos `clase_auth` creada en MySQL.

## Puesta en marcha

Desde la raíz del repo:

```
npm install
```

Crea la base `clase_auth` en MySQL (por ejemplo desde HeidiSQL o la consola de Laragon). Luego, desde la raíz:

```
npm run db:push -w 05-autenticacion-autorizacion
npm run db:seed -w 05-autenticacion-autorizacion
npm run dev -w 05-autenticacion-autorizacion
```

O entrando a la carpeta y ejecutando lo mismo sin `-w`:

```
cd 05-autenticacion-autorizacion
npm run db:push
npm run db:seed
npm run dev
```

El servidor queda en http://localhost:7005 y la documentación en http://localhost:7005/api/docs

## Cuentas de prueba (seed)

| Email | Password | Rol |
| --- | --- | --- |
| admin@demo.com | admin12345 | admin |
| ana@demo.com | ana12345 | usuario |

El registro público siempre crea rol `usuario`, por eso el admin viene del seed.

## Rutas y permisos

| Método y ruta | Quién puede usarla |
| --- | --- |
| POST /auth/registro | Público |
| POST /auth/login | Público |
| GET /auth/perfil | Usuario con token |
| DELETE /auth/logout | Usuario con token |
| DELETE /usuarios/:id | Solo admin |
| GET /usuarios/:id/sesiones | El propio usuario o un admin |
| DELETE /sesiones/:id | El dueño de la sesión o un admin |

Las rutas protegidas esperan el encabezado `Authorization: Bearer <token>`.

## Probar desde el navegador

1. Abre http://localhost:7005/api/docs
2. Ve a POST /auth/login, pulsa Try it out y usa `ana@demo.com` / `ana12345` con `dispositivo` en `web`.
3. Copia el `token` de la respuesta.
4. Pulsa el botón Authorize, pega el token y confirma.
5. Ya puedes probar el resto de rutas protegidas.

## Cliente HTTP con Bruno

En la carpeta `bruno/` hay una colección lista para Bruno (alternativa libre a Postman). Ábrela con Bruno, selecciona el entorno `local` y ejecuta `Login`: el script de la respuesta guarda el token en la variable `token`, y las rutas protegidas lo usan como `Authorization: Bearer {{token}}`.

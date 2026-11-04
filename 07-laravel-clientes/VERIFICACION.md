# VERIFICACIÓN — 07-laravel-clientes

Fecha: 2026-11-04. PHP 8.3.6, Laravel 13.40, SQLite.

## Pruebas automatizadas

```bash
composer install
php artisan test
```

Resultado: 7 pruebas, 34 aserciones, todas en verde.

Cubren: invitado redirigido de `/clientes` a `/login`; registro con `Hash::make`, logout y login; validación del registro; usuario autenticado que lista, crea, edita y elimina un cliente; rechazo de correo inválido, correo duplicado, nombre vacío y teléfono mal formado.

## Servidor

```bash
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8765
```

## Resultados curl (con cookie de sesión y token CSRF)

```
GET  /clientes                         302 → /login
POST /register (Ana, ana@mail.com)     302 → /clientes
GET  /clientes                         200  «Todavía no hay clientes»
POST /clientes email=no-es-correo      302 → /clientes/create
GET  /clientes/create                  «El correo no es válido»
POST /clientes Luis Mamani             302 → /clientes
GET  /clientes                         200  «Luis Mamani»
GET  /clientes/1                       200  luis@mail.com
POST /clientes/1 (_method=PUT)         302 → /clientes  (nombre «Luis P»)
POST /clientes/1 (_method=DELETE)      302 → /clientes
GET  /clientes                         200  «Todavía no hay clientes»
POST /logout                           302 → /login
GET  /clientes                         302 → /login
POST /login contraseña incorrecta      302 → /login  «no coinciden»
POST /login Secreta123!                302 → /clientes
```

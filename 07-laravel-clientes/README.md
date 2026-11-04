# CRUD de Clientes — Laravel + SQLite

Ejemplo de clase (DESARROLLO WEB BACKEND). Aplicación Laravel con autenticación por sesión y un CRUD de clientes.

## Cómo ejecutar

Desde la raíz del repositorio, entra a `07-laravel-clientes/`. Hace falta PHP 8.3+ con las extensiones habituales (`mbstring`, `xml`, `sqlite`, `tokenizer`, `curl`) y [Composer](https://getcomposer.org/).

```bash
cd 07-laravel-clientes
composer install
cp .env.example .env          # DB_CONNECTION=sqlite
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan serve             # http://localhost:8000
```

`touch` solo hace falta si el archivo SQLite todavía no existe. Las sesiones se guardan en la tabla `sessions` (driver `database` del `.env.example`), así que `migrate` crea usuarios, sesiones y clientes.

Regístrate en `/register` (nombre, correo, contraseña y confirmación). Después entra por `/login`. El listado de clientes está en `/clientes` y pide sesión iniciada.

## Mapa de arquitectura

```
routes/web.php                         Rutas web: /, /register, /login, /logout y el resource clientes
app/Http/Controllers/AuthController.php  Registro, login y logout de sesión
app/Http/Controllers/ClienteController.php  index, create, store, show, edit, update, destroy
app/Models/User.php                    Usuario autenticable
app/Models/Cliente.php                 Modelo Cliente ($fillable: nombre, email, telefono)
app/Http/Requests/ClienteRequest.php   Validación del alta y la edición
database/migrations/                   users, sessions, cache, jobs y la tabla clientes
resources/views/auth/                  login.blade.php y register.blade.php
resources/views/clientes/              index, create, edit, show
resources/views/layouts/app.blade.php  Layout compartido
tests/Feature/ClientesTest.php         Invitado, auth y CRUD
```

## Autenticación

La sesión es básica y está escrita en esta app:

1. **Registro** (`POST /register`): valida nombre, correo y contraseña con confirmación, guarda el usuario con `Hash::make` y lo deja logueado.
2. **Login** (`POST /login`): `Auth::attempt` con correo y contraseña. Si falla, vuelve al formulario con error en el correo.
3. **Logout** (`POST /logout`): cierra la sesión.

Las vistas están en `resources/views/auth/`. Quien no tiene sesión y pide `/clientes` es redirigido a `/login`.

## CRUD de clientes

`Route::resource('clientes', ClienteController::class)` vive detrás de `middleware('auth')`.

| Método | Ruta | Acción |
| --- | --- | --- |
| GET | `/clientes` | Listar |
| GET | `/clientes/create` | Formulario de alta |
| POST | `/clientes` | Crear |
| GET | `/clientes/{cliente}` | Ver |
| GET | `/clientes/{cliente}/edit` | Formulario de edición |
| PUT/PATCH | `/clientes/{cliente}` | Actualizar |
| DELETE | `/clientes/{cliente}` | Eliminar |

La tabla `clientes` tiene `nombre`, `email` único, `telefono` nullable y timestamps. `ClienteRequest` exige nombre, un correo válido y único, y un teléfono opcional de 7 a 15 dígitos.

## Pruebas

```bash
php artisan test
```

Usan SQLite en memoria (`phpunit.xml`).

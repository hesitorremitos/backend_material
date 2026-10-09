import { z } from 'zod';
import { registroSchema, loginSchema } from './esquemas.js';

// Convierte un esquema de zod a JSON Schema para usarlo como cuerpo.
// Quitamos $schema porque no es valido dentro de un documento OpenAPI 3.0.
function cuerpo(schema) {
  const json = z.toJSONSchema(schema);
  delete json.$schema;
  return json;
}

// Respuesta de error reutilizable con un ejemplo del mensaje real.
function error(descripcion, ejemplo) {
  return {
    description: descripcion,
    content: {
      'application/json': { example: { error: ejemplo } },
    },
  };
}

// Respuesta de error 400: zod devuelve la lista de problemas.
function errorValidacion(descripcion) {
  return {
    description: descripcion,
    content: {
      'application/json': {
        example: {
          error: 'Datos inválidos',
          detalles: [{ path: ['password'], message: 'Too small: expected string to have >=8 characters' }],
        },
      },
    },
  };
}

// Respuesta con un cuerpo de ejemplo (200 / 201).
function ok(descripcion, ejemplo) {
  return {
    description: descripcion,
    content: {
      'application/json': { example: ejemplo },
    },
  };
}

// Parametro de ruta :id reutilizable.
const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Identificador numérico',
  schema: { type: 'integer' },
};

export const openapi = {
  openapi: '3.0.0',
  info: {
    title: 'API de autenticación y autorización',
    version: '1.0.0',
    description:
      'Ejemplo de la clase 05: registro, login con token Bearer contra la tabla sesiones, perfil, logout y reglas de autorización (rol admin y regla de dueño).',
  },
  servers: [{ url: 'http://localhost:7005', description: 'Servidor local' }],
  tags: [
    { name: 'Autenticación', description: 'Registro, login, perfil y logout' },
    { name: 'Usuarios', description: 'Gestión de usuarios (solo admin) y sus sesiones' },
    { name: 'Sesiones', description: 'Dispositivos conectados' },
  ],
  components: {
    securitySchemes: {
      // Boton Authorize de Swagger UI: pegar el token del login.
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'hex' },
    },
    schemas: {
      Usuario: {
        type: 'object',
        description: 'Usuario público, nunca incluye el password',
        properties: {
          id: { type: 'integer', example: 2 },
          nombre: { type: 'string', example: 'Ana' },
          email: { type: 'string', format: 'email', example: 'ana@demo.com' },
          rol: { type: 'string', enum: ['usuario', 'admin'], example: 'usuario' },
        },
      },
      Sesion: {
        type: 'object',
        description: 'Dispositivo conectado',
        properties: {
          id: { type: 'integer', example: 1 },
          dispositivo: { type: 'string', enum: ['android', 'web', 'movil', 'ios'], example: 'web' },
          direccion: { type: 'string', nullable: true, example: '::1' },
          ultimo_acceso: { type: 'string', format: 'date-time', example: '2026-01-01T10:00:00.000Z' },
        },
      },
      Token: {
        type: 'object',
        properties: { token: { type: 'string', example: 'a1b2c3d4e5f6...' } },
      },
    },
  },
  // Por defecto ninguna ruta pide token; las que lo piden lo activan una a una.
  security: [],
  paths: {
    '/auth/registro': {
      post: {
        tags: ['Autenticación'],
        summary: 'Registrar un usuario',
        description: 'Crea un usuario nuevo. El rol siempre es usuario, nunca admin.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: cuerpo(registroSchema), example: { nombre: 'Nuevo', email: 'nuevo@demo.com', password: 'nuevo12345' } } },
        },
        responses: {
          201: ok('Usuario creado sin password en la respuesta', { id: 3, nombre: 'Nuevo', email: 'nuevo@demo.com', rol: 'usuario' }),
          400: errorValidacion('Datos inválidos'),
          409: error('El registro ya existe', 'El registro ya existe'),
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión',
        description: 'Valida las credenciales y crea una sesión. Devuelve el token que se usa como Bearer.',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: cuerpo(loginSchema), example: { email: 'ana@demo.com', password: 'ana12345', dispositivo: 'web' } },
          },
        },
        responses: {
          201: ok('Sesión creada con su token', { token: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' }),
          400: errorValidacion('Datos inválidos'),
          401: error('Credenciales inválidas', 'Credenciales inválidas'),
        },
      },
    },
    '/auth/perfil': {
      get: {
        tags: ['Autenticación'],
        summary: 'Ver mi perfil',
        description: 'Devuelve el usuario dueño del token. Ejemplo con el admin: admin@demo.com / admin12345.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: ok('Datos del usuario autenticado', { id: 2, nombre: 'Ana', email: 'ana@demo.com', rol: 'usuario' }),
          401: error('Falta el token o la sesión no es válida', 'Falta el token'),
        },
      },
    },
    '/auth/logout': {
      delete: {
        tags: ['Autenticación'],
        summary: 'Cerrar sesión',
        description: 'Borra la sesión actual. Después de esto el token deja de servir.',
        security: [{ bearerAuth: [] }],
        responses: {
          204: { description: 'Sesión cerrada, sin contenido' },
          401: error('Falta el token o la sesión no es válida', 'Sesión inválida'),
        },
      },
    },
    '/usuarios/{id}': {
      delete: {
        tags: ['Usuarios'],
        summary: 'Eliminar un usuario (solo admin)',
        description: 'Solo un admin puede borrar usuarios. Sus sesiones se borran en cascada. Necesitas el token de admin@demo.com.',
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          204: { description: 'Usuario eliminado, sin contenido' },
          401: error('Falta el token o la sesión no es válida', 'Sesión inválida'),
          403: error('No tienes permiso', 'No tienes permiso'),
          404: error('Usuario no encontrado', 'Usuario no encontrado'),
        },
      },
    },
    '/usuarios/{id}/sesiones': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar las sesiones de un usuario',
        description: 'Solo el propio usuario o un admin pueden verlas.',
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          200: {
            description: 'Lista de dispositivos conectados',
            content: {
              'application/json': {
                example: [
                  { id: 1, dispositivo: 'web', direccion: '::1', ultimo_acceso: '2026-01-01T10:00:00.000Z' },
                ],
              },
            },
          },
          401: error('Falta el token o la sesión no es válida', 'Falta el token'),
          403: error('No tienes permiso', 'No tienes permiso'),
        },
      },
    },
    '/sesiones/{id}': {
      delete: {
        tags: ['Sesiones'],
        summary: 'Cerrar una sesión',
        description: 'Solo el dueño de la sesión o un admin pueden cerrarla.',
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          204: { description: 'Sesión cerrada, sin contenido' },
          401: error('Falta el token o la sesión no es válida', 'Falta el token'),
          403: error('No tienes permiso', 'No tienes permiso'),
          404: error('Sesión no encontrada', 'Sesión no encontrada'),
        },
      },
    },
  },
};

export default openapi;

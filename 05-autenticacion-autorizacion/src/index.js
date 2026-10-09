import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { env } from './config/env.js';
import authRouter from './routes/auth.js';
import usuariosRouter from './routes/usuarios.js';
import sesionesRouter from './routes/sesiones.js';
import { swaggerUI } from '@hono/swagger-ui';
import { noEncontrado } from './middlewares/noEncontrado.js';
import { manejarErrores } from './middlewares/errores.js';
import { openapi } from './openapi.js';

const app = new Hono();

app.use('*', cors({ origin: env.CORS_ORIGIN }));

app.route('/auth', authRouter);
app.route('/usuarios', usuariosRouter);
app.route('/sesiones', sesionesRouter);

// Documentacion: JSON OpenAPI y Swagger UI para probar desde el navegador.
app.get('/api/openapi.json', (c) => c.json(openapi));
app.get('/api/docs', swaggerUI({ url: '/api/openapi.json' }));

app.notFound(noEncontrado);
app.onError(manejarErrores);

serve({ fetch: app.fetch, port: env.PORT }, () => {
  console.log(`API en el puerto ${env.PORT}`);
  console.log(`Docs: http://localhost:${env.PORT}/api/docs`);
});

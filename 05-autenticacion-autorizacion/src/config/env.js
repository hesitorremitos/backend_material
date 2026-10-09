import { z } from 'zod';

z.config(z.locales.es()); // mensajes en español

const esquema = z.object({
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string().startsWith('mysql://'),
  CORS_ORIGIN: z.string().min(1)
    .transform((s) => s.split(',')),
});

const r = esquema.safeParse(process.env);
if (!r.success) {
  console.error('Configuración inválida:');
  for (const e of r.error.issues) {
    console.error(`- ${e.path.join('.')}: ${e.message}`);
  }
  process.exit(1);
}

export const env = r.data;

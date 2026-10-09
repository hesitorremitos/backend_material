import { z } from 'zod';

export const registroSchema = z.object({
  nombre: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  dispositivo: z.enum(['android', 'web', 'movil', 'ios']),
});

// columnas que se pueden mostrar (sin password)
export const publico = { id: true, nombre: true, email: true, rol: true };

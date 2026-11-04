import { z } from "zod";

const mensajeSiFalta = (falta: string, otro: string) => (issue: { input?: unknown }) =>
  issue.input === undefined ? falta : otro;

/** Texto recortado. Vacío o null quedan en null; si el campo no viene, queda ausente. */
const telefono = z
  .union([z.string("El teléfono debe ser texto"), z.null()], "El teléfono debe ser texto")
  .optional()
  .transform((valor) => {
    if (typeof valor !== "string") return valor === undefined ? undefined : null;
    const limpio = valor.trim();
    return limpio.length > 0 ? limpio : null;
  });

/** Alta de cliente: nombre y email obligatorios, teléfono opcional. */
export const clienteSchema = z.object(
  {
    nombre: z
      .string({ error: mensajeSiFalta("El nombre es obligatorio", "El nombre debe ser texto") })
      .trim()
      .min(1, "El nombre es obligatorio"),
    email: z
      .string({ error: mensajeSiFalta("El email es obligatorio", "El email debe ser texto") })
      .trim()
      .min(1, "El email es obligatorio")
      .pipe(z.email("El email no es válido")),
    telefono,
  },
  "Los datos del cliente no son válidos",
);

/** Edición parcial: solo se validan los campos enviados. */
export const clienteUpdateSchema = clienteSchema.partial();

export function mensajeErrorZod(error: z.ZodError): string {
  const mensajes = [...new Set(error.issues.map((issue) => issue.message))];
  return mensajes.join(". ");
}

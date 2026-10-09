import { PrismaClient } from '@prisma/client';

// Prisma lee DATABASE_URL del .env
export const prisma = new PrismaClient();

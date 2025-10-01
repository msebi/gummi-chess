import { PrismaClient } from '../generated/prisma/client'; // <-- YOUR CORRECTED IMPORT PATH

// This helps us avoid creating too many Prisma Client instances in development.
declare global {
  // allow global `var` declarations
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
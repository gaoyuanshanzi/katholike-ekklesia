import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export const NEON_DATABASE_URL =
  "postgresql://neondb_owner:npg_XEhUzJl49NxY@ep-rough-frog-aywvbbxa.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = NEON_DATABASE_URL;
}

const connectionString = process.env.DATABASE_URL || NEON_DATABASE_URL;

const prismaClientSingleton = () => {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

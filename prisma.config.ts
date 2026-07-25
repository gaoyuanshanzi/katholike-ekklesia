import "dotenv/config";
import { defineConfig } from "prisma/config";

const NEON_DATABASE_URL =
  "postgresql://neondb_owner:npg_XEhUzJl49NxY@ep-rough-frog-aywvbbxa.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || NEON_DATABASE_URL,
  },
});

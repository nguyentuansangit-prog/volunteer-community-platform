import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { databaseUrl } from "./src/lib/database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  datasource: {
    // Migrations use Neon's direct endpoint; runtime retains the pooled URL.
    // Apply the same QA database selection to both endpoints.
    url: databaseUrl(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL) ?? env("DATABASE_URL"),
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});

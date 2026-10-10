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
    url: databaseUrl() ?? env("DATABASE_URL"),
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});

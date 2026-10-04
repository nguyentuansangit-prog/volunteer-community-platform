import pg from "pg";
import { spawnSync } from "node:child_process";

// Opt-in only: the flag is configured exclusively for the integration Preview branch.
const name = process.env.QA_DATABASE_NAME;
if (name) {
  if (process.env.VERCEL_ENV !== "preview" || !/^volunteer_[a-z0-9_]+_test$/.test(name)) throw new Error("Preview initialization requires a dedicated test database");
  if (!process.env.QA_SEED_PASSWORD || process.env.QA_SEED_PASSWORD.length < 16) throw new Error("A strong QA seed password is required");
  const adminUrl = new URL(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL);
  adminUrl.pathname = "/postgres";
  const db = new pg.Client({ connectionString: adminUrl.toString() });
  try {
    await db.connect();
    const exists = await db.query("SELECT datname FROM pg_database WHERE datname = $1", [name]);
    if (exists.rowCount === 0) {
      // Name is constrained to lowercase ASCII above; no user SQL is accepted.
      await db.query(`CREATE DATABASE "${name}" WITH ENCODING 'UTF8' TEMPLATE template0 LC_COLLATE 'C' LC_CTYPE 'C'`);
    }
    console.log("Dedicated QA Preview database is available.");
  } finally { await db.end(); }
  const url = new URL(process.env.DATABASE_URL);
  url.pathname = "/" + name;
  const env = { ...process.env, DATABASE_URL: url.toString() };
  for (const args of [["node_modules/prisma/build/index.js", "migrate", "deploy"], ["node_modules/tsx/dist/cli.mjs", "scripts/seed-preview.ts"]]) {
    const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
    if (result.status !== 0) throw new Error("QA Preview migration or fixture initialization failed");
  }
}

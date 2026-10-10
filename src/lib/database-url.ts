// Only an explicitly configured Vercel Preview may select the isolated QA database.
export function databaseUrl(value = process.env.DATABASE_URL) {
  const name = process.env.QA_DATABASE_NAME;
  if (!name) return value;
  if (process.env.VERCEL_ENV !== "preview" || !/^volunteer_[a-z0-9_]+_test$/.test(name)) {
    throw new Error("QA database selection requires an isolated Vercel Preview test database");
  }
  const url = new URL(value!);
  url.pathname = "/" + name;
  return url.toString();
}

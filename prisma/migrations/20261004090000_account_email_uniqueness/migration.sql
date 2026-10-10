-- Keep the existing Prisma email constraint and enforce case-insensitive
-- uniqueness, including concurrent registration requests.
CREATE UNIQUE INDEX "User_email_case_insensitive_key" ON "User" (lower("email"));

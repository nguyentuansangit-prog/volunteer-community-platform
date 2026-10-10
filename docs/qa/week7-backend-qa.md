# Week 7 backend QA — 04/10/2026

Base reviewed: d6837fa6126cb6201d22ec4269fb710fb7d8ebff (PR #41).

## Fixes
- Preserve Week 6 legacy activity list at 50 items/page; metadata API remains 20.
- Attendance locks the same Activity row as registration transitions. Cancellation deletes attendance atomically, preventing cancelled registrations from retaining volunteer hours.
- Add Week 7 PostgreSQL integration and authenticated HTTP suites to npm scripts.

## Verified locally
- Prisma generate and validate: PASS.
- All three migrations, including 20261004195000_week7_attendance: applied successfully to isolated PostgreSQL 18 UTF8 QA database.
- npm test: 10/10 PASS.
- npm run test:integration: 2/2 PASS, no skips (Week 6 + Week 7).
- npm run test:http: 3/3 PASS, no skips, against production server http://localhost:3057.
- npm run lint: PASS.
- npm run build: PASS, TypeScript and all routes compiled.
- git diff --check: PASS.

Week 7 coverage: case-insensitive keyword/location, managed status and ownership filters, page boundaries/no overlap/empty page, legacy response; APPROVED-only attendance, organizer/admin permission, pending/rejected/cancelled refusal, duration limit, ABSENT zero hours, repeated/concurrent upserts, correction, cancellation; real dashboard aggregates and role restrictions; activity approved/rejected notifications to organizer, registration approved/rejected notifications to participant, no duplicate transition notification, read persistence and ownership.

Week 6 regression: activity CRUD/moderation, registration/cancellation, audit, duplicate registration race, capacity approval race, role revocation/blocking with existing session, HTTP authentication/origin/validation.

## Remaining merge blockers
- Preview database migration status is unverified; local migration does not prove Preview migration.
- Authenticated Week 7 QA against the updated Preview deployment remains required.
- Issue #36 end-to-end UI/responsive QA remains outstanding.
- Keep Issue #34 open and do not merge PR #41 until these gates pass.

## Reproduce
Use a dedicated PostgreSQL UTF8 database with a name ending in _test. Export DATABASE_URL explicitly for test runners (they do not automatically load .env). Run prisma generate, validate, migrate deploy, then npm test and npm run test:integration. For HTTP suites seed only the dedicated QA database with ALLOW_DEMO_SEED=true, start the production server with AUTH_SECRET and AUTH_TRUST_HOST=true, export WORKFLOW_TEST_BASE_URL=http://localhost:3057, and run npm run test:http.

Windows sandbox initially caused tsx userInfo and cache errors; using a workspace npm cache and approved execution resolved them. PostgreSQL's Windows default WIN1252 cannot store the Vietnamese notifications; the successful run used UTF8. The 127.0.0.1 HTTP alias received INVALID_ORIGIN because Next's request origin was localhost; the successful HTTP run used localhost.

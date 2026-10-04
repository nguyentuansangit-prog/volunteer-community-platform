# Week 7 full-stack integration Preview

Sources: backend PR #41 at 53d5aea; account/auth UI PR #39 at 59f4ad8; Tài's original Week 7 layout at 7f6f216 (PR #37).

## Integrated behavior
- Activities: backend keyword/location and authorized workflow status filtering; pagination comes from filtered API metadata, resets to page 1 when applying filters.
- Attendance: real approved registrations; ATTENDED/ABSENT and editable hours saved through PUT /api/attendance/:registrationId; server ownership/role checks preserved.
- Organizer/Admin dashboards: real API values. All-time registration count is labelled as all statuses.
- Notifications: real paginated records; PATCH read state persists; empty/loading/error states do not use fallback fixtures.
- Authentication: real NextAuth sessions and account registration UI from PR #39, server checks current DB role/status. Existing Week 6 workflow remains available.
- One Next.js app serves frontend and API under the same origin.

## Local verification
- Prisma migrations: all four applied successfully on isolated PostgreSQL UTF8 test DB.
- npm test: 13/13 pass, no skips.
- npm run test:integration: 2/2 pass, no skips.
- npm run test:http: 5/5 pass, no skips.
- npm run lint and npm run build: pass.
- Browser: Organizer login -> managed PUBLISHED filter -> attendance -> save 2h -> refresh persistence -> dashboard shows 2h. Notification read state survives refresh. Attendance at 390px has no horizontal overflow; no warning/error captured in the browser session.
- Restored Week 6 Admin access-denied screen for blocked accounts after finding a regression in the first integrated HTTP run.

## Preview setup
The existing Vercel DATABASE_URL is shared across Preview and production. Do not migrate/seed that shared database for QA.

The integration branch can opt into a separate database by setting branch-scoped Preview-only QA_DATABASE_NAME=volunteer_week7_fullstack_test and sensitive QA_SEED_PASSWORD (at least 16 characters). The build preparation script creates only that UTF8 test database, applies migrations there and seeds three test accounts plus one published activity. Runtime selects the same test database. Initialization fails outside VERCEL_ENV=preview. With no flag, normal builds remain unchanged.

Local checks verified creating and initializing a dedicated database, repeated initialization preserves existing fixtures, and production initialization is refused. Remote database creation may still be limited by the PostgreSQL provider; deployment success and authenticated browser QA must be checked before calling the Preview ready for manual testing.

Manual QA accounts in the isolated database: admin@week7.test, organizer@week7.test, volunteer@week7.test. Password is configured through Vercel and provided privately to the requester, never committed or logged.

## Merge gate
This is an integration review/Preview branch. PR #39, #41 and the integration PR remain unmerged until team QA passes. Issue #35's original completion checkboxes are not evidence that the old PR #37 connected to the new APIs.

Preview environment setup authorized by the requester and configured on 2026-10-04. Both QA_DATABASE_NAME and sensitive QA_SEED_PASSWORD are scoped only to integration/week7-fullstack-preview. Pending: deployment with these variables, remote migration and authenticated Preview QA. Do not use an older deployment for manual writes.
# Week 6 backend — Issue #21

The implementation follows the ERD in database-design.md and the workflow proposed
on origin/docs/core-workflow. Existing cuid IDs and User.name are retained for
compatibility with Week 5 authentication. Category, Activity, Registration,
Notification and status history relations are added by a new migration; the
initial migration is unchanged.

## Business decisions for review

- Creation defaults to PENDING; organizers can explicitly create DRAFT.
- DRAFT → PENDING → PUBLISHED/REJECTED; REJECTED → DRAFT; PUBLISHED → CLOSED.
  Only ADMIN publishes/rejects. Owners and admins manage activities.
- Only DRAFT/REJECTED content can be edited. Submitted/published content cannot
  bypass moderation. Delete only DRAFT/PENDING/REJECTED with no registrations;
  close published activities to retain history.
- Only APPROVED registrations consume capacity. Registration is refused when
  approved capacity is full. Pending requests may outnumber available places.
- All signed-in active roles may register, matching the permission matrix.
  Owners/admins review PENDING registrations. Only participants cancel their
  own PENDING/APPROVED registrations, strictly before startDate, even if closed.
- CANCELLED/REJECTED are terminal. One registration per user/activity for its
  lifetime; re-registration is intentionally unavailable in this sprint.
- Registration and review require PUBLISHED status and a future startDate.
- PostgreSQL row locks serialize every write to an existing activity, including
  approval, cancellation and deletion. Counts after the lock use READ COMMITTED.
  Status updates and audit rows commit together. The unique constraint also
  protects duplicate registrations at the database boundary.
- Server requests re-read current user role/account status instead of trusting
  JWT role claims. Mutation requests require a matching Origin header.
- Notification schema is included for ERD compatibility; delivery/UI is outside
  this backend issue.

## API contract for frontend integration

All routes live under src/app/api and run on Node.js. Auth uses the existing
NextAuth session cookie; fetch from the same origin. Do not send role, userId or
organizerId in request bodies. Lists are paginated, 50 rows/page, starting at page=1.

| Method | Endpoint | Body / behavior |
| --- | --- | --- |
| GET | /api/categories | Available category IDs |
| GET | /api/activities?page=1 | Public PUBLISHED activities only |
| GET | /api/activities?scope=managed&page=1 | Own activities; all for admin |
| POST | /api/activities | Activity fields; optional DRAFT/PENDING status |
| GET | /api/activities/:id | Public or authorized owner/admin |
| PATCH | /api/activities/:id | Partial editable activity fields |
| DELETE | /api/activities/:id | Delete an eligible activity |
| PATCH | /api/activities/:id/status | {status, reason?} |
| POST | /api/activities/:id/registrations | No body; register current user |
| GET | /api/activities/:id/registrations?page=1 | Owner/admin participants + history |
| GET | /api/registrations?page=1 | Current user's registrations + history |
| PATCH | /api/registrations/:id/status | {status: APPROVED/REJECTED/CANCELLED, reason?} |

Activity fields: title, description, location, startDate, endDate, maxParticipants,
categoryId. Dates are ISO 8601 timestamps with UTC Z or explicit timezone offsets.
Dates must be future-starting and endDate > startDate; capacity is an integer
1–100000. Unknown body fields are rejected.

Responses: {data: object/array}. Public activity reads include category and
_count.registrations (APPROVED only); participant identities are never exposed
through public reads. Private registration responses select only id/name/email
from User, never password. Errors: {error: {code, message, issues?}}.
HTTP 401 unauthenticated, 403 forbidden, 404 missing/inaccessible activity,
409 workflow/capacity/duplicate conflict, 422 validation, 400 malformed JSON.
Frontend should show the server error and reload status/count after 409.

Example same-origin call:

```ts
const response = await fetch("/api/activities", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Community cleanup", description: "Clean the local park",
    location: "Ho Chi Minh City", categoryId,
    startDate: "2026-11-01T08:00:00+07:00",
    endDate: "2026-11-01T12:00:00+07:00", maxParticipants: 20,
  }),
});
const result = await response.json();
```

The /activities screen now connects these endpoints to the existing NextAuth
session and current database role. It adapts the emerald/slate visual direction
of Tài's prototype into main's src/app structure, with no localStorage roles or
mock participants. The original feature/activity-registration-ui branch remains
available and is not merged wholesale because its root app and Prisma setup differ.
The screen supports public discovery, personal registrations/history, organizer
CRUD/participant review and admin publication. See week6-qa.md for verification.

## Local verification and demo

1. Copy .env.example to .env and set DATABASE_URL and AUTH_SECRET.
2. npm ci
3. npx prisma migrate deploy
4. Set ALLOW_DEMO_SEED=true on a non-production demo DB; npm run db:seed.
5. npm test; npm run lint; npm run build.
6. For database tests, point DATABASE_URL to a dedicated DB ending in _test,
   apply migrations, then npm run test:integration.
7. Start the app with AUTH_SECRET, AUTH_TRUST_HOST=true and the seeded local DB.
   Set WORKFLOW_TEST_BASE_URL=http://localhost:3100 (matching the running port),
   then npm run test:http to verify real cookie sessions, API errors and CRUD.

Seed preserves existing records and adds organizer@test.com, admin@test.com,
volunteer@test.com and three additional volunteer accounts. Newly created demo
accounts use password 123456. It includes all activity/registration states and
audit examples. Re-running does not reset modified records or dates. Use a fresh
demo DB when old example activities have expired. Never seed production.

Integration tests run real PostgreSQL transactions, race duplicate requests and
two approvals for one final place, exercise cancellation/rejection and ownership,
verify audit history, then clean only their uniquely identified fixtures.

Local UI QA is complete. Independent team review and verification against a
migrated preview database remain required before merge.

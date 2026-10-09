# Week 7 — Remaining MVP Business Rules & Acceptance Criteria

This document defines the Sprint 3 business rules for the remaining MVP features and aligns them with the Week 6 core workflow already implemented on `main`.

## 1. Search, Filter and Pagination

### Business rules
- Public discovery only returns activities whose workflow status is `PUBLISHED`.
- Keyword search is case-insensitive and matches `title` and `location`.
- Location filtering is case-insensitive and may be combined with keyword search.
- Workflow status filters are used only in authorized management views:
  - Organizer: own activities.
  - Admin: all activities.
- Public user-facing time labels such as “upcoming” or “ended” are derived from `startDate` / `endDate`; they must not overwrite the persisted workflow status.
- Filters may be combined. The server applies all supplied filters before pagination.
- Pagination is 1-based. Invalid pages return validation errors rather than silently changing the request.
- When no activities match, the API returns an empty list and pagination metadata; the UI shows a clear empty state.
- Sorting is deterministic: nearest `startDate` first, then `createdAt` or `id` as a stable tie-breaker.

### Acceptance criteria
- Search by title returns matching published activities.
- Search by location returns matching published activities.
- Combined keyword + location filters return only records matching both.
- Public discovery never exposes `DRAFT`, `PENDING`, `REJECTED` or `CLOSED` activities.
- Organizer/Admin management filters respect role and ownership.
- Pagination metadata is derived from filtered records and never uses a hard-coded page count.
- Empty result sets are returned successfully with zero items.

## 2. Attendance and Volunteer Hours

### Business rules
- Attendance can be recorded only for a Registration whose status is `APPROVED`.
- Only the activity owner or an Admin may record or edit attendance.
- Attendance result is one of:
  - `ATTENDED`
  - `ABSENT`
- An approved registration has at most one current attendance record.
- `volunteerHours` is recorded only when result = `ATTENDED`.
- `ABSENT` always stores zero volunteer hours.
- Volunteer hours must be a non-negative decimal and cannot exceed the activity duration.
- Editing attendance updates the same attendance record; it must not create duplicate contribution rows.
- Total volunteer hours are computed from current `ATTENDED` attendance records, not incremented blindly, preventing double counting.
- Attendance is not allowed for registrations in `PENDING`, `REJECTED` or `CANCELLED`.
- Attendance must remain auditable through `createdAt` / `updatedAt` and actor information if the implementation stores audit history.

### Acceptance criteria
- APPROVED registration can be marked ATTENDED or ABSENT by the activity owner/Admin.
- Non-approved registration cannot be marked.
- ATTENDED accepts valid hours and contributes exactly once to totals.
- ABSENT contributes zero hours.
- Re-saving the same attendance never duplicates volunteer hours.
- Editing ATTENDED hours replaces the previous value in dashboard/profile totals.
- Unauthorized users receive 401/403 and cannot mutate attendance.

## 3. Dashboard Statistics

### Organizer dashboard
For activities owned by the current Organizer:
- Total Activities = all owned activities.
- Published Activities = owned activities with `PUBLISHED`.
- Total Registrations = registrations across owned activities excluding `CANCELLED` when showing active participation metrics; a separate all-time count may include them if labeled clearly.
- Approved Volunteers = registrations with `APPROVED`.
- Attended Volunteers = attendance records with `ATTENDED`.
- Volunteer Hours = sum of hours on current `ATTENDED` attendance records.

### Admin dashboard
Across the system:
- Total Activities.
- Activity counts by workflow status.
- Total Registrations and counts by registration status.
- Total attended participations.
- Total Volunteer Hours.
- Counts must be calculated from database records, never mock values.

### Data inclusion rules
- Volunteer Hours include only `ATTENDED`.
- `ABSENT`, `PENDING`, `REJECTED`, and `CANCELLED` do not add volunteer hours.
- A registration is counted once in each applicable metric.
- Organizer statistics are ownership-scoped; Admin statistics are system-wide.
- Dashboard endpoints return numeric values directly from the backend.

### Acceptance criteria
- Organizer cannot see another Organizer's private dashboard totals.
- Admin totals include all valid system records.
- Dashboard totals change after approved registration, attendance updates and status changes.
- Volunteer Hours equal the sum of stored ATTENDED hours.
- No dashboard card uses hard-coded or estimated values.

## 4. Notifications

### Trigger rules
Create a notification when:
- Registration changes `PENDING -> APPROVED`.
- Registration changes `PENDING -> REJECTED`.
- Activity changes `PENDING -> PUBLISHED`.
- Activity changes `PENDING -> REJECTED`.

### Recipients
- Registration APPROVED/REJECTED -> registration owner.
- Activity PUBLISHED/REJECTED -> activity Organizer.

### Content
Each notification identifies:
- the relevant Activity;
- the event/status change;
- a short human-readable message.

No password, private notes, or unrelated user data may be included.

### Read state
- New notifications use `isRead = false`.
- The notification owner may mark their own notification as read.
- A user may not modify another user's notification.
- Marking as read is persisted in the database; client-only state is insufficient.

### Acceptance criteria
- Each valid state transition creates the expected notification exactly once.
- Irrelevant transitions do not create duplicate notifications.
- Notification list returns only the signed-in user's notifications.
- Read/unread state survives page refresh.
- Unauthorized notification access is rejected.

## 5. Alignment with Week 6 Core Workflow

These Sprint 3 rules preserve the Week 6 decisions:
- Activity workflow remains `DRAFT -> PENDING -> PUBLISHED/REJECTED`, with `REJECTED -> DRAFT` and `PUBLISHED -> CLOSED`.
- Registration workflow remains `PENDING -> APPROVED/REJECTED/CANCELLED` according to the existing authorization rules.
- Only `APPROVED` registrations consume capacity.
- Attendance does not change Registration status.
- Notifications are side effects of valid workflow changes; they do not replace status history.
- Search/filter functionality does not bypass public visibility or role/ownership permissions.

## 6. API expectations for Technical Lead

Backend implementation for Issue #34 should expose:
- activity search/filter/pagination through the existing activities list API;
- attendance create/update/read endpoints;
- Organizer and Admin dashboard endpoints;
- notification list/read endpoints;
- validation and role checks on every mutation;
- automated tests for happy path, edge cases and unauthorized access.

The exact endpoint paths may follow the existing App Router structure, but responses must use database-backed values and preserve the existing `{ data: ... }` / `{ error: ... }` conventions.

## 7. QA coverage expected for Issue #36

QA can derive test cases for:
- search keyword, location and combined filters;
- no-result and pagination boundary cases;
- unauthorized management filters;
- APPROVED vs non-approved attendance;
- ATTENDED/ABSENT and volunteer-hours edits;
- Organizer vs Admin dashboard scope;
- notification creation, ownership and persistence of read state;
- regression of Week 6 Activity and Registration flows.

## Definition of Done for Issue #30

Issue #30 is ready to close when:
1. This document is reviewed against the Week 6 implementation.
2. Technical Lead confirms the rules are implementable for #34.
3. QA confirms the acceptance criteria are sufficient to write #36 test cases.
4. The document is merged into `main`.

# Next.js Project Structure

## 1. Overview

Dự án Volunteer Community Platform sử dụng Next.js và được tổ chức theo hướng tách rõ:

- Giao diện người dùng
- Trang quản trị
- API / Server logic
- Component dùng chung
- Database
- Authentication
- Utilities

Mục tiêu là giúp source code dễ phát triển, dễ bảo trì và thuận tiện khi chia công việc cho các thành viên.

---

## 2. Proposed Project Structure

```text
volunteer-community-platform/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   ├── activities/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   ├── profile/
│   │   └── page.tsx
│   │
│   ├── my-registrations/
│   │   └── page.tsx
│   │
│   ├── organizer/
│   │   ├── activities/
│   │   └── registrations/
│   │
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── activities/
│   │   ├── categories/
│   │   └── registrations/
│   │
│   └── api/
│       ├── auth/
│       ├── users/
│       ├── activities/
│       ├── registrations/
│       ├── categories/
│       └── notifications/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── activity/
│   ├── auth/
│   └── admin/
│
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── permissions.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── images/
│   └── icons/
│
├── types/
│   ├── user.ts
│   ├── activity.ts
│   └── registration.ts
│
├── utils/
│   ├── validation.ts
│   ├── formatDate.ts
│   └── constants.ts
│
├── middleware.ts
├── package.json
└── README.md

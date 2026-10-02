# Database Design

## 1. Main Entities

Hệ thống Volunteer Community Platform sử dụng các entity chính sau:

### User
Lưu thông tin người dùng của hệ thống.

Thông tin dự kiến:
- id
- fullName
- email
- password
- phone
- avatar
- role
- status
- createdAt
- updatedAt

Role của User:
- Guest
- Volunteer
- Organizer
- Admin

---

### Activity
Lưu thông tin các hoạt động tình nguyện.

Thông tin dự kiến:
- id
- title
- description
- location
- startDate
- endDate
- maxParticipants
- status
- categoryId
- organizerId
- createdAt
- updatedAt

---

### Registration
Lưu thông tin đăng ký tham gia hoạt động của Volunteer.

Thông tin dự kiến:
- id
- userId
- activityId
- status
- registeredAt

Trạng thái dự kiến:
- Pending
- Approved
- Rejected
- Cancelled

---

### Category
Phân loại các hoạt động tình nguyện.

Thông tin dự kiến:
- id
- name
- description
- createdAt

Ví dụ:
- Environment
- Education
- Community Support
- Charity
- Healthcare

---

### Notification
Lưu thông báo gửi đến người dùng.

Thông tin dự kiến:
- id
- userId
- title
- message
- isRead
- createdAt

## 2. ERD

Sơ đồ ERD ban đầu của hệ thống:

```mermaid
erDiagram

    USER {
        int id PK
        string fullName
        string email
        string password
        string phone
        string avatar
        string role
        string status
        datetime createdAt
        datetime updatedAt
    }

    CATEGORY {
        int id PK
        string name
        string description
        datetime createdAt
    }

    ACTIVITY {
        int id PK
        string title
        string description
        string location
        datetime startDate
        datetime endDate
        int maxParticipants
        string status
        int categoryId FK
        int organizerId FK
        datetime createdAt
        datetime updatedAt
    }

    REGISTRATION {
        int id PK
        int userId FK
        int activityId FK
        string status
        datetime registeredAt
    }

    NOTIFICATION {
        int id PK
        int userId FK
        string title
        string message
        boolean isRead
        datetime createdAt
    }

    USER ||--o{ ACTIVITY : organizes
    USER ||--o{ REGISTRATION : registers
    ACTIVITY ||--o{ REGISTRATION : has
    CATEGORY ||--o{ ACTIVITY : contains
    USER ||--o{ NOTIFICATION : receives

## 4. Relationships Between Tables

Hệ thống sử dụng các mối quan hệ chính sau:

### 4.1 User - Activity

Quan hệ:

```text
User 1 ----- N Activity
Activity.organizerId -> User.id

User 1 ----- N Registration
Registration.userId -> User.id

Activity 1 ----- N Registration
Registration.activityId -> Activity.id

User
  |
  | 1
  |
  | N
Registration
  |
  | N
  |
  | 1
Activity



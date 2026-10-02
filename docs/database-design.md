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

Các bảng trong hệ thống Volunteer Community Platform có những mối quan hệ chính như sau.

### 4.1 User - Activity

Quan hệ:

```text
User 1 ----- N Activity
```

Một Organizer có thể tạo và quản lý nhiều Activity.

Khóa liên kết:

```text
Activity.organizerId -> User.id
```

Trong đó:

- `User.id`: Primary Key của bảng User.
- `Activity.organizerId`: Foreign Key tham chiếu đến User.

---

### 4.2 User - Registration

Quan hệ:

```text
User 1 ----- N Registration
```

Một Volunteer có thể đăng ký nhiều hoạt động khác nhau.

Khóa liên kết:

```text
Registration.userId -> User.id
```

Trong đó:

- `User.id`: Primary Key.
- `Registration.userId`: Foreign Key.

---

### 4.3 Activity - Registration

Quan hệ:

```text
Activity 1 ----- N Registration
```

Một Activity có thể có nhiều người đăng ký tham gia.

Khóa liên kết:

```text
Registration.activityId -> Activity.id
```

Bảng `Registration` đóng vai trò là bảng trung gian giữa `User` và `Activity`.

Quan hệ tổng quát:

```text
User 1 ----- N Registration N ----- 1 Activity
```

Vì vậy, xét về nghiệp vụ:

```text
User N ----- N Activity
```

Đây là quan hệ Many-to-Many và được xử lý thông qua bảng `Registration`.

---

### 4.4 Category - Activity

Quan hệ:

```text
Category 1 ----- N Activity
```

Một Category có thể chứa nhiều Activity.

Ví dụ:

```text
Environment
|
|-- Trồng cây xanh
|-- Dọn rác bãi biển
|-- Bảo vệ môi trường
```

Khóa liên kết:

```text
Activity.categoryId -> Category.id
```

Trong đó:

- `Category.id`: Primary Key.
- `Activity.categoryId`: Foreign Key.

---

### 4.5 User - Notification

Quan hệ:

```text
User 1 ----- N Notification
```

Một User có thể nhận nhiều Notification.

Khóa liên kết:

```text
Notification.userId -> User.id
```

Ví dụ các thông báo:

- Đăng ký hoạt động thành công.
- Đăng ký đã được duyệt.
- Đăng ký bị từ chối.
- Hoạt động sắp bắt đầu.

---

## 5. Foreign Keys

Các Foreign Key chính của hệ thống:

| Table | Foreign Key | References |
|---|---|---|
| Activity | organizerId | User.id |
| Activity | categoryId | Category.id |
| Registration | userId | User.id |
| Registration | activityId | Activity.id |
| Notification | userId | User.id |

---

## 6. Relationship Summary

Tóm tắt quan hệ giữa các bảng:

```text
User       1 ----- N Activity
User       1 ----- N Registration
Activity   1 ----- N Registration
Category   1 ----- N Activity
User       1 ----- N Notification
```

Ký hiệu:

- `1`: One
- `N`: Many
- `PK`: Primary Key
- `FK`: Foreign Key



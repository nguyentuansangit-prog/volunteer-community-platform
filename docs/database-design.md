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

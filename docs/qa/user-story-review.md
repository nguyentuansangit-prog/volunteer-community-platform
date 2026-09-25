# QA Review - User Story & Acceptance Criteria

## 1. Mục đích

Review User Story và Acceptance Criteria của Product/Business nhằm xác định:

- User Story có đầy đủ Actor, Action và Goal hay không.
- Acceptance Criteria có rõ ràng và có thể kiểm thử hay không.
- Xác định các trường hợp Edge Case.
- Xác định các trường hợp Unauthorized.
- Ghi nhận các điểm cần Product/Business làm rõ trước khi viết Test Case.

---

## 2. Review User Story

### US-01 - Tìm kiếm & Xem hoạt động công khai

**Review:**

- Actor: Guest / Volunteer - Đạt.
- Chức năng tìm kiếm và lọc - Đạt.
- Hiển thị thông tin hoạt động - Đạt.
- Acceptance Criteria có thể kiểm thử - Đạt.
- Cần làm rõ cách xác định trạng thái hoạt động.
- Cần xác định nội dung nào Guest được xem khi chưa đăng nhập.
- Cần xác định hành vi khi tìm kiếm không có kết quả.

---

### US-02 - Đăng ký tham gia chiến dịch

**Review:**

- Actor: Volunteer - Đạt.
- Yêu cầu đăng nhập - Đạt.
- Trạng thái ban đầu PENDING - Đạt.
- Kiểm tra hoạt động đủ số lượng - Đạt.
- Kiểm tra hoạt động quá hạn - Đạt.
- Hủy đăng ký khi PENDING - Đạt.
- Chưa quy định trường hợp Volunteer đăng ký trùng.
- Chưa quy định trường hợp nhiều Volunteer đăng ký cùng lúc khi số lượng còn ít.
- Chưa quy định rõ hành vi khi Guest cố gắng đăng ký.

---

### US-03 - Tạo và Quản lý hoạt động

**Review:**

- Actor: Organization - Đạt.
- Các trường bắt buộc đã được xác định - Đạt.
- Trạng thái sau khi tạo là PENDING_APPROVAL - Đạt.
- Cho phép chỉnh sửa trước khi hoạt động diễn ra - Đạt.
- Chưa có validation chi tiết cho số lượng người tham gia.
- Chưa có validation chi tiết cho ngày bắt đầu, ngày kết thúc và hạn đăng ký.
- Chưa quy định User/Volunteer có được phép truy cập chức năng tạo hoạt động hay không.
- Chưa quy định việc chỉnh sửa sau khi hoạt động đã được Admin duyệt.

---

### US-04 - Duyệt đơn đăng ký

**Review:**

- Actor: Organization - Đạt.
- Hiển thị danh sách đơn PENDING - Đạt.
- Cho phép APPROVED hoặc REJECTED - Đạt.
- Có thông báo khi trạng thái thay đổi - Đạt.
- Chưa quy định xử lý khi đơn đã APPROVED hoặc REJECTED trước đó.
- Chưa quy định trường hợp số lượng đăng ký vượt quá số lượng cho phép.
- Chưa quy định Organization có được quản lý đơn đăng ký của hoạt động không thuộc quyền sở hữu hay không.

---

### US-05 - Điểm danh & Ghi nhận kết quả

**Review:**

- Actor: Organization - Đạt.
- Chỉ Volunteer đã APPROVED được điểm danh - Đạt.
- Có trạng thái ATTENDED / ABSENT - Đạt.
- Có cập nhật số giờ tình nguyện - Đạt.
- Chưa có validation cho số giờ tình nguyện.
- Chưa quy định việc điểm danh nhiều lần.
- Chưa quy định việc chỉnh sửa attendance sau khi xác nhận.
- Chưa quy định Organization có được điểm danh hoạt động không thuộc quyền quản lý hay không.

---

### US-06 - Phê duyệt hoạt động & Quản trị hệ thống

**Review:**

- Actor: Admin - Đạt.
- Admin xem được danh sách hoạt động chờ duyệt - Đạt.
- Admin có thể duyệt hoạt động - Đạt.
- Hoạt động chuyển sang PUBLISHED - Đạt.
- Hoạt động PUBLISHED được hiển thị công khai - Đạt.
- Chưa có Acceptance Criteria cho trường hợp Admin từ chối hoạt động.
- Chưa quy định trạng thái khi Admin từ chối.
- Chưa quy định thông báo cho Organization sau khi hoạt động được duyệt hoặc từ chối.
- Chưa có Unauthorized Case cho Volunteer/Organization truy cập chức năng Admin.

---

## 3. Các vấn đề cần Product/Business xác nhận

### Q01 - Đăng ký trùng

Volunteer đã có đơn đăng ký PENDING hoặc APPROVED thì có được đăng ký lại cùng một hoạt động không?

### Q02 - Hoạt động hết chỗ

Nếu hoạt động chỉ còn 1 vị trí nhưng có nhiều Volunteer gửi đăng ký gần như cùng lúc thì hệ thống xử lý như thế nào?

### Q03 - Validation ngày tháng

Cần xác định quy tắc giữa:

- Ngày bắt đầu
- Ngày kết thúc
- Hạn đăng ký

Ví dụ: Hạn đăng ký phải nhỏ hơn ngày bắt đầu.

### Q04 - Chỉnh sửa hoạt động

Organization có được chỉnh sửa hoạt động sau khi Admin đã PUBLISHED hay không?

### Q05 - Từ chối hoạt động

Admin có quyền từ chối hoạt động không?

Nếu có:

- Trạng thái sau khi từ chối là gì?
- Có bắt buộc nhập lý do từ chối không?
- Organization có nhận được thông báo không?

### Q06 - Điểm danh

Volunteer đã APPROVED nhưng không tham gia thì được cập nhật trạng thái ABSENT như thế nào?

### Q07 - Số giờ tình nguyện

Cần xác định:

- Số giờ tối thiểu.
- Số giờ tối đa.
- Có cho phép số giờ bằng 0 hay không.
- Có cho phép số giờ âm hay không.

### Q08 - Phân quyền

Cần xác định rõ quyền của:

- Guest
- Volunteer
- Organization
- Admin

đối với từng chức năng của hệ thống.

---

## 4. Kết luận QA

User Story và Acceptance Criteria hiện tại đã cung cấp cơ sở để xây dựng Test Plan và Test Case.

Tuy nhiên, một số quy tắc nghiệp vụ về đăng ký trùng, giới hạn số lượng, validation ngày tháng, phân quyền và xử lý từ chối hoạt động cần được Product/Business xác nhận trước khi thực hiện kiểm thử chi tiết.

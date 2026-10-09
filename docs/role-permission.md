# Role & Permission — candidate tuần 8
09/10/2026 · PR #52 SHA `b59a335a3a400b0deb8a27677966fae78647d8eb` · chờ review #47/#48/#50.
Không khẳng định các quyền này đã triển khai main/production. Role là nhóm quyền riêng; Organizer không kế thừa quyền đăng ký của Volunteer. Sửa mâu thuẫn bảng cũ theo US-03 AC3.1 và #43.

| Chức năng | Guest | Volunteer | Organizer | Admin |
|---|---|---|---|---|
| Xem/tìm public | Có | Có | Có | Có |
| Xem private activity | Không | Không | Của mình | Toàn cục |
| Tự tạo tài khoản | Volunteer/Organizer | Không áp dụng | Không áp dụng | Không tự tạo Admin |
| Tạo đơn tham gia | Không | Đủ điều kiện | Không | Không |
| Xem đơn cá nhân | Không | Của mình | Của mình nếu có dữ liệu cũ | Của mình nếu có dữ liệu cũ |
| Hủy đơn | Không | Chính chủ, trước bắt đầu | Không hủy thay | Không hủy thay |
| Tạo activity | Không | Không | Có | Có |
| Sửa activity | Không | Không | Của mình DRAFT/REJECTED | Mọi activity DRAFT/REJECTED |
| Gửi duyệt/đóng | Không | Không | Của mình, đúng transition | Mọi activity, đúng transition |
| Duyệt activity | Không | Không | Không | PENDING → PUBLISHED/REJECTED |
| Xóa activity | Không | Không | Của mình, đủ điều kiện | Mọi activity, đủ điều kiện |
| Xem/duyệt đơn | Không | Không | Activity của mình | Toàn cục |
| Xem/sửa attendance | Không | Không | Của mình, APPROVED | Toàn cục, APPROVED |
| Dashboard | Không | Không | Sở hữu | Toàn cục |
| Notification/profile | Không | Chính mình | Chính mình | Chính mình |

Hủy chỉ PENDING/APPROVED trước bắt đầu. Xóa chỉ DRAFT/PENDING/REJECTED chưa có registration. Thiếu session trả 401 ở API bảo vệ; thiếu quyền 403; private activity có thể 404 tránh tiết lộ tồn tại. Kiểm tra API/DB, không chỉ ẩn nút.

Chưa triển khai: sửa profile; CRUD user/khóa tài khoản/đổi role; duyệt tổ chức; CRUD category; gửi notification thủ công. API đọc category không chứng minh có quản lý category. Dữ liệu đơn sai quyền từ phiên bản trước cần Trân/Kiên đánh giá riêng, không tự xóa.
Nguồn: src/lib/{workflow-rules,workflow,week7}.ts và API routes tại SHA trên. [Business Rules](week7-business-rules.md).

# Git Workflow

## 1. Branch chính

- `main`: phiên bản ổn định / production.

Không push code chức năng trực tiếp lên `main`.

## 2. Quy tắc đặt tên branch

### Chức năng mới
feature/<ten-chuc-nang>

Ví dụ:
- feature/login
- feature/activity-management
- feature/volunteer-registration

### Sửa lỗi
fix/<ten-loi>

Ví dụ:
- fix/permission-check
- fix/mobile-layout

### Tài liệu
docs/<ten-tai-lieu>

Ví dụ:
- docs/user-guide
- docs/database-design

## 3. Quy tắc commit

- `feat:` thêm chức năng mới
- `fix:` sửa lỗi
- `refactor:` cải tiến cấu trúc code
- `test:` thêm hoặc sửa kiểm thử
- `docs:` cập nhật tài liệu
- `style:` thay đổi giao diện hoặc định dạng
- `chore:` cấu hình hoặc bảo trì

Ví dụ:

git commit -m "feat: add volunteer registration"
git commit -m "fix: prevent unauthorized activity update"
git commit -m "docs: add project requirements"

## 4. Quy trình làm việc

Issue
→ Ready
→ Tạo branch
→ In Progress
→ Commit
→ Push
→ Pull Request
→ In Review
→ Testing
→ Done

Nếu không thể tiếp tục:
→ Blocked

## 5. Quy định Pull Request

- Mỗi chức năng phải có Issue.
- Pull Request phải liên kết với Issue.
- Không merge khi chưa review.
- Chạy `npm run lint`.
- Chạy `npm run build`.
- QA kiểm thử trước khi merge.

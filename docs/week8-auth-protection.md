# Tuần 8 — bảo vệ đăng nhập và đăng ký

Code đã kiểm thử: `0648a177abd1fee5daed08d52096c8a4daea868a`, 10/10/2026, nhánh release/week8-completion / PR #55. Bổ sung do trợ lý thực hiện theo yêu cầu chủ dự án.

## Chính sách của ứng viên

| Thao tác | Tổng trên ứng dụng | Theo email chuẩn hóa |
|---|---|---|
| Đăng nhập | 200 lần / 60 giây | 20 lần / 15 phút |
| Đăng ký | 60 lần / 60 giây | 10 lần / 15 phút, với payload hợp lệ |

Đếm cả thành công và thất bại. Cửa sổ bắt đầu từ lần thử đầu tiên; tự reset khi hết hạn, không đổi trạng thái User thành BLOCKED và không tự mở lại sớm khi đăng nhập thành công. Đăng ký vượt quota trả 429, Retry-After và message tiếng Việt. Đăng nhập dùng lỗi CredentialsSignin/code=rate_limited để giao diện thông báo chờ tối đa 15 phút; không tiết lộ email có tồn tại. Việc kiểm tra login nằm trong authorize, áp dụng cả HTTP callback và server-action signIn.

Counter PostgreSQL dùng upsert nguyên tử, chung cho các instance; không dùng Map trong RAM. Bảng AuthRateLimit giữ HMAC-SHA256 với AUTH_SECRET, attempts và expiresAt; không lưu email, IP, mật khẩu hoặc token. Mỗi yêu cầu dọn tối đa 100 entries hết hạn qua index. Counter bão hòa ở limit+1. Không tin X-Forwarded-For hoặc các header do client cung cấp. AUTH_SECRET thiếu hoặc DB lỗi thì auth không tiếp tục xử lý mật khẩu; endpoint đăng ký trả lỗi máy chủ, không bỏ qua limiter.

Quota này là baseline MVP cần review theo tải thực tế. Global quota có thể làm người dùng khác phải chờ khi ứng dụng bị flood; account quota có thể bị lợi dụng để làm một email phải chờ. Đây chưa phải lớp chống DDoS/credential stuffing hoàn chỉnh; vẫn cần firewall/monitoring và đánh giá quota trước production. Secret rotation reset các key quota vì digest đổi; kế hoạch rotate phải cân nhắc tác động này.

## Migration và rollback

Migration mới `20261010020000_auth_rate_limits` chỉ thêm bảng/index; tổng cộng 5 migrations. Deploy migration trước khi chuyển traffic sang code mới. Không seed production. Code cũ tương thích với bảng thêm, có thể rollback app và giữ nguyên bảng; không drop bảng trong rollback. Backup/restore QA mới đã thử vào volunteer_week8_security_restore_test, 5 migrations và bảng counter hiện diện.

## Kết quả thực thi

Môi trường Node24 / PostgreSQL18, DB volunteer_week8_completion_test, production local http://localhost:3029.

- Prisma generate/validate/migrate deploy: PASS, 5 migrations.
- Toàn bộ integration: 4 nhóm PASS, 0 fail/skip. Test mới gửi 20 lần đồng thời với quota5: đúng5 được phép; chuẩn hóa email dùng chung quota; scopes riêng; entry hết hạn reset và cho thử lại; không lưu email rõ.
- Toàn bộ HTTP: 6 nhóm PASS, 0 fail/skip. Test mới tạo đúng1 tài khoản, 9 duplicate trả409, lần11 trả429/Retry-After; 20 login sai rồi password đúng vẫn bị quota chặn/code=rate_limited; không có session và tài khoản vẫn ACTIVE.
- ESLint phạm vi mã nguồn và build/TypeScript: PASS; sau sửa message cuối đã lint lại file thay đổi và build lại.
- Backup/restore mới: PASS, 5 migrations, bảng counter có dữ liệu và không restore đè DB nguồn.

Ảnh UI trước ở hồ sơ tích hợp thuộc code3ac8896, chưa là bằng chứng browser cho message rate limit mới. Cloud Preview vẫn chờ giải quyết Neon branch limit; không suy từ local PASS thành production sign-off.

# Tuần 8 — Bàn giao Product/Business của Phúc
09/10/2026 · #47/#46/#51 · Draft, **No-go đề xuất** cho release đến khi đủ gate.

## Phạm vi bàn giao
PR tài liệu dựa main 91687cd70a282fbd383f68027b0f6c807656844b, mô tả candidate #52 b59a335a3a400b0deb8a27677966fae78647d8eb. Không tự merge, deploy, đổi DB hay chốt candidate. Khi candidate đổi, Phúc/Trân/Kiên phải đối chiếu lại rules/guide và retest; không chuyển PASS theo tên branch.

## Checklist chuyển giao
| Đầu ra | Evidence/đầu mối | Trạng thái |
|---|---|---|
| Repository/release commit | Repo; #51 Sang | Repo có; release SHA chưa chốt |
| Project/backlog | #46 và Project #2 | Issue #46 báo đã thiết lập Sprint 3/4; lần này chưa xác minh board độc lập |
| Production URL | #51 | Chưa xác minh hoạt động/đúng SHA |
| Tài khoản demo từng role | Trân/Sang, kênh riêng | Chờ cấp và kiểm tra; không lưu secret |
| README/cài đặt | README main; README ứng viên #52 | Có hướng dẫn trong #52; chờ xác minh setup theo release |
| ERD/Data Dictionary/API | docs/database-design.md, docs/core-workflow-backend.md; #48 | Có tài liệu cũ; Trân xác nhận đủ và khớp candidate |
| Testcases/bugs/results | BW01–12; tests trong #52; #38/#43/#50 | Ma trận có; báo cáo local từ #52 không thay Preview QA |
| Hướng dẫn sử dụng/vận hành | week8-user-guide.md; handover kỹ thuật trong #52 | Product guide cập nhật; chờ review/UAT, kỹ thuật do Trân |
| Phản hồi người dùng | week8-user-feedback.md; Phúc | Chưa thu thập có evidence; chỉ QA reports |
| Slides/video/demo | week8-uat-demo.md; Phúc/Sang | Kịch bản/dàn ý có; chưa diễn tập/slide/video |
| Đóng góp | week8-phuc-contribution.md; #46 | Có bản truy vết; cần Phúc xác nhận vai trò thực tế |

## Gate và trách nhiệm
1. Sang chốt candidate/PR và phương án PR chồng lấn #40/#45, #37/#39/#41/#42/#44/#52; review chính thức trước merge.
2. Phúc chốt khác biệt/scope và AC; Trân xác nhận contract, RBAC/security/dependencies, migrations/backup/restore/rollback; Tài xác nhận UI.
3. Kiên chạy regression đúng SHA trên DB QA, retest #38/#43, lưu evidence. Phúc thực hiện UAT/thu thập feedback thực, review guide cùng Kiên.
4. Sang lưu go/no-go, owner, ngày, SHA, blocker và rủi ro được chấp nhận. Release chỉ sau gate; production smoke và vận hành thuộc #51 theo quyết định nhóm.

Blocker hiện có: Preview #52 lỗi Resource provisioning failed theo [comment](https://github.com/nguyentuansangit-prog/volunteer-community-platform/pull/52#issuecomment-6076007272); chưa UAT/retest candidate/sign-off; security findings trong #52 cần #48 xử lý; các khác biệt business còn chờ quyết định. Không xem Vercel success ở #44 là functional QA của #52.

## Biên bản xác nhận cần hoàn thành
| Hạng mục | Người ký | Ngày / evidence / quyết định |
|---|---|---|
| Rules và scope/gap | Phúc + Sang | Chờ |
| Contract/security/migration | Trân | Chờ |
| UI/guide | Tài + Phúc | Chờ |
| QA/UAT | Kiên + Phúc | Chờ |
| Release/bàn giao | Sang | Chờ |

Không ký thay thành viên. Mật khẩu/env/token và thông tin người thử gửi kênh riêng. Tài liệu vận hành đầy đủ trong #52 do Technical Lead xác minh; hồ sơ này không tuyên bố rollback đã được thử.

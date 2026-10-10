# Tuần 8 — Phản hồi người dùng và product review
Phúc · Product/Business · 09/10/2026 · #47/#50.

## Trạng thái
**Chưa có phản hồi người dùng ngoài nhóm có bằng chứng trong các nguồn đã kiểm tra.** Bản cũ chỉ có bảng trống; comments #47 trống. Không có số người tham gia, mức hài lòng hoặc trích dẫn để báo cáo. Không kết luận rằng nguồn khác không có phản hồi.

Nguồn đã đọc: ba tài liệu tuần 8 main `91687cd70a282fbd383f68027b0f6c807656844b`, #38/#43/#47 và comments, PR #40/#45/#52. Hội thoại tham chiếu trả mã content-reference cho câu trả lời cũ, không đủ bằng chứng UAT.

## Báo cáo QA có thật — không tính thành phản hồi người dùng
| Nguồn | Người/ngày trong nguồn | Phát hiện | Giới hạn và bước tiếp |
|---|---|---|---|
| [#38](https://github.com/nguyentuansangit-prog/volunteer-community-platform/issues/38) | Kiên, 04/10/2026 | Thiếu UI register trên main; REG-01–13 bị chặn | Có URL/branch, chưa SHA deployment; candidate có UI, Tài/Kiên cần retest. Đề xuất High |
| [#43](https://github.com/nguyentuansangit-prog/volunteer-community-platform/issues/43) | Kiên, 04/10/2026 | Organizer đăng ký và còn đơn sau F5 | Edge/Windows/ROLE-12/URL; loại môi trường/SHA chưa xác nhận. Issue ghi ảnh nhưng lần này chưa xác minh ảnh độc lập. Major theo nguồn; đề xuất High |
| [Comment sửa #43](https://github.com/nguyentuansangit-prog/volunteer-community-platform/issues/43#issuecomment-6075971174) | Tài khoản Sang, 09/10/2026 | #52 bổ sung role guard | Báo cáo local 14 unit + 2 integration + 5 HTTP; không phải UAT của Phúc trong lần này. Chờ Preview/API/DB/UI retest |

## Thu thập thực tế
Sau khi có URL QA/SHA/DB riêng, mời người thử Guest/Volunteer/Organizer; Admin dùng tài khoản demo cấp riêng. Chạy [UAT](week8-uat-demo.md), ghi số người thực tế. Hỏi bước nào khó hiểu, kết quả có đúng kỳ vọng và cần cải thiện gì. Chỉ lưu ý kiến khi người thử đồng ý; dùng mã ẩn danh.

| ID | Người/role/ngày | URL + SHA | Nhiệm vụ | Ý kiến và nguồn | Mức độ | Issue/owner/quyết định/retest |
|---|---|---|---|---|---|---|
| Chưa có dữ liệu | — | — | — | — | — | Chờ thu thập |

Mỗi ý kiến ghi rõ nguyên văn hay diễn giải, bước tái hiện và link ảnh/ghi chú đã che dữ liệu. Phúc tổng hợp; Kiên xác minh bug; Sang chốt ưu tiên.
Critical: chặn luồng chính/mất dữ liệu nghiêm trọng. High: sai quyền/nghiệp vụ quan trọng. Medium: trở ngại có cách xử lý tạm. Low: cải thiện nhỏ. Ưu tiên này là đề xuất, cần nhóm xác nhận.

Hoàn tất khi có bản ghi thực, bằng chứng đúng phiên bản, owner/quyết định cho Critical/High và retest. Chưa thu thập thì giữ nguyên trạng thái, không ghi hài lòng hoặc UAT pass.

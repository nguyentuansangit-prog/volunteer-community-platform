# Tuần 8 — Báo cáo đóng góp Product/Business (Phúc)
09/10/2026 · chuẩn bị Sprint 4 (12–18/10/2026) · #47.

## Attribution
Đợt này Work hỗ trợ biên soạn/review tĩnh theo yêu cầu người dùng. Phúc là owner Product/Business; cần xác nhận nội dung, thực hiện UAT/feedback/demo và phối hợp sign-off. Không quy toàn bộ code, test hay thao tác GitHub của tài khoản Sang thành đóng góp cá nhân Phúc; không ghi số giờ/ngày công giả định.

## Sản phẩm tài liệu đã thực hiện trong đợt Work
| Công việc | Đầu ra | Bằng chứng/phạm vi |
|---|---|---|
| Audit repo/branches/PR/issues | week8-business-workflow-review.md | Main 91687cd; rules #40/#45; candidate #52 b59a335; #38/#43/#47–51; đọc remote branches và diff |
| Hợp nhất rules đề xuất | week7-business-rules.md | Giữ khác biệt và trạng thái Draft; chưa thay approval của team |
| Đồng bộ yêu cầu/quyền | business-requirements.md, role-permission.md | Addendum giữ US gốc, sửa quyền đăng ký sai và ghi gap |
| Hoàn thiện hướng dẫn 4 nhóm | week8-user-guide.md | Có Organizer, paths và giới hạn theo code candidate |
| Ma trận AC/UAT | week8-business-workflow-review.md, week8-uat-demo.md | BW01–12, mẫu evidence; chưa thực thi |
| Tổng hợp nguồn phản hồi | week8-user-feedback.md | QA #38/#43 có nguồn; ngoài nhóm chưa thu thập |
| Demo/release handoff | week8-uat-demo.md, week8-product-handoff.md | Kịch bản/dàn ý, 11 đầu ra, owner/gate/chờ xác nhận |

Truy vết thay đổi: `git log`/diff của branch `docs/phuc-week8-product-handoff` và PR tạo từ branch này. Không đặt SHA commit chứa báo cáo vào chính file để tránh vòng tự tham chiếu; PR/commit history là nguồn tra cứu.

## Tài liệu trước đợt Work
Main có fddf8f1 (feedback), 7d64ddd/9f46366 (workflow review/kết quả), 91687cd (user guide), commit author nguyentuansangit-prog. File ghi owner Phúc; Git author không đủ chứng minh người trực tiếp viết. #45 ghi nhiệm vụ Phúc, head 3fe592b; #40 head bf7806d. Phúc cần xác nhận phần đã tự thực hiện/review; không cộng trùng hai PR cùng deliverable.

## Kiểm tra và giới hạn
Đã đối chiếu code tĩnh tại SHA #52, nội dung rules #40/#45, issue/comments và các tài liệu tuần 8. Kiểm tra diff/Markdown links trước commit được báo trong PR. Không thực thi app/DB/UAT/browser regression trong đợt tài liệu; kết quả test #52 thuộc báo cáo nguồn, không ghi là Phúc đã chạy. Preview đang blocked theo nguồn #52.

## Còn cần Phúc/nhóm hoàn tất
- Phúc xác nhận rules nguồn chung, các thay đổi scope và attribution; Trân/Kiên review AC, Tài review guide.
- Sang/Trân cấp candidate + QA URL/SHA/DB; Kiên retest #38/#43 và regression.
- Phúc thu thập feedback có bằng chứng, chạy UAT cùng Kiên, bổ sung ngày/người/result.
- Phúc/Sang diễn tập, tạo slide/video, lưu URL và ngày demo thực tế.
- Nhóm ký handoff/release theo #51; #47 giữ mở tới đủ review và UAT.

Không tuyên bố tuần 8 hoàn tất chỉ vì có tài liệu. Phần chuẩn bị tài liệu có thể review ngay; nghiệm thu và dữ liệu người dùng còn phụ thuộc nguồn thực tế.

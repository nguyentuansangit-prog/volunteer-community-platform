# Week 5 — Authentication & RBAC Test Cases

## 1. Thông tin chung

- Dự án: Volunteer Community Platform.
- Nhóm: 1 — Kyanon Internship 2026.
- Người phụ trách: Nguyễn Trung Kiên — QA/Documentation.
- Issue công việc: #12.
- Tài liệu yêu cầu: auth-and-roles-requirements.md.
- Nhánh lưu tài liệu: docs/week5-authentication-qa.
- Ngày kiểm thử đợt 1: 04/10/2026.
- Môi trường đã kiểm thử: Production trên Vercel.
- URL: https://volunteer-community-platform.vercel.app
- Branch/Commit của bản Production: Chưa xác minh.
- Trình duyệt/Thiết bị: Microsoft Edge trên máy tính Windows; chưa ghi nhận phiên bản cụ thể.
- Vercel Preview: Blocked — đang chờ chủ dự án cấp quyền truy cập.

Lưu ý: Kết quả trên Production không thay thế kiểm thử Vercel Preview. Không gán kết quả Production cho commit của nhánh tài liệu QA.

## 2. Phạm vi kiểm thử

- Đăng ký tài khoản Volunteer và Organizer.
- Validation form đăng ký và đăng nhập.
- Đăng nhập và điều hướng theo Role.
- Đăng xuất và quản lý phiên.
- Phân quyền và truy cập trái phép.
- Giao diện Authentication trên máy tính và điện thoại.
- Kiểm thử trên Vercel Preview khi có quyền truy cập.

Cập nhật hồ sơ và đổi mật khẩu không thuộc phạm vi Issue #12, trừ khi nhóm bổ sung yêu cầu.

## 3. Quy ước trạng thái

| Trạng thái | Ý nghĩa |
| --- | --- |
| Pass | Đã thực hiện đủ bước và kết quả phù hợp yêu cầu của case. |
| Fail | Kết quả thực tế khác yêu cầu. |
| Blocked | Không thể thực hiện do thiếu chức năng, dữ liệu hoặc quyền truy cập. |
| Not Run | Chưa thực hiện. |
| In Progress | Đã thực hiện một phần, còn bước hoặc tiêu chí chưa xác minh. |

Mỗi kết quả cần ghi đúng môi trường, ngày kiểm thử và bằng chứng thực tế. Không đánh dấu Pass chỉ dựa trên việc đọc code.

## 4. Điều kiện và dữ liệu kiểm thử

### 4.1. Điều kiện

- Website hoạt động và truy cập được.
- Có tài khoản kiểm thử cho VOLUNTEER, ORGANIZER và ADMIN.
- Có email chưa tồn tại để kiểm thử đăng ký và đăng nhập.
- Có đường dẫn chức năng riêng tư và API thực tế do Developer xác nhận.
- Có thông tin thời hạn phiên và cơ chế quản lý phiên để kiểm thử Session.
- Có quyền truy cập Vercel Preview.

### 4.2. Dữ liệu

| Dữ liệu | Giá trị / Cách chuẩn bị |
| --- | --- |
| Volunteer đã sử dụng | volunteer@test.com |
| Organizer | Chờ Developer cung cấp tài khoản hợp lệ. |
| Admin | Chờ Developer cung cấp tài khoản hợp lệ. |
| Email đăng ký mới | Dùng email riêng cho từng lần chạy; xác nhận chưa tồn tại. |
| Email chưa tồn tại đã thử | qa.nonexistent.20261004@example.com |
| Email không hợp lệ | kien@ |
| Mật khẩu hợp lệ mẫu | QaTest12 |
| Mật khẩu 7 ký tự | QaTest1 |
| Không có chữ hoa | qatest12 |
| Không có chữ thường | QATEST12 |
| Không có số hoặc ký tự đặc biệt | QaTestAb |
| Có ký tự đặc biệt, không có số | QaTest!@ |
| Mật khẩu sai đã thử | SaiMatKhau!2026 |

Không lưu mật khẩu thật, cookie hoặc token xác thực vào tài liệu hay GitHub Issue.

## 5. Test Cases — Register

Điều kiện chung: Người dùng chưa đăng nhập, truy cập được form đăng ký. Email đăng ký hợp lệ phải chưa tồn tại, trừ case kiểm tra email trùng.

| ID | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| REG-01 | Đăng ký Volunteer hợp lệ | Nhập Họ tên, Email mới, mật khẩu QaTest12 và xác nhận giống nhau; chọn VOLUNTEER; gửi form. | Tạo tài khoản Volunteer được kích hoạt mặc định; thông báo thành công; chuyển đến Đăng nhập. |
| REG-02 | Đăng ký Organizer hợp lệ | Điền đầy đủ dữ liệu hợp lệ; chọn ORGANIZER; gửi form. | Tạo tài khoản Organizer được kích hoạt mặc định; thông báo thành công; chuyển đến Đăng nhập. |
| REG-03 | Thiếu dữ liệu bắt buộc | Lần lượt bỏ trống từng trường Họ tên, Email, Mật khẩu, Xác nhận mật khẩu và Role; gửi form mỗi lần. | Báo lỗi phù hợp tại trường thiếu; không tạo tài khoản. |
| REG-04 | Email không hợp lệ | Nhập email kien@ cùng các trường còn lại hợp lệ; gửi form. | Báo lỗi định dạng email; không tạo tài khoản. |
| REG-05 | Email đã tồn tại | Dùng email của tài khoản đã tồn tại; điền các trường còn lại hợp lệ; gửi form. | Từ chối email trùng; không tạo thêm tài khoản. |
| REG-06 | Mật khẩu dưới 8 ký tự | Nhập QaTest1 và xác nhận giống nhau; gửi form với dữ liệu khác hợp lệ. | Báo lỗi độ dài mật khẩu; không tạo tài khoản. |
| REG-07 | Mật khẩu đúng 8 ký tự | Nhập QaTest12 và xác nhận giống nhau; gửi form với email mới và dữ liệu hợp lệ. | Chấp nhận mật khẩu đạt yêu cầu; đăng ký thành công. |
| REG-08 | Mật khẩu thiếu chữ hoa | Nhập qatest12 và xác nhận giống nhau; gửi form. | Báo lỗi yêu cầu chữ hoa; không tạo tài khoản. |
| REG-09 | Mật khẩu thiếu chữ thường | Nhập QATEST12 và xác nhận giống nhau; gửi form. | Báo lỗi yêu cầu chữ thường; không tạo tài khoản. |
| REG-10 | Mật khẩu thiếu số và ký tự đặc biệt | Nhập QaTestAb và xác nhận giống nhau; gửi form. | Báo lỗi yêu cầu ít nhất một số hoặc ký tự đặc biệt; không tạo tài khoản. |
| REG-11 | Mật khẩu có ký tự đặc biệt, không có số | Nhập QaTest!@ và xác nhận giống nhau; dùng email mới; gửi form. | Chấp nhận mật khẩu vì đạt độ dài, có chữ hoa, chữ thường và ký tự đặc biệt. |
| REG-12 | Xác nhận mật khẩu không khớp | Nhập hai giá trị mật khẩu khác nhau; gửi form. | Báo lỗi xác nhận mật khẩu; không tạo tài khoản. |
| REG-13 | Guest không được tự đăng ký Admin | Kiểm tra lựa chọn Role trên UI; gửi yêu cầu đăng ký với role ADMIN qua endpoint thực tế do Developer xác nhận. | UI chỉ cho chọn VOLUNTEER/ORGANIZER; server từ chối ADMIN; không tạo tài khoản Admin. |

## 6. Test Cases — Login

Điều kiện chung: Người dùng chưa đăng nhập. Các tài khoản hợp lệ được Developer cung cấp hoặc đã tạo thành công.

| ID | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| LOG-01 | Volunteer đăng nhập đúng | Nhập email và mật khẩu Volunteer hợp lệ; gửi form; kiểm tra Role và URL sau đăng nhập. | Đăng nhập thành công; đúng role VOLUNTEER; đến trang khám phá hoạt động hoặc Dashboard cá nhân theo AC2.3. |
| LOG-02 | Organizer đăng nhập đúng | Nhập tài khoản Organizer hợp lệ; gửi form; kiểm tra Role và URL. | Đăng nhập thành công; đúng role ORGANIZER; đến trang quản lý chiến dịch của tổ chức. |
| LOG-03 | Admin đăng nhập đúng | Nhập tài khoản Admin hợp lệ; gửi form; kiểm tra Role và URL. | Đăng nhập thành công; đúng role ADMIN; đến trang quản trị. |
| LOG-04 | Sai mật khẩu | Nhập email tồn tại và mật khẩu sai; gửi form. | Không đăng nhập; hiển thị “Email hoặc mật khẩu không chính xác” theo AC2.4. |
| LOG-05 | Email chưa tồn tại | Nhập email chưa tồn tại và mật khẩu bất kỳ không trống; gửi form. | Không đăng nhập; hiển thị cùng lỗi chung như LOG-04, không tiết lộ email có tồn tại hay không. |
| LOG-06 | Thiếu trường bắt buộc | Thử cả hai trường trống, chỉ email trống và chỉ mật khẩu trống; gửi form mỗi lần. | Báo trường bắt buộc và chặn đăng nhập. |
| LOG-07 | Email không hợp lệ | Nhập kien@ và mật khẩu không trống; gửi form. | Báo lỗi định dạng email; chặn gửi form đăng nhập. |

## 7. Test Cases — Logout

Điều kiện chung: Đã đăng nhập thành công. Thực hiện với từng Role khi có tài khoản phù hợp.

| ID | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| OUT-01 | Đăng xuất thành công | Đăng nhập; bấm Đăng xuất; kiểm tra URL, trạng thái UI và phiên xác thực. Lặp lại với Volunteer, Organizer, Admin. | Kết thúc phiên theo cơ chế hệ thống; về trang chủ công khai theo AC3.2; không còn trạng thái đăng nhập. |
| OUT-02 | Truy cập lại route riêng tư sau đăng xuất | Đăng xuất; nhập trực tiếp một route riêng tư đã xác nhận, ví dụ /admin. | Yêu cầu đăng nhập hoặc chuyển về /login; không hiển thị nội dung riêng tư. |
| OUT-03 | Bấm Back sau đăng xuất | Mở trang riêng tư khi đăng nhập; đăng xuất; bấm Back; kiểm tra nội dung; tải lại và thử thao tác cần xác thực. | Không truy cập được nội dung hoặc thao tác riêng tư sau đăng xuất; không khôi phục phiên từ lịch sử trình duyệt. |

## 8. Test Cases — Session

Điều kiện chung: Developer xác nhận cơ chế phiên, thời hạn phiên và cách kiểm thử phù hợp. Thực hiện trên môi trường kiểm thử được cấp quyền.

| ID | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| SES-01 | Cookie xác thực an toàn | Nếu dùng cookie xác thực, đăng nhập trên HTTPS; kiểm tra thuộc tính cookie bằng DevTools. | Cookie xác thực có HttpOnly và Secure; cấu hình phù hợp cơ chế phiên đã thống nhất. |
| SES-02 | Phiên hết hạn | Đăng nhập; để phiên hết hạn theo cấu hình hoặc dùng thời hạn rút ngắn trên môi trường test; truy cập route riêng tư. | Tự đăng xuất hoặc yêu cầu làm mới phiên; phiên hết hạn không cấp quyền truy cập. |
| SES-03 | Sử dụng lại phiên sau đăng xuất | Trên môi trường test, kiểm tra yêu cầu riêng tư dùng thông tin phiên trước đăng xuất theo hướng dẫn Developer. | Phiên cũ bị từ chối theo AC3.1. Nếu dùng JWT không có cơ chế thu hồi, ghi nhận sai khác và yêu cầu làm rõ AC; không tự đánh dấu Pass. |

Không đưa giá trị cookie/token vào ảnh hoặc báo cáo công khai.

## 9. Test Cases — Role / Permission

Điều kiện chung: Có tài khoản đúng Role, route và API thực tế. Nếu chức năng chưa triển khai thì ghi Blocked, không dùng trang 404 làm bằng chứng phân quyền.

| ID | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| ROLE-01 | Volunteer dùng chức năng được phép | Đăng nhập Volunteer; mở chức năng dành cho Volunteer; thực hiện thao tác phù hợp bằng dữ liệu test. | Truy cập và sử dụng được chức năng Volunteer theo ma trận quyền. |
| ROLE-02 | Organizer dùng chức năng được phép | Đăng nhập Organizer; mở quản lý chiến dịch; thực hiện thao tác phù hợp bằng dữ liệu test. | Truy cập và sử dụng được chức năng Organizer theo ma trận quyền. |
| ROLE-03 | Admin dùng chức năng được phép | Đăng nhập Admin; mở trang quản trị và chức năng kiểm duyệt đã triển khai. | Truy cập và sử dụng được chức năng Admin theo ma trận quyền. |
| ROLE-04 | Volunteer truy cập Admin | Đăng nhập Volunteer; nhập trực tiếp /admin. | Bị từ chối bằng 403 hoặc trang thông báo không có quyền; không thấy nội dung quản trị. |
| ROLE-05 | Organizer truy cập Admin | Đăng nhập Organizer; nhập trực tiếp route Admin. | Bị từ chối; không thấy nội dung quản trị. |
| ROLE-06 | Volunteer truy cập chức năng Organizer | Đăng nhập Volunteer; mở trực tiếp route Organizer đã xác nhận. | Bị từ chối; không sử dụng được chức năng Organizer. |
| ROLE-07 | Guest truy cập route riêng tư | Khi chưa đăng nhập, mở trực tiếp các route riêng tư đã xác nhận. | Yêu cầu đăng nhập; không thấy nội dung riêng tư. |
| ROLE-08 | Guest xem hoạt động công khai | Khi chưa đăng nhập, mở danh sách và chi tiết hoạt động công khai. | Xem được nội dung công khai; không bị bắt đăng nhập chỉ để xem. |
| ROLE-09 | Volunteer gọi API Admin | Đăng nhập Volunteer; gửi yêu cầu đến API Admin thực tế bằng dữ liệu test. | API từ chối quyền truy cập, thường là 403; không trả dữ liệu Admin hoặc thực hiện thao tác. |
| ROLE-10 | Guest gọi API cần xác thực | Khi chưa đăng nhập, gửi yêu cầu đến API riêng tư thực tế. | API từ chối, thường là 401; không trả dữ liệu riêng tư hoặc thực hiện thao tác. |
| ROLE-11 | Admin tạo chiến dịch | Đăng nhập Admin; thử chức năng và API tạo chiến dịch thực tế. | Bị từ chối theo ma trận yêu cầu hiện tại: tạo chiến dịch dành cho Organizer. |
| ROLE-12 | Organizer đăng ký tham gia chiến dịch | Đăng nhập Organizer; thử chức năng và API đăng ký tham gia. | Bị từ chối theo ma trận yêu cầu hiện tại: đăng ký tham gia dành cho Volunteer. |

Nếu Product thay đổi ma trận quyền, cập nhật yêu cầu và test case trước khi đánh giá kết quả.

## 10. Test Cases — UI

| ID | Trường hợp | Các bước thực hiện | Kết quả mong đợi |
| --- | --- | --- | --- |
| UI-01 | Giao diện máy tính | Đặt viewport 1366 × 768; kiểm tra Register/Login và thông báo lỗi. | Nội dung rõ ràng, không chồng lấn hoặc bị cắt; các trường và nút thao tác được. |
| UI-02 | Giao diện điện thoại | Đặt viewport 375 × 667; kiểm tra Register/Login và cuộn trang. | Form dùng được; không tràn ngang; nội dung và nút truy cập được. |
| UI-03 | Sửa dữ liệu sau lỗi | Gửi form với dữ liệu sai; sửa thành hợp lệ; gửi lại. | Validation được đánh giá lại; lỗi cũ không cản thao tác khi dữ liệu đã hợp lệ. |
| UI-04 | Điều hướng Authentication | Kiểm tra các liên kết đăng ký, đăng nhập và nút đăng xuất ở trạng thái phù hợp. | Liên kết hoạt động đúng; trạng thái UI phù hợp trạng thái đăng nhập và yêu cầu nghiệp vụ. |

## 11. Kết quả kiểm thử đợt 1

### 11.1. Môi trường và giới hạn

- Ngày: 04/10/2026.
- Website: https://volunteer-community-platform.vercel.app
- Tài khoản đã sử dụng: volunteer@test.com, role VOLUNTEER.
- Chưa xác minh commit của bản Production.
- Đã kiểm tra code đăng nhập do người kiểm thử sao chép từ nhánh main.
- Chưa kiểm thử Vercel Preview do đang chờ cấp quyền.
- Validation quan sát được là validation giao diện/trình duyệt; chưa xác minh validation phía server.

### 11.2. Bảng kết quả

| Test ID | Trạng thái | Kết quả thực tế / Phần còn thiếu |
| --- | --- | --- |
| REG-01 đến REG-13 | Blocked | Chưa tìm thấy giao diện đăng ký. src/app trên main không có register; login/page.tsx không có form hoặc liên kết đăng ký. Theo dõi #38. |
| LOG-01 | In Progress | Đăng nhập thành công bằng volunteer@test.com; hiển thị Volunteer Test và role VOLUNTEER. Chưa xác minh đầy đủ URL và điều hướng theo AC2.3. |
| LOG-02 | Not Run | Chưa thực hiện với tài khoản Organizer. |
| LOG-03 | Not Run | Chưa thực hiện với tài khoản Admin. |
| LOG-04 | Fail | Sai mật khẩu bị từ chối. Hiển thị “Email hoặc mật khẩu không đúng.”, khác nguyên văn AC2.4 “Email hoặc mật khẩu không chính xác”. Hành vi từ chối đạt; câu thông báo cần xác nhận. |
| LOG-05 | Fail | Email qa.nonexistent.20261004@example.com bị từ chối với cùng thông báo như LOG-04. Không tiết lộ sự tồn tại tài khoản qua câu thông báo; nội dung khác nguyên văn AC2.4. |
| LOG-06 | Pass | Thử cả hai trường trống, email trống và mật khẩu trống. Trình duyệt hiển thị “Vui lòng điền vào ô này.” tại trường bắt buộc và chặn gửi form. |
| LOG-07 | Pass | Email kien@ bị trình duyệt báo thiếu phần sau @ và chặn gửi form. |
| OUT-01 | Fail | Sau thao tác đăng xuất, về /login thay vì trang chủ công khai theo AC3.2. Chưa xác minh toàn bộ việc hủy phiên client/server; chưa lặp lại với Organizer/Admin. |
| OUT-02 | Pass | Sau đăng xuất, truy cập lại /admin bị chuyển về /login; không hiển thị nội dung quản trị. |
| OUT-03 | Not Run | Chưa thực hiện đầy đủ kiểm tra Back, tải lại và thao tác riêng tư. |
| SES-01 | Not Run | Chưa kiểm tra thuộc tính cookie. |
| SES-02 | Not Run | Chưa kiểm tra phiên hết hạn. |
| SES-03 | Not Run | Chưa kiểm tra sử dụng lại phiên sau đăng xuất. |
| ROLE-01 | Not Run | Chưa thực hiện đầy đủ chức năng Volunteer. |
| ROLE-02 | Not Run | Chưa thực hiện chức năng Organizer. |
| ROLE-03 | Not Run | Chưa thực hiện chức năng Admin. |
| ROLE-04 | Pass | Volunteer truy cập /admin thấy “Không có quyền truy cập” và role VOLUNTEER; không thấy nội dung quản trị. Chưa xác minh HTTP status. |
| ROLE-05 | Not Run | Chưa thực hiện. |
| ROLE-06 | Not Run | Chưa thực hiện. |
| ROLE-07 | Not Run | Chưa chạy riêng đầy đủ các route với Guest; OUT-02 mới xác minh /admin sau đăng xuất. |
| ROLE-08 | In Progress | Đã quan sát danh sách hoạt động công khai khi UI hiển thị nút Đăng nhập; chưa xác minh đầy đủ URL và trang chi tiết. |
| ROLE-09 | Not Run | Chưa kiểm tra API Admin với Volunteer. |
| ROLE-10 | Not Run | Chưa kiểm tra API riêng tư với Guest. |
| ROLE-11 | Not Run | Chưa thực hiện. |
| ROLE-12 | Not Run | Chưa thực hiện. |
| UI-01 | Not Run | Chưa kiểm tra có kiểm soát tại viewport 1366 × 768. |
| UI-02 | Not Run | Chưa kiểm tra viewport điện thoại. |
| UI-03 | Not Run | Chưa thực hiện đầy đủ. |
| UI-04 | Not Run | Chưa thực hiện đầy đủ; thiếu giao diện đăng ký đang theo dõi #38. |

Trạng thái Fail của LOG-04/LOG-05 dựa trên yêu cầu câu thông báo nguyên văn hiện tại. Nếu Product chấp nhận thông báo tương đương, cần ghi lại quyết định và cập nhật Expected Result trước khi đánh giá lại.

## 12. Bằng chứng kiểm thử

Các ảnh dưới đây đã được thu thập trong quá trình kiểm thử. Cần đính kèm vào repository hoặc GitHub Issue và bổ sung liên kết; tên ảnh không phải liên kết bằng chứng.

| Nội dung | Tên ảnh | Liên kết |
| --- | --- | --- |
| Volunteer đăng nhập thành công | image(20261004-103859).png | Chưa bổ sung |
| Volunteer bị từ chối truy cập Admin | image(20261004-104030).png | Chưa bổ sung |
| Trang login sau thao tác đăng xuất | image(20261004-104338).png | Chưa bổ sung |
| Truy cập lại Admin sau đăng xuất | image(20261004-110135).png | Chưa bổ sung |
| Đăng nhập sai mật khẩu | image(20261004-110627).png | Chưa bổ sung |
| Đăng nhập email chưa tồn tại | image(20261004-110800).png | Chưa bổ sung |
| Danh sách src/app trên main | image(20261004-111921).png | Chưa bổ sung |
| Code login/page.tsx | image(20261004-112217).png | Chưa bổ sung |

## 13. Vấn đề và Bug Issue

| Vấn đề | Trạng thái | Issue |
| --- | --- | --- |
| Chưa tìm thấy giao diện đăng ký tài khoản theo US-01 | Đã tạo Issue; chờ Developer xác nhận nhánh/đường dẫn hoặc bổ sung chức năng. | https://github.com/nguyentuansangit-prog/volunteer-community-platform/issues/38 |
| Đăng xuất chuyển về /login thay vì trang chủ công khai theo AC3.2 | Đã ghi nhận; chưa tạo Bug Issue. | Chưa có |
| Câu thông báo đăng nhập khác nguyên văn AC2.4 | Đã ghi nhận; cần Product/Developer xác nhận và tạo Issue theo dõi. | Chưa có |
| Chưa có quyền truy cập Vercel Preview | Blocked; chờ chủ dự án cấp quyền. | Theo dõi trong #12 |

Không ghi nhận Vercel Deployment Protection là lỗi Authentication của ứng dụng.

### Thông tin cần có khi tạo Bug Issue

- Tiêu đề mô tả rõ lỗi.
- Môi trường và URL.
- Branch/Commit nếu đã xác minh.
- Điều kiện trước khi kiểm thử.
- Các bước tái hiện.
- Kết quả mong đợi và thực tế.
- Ảnh hoặc video bằng chứng.
- Test ID và Acceptance Criteria liên quan.
- Liên kết về Issue #12.

## 14. Kiểm thử Vercel Preview

Trạng thái hiện tại: Blocked — đang chờ cấp quyền truy cập.

Khi được cấp quyền:

1. Ghi nhận URL Preview, branch và commit của deployment.
2. Xác nhận tài khoản và dữ liệu kiểm thử.
3. Chạy các case Authentication, validation, Role/Permission và Unauthorized.
4. Kiểm tra giao diện máy tính và điện thoại.
5. Ghi kết quả Preview riêng với Production.
6. Tạo Bug Issue cho lỗi phát hiện và liên kết bằng chứng.
7. Kiểm thử lại sau khi Developer sửa lỗi.

Không đánh dấu Acceptance Criteria “Vercel Preview đã được kiểm thử” khi chỉ chạy trên Production.

## 15. Công việc còn lại của Issue #12

- [x] Viết test case Register/Login/Logout.
- [x] Viết test case validation.
- [x] Viết test case Role/Permission.
- [x] Viết Unauthorized Case.
- [x] Thực hiện một phần kiểm thử trên Production.
- [x] Tạo Issue #38 theo dõi giao diện đăng ký còn thiếu.
- [ ] Tạo Bug Issue cho điều hướng sau đăng xuất.
- [ ] Ghi nhận và xác nhận sai khác thông báo đăng nhập.
- [ ] Xác minh commit của bản đang kiểm thử.
- [ ] Hoàn tất kiểm thử các Role và case còn lại.
- [ ] Kiểm thử Vercel Preview.
- [ ] Bổ sung liên kết bằng chứng.
- [ ] Cập nhật hướng dẫn chạy project dựa trên README, package.json và cấu hình thực tế.
- [ ] Kiểm thử lại các lỗi sau khi sửa.
- [ ] Tạo Pull Request tài liệu, liên kết Issue #12 và yêu cầu review.

Issue #12 chưa đủ điều kiện hoàn tất tại thời điểm báo cáo này.

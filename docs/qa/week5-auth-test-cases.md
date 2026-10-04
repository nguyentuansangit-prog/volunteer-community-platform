# Week 5 — Authentication & RBAC Test Cases

## 1. Thông tin chung

- Dự án: Volunteer Community Platform.
- Nhóm: 1 — Kyanon Internship 2026.
- Người kiểm thử: Nguyễn Trung Kiên — QA/Documentation.
- Issue công việc: #12.
- Tài liệu yêu cầu: auth-and-roles-requirements.md.
- Nhánh tài liệu: docs/week5-authentication-qa.
- Thời gian kiểm thử: 04–05/10/2026, giờ Việt Nam.
- URL đã kiểm thử: https://volunteer-community-platform-ikejdeji4.vercel.app
- Nền tảng triển khai: Vercel.
- Loại deployment Preview/Production: Chưa xác minh trong Vercel.
- Branch/Commit của deployment: Chưa xác minh.
- Trình duyệt: Microsoft Edge trên Windows; chưa ghi nhận phiên bản.
- Mobile: Mô phỏng bằng DevTools tại viewport 375 × 667.
- Desktop: Đã kiểm thử chức năng; chưa xác minh viewport 1366 × 768.

Kết quả trong tài liệu chỉ áp dụng cho URL trên tại thời điểm kiểm thử.
Các kết quả trước đây trên https://volunteer-community-platform.vercel.app
được loại khỏi báo cáo vì kiểm thử nhầm bản triển khai.

Commit của nhánh tài liệu QA không phải commit của ứng dụng đã triển khai.

## 2. Phạm vi

- Register cho Volunteer và Organizer.
- Validation Register/Login.
- Login và điều hướng theo Role.
- Logout, bảo vệ route và cookie phiên.
- Role/Permission và Unauthorized Case.
- Giao diện và điều hướng Authentication trên desktop/mobile.

Đã kiểm tra truy cập hồ sơ để xác minh bảo vệ route.
Chỉnh sửa hồ sơ và đổi mật khẩu chưa được kiểm thử trong báo cáo này.

## 3. Quy ước trạng thái

| Trạng thái | Ý nghĩa |
| --- | --- |
| Pass | Đã thực hiện đầy đủ các tiêu chí của case và đạt kết quả mong đợi. |
| Fail | Đã quan sát kết quả khác yêu cầu. |
| In Progress | Đã kiểm thử một phần, còn tiêu chí chưa xác minh. |
| Not Run | Chưa thực hiện. |
| Blocked | Không thể thực hiện do thiếu điều kiện, dữ liệu hoặc quyền. |

Không suy luận kết quả API/server từ việc ẩn nút trên UI.
Trang 404 không phải bằng chứng phân quyền.
Xóa cookie trên trình duyệt không chứng minh token cũ bị vô hiệu hóa ở server.

## 4. Điều kiện và dữ liệu kiểm thử

### 4.1. Điều kiện

- Website truy cập được.
- Có tài khoản đúng Role.
- Dùng email riêng chưa tồn tại khi kiểm thử đăng ký mới.
- Xác định route và API thực tế trước khi kiểm thử trực tiếp.
- Developer xác nhận thời hạn và cơ chế phiên trước khi kiểm thử hết hạn/replay.
- Xác minh deployment trong Vercel để đối chiếu Acceptance Criteria Preview.

### 4.2. Dữ liệu

| Dữ liệu | Giá trị / Ghi chú |
| --- | --- |
| Volunteer | kien.qa.20261004@example.com |
| Volunteer với mật khẩu chứa ký tự đặc biệt | kien.qa.special.20261004@example.com |
| Organizer | kien.qa.organizer.20261004@example.com |
| Admin | Tài khoản test do nhóm cung cấp; người kiểm thử báo đã kiểm thử đạt, chưa bổ sung định danh và ảnh. |
| Email chưa tồn tại đã thử | kien.qa.nonexistent.20261004@example.com |
| Email sai định dạng đã thử | kien.qa |
| Mật khẩu hợp lệ mẫu | QaTest12 |
| Mật khẩu 7 ký tự | QaTest1 |
| Thiếu chữ hoa | qatest12 |
| Thiếu chữ thường | QATEST12 |
| Thiếu số và ký tự đặc biệt | QaTestAb |
| Có ký tự đặc biệt, không có số | QaTest!@ |
| Mật khẩu sai mẫu | Wrong123! |
| Xác nhận không khớp | QaTest12 / QaTest13 |
| Hoạt động dùng để kiểm thử | Dọn rác bãi biển |

Các mật khẩu trên là dữ liệu test mẫu.
Không lưu mật khẩu thật, giá trị cookie hoặc token vào GitHub.

## 5. Register

Điều kiện chung: Guest mở /register; email mới chưa tồn tại,
trừ case kiểm tra email trùng.

| ID | Trường hợp và bước thực hiện | Kết quả mong đợi |
| --- | --- | --- |
| REG-01 | Nhập đầy đủ dữ liệu hợp lệ; chọn VOLUNTEER; gửi form. | Thành công, thông báo và chuyển đến Login; tài khoản có thể đăng nhập ngay với role VOLUNTEER. |
| REG-02 | Nhập đầy đủ dữ liệu hợp lệ; chọn ORGANIZER; gửi form. | Thành công, thông báo và chuyển đến Login; tài khoản có thể đăng nhập ngay với role ORGANIZER. |
| REG-03 | Gửi tất cả ô văn bản trống; lần lượt bỏ trống Họ tên, Email, Mật khẩu, Xác nhận mật khẩu với các ô khác hợp lệ. | Báo lỗi, chặn đăng ký. Role mặc định phải là lựa chọn hợp lệ; kiểm tra thiếu role phía server thuộc phần bổ sung. |
| REG-04 | Nhập email kien.qa; dữ liệu khác hợp lệ; gửi form. | Báo email không hợp lệ, chặn đăng ký. |
| REG-05 | Dùng email đã tồn tại; gửi form với dữ liệu khác hợp lệ. | Từ chối email trùng. |
| REG-06 | Nhập QaTest1 và xác nhận giống nhau; gửi form. | Báo mật khẩu dưới 8 ký tự. |
| REG-07 | Nhập QaTest12 và xác nhận giống nhau; dùng email mới; gửi form. | Chấp nhận mật khẩu đúng 8 ký tự. |
| REG-08 | Nhập qatest12 và xác nhận giống nhau; gửi form. | Báo thiếu chữ hoa. |
| REG-09 | Nhập QATEST12 và xác nhận giống nhau; gửi form. | Báo thiếu chữ thường. |
| REG-10 | Nhập QaTestAb và xác nhận giống nhau; gửi form. | Báo thiếu số hoặc ký tự đặc biệt. |
| REG-11 | Nhập QaTest!@ và xác nhận giống nhau; dùng email mới; gửi form. | Chấp nhận chữ hoa, chữ thường và ký tự đặc biệt dù không có số. |
| REG-12 | Nhập QaTest12 và xác nhận QaTest13; gửi form. | Báo xác nhận mật khẩu không khớp. |
| REG-13 | Kiểm tra dropdown Role; gửi role ADMIN qua endpoint đăng ký thực tế. | UI chỉ có Volunteer/Organizer; server từ chối tự đăng ký Admin. |

REG-03 được làm rõ để phù hợp form có role mặc định:
không dùng việc không thể bỏ trống dropdown để kết luận server đã kiểm tra role.

Kết quả đăng ký thành công và đăng nhập ngay xác minh hành vi người dùng.
Chưa truy vấn cơ sở dữ liệu để kiểm tra giá trị trạng thái kích hoạt.

## 6. Login

| ID | Trường hợp và bước thực hiện | Kết quả mong đợi |
| --- | --- | --- |
| LOG-01 | Đăng nhập Volunteer hợp lệ; kiểm tra Role và URL. | Đúng VOLUNTEER; đến trang khám phá hoặc Dashboard cá nhân. |
| LOG-02 | Đăng nhập Organizer hợp lệ; kiểm tra Role và URL. | Đúng ORGANIZER; đến quản lý chiến dịch. |
| LOG-03 | Đăng nhập Admin hợp lệ; kiểm tra Role và URL. | Đúng ADMIN; đến trang quản trị. |
| LOG-04 | Email tồn tại, mật khẩu Wrong123!; gửi form. | Từ chối; báo “Email hoặc mật khẩu không chính xác”. |
| LOG-05 | Email chưa tồn tại, mật khẩu không trống; gửi form. | Từ chối với cùng lỗi chung như LOG-04. |
| LOG-06 | Thử cả hai ô trống, chỉ email trống, chỉ mật khẩu trống. | Chặn đăng nhập và báo trường bắt buộc. |
| LOG-07 | Nhập email kien.qa và mật khẩu không trống. | Chặn form do email sai định dạng. |

## 7. Logout

| ID | Trường hợp và bước thực hiện | Kết quả mong đợi |
| --- | --- | --- |
| OUT-01 | Đăng nhập từng Role; Logout; kiểm tra UI, URL và phiên. | Về trang chủ công khai, không còn đăng nhập; hủy phiên theo AC3.1. |
| OUT-02 | Logout rồi mở trực tiếp route riêng tư thực tế. | Chuyển đến Login hoặc yêu cầu xác thực; không thấy nội dung riêng tư. |
| OUT-03 | Mở trang riêng tư; Logout; Back; reload; thử thao tác riêng tư. | Không khôi phục quyền truy cập hoặc thao tác sau Logout. |

## 8. Session

| ID | Trường hợp và bước thực hiện | Kết quả mong đợi |
| --- | --- | --- |
| SES-01 | Login trên HTTPS; kiểm tra cookie phiên bằng DevTools. | Cookie có HttpOnly và Secure. |
| SES-02 | Để phiên hết hạn theo cấu hình test; mở route riêng tư. | Yêu cầu đăng nhập/làm mới; phiên hết hạn không cấp quyền. |
| SES-03 | Theo hướng dẫn Developer, gửi yêu cầu riêng tư với token trước Logout. | Token cũ bị từ chối theo AC3.1; nếu cơ chế JWT chưa thu hồi token, ghi sai khác và làm rõ yêu cầu. |

Không chia sẻ giá trị cookie/token trong bằng chứng.

## 9. Role / Permission

| ID | Trường hợp và bước thực hiện | Kết quả mong đợi |
| --- | --- | --- |
| ROLE-01 | Volunteer mở và dùng chức năng Volunteer với dữ liệu test. | Được truy cập và thao tác theo ma trận quyền. |
| ROLE-02 | Organizer mở quản lý chiến dịch và thao tác với dữ liệu test. | Được truy cập và thao tác theo ma trận quyền. |
| ROLE-03 | Admin mở /admin và dùng chức năng Admin đã triển khai. | Được truy cập và thao tác theo ma trận quyền. |
| ROLE-04 | Volunteer mở /admin trực tiếp. | Bị từ chối; không thấy dữ liệu quản trị. |
| ROLE-05 | Organizer mở /admin trực tiếp. | Bị từ chối; không thấy dữ liệu quản trị. |
| ROLE-06 | Volunteer mở route quản lý Organizer thực tế. | Không thấy hoặc sử dụng được chức năng Organizer; server bảo vệ thao tác riêng tư. |
| ROLE-07 | Guest mở /admin và /profile. | Chuyển đến Login; không thấy dữ liệu riêng tư. |
| ROLE-08 | Guest mở danh sách và chi tiết hoạt động công khai. | Xem được mà không cần đăng nhập. |
| ROLE-09 | Volunteer gọi API Admin thực tế. | Từ chối quyền, thường là 403; không trả dữ liệu riêng tư. |
| ROLE-10 | Guest gọi API cần Authentication thực tế. | Từ chối xác thực, thường là 401. |
| ROLE-11 | Admin thử UI/API tạo chiến dịch. | Bị từ chối theo ma trận: chỉ Organizer tạo chiến dịch. |
| ROLE-12 | Organizer thử đăng ký tham gia trên UI/API. | Bị từ chối theo ma trận: chỉ Volunteer đăng ký tham gia. |

Nếu Product thay đổi ma trận quyền, cần cập nhật yêu cầu và Expected Result.

## 10. UI

| ID | Trường hợp và bước thực hiện | Kết quả mong đợi |
| --- | --- | --- |
| UI-01 | Viewport 1366 × 768; kiểm tra Register/Login và lỗi. | Không cắt/chồng nội dung; form thao tác được. |
| UI-02 | Viewport 375 × 667; kiểm tra Register/Login, lỗi và cuộn. | Form thao tác được, các nút truy cập được, không tràn ngang. |
| UI-03 | Gửi dữ liệu sai; sửa hợp lệ; gửi lại trên Register/Login. | Lỗi cũ không cản thao tác hợp lệ. |
| UI-04 | Kiểm tra liên kết Register/Login, menu, Profile, Logout. | Điều hướng đúng; trạng thái UI đúng theo phiên. |

## 11. Kết quả kiểm thử trên bản đúng

### 11.1. Giới hạn

- Kết quả chủ yếu từ thao tác UI và ảnh chụp.
- Validation phía server chưa được kiểm thử trực tiếp.
- Chưa xác minh branch/commit và loại deployment trong Vercel.
- Admin: người kiểm thử báo Login và truy cập Admin đạt; chưa bổ sung ảnh.
- Mobile dùng mô phỏng DevTools, chưa kiểm thử điện thoại thật.
- Chưa xác minh HTTP status của các trang từ chối quyền.

### 11.2. Register

| ID | Trạng thái | Kết quả thực tế / Phần còn thiếu |
| --- | --- | --- |
| REG-01 | Pass | Đăng ký Volunteer thành công; chuyển Login kèm thông báo; đăng nhập ngay và hiển thị đúng Role. |
| REG-02 | Pass | Đăng ký Organizer thành công; chuyển Login kèm thông báo; đăng nhập ngay và hiển thị đúng Role. |
| REG-03 | Pass | Đã thử tất cả ô văn bản trống và từng ô trống riêng; hiển thị lỗi và chặn đăng ký. Dropdown có role mặc định hợp lệ. |
| REG-04 | Pass | Email kien.qa bị báo không hợp lệ. |
| REG-05 | Pass | Báo “Email đã được sử dụng. Vui lòng dùng email khác.” |
| REG-06 | Pass | QaTest1 bị từ chối do dưới 8 ký tự. |
| REG-07 | Pass | QaTest12 được chấp nhận khi đăng ký Volunteer. |
| REG-08 | Pass | qatest12 bị từ chối do thiếu chữ hoa. |
| REG-09 | Pass | QATEST12 bị từ chối do thiếu chữ thường. |
| REG-10 | Pass | QaTestAb bị từ chối do thiếu số/ký tự đặc biệt. |
| REG-11 | Pass | QaTest!@ được chấp nhận; tài khoản mới đăng nhập được. |
| REG-12 | Pass | Xác nhận khác mật khẩu bị báo lỗi. |
| REG-13 | In Progress | Dropdown chỉ có Volunteer/Organizer; chưa gửi role ADMIN trực tiếp đến server. |

### 11.3. Login

| ID | Trạng thái | Kết quả thực tế / Phần còn thiếu |
| --- | --- | --- |
| LOG-01 | Pass | Volunteer đăng nhập thành công; đúng Role; đến /activities. |
| LOG-02 | Pass | Organizer đăng nhập thành công; đúng Role; đến /activities?scope=managed. |
| LOG-03 | Pass | Người kiểm thử xác nhận Admin đăng nhập và điều hướng đúng; cần bổ sung ảnh/định danh tài khoản test. |
| LOG-04 | Pass | Mật khẩu sai bị từ chối với lỗi “Email hoặc mật khẩu không chính xác”; kiểm tra cả desktop và mobile. |
| LOG-05 | Pass | Email chưa tồn tại bị từ chối với cùng thông báo chung. |
| LOG-06 | In Progress | Đã thử email trống và mật khẩu trống riêng; trình duyệt chặn. Chưa lưu bằng chứng chạy riêng trường hợp cả hai ô trống trên bản đúng. |
| LOG-07 | Pass | Email kien.qa bị trình duyệt báo sai định dạng và chặn gửi. |

### 11.4. Logout / Session

| ID | Trạng thái | Kết quả thực tế / Phần còn thiếu |
| --- | --- | --- |
| OUT-01 | In Progress | Volunteer Logout về trang chủ; cookie session-token biến mất. Chưa xác minh đầy đủ Logout từng Role và vô hiệu hóa token cũ ở server. |
| OUT-02 | Pass | Sau Logout, mở /admin hoặc /profile chuyển đến Login; không hiển thị nội dung riêng tư. |
| OUT-03 | In Progress | Đã thử Back và reload sau Logout, vẫn ở Login. Chưa thử riêng thao tác/API cần Authentication bằng phiên cũ. |
| SES-01 | Pass | Cookie lọc theo session-token có HttpOnly và Secure; SameSite=Lax. |
| SES-02 | Not Run | Chưa kiểm thử thời hạn phiên. |
| SES-03 | Not Run | Chưa gửi lại yêu cầu với token trước Logout. |

### 11.5. Role / Permission

| ID | Trạng thái | Kết quả thực tế / Phần còn thiếu |
| --- | --- | --- |
| ROLE-01 | In Progress | Volunteer mở được “Đăng ký của tôi”. Chưa thực hiện đầy đủ thao tác nghiệp vụ của case. |
| ROLE-02 | In Progress | Organizer mở được quản lý chiến dịch và form tạo hoạt động. Chưa lưu hoạt động test. |
| ROLE-03 | In Progress | Người kiểm thử báo truy cập /admin đạt. Chưa ghi nhận thao tác chức năng kiểm duyệt của case. |
| ROLE-04 | Pass | Volunteer mở /admin thấy “Không có quyền truy cập”, không thấy nội dung quản trị. |
| ROLE-05 | Pass | Organizer mở /admin bị từ chối và hiển thị đúng Role. |
| ROLE-06 | In Progress | Volunteer mở /activities?scope=managed chỉ thấy Khám phá, không có quản lý/tạo hoạt động. Chưa kiểm thử server/API tương ứng. |
| ROLE-07 | Pass | Guest mở /admin và /profile bị chuyển đến Login. |
| ROLE-08 | In Progress | Guest xem được danh sách công khai. Chưa kiểm thử trang chi tiết riêng. |
| ROLE-09 | Not Run | Chưa gọi API Admin với Volunteer. |
| ROLE-10 | Not Run | Chưa gọi API riêng tư với Guest. |
| ROLE-11 | Not Run | Chưa thử Admin tạo chiến dịch. |
| ROLE-12 | Fail | Organizer đăng ký “Dọn rác bãi biển” thành công; hiển thị Chờ duyệt và còn trạng thái sau F5. |

ROLE-12 đã Fail từ thao tác UI thực tế; không cần hoàn tất phần gọi API
riêng để ghi nhận lỗi đã quan sát.

### 11.6. UI

| ID | Trạng thái | Kết quả thực tế / Phần còn thiếu |
| --- | --- | --- |
| UI-01 | Not Run | Chưa kiểm tra có kiểm soát tại viewport 1366 × 768. |
| UI-02 | In Progress | Register/Login ở 375 × 667 có form, nút và lỗi đọc rõ; cuộn đến cuối được. Chưa ghi nhận kiểm tra kéo ngang để xác nhận không tràn ngang. |
| UI-03 | In Progress | Login sai mật khẩu rồi sửa đúng đăng nhập thành công. Chưa hoàn tất luồng sửa lỗi Register. |
| UI-04 | Pass | Đã dùng liên kết Register/Login; mở menu mobile, Profile; Logout về trang chủ; route riêng tư yêu cầu Login. |

## 12. Bằng chứng

Tên ảnh dưới đây giúp đối chiếu lần kiểm thử.
Cần đính kèm ảnh vào repository hoặc Issue và bổ sung liên kết thực tế.
Tên ảnh đơn thuần chưa phải bằng chứng truy cập được từ GitHub.

| Nội dung | Tên ảnh | Liên kết |
| --- | --- | --- |
| Volunteer đăng ký thành công | image(20261004-134655).png | Chưa bổ sung |
| Volunteer Login thành công | image(20261004-135010).png | Chưa bổ sung |
| Volunteer bị chặn Admin | image(20261004-135242).png | Chưa bổ sung |
| Login sai mật khẩu | image(20261004-135845).png | Chưa bổ sung |
| Login email chưa tồn tại | image(20261004-140426).png | Chưa bổ sung |
| Đăng ký email trùng | image(20261004-151721).png | Chưa bổ sung |
| Mật khẩu ký tự đặc biệt được chấp nhận | image(20261004-152040).png | Chưa bổ sung |
| Organizer đăng ký thành công | image(20261004-152511).png | Chưa bổ sung |
| Organizer Login thành công | image(20261004-152632).png | Chưa bổ sung |
| Organizer bị chặn Admin | image(20261004-152721).png | Chưa bổ sung |
| Organizer mở form tạo hoạt động | image(20261004-152852).png | Chưa bổ sung |
| Volunteer mở URL quản lý Organizer | image(20261004-153053).png | Chưa bổ sung |
| Guest xem hoạt động công khai | image(20261004-154204).png | Chưa bổ sung |
| Organizer đăng ký tham gia thành công | image(20261004-155053).png | Chưa bổ sung |
| Đăng ký Organizer còn sau F5 | image(20261004-155241).png | Chưa bổ sung |
| Register mobile và validation | image(20261004-175406).png | Chưa bổ sung |
| Login sai mật khẩu mobile | image(20261004-175749).png | Chưa bổ sung |
| Menu mobile sau Login | image(20261004-180011).png | Chưa bổ sung |
| Profile mobile | image(20261004-180206).png | Chưa bổ sung |
| Trang chủ sau Logout mobile | image(20261004-180223).png | Chưa bổ sung |
| Login khi mở lại Profile | image(20261004-180340).png | Chưa bổ sung |
| Cookie có HttpOnly/Secure | image(20261004-182201).png | Chưa bổ sung; che Value trước khi đăng |
| Cookie phiên biến mất sau Logout | image(20261004-182411).png | Chưa bổ sung |

Bổ sung ảnh Admin và ảnh validation Register riêng từng trường khi hoàn thiện.
Các ảnh cookie phải che toàn bộ Value và phần xem trước token.

## 13. Bug và đính chính

### 13.1. Lỗi trên bản đúng

| Test ID | Vấn đề | Mức độ đề xuất | Theo dõi |
| --- | --- | --- | --- |
| ROLE-12 | Organizer vẫn đăng ký tham gia hoạt động được. UI báo gửi thành công, trạng thái Chờ duyệt còn sau reload. | Major | Bổ sung số/link Bug Issue đã tạo; chưa ghi nhận số Issue trong báo cáo. |

Tiêu đề Bug:
[Week 5][Bug][RBAC] Organizer vẫn đăng ký tham gia hoạt động được

Expected:
Chỉ Volunteer được đăng ký tham gia; Organizer bị chặn ở UI và server.

Liên quan: #12 và ma trận Role/Permission.

Sau khi có bản sửa, chạy lại bằng Organizer và kiểm tra
Volunteer vẫn đăng ký được bằng dữ liệu test phù hợp.

### 13.2. Đính chính kết quả cũ

Issue #38 về thiếu giao diện đăng ký được ghi nhận khi kiểm thử nhầm
bản triển khai. Bản đúng có Register và đã đăng ký thành công
với Volunteer/Organizer.

Không tính #38 là lỗi còn tồn tại trên bản đúng.
Trạng thái đóng/xóa Issue #38 cần xác nhận trên GitHub.

Các ghi nhận cũ về Logout về /login và câu thông báo Login
không áp dụng cho lần kiểm thử này:
- Bản đúng Logout về trang chủ.
- Bản đúng hiển thị “Email hoặc mật khẩu không chính xác”.

## 14. Vercel và truy vết deployment

- Đã truy cập và thực hiện kiểm thử tại:
  https://volunteer-community-platform-ikejdeji4.vercel.app
- Chưa xác minh Environment là Preview hay Production trong Vercel.
- Chưa xác minh branch/commit của deployment.
- Không còn dùng tình trạng bị chặn của URL cũ để mô tả URL hiện tại.

Cần chủ dự án cung cấp hoặc xác nhận:
1. Environment của deployment.
2. Git branch và commit.
3. Liên kết deployment/PR tương ứng.

Chỉ đánh dấu AC “Vercel Preview đã được kiểm thử” hoàn tất
khi URL đã chạy được xác nhận là Preview.
Nếu URL hiện tại là Production, cần chạy trên Preview và ghi kết quả riêng.

## 15. Công việc còn lại của Issue #12

- [x] Có test case Register/Login/Logout.
- [x] Có test case validation.
- [x] Có test case Role/Permission và Unauthorized.
- [x] Đã kiểm thử Register cho Volunteer/Organizer.
- [x] Đã kiểm thử Login và bảo vệ route trên bản đúng.
- [x] Đã kiểm tra thuộc tính cookie và xóa cookie sau Logout.
- [x] Đã kiểm tra một phần giao diện mobile.
- [x] Ghi nhận lỗi Organizer đăng ký tham gia.
- [ ] Bổ sung số/link Bug Issue ROLE-12.
- [ ] Xác nhận xử lý Issue #38 ghi nhận nhầm bản.
- [ ] Xác minh Environment, branch và commit của deployment.
- [ ] Xác nhận hoàn tất kiểm thử Vercel Preview.
- [ ] Hoàn tất các case In Progress/Not Run.
- [ ] Bổ sung ảnh Admin và liên kết bằng chứng.
- [ ] Kiểm thử lại ROLE-12 sau khi sửa.
- [ ] Cập nhật hướng dẫn chạy project theo README, package.json,
      biến môi trường và cấu hình Prisma thực tế.
- [ ] Tạo Pull Request tài liệu, liên kết #12 và yêu cầu review.

Issue #12 chưa đủ điều kiện hoàn tất.

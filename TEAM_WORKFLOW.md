# Quy Trình Hợp Tác Nhóm & Quản Lý Dự Án FJMS

Tài liệu này hướng dẫn cách làm việc nhóm song song, quản lý source code qua Git/GitHub, đồng bộ hóa Database và cấu trúc thư mục chuẩn hóa để **hạn chế tối đa xung đột (conflict)**. Tất cả thành viên bắt buộc phải tuân thủ.

---

## 📂 1. Cấu Trúc Thư Mục Chuẩn Hóa (Project Directory Structure)

Để đảm bảo code của các thành viên không bị đè lên nhau, toàn bộ cấu trúc thư mục của dự án đã được sắp xếp gọn gàng theo từng phân hệ (Module) như sau:

```text
swp391-rbl-project-team_7-1/
├── backend/                       # Source code Backend (Node.js & Express)
│   ├── config/                    # Cấu hình DB và Server (.env, db.js,...)
│   ├── controllers/               # Xử lý logic nghiệp vụ chính
│   ├── database/                  # File SQL và các patch nâng cấp DB
│   ├── middleware/                # Các bộ lọc trung gian (Auth, Verify Admin)
│   ├── routes/                    # Định tuyến API các phân hệ
│   └── utils/                     # Các tiện ích dùng chung (Email Service,...)
│
├── frontend/                      # Source code Frontend (React.js + Vite)
│   ├── index.html                 # File chạy chính của Client
│   └── src/                       # Thư mục chứa mã nguồn chính (Source code)
│       ├── App.jsx                # Component tổng định tuyến
│       ├── main.jsx               # File khởi chạy chính của React
│       ├── index.css              # Style chính toàn trang
│       ├── components/            # UI Components dùng chung (Header, Sidebar,...)
│       ├── layouts/               # Các khung giao diện chung (PublicLayout, DashboardLayout)
│       └── pages/                 # Màn hình giao diện phân theo Role & Module
│           ├── Admin/             # Phân hệ Admin (Dashboard, Analytics, Users, Disputes,...)
│           ├── Auth/              # Module xác thực (Login, Register, OTP, ForgotPassword)
│           ├── Employer/          # Phân hệ Employer (PostJob, Proposals, Wallet, progress)
│           ├── Freelancer/        # Phân hệ Freelancer (Browse, SubmitWork, Apply, Wallet)
│           ├── Payment/           # Xử lý cổng VNPay (VNPayGateway, Success, Failed)
│           └── Public/            # Trang dùng chung (LandingPage, HelpCenter, Articles, Profile)
```

> [!IMPORTANT]
> **Quy định đối với Frontend:** 
> * Khi tạo trang mới, bắt buộc phải đặt đúng vào thư mục Role/Module tương ứng ở trên. 
> * Định tuyến trang mới trong file [App.jsx](file:///d:/FPT/SWP/FJMS/swp391-rbl-project-team_7-1/frontend/App.jsx).

---

## 💻 2. Quy Trình Quản Lý Source Code (Git & GitHub Flow)

Dự án sử dụng quy trình Git Flow rút gọn bao gồm các nhánh chính:
* `main` (hoặc `master`): Chỉ chứa code chạy ổn định và đã test hoàn chỉnh. **Tuyệt đối không commit trực tiếp.**
* `develop`: Nhánh chứa code tích hợp mới nhất của cả nhóm. Các tính năng mới sẽ được gộp vào đây để test chung.

### Quy trình các bước thực hiện tính năng mới:

| Bước | Lệnh Terminal | Mô tả |
| :--- | :--- | :--- |
| **1. Cập nhật** | `git checkout develop`<br>`git pull origin develop` | Đồng bộ code mới nhất của nhóm về local |
| **2. Tạo nhánh** | `git checkout -b feature/ten-tinh-nang` | Tạo nhánh tính năng mới (Ví dụ: `feature/wallet`) |
| **3. Lập trình** | `git add .`<br>`git commit -m "feat(auth): add register form UI"` | Lưu lại tiến độ thường xuyên với commit message rõ ràng |
| **4. Đẩy code** | `git push origin feature/ten-tinh-nang` | Đẩy nhánh lên GitHub khi hoàn thành |
| **5. Tạo PR** | Thực hiện trên giao diện Web GitHub | Tạo Pull Request gộp từ nhánh của bạn vào `develop` và chỉ định thành viên khác review |

---

## 🗄️ 3. Quy Trình Quản Lý & Đồng Bộ Database (SQL Server)

Dự án sử dụng duy nhất một cấu trúc database chạy độc lập trên máy local của mỗi thành viên thông qua file [FJMS.sql](file:///d:/FPT/SWP/FJMS/swp391-rbl-project-team_7-1/FJMS.sql).

### Quy định sửa đổi Database:
1. **Không tự ý thay đổi file gốc [FJMS.sql](file:///d:/FPT/SWP/FJMS/swp391-rbl-project-team_7-1/FJMS.sql)** nếu chưa được sự đồng ý của cả nhóm.
2. Khi cần thêm bảng mới, cột mới, hoặc sửa kiểu dữ liệu:
   * **Không sửa trực tiếp** vào database hay file gốc.
   * Tạo một file SQL nhỏ lưu trong thư mục `backend/database/updates/` đặt tên theo định dạng: `patch_v[Phiên bản]_[Mô tả].sql` (ví dụ: `patch_v1.1_add_address_to_users.sql`).
   * Viết lệnh thay đổi cấu trúc database vào file đó. Ví dụ:
     ```sql
     USE FJMS;
     GO
     ALTER TABLE users ADD address NVARCHAR(255) NULL;
     ```
   * Commit file này lên Git cùng với code xử lý.
   * Các thành viên khác khi `pull` code mới về chỉ cần mở file SQL patch đó lên và chạy (Execute) trên SQL Server của họ để đồng bộ.

---

## 🔄 4. Quy Trình Phát Triển Song Song (Frontend & Backend)

Để phát triển song song hiệu quả và tránh phụ thuộc vào nhau:
1. **Thống nhất API đầu tiên:** Trước khi bắt tay vào code, hai bên thảo luận để thống nhất tài liệu API (gồm URL endpoint, cấu trúc JSON gửi lên và kết quả trả về).
2. **Frontend dùng dữ liệu giả (Mock Data):** Frontend dựng giao diện và sử dụng dữ liệu tự định nghĩa (giả lập) để chạy thử các chức năng trước.
3. **Backend kiểm thử độc lập:** Backend viết logic và tự kiểm thử API của mình thông qua các công cụ như Postman hoặc extension Thunder Client trên VS Code.
4. **Tích hợp (Integration):** Khi cả 2 phần hoàn tất, Frontend chỉ cần đổi URL gọi API từ dữ liệu giả sang API thật của Backend.

---

## 🛠️ 5. Giải Quyết Xung Đột (Conflict)

Nếu hai người cùng sửa một file trên cùng một dòng, Git sẽ báo xung đột khi `git pull` hoặc merge PR.
1. Mở file bị báo xung đột trong VS Code.
2. Chọn giữa:
   * **Accept Current Change:** Giữ lại code của bạn.
   * **Accept Incoming Change:** Lấy code của người khác đẩy lên.
   * **Accept Both Changes:** Giữ cả hai phiên bản code.
3. Sau khi giải quyết xong các điểm xung đột, lưu file, thực hiện add, commit và push lại lên GitHub.


# Quy Trình Hợp Tác Nhóm & Quản Lý Dự Án FJMS

Tài liệu này hướng dẫn cách làm việc nhóm song song, quản lý source code qua Git/GitHub và đồng bộ hóa Database để **hạn chế tối đa xung đột (conflict)**. Tất cả thành viên bắt buộc phải tuân thủ.

---

## 1. Quy Trình Quản Lý Source Code (Git & GitHub)

Dự án sử dụng quy trình Git Flow rút gọn bao gồm các nhánh chính:
* `main` (hoặc `master`): Chỉ chứa code chạy ổn định và đã test hoàn chỉnh. **Tuyệt đối không commit trực tiếp.**
* `develop`: Nhánh chứa code tích hợp mới nhất của cả nhóm. Các tính năng mới sẽ được gộp vào đây để test chung.

### Các bước làm việc khi bắt đầu làm tính năng mới:

#### Bước 1: Đồng bộ code mới nhất
Trước khi code, hãy chuyển về nhánh `develop` và tải code mới nhất về:
```bash
git checkout develop
git pull origin develop
```

#### Bước 2: Tạo nhánh tính năng riêng
Đặt tên nhánh theo cấu trúc: `feature/ten-tinh-nang` (ví dụ: `feature/wallet`, `feature/register`):
```bash
git checkout -b feature/ten-tinh-nang
```

#### Bước 3: Viết code và commit cục bộ
Trong quá trình code, hãy commit thường xuyên để lưu lại tiến độ:
```bash
git add .
git commit -m "feat(auth): add register form UI"
```

#### Bước 4: Đẩy nhánh lên GitHub
```bash
git push origin feature/ten-tinh-nang
```

#### Bước 5: Tạo Pull Request (PR) & Review
1. Truy cập vào kho chứa (Repository) trên GitHub.
2. Nhấn nút **Compare & pull request** cho nhánh bạn vừa đẩy lên.
3. Chọn gộp (merge) nhánh `feature/ten-tinh-nang` vào nhánh `develop`.
4. Chỉ định ít nhất 1 thành viên khác trong nhóm review code.
5. Sau khi được duyệt, bấm **Merge pull request** để gộp code và xóa nhánh tính năng trên GitHub.

---

## 2. Quy Trình Quản Lý & Đồng Bộ Database (SQL Server)

Dự án sử dụng duy nhất một cấu trúc database chạy độc lập trên máy local của mỗi thành viên thông qua file [FJMS.sql](file:///d:/FPT/SWP/FJMS/swp391-rbl-project-team_7-1/FJMS.sql).

### Quy định sửa đổi Database:
1. **Không tự ý thay đổi file gốc [FJMS.sql](file:///d:/FPT/SWP/FJMS/swp391-rbl-project-team_7-1/FJMS.sql)** nếu chưa được sự đồng ý của cả nhóm.
2. Khi cần thêm bảng mới, cột mới, hoặc sửa kiểu dữ liệu:
   * **Không sửa trực tiếp** vào database hay file gốc.
   * Tạo một file SQL nhỏ lưu trong thư mục `backend/database/updates/` (hoặc thư mục thống nhất của nhóm) đặt tên theo định dạng: `patch_v[Phiên bản]_[Mô tả].sql` (ví dụ: `patch_v1.1_add_address_to_users.sql`).
   * Viết lệnh thay đổi cấu trúc database vào file đó. Ví dụ:
     ```sql
     USE FJMS;
     GO
     ALTER TABLE users ADD address NVARCHAR(255) NULL;
     ```
   * Commit file này lên Git cùng với code xử lý.
   * Các thành viên khác khi `pull` code mới về chỉ cần mở file SQL patch đó lên và chạy (Execute) trên SQL Server của họ để đồng bộ.

---

## 3. Quy Trình Phát Triển Song Song (Frontend & Backend)

Để phát triển song song hiệu quả và tránh phụ thuộc vào nhau:
1. **Thống nhất API đầu tiên:** Trước khi bắt tay vào code, hai bên thảo luận để thống nhất tài liệu API (gồm URL endpoint, cấu trúc JSON gửi lên và kết quả trả về).
2. **Frontend dùng dữ liệu giả (Mock Data):** Frontend dựng giao diện và sử dụng dữ liệu tự định nghĩa (giả lập) để chạy thử các chức năng trước.
3. **Backend kiểm thử độc lập:** Backend viết logic và tự kiểm thử API của mình thông qua các công cụ như Postman hoặc extension Thunder Client trên VS Code.
4. **Tích hợp (Integration):** Khi cả 2 phần hoàn tất, Frontend chỉ cần đổi URL gọi API từ dữ liệu giả sang API thật của Backend.

---

## 4. Giải Quyết Xung Đột (Conflict) Nếu Có

Nếu hai người cùng sửa một file trên cùng một dòng, Git sẽ báo xung đột khi `git pull` hoặc merge PR.
1. Mở file bị báo xung đột trong VS Code.
2. Chọn giữa:
   * **Accept Current Change:** Giữ lại code của bạn.
   * **Accept Incoming Change:** Lấy code của người khác đẩy lên.
   * **Accept Both Changes:** Giữ cả hai phiên bản code.
3. Sau khi giải quyết xong các điểm xung đột, lưu file, thực hiện add, commit và push lại lên GitHub.

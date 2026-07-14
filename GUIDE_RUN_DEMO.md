# 📝 HƯỚNG DẪN CHẠY DEMO DỰ ÁN (FRONTEND VERCEL + BACKEND NGROK)

Tài liệu này lưu lại các bước cần thực hiện mỗi khi bạn muốn chạy dự án cho giảng viên, bạn bè hoặc khách hàng dùng thử từ xa.

---

## ⚡ 1. Các bước cần chạy mỗi lần DEMO (Khi bắt đầu buổi thuyết trình)

Mở máy tính của bạn lên (máy đóng vai trò làm Server chứa Database) và thực hiện:

### Bước A: Đảm bảo Database đã bật
Đảm bảo **SQL Server** trên máy bạn đã được bật và đang chạy bình thường.

### Bước B: Khởi động Server Code (Backend + Frontend)
Mở một cửa sổ Terminal/Command Prompt tại thư mục dự án và chạy:
```bash
npm run dev
```
*(Lệnh này sẽ khởi chạy Backend ở cổng `5000` và Frontend ở cổng `5173` dưới máy local của bạn).*

### Bước C: Kích hoạt đường truyền Ngrok cho Backend
Mở một cửa sổ Terminal/Command Prompt khác độc lập tại thư mục dự án và chạy:
```bash
ngrok start --all --config ngrok.yml
```
*(Lệnh này mở đường truyền kết nối từ Internet vào Backend trên máy bạn qua tên miền cố định: `https://wiry-hypnotize-creasing.ngrok-free.dev`)*

---

## 🌐 2. Link truy cập trang web chính thức (Gửi cho người dùng)

Sau khi hoàn thành **mục 1**, bạn chỉ cần gửi đường link Frontend trên Vercel sau đây cho mọi người để truy cập và trải nghiệm:

👉 **Địa chỉ Web:** [https://fjms.vercel.app](https://fjms.vercel.app)

*(Khi người dùng thao tác trên link này, dữ liệu sẽ tự động đi qua ngrok và lưu trực tiếp vào Database SQL Server trên máy bạn).*

---

## 🛠️ 3. Cách cập nhật khi SỬA CODE hoặc ĐỔI LINK NGROK

### Trường hợp 1: Khi bạn sửa code ở máy và muốn cập nhật lên web Vercel
1. Mở Terminal tại thư mục `frontend` (`cd frontend`).
2. Chạy lệnh để Vercel tải code mới lên:
   ```bash
   vercel --prod
   ```

### Trường hợp 2: Khi link ngrok của bạn bị thay đổi (Ví dụ đổi tài khoản ngrok hoặc đổi tên miền khác)
1. Mở file `frontend/.env` sửa lại dòng `VITE_API_URL` bằng link ngrok Backend mới của bạn:
   ```env
   VITE_API_URL=https://<link-ngrok-moi>.ngrok-free.dev/api
   ```
2. Mở Terminal tại thư mục `frontend` và chạy lệnh dưới đây để Vercel build lại web với địa chỉ Backend mới:
   ```bash
   vercel --prod
   ```

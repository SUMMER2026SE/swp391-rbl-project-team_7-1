# Project Analysis

## 1. Cấu trúc thư mục

Root
- `package.json` : script dự án chung, chạy đồng thời frontend/backend
- `README.md` : mô tả tổng quan dự án, stack, hướng dẫn chạy

Frontend
- `frontend/package.json` : cấu hình app React, Vite, Tailwind
- `frontend/App.jsx` : định nghĩa routes, phân chia layout public/dashboard
- `frontend/main.jsx` : entry point React, Google OAuth provider
- `frontend/index.css` : CSS toàn cục
- `frontend/assets/` : tài nguyên tĩnh
- `frontend/components/` : các component tái sử dụng như `Header`, `Footer`, `Sidebar`
- `frontend/layouts/` : `DashboardLayout.jsx`, `PublicLayout.jsx`
- `frontend/pages/` : page-level components gồm auth, dashboard, project, payment, admin, freelancer, employer
- `frontend/public/` : tài nguyên public tĩnh

Backend
- `backend/package.json` : dependencies Node/Express và script chạy
- `backend/server.js` : khởi tạo Express server, middleware, route mount, health check
- `backend/config/db.js` : cấu hình `mssql` kết nối SQL Server
- `backend/routes/` : router cho `auth` và `user`
- `backend/controllers/` : xử lý business logic cho auth và user
- `backend/services/` : layer truy vấn DB cho user management
- `backend/middleware/` : auth middleware kiểm tra JWT và phân quyền admin
- `backend/utils/` : tiện ích email OTP
- `backend/.env.example` : các biến môi trường mẫu

## 2. Công nghệ đang sử dụng

Frontend
- React 19
- Vite
- TailwindCSS
- React Router DOM
- Lucide icon
- Recharts
- @react-oauth/google

Backend
- Node.js
- Express.js
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- google-auth-library
- mssql
- nodemailer
- nodemon (dev)

Database
- Microsoft SQL Server (`mssql` client)

Authentication
- JWT token
- bcrypt password hashing
- Google OAuth ID token
- Email OTP verification and password reset

## 3. Authentication flow

1. **Đăng ký**
   - Endpoint: `POST /api/auth/register`
   - Yêu cầu: `fullName`, `email`, `password`, `role` (`FREELANCER` hoặc `EMPLOYER`), optional `phone`
   - Kiểm tra email/phone tồn tại, validate mật khẩu, hash password
   - Tạo user trong bảng `users`, insert role vào `user_roles`
   - Nếu role là `FREELANCER`, tạo profile trong `freelancer_profiles`
   - Tạo OTP email verification, lưu vào `email_verifications`, gửi email qua `nodemailer`
   - Trả về `userId`, `email`, và `otpCode` (phục vụ test/simulated notification)

2. **Xác thực email**
   - Endpoint: `POST /api/auth/verify-email`
   - Yêu cầu: `email`, `code`
   - Kiểm tra user, OTP chưa dùng, hết hạn
   - Cập nhật `email_verifications.is_used = 1` và `users.is_email_verified = 1`

3. **Đăng nhập bằng email/password**
   - Endpoint: `POST /api/auth/login`
   - Yêu cầu: `email`, `password`
   - Lấy user từ DB; nếu status khác `ACTIVE` trả lỗi
   - So sánh mật khẩu với `bcrypt.compareSync`
   - Nếu email chưa xác thực: tạo OTP mới, lưu `email_verifications`, gửi email và trả `isEmailVerified: false`
   - Nếu đúng, lấy roles từ `user_roles`, tạo JWT chứa `userId`, `email`, `role`, `roles`
   - Lưu token vào `users.refresh_token` và trả token + thông tin user

4. **Google OAuth**
   - Endpoint: `POST /api/auth/google`
   - Yêu cầu: `credential` Google ID token
   - Xác thực với Google OAuth2Client
   - Nếu user tồn tại: cập nhật `is_email_verified = 1` nếu chưa xác thực
   - Nếu chưa tồn tại: tạo user mới với `role_default = FREELANCER`, hash password dummy, insert `user_roles`, tạo `freelancer_profiles`
   - Tạo JWT và cập nhật `refresh_token`

5. **Quên mật khẩu / reset password**
   - `POST /api/auth/forgot-password`: tạo OTP reset vào `password_reset_tokens`, gửi email
   - `POST /api/auth/reset-password`: kiểm tra `email`, `otpCode`, `newPassword`, hash password mới, cập nhật user và đánh dấu token đã dùng

6. **Resend OTP**
   - `POST /api/auth/resend-otp`: gửi lại OTP xác thực email mới nếu email chưa được xác thực

7. **Token auth middleware**\n   - `verifyToken` kiểm tra header `Authorization: Bearer <token>`
   - Giải mã JWT bằng `JWT_SECRET`, gán `req.user`
   - `verifyAdmin` kiểm tra `req.user.role` hoặc `roles` có `ADMIN`

## 4. Database access layer

- Kết nối chung: `backend/config/db.js`
  - Sử dụng `mssql.ConnectionPool(config).connect()`
  - `poolPromise` được export và dùng ở controller/service
  - Config lấy từ `.env`

- Truy vấn SQL trực tiếp bằng parameterized query
  - `pool.request().input(...).query(...)`
  - Hầu hết controller dùng raw SQL query để thao tác `users`, `roles`, `freelancer_profiles`, `email_verifications`, `password_reset_tokens`, `freelancer_skills`, `skills`

- Layer `services` hạn chế nhỏ chỉ cho user quản trị:
  - `getUserById(userId)`
  - `fetchAllUsers()`
  - `updateUserStatusById(userId, status)`

- Pattern DB hiện tại
  - Không dùng ORM
  - Truy vấn trực tiếp, được parameterized để tránh SQL injection
  - Controllers vẫn chứa nhiều logic truy vấn trực tiếp, chỉ một số action chuyển sang `services`

## 5. Các API hiện có

Backend routes:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/resend-otp`
- `POST /api/auth/google`

User routes (có auth):
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `PUT /api/user/change-password`
- `DELETE /api/user/account`

Admin-only routes:
- `GET /api/user/admin`
- `PUT /api/user/admin/:userId/ban`
- `PUT /api/user/admin/:userId/unban`

Frontend pages/routes đáng chú ý:
- `/` landing page
- `/login`
- `/register`
- `/verify-email`
- `/forgot-password`
- `/vnpay-gateway`
- `/payment-failed`
- `/payment-success`
- `/projects`
- `/browse-projects`
- `/project-details`
- `/profile`
- `/freelancer-dashboard`
- `/employer-dashboard`
- `/admin-dashboard`
- nhiều route dashboard khác cho employer/freelancer/admin

## 6. Coding convention của nhóm

Backend
- Dùng ES module (`import` / `export`)
- File chia theo folder rõ ràng: `controllers`, `routes`, `middleware`, `config`, `utils`, `services`
- Tên hàm camelCase
- Biến constant in hoa như `JWT_SECRET`, `DB_USER`
- Log, error messages viết tiếng Việt
- Dùng `async/await` và `try/catch`
- Giao tiếp với DB qua `poolPromise` và `.input(...).query(...)`

Frontend
- React function component
- JSX + TailwindCSS utility classes
- Sử dụng `react-router-dom` để định tuyến
- Token/user lưu vào `localStorage`
- Header/dashboard layout kiểm tra `localStorage.token`
- Đặt API trực tiếp trong `fetch('http://localhost:5000/api/...')`
- Hiển thị thông báo success/error trực tiếp trong component state

Quy ước chung
- Code sử dụng tiếng Anh cho tên biến/hàm/class
- Bình luận và thông báo frontend/backend viết Tiếng Việt
- Không có trung tâm API client chung, nhiều `fetch` trực tiếp trong page components
- Tập trung vào reusable layout và page separation

## Ghi chú bổ sung

- Dự án nhiều phần UI đã được thiết kế sẵn nhưng backend hiện chỉ bao phủ auth/user management và chưa có API đầy đủ cho project/job, proposal, payment, message.
- Có `frontend/eslint.config.js` cấu hình lint cơ bản cho JS/JSX với React hooks.
- `.gitignore` đã loại trừ `node_modules`, `.env`, logs.

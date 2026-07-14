# DATABASE_GUIDE

## 1. Phạm vi

Tài liệu này mô tả schema cơ sở dữ liệu được backend sử dụng trong dự án FJMS. Do project không có file SQL schema trực tiếp trong workspace, nội dung được suy ra từ các truy vấn SQL trong mã backend.

## 2. Các bảng chính

### 2.1 users
- `user_id` (PK)
- `full_name`
- `email`
- `phone`
- `password_hash`
- `role_default`
- `is_email_verified`
- `status`
- `refresh_token`
- `avatar_url`
- `bio`
- `company_name`
- `website_url`
- `address`
- `created_at`

Mô tả: Bảng người dùng chính cho tất cả các tài khoản. Chứa thông tin xác thực, trạng thái, role mặc định và metadata profile cơ bản.

### 2.2 roles
- `role_id` (PK)
- `role_name`

Mô tả: Bảng lookup cho các vai trò hệ thống như `ADMIN`, `EMPLOYER`, `FREELANCER`.

### 2.3 user_roles
- `user_id` (FK -> users.user_id)
- `role_id` (FK -> roles.role_id)

Mô tả: Liên kết nhiều-nhiều giữa user và role. Dùng để xác định danh sách role của người dùng.

### 2.4 freelancer_profiles
- `freelancer_id` (FK -> users.user_id)
- `availability_status`
- `rating_average`
- `total_reviews`
- `headline`
- `experience_years`
- `hourly_rate`
- `portfolio_summary`
- `updated_at`
- `created_at`

Mô tả: Thông tin chuyên sâu dành cho freelancer, bao gồm trạng thái hoạt động, mức đánh giá, mô tả kỹ năng và lịch sử hồ sơ.

### 2.5 skills
- `skill_id` (PK)
- `skill_name`
- `created_at`

Mô tả: Danh sách kỹ năng dùng chung cho hệ thống. Các kỹ năng này sau đó được gắn với freelancer qua bảng kết nối.

### 2.6 freelancer_skills
- `freelancer_id` (FK -> users.user_id)
- `skill_id` (FK -> skills.skill_id)
- `skill_level`
- `created_at`

Mô tả: Bảng liên kết giữa freelancer và kỹ năng, cho phép một freelancer có nhiều kỹ năng và mỗi kỹ năng có mức độ.

### 2.7 email_verifications
- `verification_id` (PK)
- `user_id` (FK -> users.user_id)
- `verification_code`
- `expired_at`
- `is_used`
- `created_at`

Mô tả: Lưu OTP xác thực email khi người dùng đăng ký hoặc yêu cầu gửi lại mã.

### 2.8 password_reset_tokens
- `reset_id` (PK)
- `user_id` (FK -> users.user_id)
- `reset_token`
- `expired_at`
- `is_used`
- `created_at`

Mô tả: Lưu mã OTP phục hồi mật khẩu khi người dùng quên mật khẩu.

## 3. Khóa ngoại và quan hệ

- `user_roles.user_id` -> `users.user_id`
- `user_roles.role_id` -> `roles.role_id`
- `freelancer_profiles.freelancer_id` -> `users.user_id`
- `freelancer_skills.freelancer_id` -> `users.user_id`
- `freelancer_skills.skill_id` -> `skills.skill_id`
- `email_verifications.user_id` -> `users.user_id`
- `password_reset_tokens.user_id` -> `users.user_id`

Các quan hệ chính:
- Một user có thể có nhiều role thông qua `user_roles`.
- Một freelancer có một profile trong `freelancer_profiles`.
- Một freelancer có thể có nhiều kỹ năng qua `freelancer_skills`.
- Một user có thể có nhiều record xác thực email và nhiều lần yêu cầu reset password.

## 4. Nghiệp vụ chính

### 4.1 Đăng ký người dùng
- Tạo record trong `users`.
- Gắn role mặc định vào `user_roles` dựa trên `role_default`.
- Nếu role là `FREELANCER`, tạo record `freelancer_profiles` ban đầu.
- Tạo mã OTP xác thực email trong `email_verifications`.

### 4.2 Xác thực email
- Kiểm tra `users` theo `email`.
- So sánh `verification_code` trong `email_verifications` với `user_id` và đảm bảo `is_used = 0` và chưa hết hạn.
- Cập nhật `email_verifications.is_used = 1` và `users.is_email_verified = 1`.

### 4.3 Đăng nhập
- Lấy user theo `email`.
- So sánh mật khẩu nhập vào với `password_hash`.
- Nếu tài khoản chưa xác thực email, tạo mã OTP mới trong `email_verifications` và trả về trạng thái chưa xác thực.
- Nếu đăng nhập thành công, lấy danh sách role từ `user_roles` và tạo JWT.
- Lưu token vào `users.refresh_token`.

### 4.4 Google OAuth
- Nếu user tồn tại theo `email`, dùng user đó.
- Nếu chưa tồn tại, tạo user mới với `role_default = FREELANCER`, đánh dấu `is_email_verified = 1` và tạo `freelancer_profiles`.
- Luôn đồng bộ `roles` từ bảng `user_roles`.
- Tạo JWT và cập nhật `refresh_token`.

### 4.5 Quên mật khẩu và reset password
- `forgot-password`: tạo mã `reset_token` trong `password_reset_tokens` và gửi email.
- `reset-password`: xác thực token, kiểm tra `expired_at` và `is_used`, hash mật khẩu mới, cập nhật `users.password_hash`, đánh dấu token đã dùng.

### 4.6 Cập nhật profile freelancer
- Cập nhật thông tin người dùng trong `users` (tên, phone, bio, avatar, company, website, address).
- Upsert thông tin freelancer vào `freelancer_profiles`.
- Đồng bộ kỹ năng freelancer: xóa cũ từ `freelancer_skills`, chèn lại danh sách kỹ năng mới, tạo mới skill nếu chưa tồn tại trong `skills`.

### 4.7 Quản trị user
- Lấy danh sách người dùng từ `users`.
- Thay đổi trạng thái user (`BANNED`, `ACTIVE`) trong `users.status`.
- Khi cấm user, `refresh_token` được xóa.

### 4.8 Xóa tài khoản
- So sánh mật khẩu cũ với `users.password_hash`.
- Nếu đúng, cập nhật `users.status = 'DELETED'` và xóa `refresh_token`.

## 5. Ghi chú

- Backend hiện chỉ tham chiếu các bảng liên quan đến auth/user/freelancer skills.
- README mô tả nhiều nghiệp vụ mở rộng như project, proposal, wallet, disputes, payment, nhưng những bảng này không xuất hiện trong mã backend hiện tại.
- Tài liệu này dựa trên các truy vấn SQL thực tế trong mã nguồn backend.

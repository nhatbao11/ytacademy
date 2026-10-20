# HƯỚNG DẪN DỰ ÁN & QUY TẮC PHÁT TRIỂN: BACKEND SERVICE (YT ACADEMY)

> **LƯU Ý QUAN TRỌNG CHO TẤT CẢ AGENT / DEVELOPER**:
> Tệp này ghi nhận toàn bộ quyết định kiến trúc, tiêu chuẩn kỹ thuật, mô hình dữ liệu Supabase, phân quyền (RBAC) và quy tắc phát triển của **Backend Service** cho dự án **YT Academy (ytacademy.vn)**.
> Khi tiếp tục phát triển backend, **LUÔN ĐỌC VÀ TUÂN THỦ** các quy định tại tệp này, không thay đổi cấu trúc hoặc hỏi lại các quyết định đã thống nhất.

---

## 1. CÔNG NGHỆ & KIẾN TRÚC BACKEND

* **Ngôn ngữ & Nền tảng**: Node.js (v20+) + TypeScript (Strict Mode).
* **Framework**: Express.js + TS-Node-Dev (phát triển) / TSC (production build).
* **Database Engine**: **Supabase** (PostgreSQL 15+).
* **Cơ chế xác thực (Authentication)**: JWT (JSON Web Token) kết hợp bcryptjs mã hóa mật khẩu và Supabase Client (`@supabase/supabase-js`).
* **Validation**: Zod (kiểm tra chặt chẽ payload gửi lên từ client).
* **Bảo mật & CORS**: Cho phép `http://localhost:5173` (dev) và `https://ytacademy.vn` (production).
* **Tách biệt hoàn toàn**: Thư mục `backend/` hoạt động như một microservice/API server độc lập với `frontend/`.

---

## 2. HỆ THỐNG PHÂN QUYỀN RBAC MỞ RỘNG (ROLE-BASED ACCESS CONTROL)

### Quy tắc Thiết kế (Future-Proof):
Hệ thống phân quyền được xây dựng theo mô hình **RBAC 2 tầng** (Role + Permission) và hỗ trợ **Đa vai trò (Multi-role)**:

1. **Các vai trò hiện tại (Current Roles)**:
   * `student` (**Học viên**): Quyền mặc định khi đăng ký tài khoản. Có quyền xem khóa học đã mua, bài giảng video, gửi câu hỏi thảo luận, nhận chứng nhận.
   * `admin` (**Quản trị viên hệ thống**): Toàn quyền điều hành, quản trị người dùng, gán vai trò, quản lý khóa học, đơn hàng và thống kê tài chính.

2. **Các vai trò mở rộng sẵn sàng (Ready for Extension)**:
   * `instructor` (**Giảng viên - VD: Mr. Trần Minh Nhật**): Đăng tải giáo trình, đề cương, bài tập, chấm điểm và giải đáp học viên.
   * `collaborator` (**Cộng tác viên / Đại lý Affiliate**): Xem link giới thiệu, thống kê lượt chuyển đổi, hoa hồng và doanh số.
   * `assistant` (**Trợ giảng**): Đôn đốc tiến độ học tập, hỗ trợ học viên 24/7.

3. **Cấu trúc Cơ sở dữ liệu (Supabase)**:
   * `roles`: Định nghĩa danh mục vai trò (`code`, `name`, `description`).
   * `permissions`: Định nghĩa quyền chi tiết theo từng module (`code`, `name`, `module`).
   * `role_permissions`: Bảng nối N-N giữa vai trò và quyền chi tiết.
   * `users`: Bảng tài khoản người dùng (`id`, `email`, `password_hash`, `full_name`, `phone`, `role_code`, `status`).
   * `user_roles`: Bảng nối N-N cho phép 1 người dùng sở hữu đồng thời nhiều vai trò (ví dụ: vừa là Giảng viên vừa là Quản trị viên).
   * `user_enrolled_courses`: Danh sách các môn học học viên đã mua/kích hoạt (`c-fa`, `c-fa-hybrid`, `c-fa-records`, `c-fr`, `c-aa`).

---

## 3. CẤU TRÚC THƯ MỤC BACKEND

```text
backend/
├── database/
│   └── schema.sql             # Toàn bộ SQL script (Tables, Triggers, RLS, Seed Roles)
├── src/
│   ├── config/                # Cấu hình môi trường, Supabase Client, JWT Secrets
│   │   ├── env.ts
│   │   └── supabase.ts
│   ├── constants/             # Enums: Role, Permission, UserStatus, ErrorCodes
│   │   └── roles.ts
│   ├── controllers/           # Tầng tiếp nhận request & trả về response HTTP
│   │   ├── authController.ts
│   │   └── userController.ts
│   ├── middlewares/           # Tầng middleware xác thực & phân quyền
│   │   ├── authMiddleware.ts  # Xác thực token JWT
│   │   ├── roleMiddleware.ts  # Kiểm tra vai trò: requireRole(['admin', 'instructor'])
│   │   └── validate.ts        # Zod request validator
│   ├── models/                # TypeScript Interfaces & DTOs
│   │   ├── user.ts
│   │   └── role.ts
│   ├── routes/                # Định tuyến API
│   │   ├── authRoutes.ts      # POST /api/v1/auth/register, POST /api/v1/auth/login, GET /me
│   │   ├── userRoutes.ts      # Quản lý user & phân quyền (Admin only)
│   │   └── index.ts
│   ├── services/              # Tầng nghiệp vụ xử lý logic & tương tác Supabase
│   │   ├── authService.ts
│   │   └── userService.ts
│   ├── app.ts                 # Cấu hình Express app (CORS, JSON Parser, Logger)
│   └── server.ts              # Entrypoint khởi động HTTP server
├── .env.example               # Mẫu biến môi trường
├── package.json
├── tsconfig.json
└── AGENTS.md                  # Quy tắc & tài liệu bộ nhớ backend
```

---

## 4. QUY TẮC PHÁT TRIỂN & VIẾT CODE BACKEND

1. **Không dùng `any`**: Mọi request body, params, response và Supabase queries đều phải có kiểu dữ liệu TypeScript rõ ràng.
2. **Xử lý Mật khẩu**: Bắt buộc băm mật khẩu bằng `bcryptjs` với salt rounds tối thiểu là 10. Tuyệt đối không lưu plain text.
3. **Phân quyền linh hoạt**:
   * Khi tạo API cần bảo vệ, dùng middleware `verifyToken`.
   * Khi kiểm tra quyền, dùng `requireRole([Role.ADMIN])` hoặc `requireRole([Role.ADMIN, Role.INSTRUCTOR])`.
4. **Chuẩn định dạng Response API**:
   ```json
   {
     "success": true,
     "message": "Thông điệp phản hồi",
     "data": { ... }
   }
   ```
   Nếu có lỗi:
   ```json
   {
     "success": false,
     "message": "Mô tả lỗi chi tiết",
     "errorCode": "INVALID_CREDENTIALS"
   }
   ```
5. **Chế độ Mock Fallback Thông minh**:
   * Khi chưa điền `SUPABASE_SERVICE_ROLE_KEY` hoặc môi trường dev offline, service phải có cơ chế fallback mock trong bộ nhớ để frontend kiểm thử mượt mà không bị crash server.

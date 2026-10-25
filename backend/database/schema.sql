-- ==============================================================================
-- YT ACADEMY (ytacademy.vn) - DATABASE SCHEMA WITH EXTENSIBLE RBAC
-- Target Engine: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- Bật extension pgcrypto để sinh UUID ngẫu nhiên
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. BẢNG ROLES (VAI TRÒ / QUYỀN HỆ THỐNG - DỄ DÀNG MỞ RỘNG)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL, -- 'student', 'admin', 'instructor', 'collaborator', ...
  name VARCHAR(100) NOT NULL,       -- 'Học viên', 'Quản trị viên', 'Giảng viên', ...
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 2. BẢNG PERMISSIONS (QUYỀN CHI TIẾT THEO TỪNG CHỨC NĂNG)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL, -- 'course:read', 'course:create', 'user:manage', ...
  name VARCHAR(150) NOT NULL,
  module VARCHAR(50) NOT NULL,       -- 'courses', 'users', 'orders', 'affiliate', ...
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 3. BẢNG ROLE_PERMISSIONS (LIÊN KẾT NHIỀU - NHIỀU GIỮA ROLES & PERMISSIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (role_id, permission_id)
);

-- ------------------------------------------------------------------------------
-- 4. BẢNG USERS (TÀI KHOẢN NGƯỜI DÙNG)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(25),
  avatar_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
  role_code VARCHAR(50) NOT NULL DEFAULT 'student' REFERENCES roles(code) ON UPDATE CASCADE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 5. BẢNG USER_ROLES (ĐA VAI TRÒ - HỖ TRỢ 1 TÀI KHOẢN CÓ NHIỀU QUYỀN MỞ RỘNG)
-- Ví dụ: Vừa là Giảng viên (instructor) vừa là Quản trị viên (admin)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_code VARCHAR(50) NOT NULL REFERENCES roles(code) ON DELETE CASCADE ON UPDATE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (user_id, role_code)
);

-- ------------------------------------------------------------------------------
-- 6. BẢNG USER_ENROLLED_COURSES (DANH SÁCH MÔN HỌC ĐÃ MUA / KÍCH HOẠT CỦA HỌC VIÊN)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_enrolled_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(50) NOT NULL, -- 'c-fa', 'c-fa-hybrid', 'c-fa-records', 'c-fr', 'c-aa'
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'locked')),
  enrolled_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- ------------------------------------------------------------------------------
-- 7. TRIGGER TỰ ĐỘNG CẬP NHẬT UPDATED_AT
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 8. TRIGGER TỰ ĐỘNG ĐỒNG BỘ ROLE VÀO USER_ROLES KHI TẠO USER MỚI
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, role_code)
  VALUES (NEW.id, NEW.role_code)
  ON CONFLICT (user_id, role_code) DO NOTHING;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_sync_user_role ON users;
CREATE TRIGGER trigger_sync_user_role
  AFTER INSERT OR UPDATE OF role_code ON users
  FOR EACH ROW
  EXECUTE PROCEDURE sync_user_role();

-- ------------------------------------------------------------------------------
-- 9. SEED DỮ LIỆU BAN ĐẦU: CÁC VAI TRÒ (ROLES) & QUYỀN HẠN (PERMISSIONS)
-- ------------------------------------------------------------------------------
INSERT INTO roles (code, name, description)
VALUES
  ('student', 'Học viên', 'Người học tại YT Academy, có quyền truy cập khóa học đã mua, xem bài giảng, làm bài tập và nhận hỗ trợ học tập.'),
  ('admin', 'Quản trị viên', 'Toàn quyền điều hành hệ thống: quản lý tài khoản, phân quyền, quản lý khóa học, đơn hàng và doanh thu.'),
  ('instructor', 'Giảng viên', 'Chuyên gia phụ trách chuyên môn: đăng tải tài liệu, tạo đề thi, giải đáp thắc mắc và chấm bài cho học viên.'),
  ('collaborator', 'Cộng tác viên / Đại lý', 'Đối tác phát triển thị trường: theo dõi doanh số, quản lý mã giới thiệu affiliate và hoa hồng.'),
  ('assistant', 'Trợ giảng', 'Hỗ trợ giảng viên: đôn đốc học viên, trực kênh hỏi đáp 24/7 và kiểm tra bài tập.')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Seed các quyền cơ bản (Permissions)
INSERT INTO permissions (code, name, module)
VALUES
  -- Khóa học (Courses)
  ('courses:view', 'Xem danh sách và nội dung khóa học', 'courses'),
  ('courses:create', 'Tạo mới khóa học và bài giảng', 'courses'),
  ('courses:update', 'Chỉnh sửa nội dung và học phí khóa học', 'courses'),
  ('courses:delete', 'Xóa khóa học', 'courses'),

  -- Người dùng & Phân quyền (Users & Roles)
  ('users:view', 'Xem danh sách người dùng', 'users'),
  ('users:manage', 'Quản lý tài khoản và thay đổi quyền hạn', 'users'),

  -- Đơn hàng & Học phí (Orders)
  ('orders:view', 'Xem lịch sử thanh toán và đơn hàng', 'orders'),
  ('orders:manage', 'Kích hoạt khóa học thủ công và hoàn tiền', 'orders'),

  -- Báo cáo & Thống kê (Analytics)
  ('analytics:view', 'Xem báo cáo doanh thu và tỷ lệ hoàn thành khóa học', 'analytics'),

  -- Cộng tác viên (Affiliate)
  ('affiliate:view', 'Xem thống kê hoa hồng và lượt giới thiệu', 'affiliate')
ON CONFLICT (code) DO NOTHING;

-- Gán quyền cho Admin (Admin có tất cả quyền)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'admin'
ON CONFLICT DO NOTHING;

-- Gán quyền cho Instructor (Giảng viên)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'instructor' AND p.code IN ('courses:view', 'courses:create', 'courses:update')
ON CONFLICT DO NOTHING;

-- Gán quyền cho Student (Học viên)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'student' AND p.code IN ('courses:view')
ON CONFLICT DO NOTHING;

-- Gán quyền cho Collaborator (Cộng tác viên)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'collaborator' AND p.code IN ('affiliate:view', 'courses:view')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 7. SUPABASE AUTH TRIGGER: TỰ ĐỘNG ĐỒNG BỘ AUTH.USERS -> PUBLIC.USERS
-- ------------------------------------------------------------------------------
-- Khi có tài khoản đăng ký qua Supabase Auth (auth.users), trigger này tự động
-- tạo bản ghi tương ứng vào bảng public.users để hiển thị ngay trong Table Editor!

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    password_hash,
    full_name,
    phone,
    role_code,
    status
  )
  VALUES (
    new.id,
    new.email,
    'SUPABASE_AUTH_MANAGED',
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger lắng nghe sự kiện INSERT trên auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 8. BẢNG COURSE_REGISTRATIONS (DANH SÁCH HỌC VIÊN ĐĂNG KÝ MÔN HỌC / ĐƠN HÀNG)
-- ------------------------------------------------------------------------------
-- Lưu trữ đầy đủ thông tin mỗi lần học viên bấm 'XÁC NHẬN ĐĂNG KÝ'
CREATE TABLE IF NOT EXISTS public.course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  student_name VARCHAR(150) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  student_phone VARCHAR(25),
  course_id VARCHAR(50) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  course_price NUMERIC DEFAULT 0,
  sale_price NUMERIC DEFAULT 0,
  voucher_code VARCHAR(50),
  final_price NUMERIC DEFAULT 0,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'completed', 'cancelled')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Bật Row Level Security (RLS) cho phép đọc ghi an toàn
ALTER TABLE public.course_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép học viên tạo đơn đăng ký" ON public.course_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Cho phép đọc đơn đăng ký" ON public.course_registrations
  FOR SELECT USING (true);



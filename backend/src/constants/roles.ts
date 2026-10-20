/**
 * Danh mục Vai trò (Roles) trong hệ thống YT Academy
 * Thiết kế mở rộng: Hiện tại student & admin, sẵn sàng cho instructor, collaborator, assistant
 */
export enum Role {
  STUDENT = 'student',          // Học viên (mặc định)
  ADMIN = 'admin',              // Quản trị viên
  INSTRUCTOR = 'instructor',    // Giảng viên (Mr. Trần Minh Nhật...)
  COLLABORATOR = 'collaborator',// Cộng tác viên / Affiliate
  ASSISTANT = 'assistant',      // Trợ giảng
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export const ROLE_NAMES: Record<Role, string> = {
  [Role.STUDENT]: 'Học viên',
  [Role.ADMIN]: 'Quản trị viên',
  [Role.INSTRUCTOR]: 'Giảng viên',
  [Role.COLLABORATOR]: 'Cộng tác viên',
  [Role.ASSISTANT]: 'Trợ giảng',
}

export const DEFAULT_ROLE = Role.STUDENT

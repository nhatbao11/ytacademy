import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env'
import { getSupabaseClient, isSupabaseConfigured } from '../config/supabase'
import { Role, UserStatus, DEFAULT_ROLE } from '../constants/roles'
import { IUser, IUserInDb, IAuthPayload } from '../models/user'

export interface RegisterDTO {
  email: string
  password: string
  fullName: string
  phone?: string
  role?: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface AuthResponse {
  user: IUser
  token: string
  enrolledCourseIds: string[]
}

// In-Memory Database Fallback (Dành cho kiểm thử cục bộ khi chưa điền Supabase credentials)
const mockUsersDb: Array<{
  id: string
  email: string
  passwordHash: string
  fullName: string
  phone?: string
  roleCode: string
  roles: string[]
  status: UserStatus
  enrolledCourseIds: string[]
  createdAt: string
}> = [
  {
    id: 'admin-seed-01',
    email: 'admin@ytacademy.vn',
    passwordHash: bcrypt.hashSync('Admin@123456', 10),
    fullName: 'Quản trị viên YT Academy',
    phone: '0822082407',
    roleCode: Role.ADMIN,
    roles: [Role.ADMIN, Role.INSTRUCTOR],
    status: UserStatus.ACTIVE,
    enrolledCourseIds: ['c-fa-records', 'c-fa-hybrid', 'c-fa', 'c-fr', 'c-aa'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student-seed-01',
    email: 'hocvien@ytacademy.vn',
    passwordHash: bcrypt.hashSync('Hocvien@123456', 10),
    fullName: 'Học viên Mẫu',
    phone: '0901234567',
    roleCode: Role.STUDENT,
    roles: [Role.STUDENT],
    status: UserStatus.ACTIVE,
    enrolledCourseIds: ['c-fa'],
    createdAt: new Date().toISOString(),
  },
]

export class AuthService {
  /**
   * Tạo token JWT cho người dùng
   */
  private static generateToken(payload: IAuthPayload): string {
    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    } as jwt.SignOptions)
  }

  /**
   * Đăng ký tài khoản người dùng mới
   */
  public static async register(dto: RegisterDTO): Promise<AuthResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase()
    const roleCode = dto.role || DEFAULT_ROLE

    // 1. Nếu đã kết nối Supabase
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient()

      // Kiểm tra email trùng
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', normalizedEmail)
        .single()

      if (existingUser) {
        throw new Error('Email này đã được đăng ký tài khoản tại YT Academy.')
      }

      // Băm mật khẩu
      const passwordHash = await bcrypt.hash(dto.password, 10)

      // Tạo user mới
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: normalizedEmail,
          password_hash: passwordHash,
          full_name: dto.fullName.trim(),
          phone: dto.phone?.trim() || null,
          role_code: roleCode,
          status: UserStatus.ACTIVE,
        })
        .select()
        .single()

      if (insertError || !newUser) {
        throw new Error(`Lỗi tạo tài khoản: ${insertError?.message || 'Không xác định'}`)
      }

      const token = this.generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role_code,
        roles: [newUser.role_code],
      })

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          phone: newUser.phone,
          status: newUser.status as UserStatus,
          roleCode: newUser.role_code,
          roles: [newUser.role_code],
        },
        token,
        enrolledCourseIds: [],
      }
    }

    // 2. Chế độ Mock Fallback khi chưa cấu hình Supabase
    const existing = mockUsersDb.find((u) => u.email === normalizedEmail)
    if (existing) {
      throw new Error('Email này đã được đăng ký tài khoản tại YT Academy.')
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const newMockUser = {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
      passwordHash,
      fullName: dto.fullName.trim(),
      phone: dto.phone?.trim(),
      roleCode,
      roles: [roleCode],
      status: UserStatus.ACTIVE,
      enrolledCourseIds: [],
      createdAt: new Date().toISOString(),
    }

    mockUsersDb.push(newMockUser)

    const token = this.generateToken({
      userId: newMockUser.id,
      email: newMockUser.email,
      role: newMockUser.roleCode,
      roles: newMockUser.roles,
    })

    return {
      user: {
        id: newMockUser.id,
        email: newMockUser.email,
        fullName: newMockUser.fullName,
        phone: newMockUser.phone,
        status: newMockUser.status,
        roleCode: newMockUser.roleCode,
        roles: newMockUser.roles,
      },
      token,
      enrolledCourseIds: [],
    }
  }

  /**
   * Đăng nhập hệ thống
   */
  public static async login(dto: LoginDTO): Promise<AuthResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase()

    // 1. Nếu đã kết nối Supabase
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient()

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .single()

      if (error || !user) {
        throw new Error('Email hoặc mật khẩu không chính xác.')
      }

      if (user.status === UserStatus.BANNED) {
        throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị YT Academy.')
      }

      const isMatch = await bcrypt.compare(dto.password, user.password_hash)
      if (!isMatch) {
        throw new Error('Email hoặc mật khẩu không chính xác.')
      }

      // Lấy danh sách roles mở rộng của user
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_code')
        .eq('user_id', user.id)

      const roles = userRoles && userRoles.length > 0
        ? Array.from(new Set([user.role_code, ...userRoles.map((r: { role_code: string }) => r.role_code)]))
        : [user.role_code]

      // Lấy danh sách khóa học đã kích hoạt
      const { data: enrolled } = await supabase
        .from('user_enrolled_courses')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('status', 'active')

      const enrolledCourseIds = enrolled ? enrolled.map((e: { course_id: string }) => e.course_id) : []

      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role_code,
        roles,
      })

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          phone: user.phone,
          avatarUrl: user.avatar_url,
          status: user.status as UserStatus,
          roleCode: user.role_code,
          roles,
        },
        token,
        enrolledCourseIds,
      }
    }

    // 2. Chế độ Mock Fallback
    const user = mockUsersDb.find((u) => u.email === normalizedEmail)
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác.')
    }

    if (user.status === UserStatus.BANNED) {
      throw new Error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị YT Academy.')
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác.')
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.roleCode,
      roles: user.roles,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        status: user.status,
        roleCode: user.roleCode,
        roles: user.roles,
      },
      token,
      enrolledCourseIds: user.enrolledCourseIds,
    }
  }

  /**
   * Lấy thông tin cá nhân hiện tại (Profile / Me)
   */
  public static async getProfile(userId: string): Promise<IUser & { enrolledCourseIds: string[] }> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient()
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !user) {
        throw new Error('Không tìm thấy thông tin tài khoản.')
      }

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_code')
        .eq('user_id', user.id)

      const roles = userRoles && userRoles.length > 0
        ? Array.from(new Set([user.role_code, ...userRoles.map((r: { role_code: string }) => r.role_code)]))
        : [user.role_code]

      const { data: enrolled } = await supabase
        .from('user_enrolled_courses')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('status', 'active')

      const enrolledCourseIds = enrolled ? enrolled.map((e: { course_id: string }) => e.course_id) : []

      return {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        avatarUrl: user.avatar_url,
        status: user.status as UserStatus,
        roleCode: user.role_code,
        roles,
        enrolledCourseIds,
      }
    }

    const user = mockUsersDb.find((u) => u.id === userId)
    if (!user) {
      throw new Error('Không tìm thấy thông tin tài khoản.')
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status,
      roleCode: user.roleCode,
      roles: user.roles,
      enrolledCourseIds: user.enrolledCourseIds,
    }
  }

  /**
   * Lấy danh sách tất cả người dùng (Dành cho Admin)
   */
  public static async getAllUsers(): Promise<IUser[]> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient()
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, full_name, phone, role_code, status, created_at')
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)

      return (users || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        fullName: u.full_name,
        phone: u.phone,
        status: u.status as UserStatus,
        roleCode: u.role_code,
        createdAt: u.created_at,
      }))
    }

    return mockUsersDb.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      status: u.status,
      roleCode: u.roleCode,
      roles: u.roles,
      createdAt: u.createdAt,
    }))
  }

  /**
   * Cập nhật vai trò / quyền hạn người dùng (Chỉ Admin)
   */
  public static async updateUserRole(userId: string, newRole: Role | string): Promise<void> {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('users')
        .update({ role_code: newRole })
        .eq('id', userId)

      if (error) throw new Error(error.message)
      return
    }

    const user = mockUsersDb.find((u) => u.id === userId)
    if (user) {
      user.roleCode = newRole
      if (!user.roles.includes(newRole)) {
        user.roles.push(newRole)
      }
    }
  }
}

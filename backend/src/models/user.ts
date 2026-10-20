import { Role, UserStatus } from '../constants/roles'

export interface IUser {
  id: string
  email: string
  fullName: string
  phone?: string
  avatarUrl?: string
  status: UserStatus
  roleCode: Role | string
  roles?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface IUserInDb {
  id: string
  email: string
  password_hash: string
  full_name: string
  phone?: string
  avatar_url?: string
  status: string
  role_code: string
  created_at: string
  updated_at: string
}

export interface IAuthPayload {
  userId: string
  email: string
  role: Role | string
  roles: string[]
}

export interface IEnrolledCourseInDb {
  id: string
  user_id: string
  course_id: string
  status: string
  enrolled_at: string
}

export type AdminTab =
  | 'overview'
  | 'courses'
  | 'students'
  | 'reviews'
  | 'activations'
  | 'settings'

export interface IAdminStudent {
  id: string
  name: string
  email: string
  phone: string
  role: 'student' | 'admin' | 'instructor' | 'collaborator' | 'assistant'
  enrolledCourseIds: string[]
  status: 'active' | 'locked'
  registeredAt: string
  totalSpent: number
}

export interface IAdminCourse {
  id: string
  code: string
  title: string
  category: string
  format: string
  originalPrice: number
  salePrice: number
  discountPercent: number
  studentsCount: number
  rating: number
  reviewsCount: number
  isPublished: boolean
  instructorName: string
  description?: string
  chaptersCount?: number
  lessonsCount?: number
}

export interface IAdminReview {
  id: string
  studentName: string
  studentEmail: string
  courseId: string
  courseName: string
  rating: number
  comment: string
  createdAt: string
  status: 'approved' | 'pending' | 'rejected'
}

export interface IAdminActivationCode {
  id: string
  code: string
  courseId: string
  courseName: string
  createdAt: string
  expiresAt: string
  status: 'unused' | 'used' | 'revoked'
  usedByEmail?: string
  usedAt?: string
}

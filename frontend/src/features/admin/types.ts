export type AdminTab =
  | 'overview'
  | 'courses'
  | 'students'
  | 'orders'
  | 'reviews'
  | 'activations'
  | 'vouchers'
  | 'exams'
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

export interface IAdminOrder {
  id: string
  orderCode: string
  studentName: string
  studentEmail: string
  studentPhone: string
  courseId: string
  courseName: string
  amount: number
  paymentMethod: 'VietQR / Chuyển khoản' | 'ZaloPay' | 'MoMo' | 'Tiền mặt tại trung tâm'
  status: 'completed' | 'pending' | 'cancelled'
  createdAt: string
  note?: string
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

export interface IAdminVoucher {
  id: string
  code: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  applicableCourseId: string // 'all' hoặc id khóa học
  maxUses: number
  usedCount: number
  validUntil: string
  status: 'active' | 'expired'
}

export interface IAdminMaterial {
  id: string
  title: string
  courseId: string
  courseName: string
  type: 'cbe_mock' | 'lecture_notes' | 'revision_kit'
  fileFormat: string
  fileSize: string
  downloadsCount: number
  updatedAt: string
}

export type CourseCategory =
  | 'all'
  | 'applied-knowledge'
  | 'applied-skills'
  | 'strategic-professional'
  | 'acca-online'
  | 'acca-offline'

export interface IInstructor {
  id: string
  name: string
  title: string
  avatar: string
  experience: string
  coursesCount?: number
  studentsCount?: number
}

export interface ILessonDetail {
  id: string
  title: string
  titleEn?: string
  duration: string
}

export interface IChapterDetail {
  id: string
  title: string
  titleEn?: string
  lessonsCount: number
  totalDuration?: string
  totalDurationEn?: string
  lessons: ILessonDetail[]
}

export interface ICourseReview {
  id: string
  userName: string
  userRole?: string
  avatar?: string
  rating: number
  date: string
  comment: string
  commentEn?: string
}

export interface ICourse {
  id: string
  title: string
  titleEn?: string
  slug: string
  category: CourseCategory
  categoryName: string
  categoryNameEn?: string
  levelName: string // e.g. 'Applied Knowledge', 'Applied Skills', 'Strategic Professional'
  levelNameEn?: string
  instructor: IInstructor
  rating: number
  reviewCount: number
  studentCount: number
  originalPrice: number
  salePrice: number
  discountPercent: number
  thumbnail: string
  isHot?: boolean
  isNew?: boolean
  lessonsCount: number
  durationHours: string
  durationHoursEn?: string
  format?: string
  formatEn?: string
  allDevicesSupport?: string
  allDevicesSupportEn?: string
  description: string
  descriptionEn?: string
  targetAudience: string
  targetAudienceEn?: string
  whatYouWillLearn: string[]
  whatYouWillLearnEn?: string[]
  fullDescription: string
  fullDescriptionEn?: string
  chapters: IChapterDetail[]
  reviews?: ICourseReview[]
}

export interface ICategoryItem {
  id: CourseCategory
  name: string
  description: string
  courseCount: number
}

export interface ICartItem {
  course: ICourse
  addedAt: number
}

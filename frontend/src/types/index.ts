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
  duration: string
}

export interface IChapterDetail {
  id: string
  title: string
  lessonsCount: number
  totalDuration?: string
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
}

export interface ICourse {
  id: string
  title: string
  slug: string
  category: CourseCategory
  categoryName: string
  levelName: string // e.g. 'Applied Knowledge', 'Applied Skills', 'Strategic Professional'
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
  description: string
  targetAudience: string
  whatYouWillLearn: string[]
  fullDescription: string
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

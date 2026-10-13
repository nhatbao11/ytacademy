import type { ICourse } from '../../types'

export interface IEnrolledCourse {
  id: string
  course: ICourse
  status: 'active' | 'expired'
  expireDate: string
  completedLessons: number
  totalLessons: number
  progressPercent: number
}

export interface IChapter {
  id: string
  title: string
  lessonsCount: number
  lessons: {
    id: string
    title: string
    duration: string
    isCompleted?: boolean
  }[]
}

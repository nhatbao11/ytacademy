import { useState, useEffect, useMemo } from 'react'
import type { ICourse, CourseCategory } from '../../types'
import { courseService } from './courseService'

export const useCourses = () => {
  const [courses, setCourses] = useState<ICourse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let mounted = true
    courseService.getCourses().then((data) => {
      if (mounted) {
        setCourses(data)
        setLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchCategory =
        selectedCategory === 'all' || course.category === selectedCategory

      const cleanQuery = searchQuery.trim().toLowerCase()
      const matchSearch =
        !cleanQuery ||
        course.title.toLowerCase().includes(cleanQuery) ||
        course.instructor.name.toLowerCase().includes(cleanQuery) ||
        course.categoryName.toLowerCase().includes(cleanQuery)

      return matchCategory && matchSearch
    })
  }, [courses, selectedCategory, searchQuery])

  return {
    courses: filteredCourses,
    allCourses: courses,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  }
}

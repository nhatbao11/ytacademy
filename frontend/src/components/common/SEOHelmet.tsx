import { useEffect } from 'react'
import type { ICourse } from '../../types'

interface SEOProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  course?: ICourse
}

export const SEOHelmet: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  course,
}) => {
  useEffect(() => {
    // 1. Cập nhật Title
    const defaultTitle = 'YT Academy – Khóa Học ACCA Chuẩn Quốc Tế | Learn Today - Grow Tomorrow'
    const finalTitle = title ? `${title} | YT Academy` : defaultTitle
    document.title = finalTitle

    // Helper cập nhật hoặc tạo meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrVal)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // 2. Cập nhật Description
    const defaultDesc =
      'Trung tâm YT Academy (ytacademy.vn) chuyên sâu đào tạo Chứng chỉ Kế toán Công chứng Anh quốc ACCA Quốc tế. Lớp 1-to-1, Nhóm nhỏ & Video Record sát định dạng đề thi CBE.'
    const finalDesc = description || defaultDesc
    setMetaTag('name', 'description', finalDesc)
    setMetaTag('property', 'og:description', finalDesc)
    setMetaTag('property', 'twitter:description', finalDesc)

    // 3. Cập nhật Open Graph Title & URL
    setMetaTag('property', 'og:title', finalTitle)
    setMetaTag('property', 'twitter:title', finalTitle)

    const finalUrl = canonicalUrl || 'https://ytacademy.vn/'
    setMetaTag('property', 'og:url', finalUrl)
    setMetaTag('property', 'twitter:url', finalUrl)

    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage)
      setMetaTag('property', 'twitter:image', ogImage)
    }

    // 4. Cập nhật Canonical Link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonicalEl) {
      canonicalEl = document.createElement('link')
      canonicalEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalEl)
    }
    canonicalEl.setAttribute('href', finalUrl)

    // 5. Cập nhật Schema.org JSON-LD riêng cho từng khóa học
    const existingCourseScript = document.getElementById('dynamic-course-schema')
    if (existingCourseScript) {
      existingCourseScript.remove()
    }

    if (course) {
      const script = document.createElement('script')
      script.id = 'dynamic-course-schema'
      script.type = 'application/ld+json'
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'YT Academy',
          sameAs: 'https://ytacademy.vn',
        },
        offers: {
          '@type': 'Offer',
          price: course.salePrice || course.originalPrice,
          priceCurrency: 'VND',
          category: 'Paid',
          availability: 'https://schema.org/InStock',
          url: finalUrl,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: course.format?.toLowerCase().includes('online') ? 'online' : 'blended',
          instructor: {
            '@type': 'Person',
            name: course.instructor?.name || 'Mr. Trần Minh Nhật',
          },
        },
      })
      document.head.appendChild(script)
    }

    return () => {
      // Cleanup script khi unmount
      const s = document.getElementById('dynamic-course-schema')
      if (s) s.remove()
    }
  }, [title, description, canonicalUrl, ogImage, course])

  return null
}

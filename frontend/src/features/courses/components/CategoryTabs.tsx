import React from 'react'
import { useTranslation } from 'react-i18next'
import type { CourseCategory } from '../../../types'

interface CategoryTabsProps {
  selectedCategory: CourseCategory
  onSelectCategory: (cat: CourseCategory) => void
  totalCount: number
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation()

  const tabs: { id: CourseCategory; label: string }[] = [
    { id: 'all', label: t('courses.tabAll') },
    { id: 'applied-knowledge', label: t('courses.tabAppliedKnowledge') },
    { id: 'applied-skills', label: t('courses.tabAppliedSkills') },
    { id: 'strategic-professional', label: t('courses.tabStrategicProfessional') },
    { id: 'acca-online', label: t('courses.tabAccaOnline') },
    { id: 'acca-offline', label: t('courses.tabAccaOffline') },
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
      {tabs.map((tab) => {
        const isActive = selectedCategory === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectCategory(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors border rounded-none cursor-pointer ${
              isActive
                ? 'bg-[#0B2545] text-amber-400 border-[#0B2545]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

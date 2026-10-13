import React from 'react'
import { useTranslation } from 'react-i18next'
import { Award, MonitorPlay, HeartHandshake, Briefcase } from 'lucide-react'

export const WhyChooseUs: React.FC = () => {
  const { t } = useTranslation()

  const items = [
    { icon: Award, title: t('whyUs.f1Title'), desc: t('whyUs.f1Desc') },
    { icon: MonitorPlay, title: t('whyUs.f2Title'), desc: t('whyUs.f2Desc') },
    { icon: HeartHandshake, title: t('whyUs.f3Title'), desc: t('whyUs.f3Desc') },
    { icon: Briefcase, title: t('whyUs.f4Title'), desc: t('whyUs.f4Desc') },
  ]

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 mb-8">
          {t('whyUs.title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

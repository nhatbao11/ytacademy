import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { useCartStore } from '../cartStore'
import { useAuthStore } from '../../auth/authStore'
import { formatCurrency } from '../../../utils/format'

export const CartDrawer: React.FC = () => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'vi'
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    clearCart,
    applyVoucher,
    voucherCode,
    discountRate,
    getSubtotal,
    getTotal,
  } = useCartStore()
  const { isLoggedIn, openAuthModal, addEnrolledCourse } = useAuthStore()

  const [inputCode, setInputCode] = useState('')
  const [voucherNotice, setVoucherNotice] = useState<{ text: string; success: boolean } | null>(null)
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false)

  if (!isOpen) return null

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim()) return
    const res = applyVoucher(inputCode)
    setVoucherNotice({ text: res.message, success: res.success })
  }

  const handleCheckout = () => {
    if (!isLoggedIn) {
      openAuthModal('login', 'auth.loginToCheckout', () => {
        items.forEach((item) => addEnrolledCourse(item.course.id))
        setIsCheckoutSuccess(true)
        setTimeout(() => {
          clearCart()
          setIsCheckoutSuccess(false)
          closeCart()
        }, 2500)
      })
      return
    }

    items.forEach((item) => addEnrolledCourse(item.course.id))
    setIsCheckoutSuccess(true)
    setTimeout(() => {
      clearCart()
      setIsCheckoutSuccess(false)
      closeCart()
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-none bg-amber-400 text-slate-950 font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{t('cart.title')}</h3>
                <span className="text-xs text-slate-500">
                  {items.length} {t('cart.itemsCount')}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-none text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Checkout Success Feedback */}
          {isCheckoutSuccess ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-none bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-xl font-black text-slate-900">{t('cart.orderSuccess')}</h4>
              <p className="text-sm text-slate-600">
                {t('cart.orderSuccessDesc')}
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-20 h-20 rounded-none bg-slate-100 flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-10 h-10 stroke-1" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{t('cart.emptyTitle')}</h4>
                      <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                        {t('cart.emptyDesc')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeCart}
                      className="px-5 py-2.5 rounded-none bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      {t('cart.exploreCourses')}
                    </button>
                  </div>
                ) : (
                  items.map(({ course }) => (
                    <div
                      key={course.id}
                      className="flex gap-3.5 p-3 rounded-none border border-slate-200/80 hover:border-amber-400/50 transition-all bg-white shadow-2xs"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-20 h-16 rounded-none object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {course.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {course.instructor.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-extrabold text-[#0B2545]">
                            {formatCurrency(course.salePrice, currentLang)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(course.id)}
                            className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                            title={t('cart.remove')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Calculations & Checkout */}
              {items.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                  {/* Voucher code input */}
                  <form onSubmit={handleApplyVoucher} className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          placeholder={t('cart.voucherPlaceholder')}
                          className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-none focus:border-amber-400 focus:outline-none uppercase"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-2 text-xs font-bold bg-slate-900 text-white rounded-none hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {t('cart.applyVoucher')}
                      </button>
                    </div>
                    {voucherNotice && (
                      <p
                        className={`text-[11px] ${
                          voucherNotice.success ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {voucherNotice.text}
                      </p>
                    )}
                  </form>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span>{t('cart.subtotal')}</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(getSubtotal(), currentLang)}
                      </span>
                    </div>

                    {discountRate > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>{t('cart.discount')} ({voucherCode} -{discountRate * 100}%)</span>
                        <span>-{formatCurrency(getSubtotal() * discountRate, currentLang)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                      <span>{t('cart.total')}</span>
                      <span className="text-[#0B2545]">
                        {formatCurrency(getTotal(), currentLang)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-none shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 text-sm"
                  >
                    <span>{t('cart.checkout')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t('cart.guarantee')}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

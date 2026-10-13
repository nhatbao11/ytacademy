import { create } from 'zustand'
import type { ICourse, ICartItem } from '../../types'

interface CartState {
  items: ICartItem[]
  isOpen: boolean
  voucherCode: string
  discountRate: number
  addToCart: (course: ICourse) => void
  removeFromCart: (courseId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  applyVoucher: (code: string) => { success: boolean; message: string }
  getTotalCount: () => number
  getSubtotal: () => number
  getTotal: () => number
}

// Load initial cart from localStorage if present
const getSavedCart = (): ICartItem[] => {
  try {
    const saved = localStorage.getItem('yt_academy_cart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: getSavedCart(),
  isOpen: false,
  voucherCode: '',
  discountRate: 0,

  addToCart: (course: ICourse) => {
    set((state) => {
      const exists = state.items.some((item) => item.course.id === course.id)
      if (exists) {
        return { isOpen: true }
      }
      const updated = [...state.items, { course, addedAt: Date.now() }]
      try {
        localStorage.setItem('yt_academy_cart', JSON.stringify(updated))
      } catch {
        // Ignore localStorage error
      }
      return { items: updated, isOpen: true }
    })
  },

  removeFromCart: (courseId: string) => {
    set((state) => {
      const updated = state.items.filter((item) => item.course.id !== courseId)
      try {
        localStorage.setItem('yt_academy_cart', JSON.stringify(updated))
      } catch {
        // Ignore localStorage error
      }
      return { items: updated }
    })
  },

  clearCart: () => {
    try {
      localStorage.removeItem('yt_academy_cart')
    } catch {
      // Ignore
    }
    set({ items: [], voucherCode: '', discountRate: 0 })
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  applyVoucher: (code: string) => {
    const clean = code.trim().toUpperCase()
    if (clean === 'YTACADEMY' || clean === 'VIP2026') {
      set({ voucherCode: clean, discountRate: 0.1 })
      return { success: true, message: 'Áp dụng mã giảm 10% thành công!' }
    } else if (clean === 'BIG4PASS') {
      set({ voucherCode: clean, discountRate: 0.15 })
      return { success: true, message: 'Áp dụng mã giảm 15% thành công!' }
    }
    return { success: false, message: 'Mã voucher không hợp lệ hoặc đã hết hạn.' }
  },

  getTotalCount: () => {
    return get().items.length
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.course.salePrice, 0)
  },

  getTotal: () => {
    const subtotal = get().getSubtotal()
    const discount = subtotal * get().discountRate
    return Math.max(0, subtotal - discount)
  },
}))

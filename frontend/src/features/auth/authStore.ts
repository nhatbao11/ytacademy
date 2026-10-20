import { create } from 'zustand'

export interface IUser {
  id?: string
  name: string
  email: string
  phone?: string
  role?: string
  roles?: string[]
  token?: string
}

interface AuthState {
  isLoggedIn: boolean
  user: IUser | null
  token: string | null
  enrolledCourseIds: string[]
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'register'
  authHintMessage: string | null
  pendingAction: (() => void) | null

  openAuthModal: (
    mode?: 'login' | 'register',
    hint?: string | null,
    onAfterLogin?: (() => void) | null
  ) => void
  closeAuthModal: () => void
  login: (userData: IUser, enrolledIds?: string[], token?: string) => void
  logout: () => void
  addEnrolledCourse: (courseId: string) => void
}

// Lấy thông tin phiên đăng nhập đã lưu từ localStorage (nếu có)
const getSavedAuth = (): {
  isLoggedIn: boolean
  user: IUser | null
  token: string | null
  enrolledCourseIds: string[]
} => {
  try {
    const saved = localStorage.getItem('yt_academy_auth')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.isLoggedIn && parsed.user) {
        return {
          isLoggedIn: true,
          user: parsed.user,
          token: parsed.token || localStorage.getItem('yt_academy_token') || null,
          enrolledCourseIds: Array.isArray(parsed.enrolledCourseIds) ? parsed.enrolledCourseIds : ['c-fa'],
        }
      }
    }
  } catch {
    // Ignore error
  }
  return {
    isLoggedIn: false,
    user: null,
    token: null,
    enrolledCourseIds: [],
  }
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initial = getSavedAuth()

  return {
    isLoggedIn: initial.isLoggedIn,
    user: initial.user,
    token: initial.token,
    enrolledCourseIds: initial.enrolledCourseIds,
    isAuthModalOpen: false,
    authModalMode: 'login',
    authHintMessage: null,
    pendingAction: null,

    openAuthModal: (mode = 'login', hint = null, onAfterLogin = null) => {
      set({
        isAuthModalOpen: true,
        authModalMode: mode,
        authHintMessage: hint || null,
        pendingAction: onAfterLogin || null,
      })
    },

    closeAuthModal: () => {
      set({
        isAuthModalOpen: false,
        authHintMessage: null,
        pendingAction: null,
      })
    },

    login: (userData: IUser, enrolledIds = ['c-fa'], token?: string) => {
      const state = get()
      const currentEnrolled = state.enrolledCourseIds.length > 0 ? state.enrolledCourseIds : enrolledIds
      const finalToken = token || userData.token || null

      const authData = {
        isLoggedIn: true,
        user: { ...userData, token: finalToken || undefined },
        token: finalToken,
        enrolledCourseIds: currentEnrolled,
      }

      try {
        localStorage.setItem('yt_academy_auth', JSON.stringify(authData))
        if (finalToken) {
          localStorage.setItem('yt_academy_token', finalToken)
        }
      } catch {
        // Ignore localStorage error
      }

      const pending = state.pendingAction

      set({
        isLoggedIn: true,
        user: { ...userData, token: finalToken || undefined },
        token: finalToken,
        enrolledCourseIds: currentEnrolled,
        isAuthModalOpen: false,
        authHintMessage: null,
        pendingAction: null,
      })

      // Thực thi hành động người dùng đang định làm sau khi đăng nhập thành công
      if (pending && typeof pending === 'function') {
        try {
          pending()
        } catch (err) {
          console.error('Lỗi khi thực thi pending action:', err)
        }
      }
    },

    logout: () => {
      try {
        localStorage.removeItem('yt_academy_auth')
        localStorage.removeItem('yt_academy_token')
      } catch {
        // Ignore localStorage error
      }
      set({
        isLoggedIn: false,
        user: null,
        token: null,
        enrolledCourseIds: [],
        isAuthModalOpen: false,
        authHintMessage: null,
        pendingAction: null,
      })
    },

    addEnrolledCourse: (courseId: string) => {
      set((state) => {
        if (state.enrolledCourseIds.includes(courseId)) return state
        const updated = [...state.enrolledCourseIds, courseId]
        if (state.isLoggedIn) {
          try {
            localStorage.setItem(
              'yt_academy_auth',
              JSON.stringify({
                isLoggedIn: state.isLoggedIn,
                user: state.user,
                enrolledCourseIds: updated,
              })
            )
          } catch {
            // Ignore
          }
        }
        return { enrolledCourseIds: updated }
      })
    },
  }
})

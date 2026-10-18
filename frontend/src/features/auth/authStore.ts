import { create } from 'zustand'

export interface IUser {
  name: string
  email: string
  phone?: string
  role?: string
}

interface AuthState {
  isLoggedIn: boolean
  user: IUser | null
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
  login: (userData: IUser, enrolledIds?: string[]) => void
  logout: () => void
  addEnrolledCourse: (courseId: string) => void
}

// Lấy thông tin phiên đăng nhập đã lưu từ localStorage (nếu có)
const getSavedAuth = (): { isLoggedIn: boolean; user: IUser | null; enrolledCourseIds: string[] } => {
  try {
    const saved = localStorage.getItem('yt_academy_auth')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.isLoggedIn && parsed.user) {
        return {
          isLoggedIn: true,
          user: parsed.user,
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
    enrolledCourseIds: [],
  }
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initial = getSavedAuth()

  return {
    isLoggedIn: initial.isLoggedIn,
    user: initial.user,
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

    login: (userData: IUser, enrolledIds = ['c-fa']) => {
      const state = get()
      const currentEnrolled = state.enrolledCourseIds.length > 0 ? state.enrolledCourseIds : enrolledIds

      const authData = {
        isLoggedIn: true,
        user: userData,
        enrolledCourseIds: currentEnrolled,
      }

      try {
        localStorage.setItem('yt_academy_auth', JSON.stringify(authData))
      } catch {
        // Ignore localStorage error
      }

      const pending = state.pendingAction

      set({
        isLoggedIn: true,
        user: userData,
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
      } catch {
        // Ignore localStorage error
      }
      set({
        isLoggedIn: false,
        user: null,
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

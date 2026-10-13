import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Lock, Mail, User, Phone, CheckCircle2, ShieldCheck, Loader2, RotateCw } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  initialMode?: 'login' | 'register'
  onClose: () => void
}

// Danh sách các mã Captcha ngẫu nhiên mẫu
const CAPTCHA_POOL = ['7K9X', 'AC26', 'Y4T8', 'M9F3', 'B7R1', '8N2P', 'P5W9']

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
}) => {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Human Verification (Bạn có phải con người không?)
  const [isHumanVerified, setIsHumanVerified] = useState(false)
  const [isVerifyingHuman, setIsVerifyingHuman] = useState(false)

  // Captcha Code Challenge
  const [captchaCode, setCaptchaCode] = useState('7K9X')
  const [userCaptchaInput, setUserCaptchaInput] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  // Sinh mã Captcha ngẫu nhiên mới
  const generateNewCaptcha = () => {
    const randomIndex = Math.floor(Math.random() * CAPTCHA_POOL.length)
    setCaptchaCode(CAPTCHA_POOL[randomIndex])
    setUserCaptchaInput('')
  }

  useEffect(() => {
    if (isOpen) {
      generateNewCaptcha()
      setIsHumanVerified(false)
      setIsVerifyingHuman(false)
      setUserCaptchaInput('')
      setValidationError(null)
    }
  }, [isOpen, mode])

  if (!isOpen) return null

  // Click xác thực người dùng (Human verification click)
  const handleVerifyHuman = () => {
    if (isHumanVerified || isVerifyingHuman) return
    setIsVerifyingHuman(true)
    setValidationError(null)

    setTimeout(() => {
      setIsVerifyingHuman(false)
      setIsHumanVerified(true)
    }, 900)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Kiểm tra xác nhận con người
    if (!isHumanVerified) {
      setValidationError(t('auth.captchaError'))
      return
    }

    // 2. Kiểm tra mã Captcha
    if (userCaptchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setValidationError(t('auth.captchaCodeMismatch'))
      return
    }

    setValidationError(null)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false)
      setIsHumanVerified(false)
      setUserCaptchaInput('')
      onClose()
    }, 1500)
  }

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setValidationError(null)
    generateNewCaptcha()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-none shadow-2xl border border-slate-200 p-5 sm:p-8 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-none text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label={t('common.close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 mb-6 pb-2 gap-6">
          <button
            type="button"
            onClick={() => handleSwitchMode('login')}
            className={`pb-2 text-base font-black uppercase tracking-wider transition-all relative ${
              mode === 'login' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('nav.login')}
            {mode === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-none" />
            )}
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('register')}
            className={`pb-2 text-base font-black uppercase tracking-wider transition-all relative ${
              mode === 'register' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('nav.register')}
            {mode === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-none" />
            )}
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-none bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {mode === 'login' ? t('auth.loginSuccess') : t('auth.registerSuccess')}
            </h4>
            <p className="text-xs text-slate-500">{t('auth.redirecting')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('auth.fullNameLabel')}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('auth.fullNamePlaceholder')}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-xs sm:text-sm focus:border-amber-400 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('auth.phoneLabel')}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('auth.phonePlaceholder')}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-xs sm:text-sm focus:border-amber-400 focus:bg-white outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-xs sm:text-sm focus:border-amber-400 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {t('auth.passwordLabel')}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-none text-xs sm:text-sm focus:border-amber-400 focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* BẢO MẬT & XÁC THỰC HUMAN / CAPTCHA (Theo yêu cầu người dùng) */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-none space-y-3">
              {/* Phần 1: "Bạn có phải con người không?" (Human Verification Box) */}
              <div
                className={`p-2.5 border transition-all rounded-none bg-white ${
                  !isHumanVerified && validationError
                    ? 'border-red-400 bg-red-50/20'
                    : isHumanVerified
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-slate-300 hover:border-amber-500'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleVerifyHuman}
                      className={`w-6 h-6 border flex items-center justify-center transition-all rounded-none cursor-pointer shrink-0 ${
                        isHumanVerified
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isVerifyingHuman
                          ? 'bg-white border-amber-500'
                          : 'bg-white border-slate-400 hover:border-amber-500'
                      }`}
                      aria-label={t('auth.areYouHuman')}
                    >
                      {isHumanVerified && <CheckCircle2 className="w-4 h-4" />}
                      {isVerifyingHuman && <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
                    </button>

                    <div className="cursor-pointer select-none" onClick={handleVerifyHuman}>
                      <span className="block text-[11px] text-slate-500 font-medium leading-none mb-0.5">
                        {t('auth.areYouHuman')}
                      </span>
                      <span
                        className={`text-xs font-bold leading-tight ${
                          isHumanVerified ? 'text-emerald-700' : 'text-slate-800'
                        }`}
                      >
                        {isVerifyingHuman
                          ? t('auth.captchaVerifying')
                          : isHumanVerified
                          ? t('auth.captchaVerified')
                          : t('auth.iAmHuman')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 select-none">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-700">
                      <ShieldCheck className="w-3 h-3 text-amber-500" />
                      <span>{t('auth.securityBadge')}</span>
                    </div>
                    <div className="text-[9px] text-slate-400">
                      <span>Anti-Bot</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần 2: Mã Captcha hiển thị & ô nhập mã */}
              <div className="space-y-1.5 pt-1 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    {t('auth.captchaInputLabel')}
                  </label>
                  <button
                    type="button"
                    onClick={generateNewCaptcha}
                    className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>{t('auth.refreshCaptcha')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Ô hiển thị mã Captcha đồ họa bảo mật (Mô phỏng canvas captcha) */}
                  <div
                    onClick={generateNewCaptcha}
                    title={t('auth.refreshCaptcha')}
                    className="h-10 px-3 bg-[#0B2545] border border-slate-700 flex items-center justify-center font-mono text-base font-black tracking-widest text-amber-400 select-none cursor-pointer rounded-none relative overflow-hidden shrink-0 shadow-inner"
                    style={{
                      letterSpacing: '0.3em',
                      textDecoration: 'line-through',
                      textDecorationColor: '#f59e0b',
                    }}
                  >
                    <span className="relative z-10 transform -rotate-1 inline-block drop-shadow-sm">
                      {captchaCode}
                    </span>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />
                  </div>

                  {/* Input nhập Captcha */}
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={userCaptchaInput}
                    onChange={(e) => {
                      setUserCaptchaInput(e.target.value)
                      if (validationError) setValidationError(null)
                    }}
                    placeholder={t('auth.captchaInputPlaceholder')}
                    className="flex-1 min-w-0 h-10 px-3 bg-white border border-slate-300 rounded-none text-xs font-mono font-bold uppercase tracking-wider focus:border-amber-500 focus:ring-0 outline-none"
                  />
                </div>
              </div>

              {/* Thông báo lỗi nếu chưa tích human hoặc gõ sai captcha */}
              {validationError && (
                <p className="text-[11px] text-red-600 font-semibold pt-0.5">
                  ⚠️ {validationError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-none font-bold text-xs sm:text-sm uppercase tracking-wider bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              {mode === 'login' ? t('auth.submitLogin') : t('auth.submitRegister')}
            </button>

            <div className="text-center text-xs text-slate-500 pt-1">
              {mode === 'login' ? (
                <>
                  <span>{t('auth.noAccount')} </span>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('register')}
                    className="font-bold text-amber-600 hover:underline"
                  >
                    {t('auth.registerNow')}
                  </button>
                </>
              ) : (
                <>
                  <span>{t('auth.haveAccount')} </span>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="font-bold text-amber-600 hover:underline"
                  >
                    {t('auth.loginNow')}
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

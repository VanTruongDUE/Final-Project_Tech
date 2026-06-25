import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { mockUsers } from '../../mocks/users.mock'
import { resolveRoleHome } from '../../utils/roles'

const defaultCredentials = {
  email: 'customer@techtonic.vn',
  password: '123456',
}

function FieldIcon({ name }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8f7069]">
      <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
        {name}
      </span>
    </span>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, login } = useAuth()
  const [formData, setFormData] = useState(defaultCredentials)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (location.state?.prefillEmail) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.prefillEmail,
        password: '',
      }))
    }
  }, [location.state])

  useEffect(() => {
    if (currentUser) {
      const fromLocation = location.state?.from

      if (fromLocation?.pathname) {
        navigate(`${fromLocation.pathname}${fromLocation.search || ''}`, {
          replace: true,
          state: fromLocation.state,
        })
        return
      }

      navigate(resolveRoleHome(currentUser.role), { replace: true })
    }
  }, [currentUser, location.state, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrorMessage('')
  }

  const handleQuickFill = (email, password) => {
    setFormData({ email, password })
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const user = await login(formData.email, formData.password)
      const fromLocation = location.state?.from

      if (fromLocation?.pathname) {
        navigate(`${fromLocation.pathname}${fromLocation.search || ''}`, {
          replace: true,
          state: fromLocation.state,
        })
        return
      }

      navigate(resolveRoleHome(user.role), { replace: true })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const noticeMessage =
    location.state?.resetSuccessMessage || location.state?.registerSuccessMessage || ''

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[#fbf9f9] px-3 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8%] top-[-10%] h-[320px] w-[320px] rounded-full bg-[#ffdad3]/50 blur-[90px]" />
        <div className="absolute bottom-[-12%] right-[-10%] h-[320px] w-[320px] rounded-full bg-[#ffb4a4]/35 blur-[100px]" />
      </div>

      <main className="relative z-10 w-full max-w-[480px] rounded-xl border border-[#e3beb6] bg-white p-8 shadow-[0px_12px_32px_rgba(0,0,0,0.05)] sm:p-12">
        <div className="mb-12 text-center">
          <Link to="/" className="text-[32px] font-bold tracking-tight text-[#ee4d2d]">
            TechToShop
          </Link>
          <p className="mt-3 text-sm text-[#5b403b]">Quản trị hệ thống & Cửa hàng</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-[#1b1c1c]">
              Email hoặc Số điện thoại
            </label>
            <div className="relative">
              <FieldIcon name="person" />
              <input
                id="email"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email hoặc số điện thoại"
                className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white pl-10 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/20"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-[#1b1c1c]">
              Mật khẩu
            </label>
            <div className="relative">
              <FieldIcon name="lock" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white pl-10 pr-12 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8f7069] transition hover:text-[#ee4d2d]"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-[-8px] flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#1b1c1c]">
              <input type="checkbox" className="h-4 w-4 rounded border-[#e3beb6] accent-[#ee4d2d]" />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-[#ee4d2d] hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          {noticeMessage ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {noticeMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#ee4d2d] text-sm font-semibold text-white transition hover:bg-[#b22204] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_forward
            </span>
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#e3beb6]" />
          <span className="text-[12px] uppercase tracking-[0.22em] text-[#8f7069]">hoặc</span>
          <div className="h-px flex-1 bg-[#e3beb6]" />
        </div>

        <div className="text-center text-sm text-[#1b1c1c]">
          Chưa có tài khoản?
          <Link to="/register" className="ml-1 font-medium text-[#ee4d2d] hover:underline">
            Đăng ký ngay
          </Link>
        </div>

        <div className="mt-6 border-t border-[#e3beb6]/70 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8f7069]">
            Tài khoản demo
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {mockUsers.map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => handleQuickFill(user.email, user.password)}
                className="rounded-lg border border-[#e3beb6]/80 px-3 py-2 text-left text-xs transition hover:border-[#ee4d2d] hover:bg-[#fff1ec]"
              >
                <span className="block font-semibold text-[#ee4d2d]">{user.role}</span>
                <span className="block truncate text-[#5b403b]">{user.email}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { mockUsers } from '../../mocks/users.mock'
import { resolveRoleHome } from '../../utils/roles'

const defaultCredentials = {
  email: 'customer@techtonic.vn',
  password: '123456',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, login } = useAuth()
  const [formData, setFormData] = useState(defaultCredentials)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
  }

  const handleQuickFill = (email, password) => {
    setFormData({ email, password })
    setErrorMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      const user = login(formData.email, formData.password)
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
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#fbf9f9] px-3 py-12">
      <section className="w-full max-w-[480px] rounded-xl border border-[#e3beb6]/80 bg-white p-8 shadow-[0_12px_32px_rgba(0,0,0,0.05)] sm:p-12">
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-[#ee4d2d]">
            TechToShop
          </Link>
          <p className="mt-3 text-sm text-[#5b403b]">Quản trị hệ thống & cửa hàng</p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium">Email hoặc số điện thoại</span>
            <div className="mt-2 flex h-12 items-center rounded-lg border border-[#e3beb6] px-3 focus-within:border-[#ee4d2d] focus-within:ring-2 focus-within:ring-[#ee4d2d]/15">
              <span className="text-[#5b403b]">♙</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="min-w-0 flex-1 px-3 py-3 outline-none"
                placeholder="Nhập email hoặc số điện thoại"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium">Mật khẩu</span>
            <div className="mt-2 flex h-12 items-center rounded-lg border border-[#e3beb6] px-3 focus-within:border-[#ee4d2d] focus-within:ring-2 focus-within:ring-[#ee4d2d]/15">
              <span className="text-[#5b403b]">▣</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="min-w-0 flex-1 px-3 py-3 outline-none"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-sm font-semibold text-[#5b403b] transition hover:text-[#ee4d2d]"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-[#ee4d2d]" />
              Ghi nhớ đăng nhập
            </label>
            <Link to="/forgot-password" className="text-[#ee4d2d]">
              Quên mật khẩu?
            </Link>
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#ee4d2d] px-4 py-3 font-semibold text-white transition hover:bg-[#d73211]"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-2 text-sm">
          <span className="text-[#5b403b]">Chưa có tài khoản?</span>
          <Link to="/register" className="font-semibold text-[#ee4d2d]">
            Đăng ký ngay
          </Link>
        </div>

        <div className="mt-6 border-t border-[#e3beb6]/70 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8f7069]">Tài khoản demo</p>
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
      </section>
    </div>
  )
}

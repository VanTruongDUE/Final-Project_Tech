import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { authService } from '../../services/authService'
import { resolveRoleHome } from '../../utils/roles'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState(initialForm)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (currentUser) {
      navigate(resolveRoleHome(currentUser.role), { replace: true })
    }
  }, [currentUser, navigate])

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!formData.agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với điều khoản trước khi đăng ký.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await authService.registerUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      navigate('/login', {
        replace: true,
        state: {
          registerSuccessMessage: result.message,
          prefillEmail: formData.email.trim().toLowerCase(),
        },
      })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#fbf9f9] px-3 py-12">
      <main className="w-full max-w-[480px] rounded-xl border border-[#e3beb6] bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.1)] sm:p-12">
        <div className="mb-10 text-center">
          <Link to="/" className="text-[32px] font-bold tracking-tight text-[#ee4d2d]">
            TechToShop
          </Link>
          <h1 className="mt-4 text-[30px] font-bold leading-tight text-[#1b1c1c] sm:text-[32px]">
            Tạo tài khoản mới
          </h1>
          <p className="mt-2 text-sm text-[#5b403b]">
            Điền thông tin bên dưới để bắt đầu
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#1b1c1c]">Họ tên</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white px-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#1b1c1c]">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập địa chỉ email"
              className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white px-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#1b1c1c]">Số điện thoại</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white px-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#1b1c1c]">Mật khẩu</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tạo mật khẩu"
              className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white px-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[#1b1c1c]">
              Xác nhận mật khẩu
            </span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white px-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]"
              required
            />
          </label>

          <label className="mt-2 flex items-start gap-3 text-sm text-[#5b403b]">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-[#e3beb6] accent-[#ee4d2d]"
              required
            />
            <span className="leading-7">
              Tôi đồng ý với{' '}
              <span className="font-medium text-[#ee4d2d]">Điều khoản sử dụng</span> và{' '}
              <span className="font-medium text-[#ee4d2d]">Chính sách bảo mật</span> của
              TechToShop.
            </span>
          </label>

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-lg bg-[#ee4d2d] px-4 text-sm font-bold text-white transition hover:bg-[#d63c1e] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 border-t border-[#e3beb6] pt-6 text-center text-sm text-[#5b403b]">
          Đã có tài khoản?
          <Link to="/login" className="ml-1 font-bold text-[#ee4d2d] transition hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </main>
    </div>
  )
}

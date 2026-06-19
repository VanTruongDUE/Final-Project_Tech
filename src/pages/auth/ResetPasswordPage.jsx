import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { authService } from '../../services/authService'
import { resolveRoleHome } from '../../utils/roles'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: location.state?.otp || '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (currentUser) {
      navigate(resolveRoleHome(currentUser.role), { replace: true })
    }
  }, [currentUser, navigate])

  const canEditEmailAndOtp = useMemo(
    () => !location.state?.email || !location.state?.otp,
    [location.state],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const result = await authService.resetPassword(formData)

      navigate('/login', {
        replace: true,
        state: {
          resetSuccessMessage: result.message,
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
      <main className="w-full max-w-[480px] overflow-hidden rounded-xl bg-white shadow-[0px_1px_20px_0px_rgba(0,0,0,0.05)]">
        <div className="p-6 sm:p-12">
          <div className="flex flex-col gap-2 text-center">
            <div className="mb-2 flex justify-center text-[#b22204]">
              <span className="material-symbols-outlined text-[44px]" aria-hidden="true">
                lock_reset
              </span>
            </div>
            <h1 className="text-[32px] font-bold leading-tight text-[#1b1c1c]">Đặt lại mật khẩu</h1>
            <p className="text-sm leading-6 text-[#5b403b]">
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
            </p>
          </div>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1b1c1c]">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!canEditEmailAndOtp}
                  className="h-12 w-full rounded-lg border border-[#e3beb6] bg-white px-4 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/20 read-only:bg-[#f5f3f3]"
                  placeholder="Nhập email"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#1b1c1c]">Mã OTP</span>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  readOnly={!canEditEmailAndOtp}
                  className="h-12 w-full rounded-lg border border-[#e3beb6] bg-white px-4 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/20 read-only:bg-[#f5f3f3]"
                  placeholder="Nhập mã OTP"
                  required
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="newPassword" className="text-sm font-medium text-[#1b1c1c]">
                Mật khẩu mới
              </label>
              <div className="flex items-center rounded-lg border border-[#e3beb6] bg-white px-4 transition focus-within:border-[#ee4d2d] focus-within:ring-2 focus-within:ring-[#ee4d2d]/20">
                <span className="material-symbols-outlined mr-3 text-[20px] text-[#8f7069]" aria-hidden="true">
                  lock
                </span>
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="text-sm text-[#8f7069] transition hover:text-[#ee4d2d]"
                >
                  {showNewPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#1b1c1c]">
                Xác nhận mật khẩu
              </label>
              <div className="flex items-center rounded-lg border border-[#e3beb6] bg-white px-4 transition focus-within:border-[#ee4d2d] focus-within:ring-2 focus-within:ring-[#ee4d2d]/20">
                <span className="material-symbols-outlined mr-3 text-[20px] text-[#8f7069]" aria-hidden="true">
                  shield_lock
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-sm text-[#8f7069] transition hover:text-[#ee4d2d]"
                >
                  {showConfirmPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-[#f5f3f3] px-4 py-4 text-sm text-[#5b403b]">
              Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số.
            </div>

            {errorMessage ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex h-12 items-center justify-center gap-2 rounded-lg bg-[#ee4d2d] text-sm font-semibold text-white transition hover:bg-[#d44124] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Đang cập nhật mật khẩu' : 'Cập nhật mật khẩu'}
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                arrow_forward
              </span>
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-[#5b403b] transition hover:text-[#ee4d2d]"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  arrow_back
                </span>
                Quay lại Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

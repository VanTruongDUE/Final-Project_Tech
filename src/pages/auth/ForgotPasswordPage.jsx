import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { authService } from '../../services/authService'
import { resolveRoleHome } from '../../utils/roles'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (currentUser) {
      navigate(resolveRoleHome(currentUser.role), { replace: true })
    }
  }, [currentUser, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const result = await authService.requestPasswordReset(identifier)

      navigate('/verify-otp', {
        replace: true,
        state: {
          identifier: result.data.email || result.data.phone,
          successMessage: result.message,
        },
      })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[#fbf9f9] px-3 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffdad3]/25 blur-[110px]" />
      </div>

      <main className="w-full max-w-[480px] rounded-xl border border-[#e3e2e2] bg-white p-6 shadow-sm sm:p-12">
        <header className="pb-2 text-center">
          <h1 className="text-[32px] font-bold tracking-tight text-[#ee4d2d]">TechToShop</h1>
          <h2 className="mt-4 text-[30px] font-bold leading-tight text-[#1b1c1c]">Quên mật khẩu</h2>
          <p className="mt-3 text-sm leading-6 text-[#5b403b]">
            Nhập Email hoặc Số điện thoại của bạn để nhận mã OTP khôi phục mật khẩu.
          </p>
        </header>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#1b1c1c]">
              Email hoặc Số điện thoại
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#8f7069]">
                ✉️
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value)
                  setErrorMessage('')
                }}
                placeholder="VD: user@example.com hoặc 0987654321"
                className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white pl-11 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]"
                required
              />
            </div>
          </label>

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#ee4d2d] text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Đang gửi mã OTP' : 'Gửi mã OTP'}
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              send
            </span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#ee4d2d] transition hover:opacity-80"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              arrow_back
            </span>
            Quay lại Đăng nhập
          </Link>
        </div>
      </main>
    </div>
  )
}

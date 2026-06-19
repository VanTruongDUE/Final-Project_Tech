import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { authService } from '../../services/authService'
import { resolveRoleHome } from '../../utils/roles'

const OTP_LENGTH = 6

const buildOtpArray = (otp = '') =>
  Array.from({ length: OTP_LENGTH }, (_, index) => otp[index] || '')

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otpDigits, setOtpDigits] = useState(buildOtpArray())
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (currentUser) {
      navigate(resolveRoleHome(currentUser.role), { replace: true })
    }
  }, [currentUser, navigate])

  const otpValue = useMemo(() => otpDigits.join(''), [otpDigits])

  const maskedEmail = useMemo(() => {
    if (!email.includes('@')) {
      return email || 'email của bạn'
    }

    const [name, domain] = email.split('@')
    const visibleName = name.slice(0, 2)
    return `${visibleName}${'*'.repeat(Math.max(name.length - 2, 2))}@${domain}`
  }, [email])

  const updateDigit = (index, value) => {
    const nextCharacter = value.replace(/\D/g, '').slice(-1)
    setOtpDigits((prev) => {
      const nextDigits = [...prev]
      nextDigits[index] = nextCharacter
      return nextDigits
    })
    setErrorMessage('')

    if (nextCharacter && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)

    if (!pastedValue) {
      return
    }

    event.preventDefault()
    setOtpDigits(buildOtpArray(pastedValue))
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const result = await authService.verifyResetOtp({
        email,
        otp: otpValue,
      })

      navigate('/reset-password', {
        replace: true,
        state: {
          email: result.data.email,
          otp: result.data.otp,
        },
      })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await authService.requestPasswordReset(email)
      setOtpDigits(buildOtpArray())
      setErrorMessage('')
      inputRefs.current[0]?.focus()
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#fbf9f9] px-3 py-12">
      <main className="relative w-full max-w-[480px] overflow-hidden rounded-xl border border-[#e3beb6]/30 bg-white p-6 shadow-sm sm:p-12">
        <div className="absolute left-0 top-0 h-[6px] w-full bg-gradient-to-r from-[#b22204] via-[#d63c1e] to-[#b41f00]" />

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f3f3] text-[30px] text-[#b22204]">
            🛡️
          </div>
          <h1 className="text-[32px] font-bold leading-tight text-[#1b1c1c]">Xác minh OTP</h1>
          <p className="mt-3 text-sm leading-6 text-[#5b403b]">
            Mã xác minh đã được gửi đến email
            <br />
            <strong className="font-medium text-[#1b1c1c]">{maskedEmail}</strong>
          </p>
        </div>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#1b1c1c]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setErrorMessage('')
              }}
              className="h-12 w-full rounded-lg border border-[#e3beb6] bg-[#f5f3f3] px-4 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/20"
              placeholder="Nhập email nhận OTP"
              required
            />
          </label>

          <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
            {otpDigits.map((digit, index) => (
              <input
                key={`otp-${index}`}
                ref={(element) => {
                  inputRefs.current[index] = element
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                aria-label={`OTP số ${index + 1}`}
                className="h-12 rounded-lg border border-[#e3beb6] bg-[#f5f3f3] text-center text-xl font-semibold outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/20 sm:h-14"
                placeholder="•"
              />
            ))}
          </div>

          <div className="text-center text-sm text-[#5b403b]">
            Chưa nhận được mã?
            <button
              type="button"
              onClick={handleResendOtp}
              className="ml-1 font-medium text-[#ee4d2d] transition hover:underline"
            >
              Gửi lại mã
            </button>
          </div>

          {errorMessage ? (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <span aria-hidden="true">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-12 rounded-lg bg-[#ee4d2d] text-base font-medium text-white transition hover:bg-[#d63c1e] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Đang xác minh' : 'Xác nhận'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-[#5b403b] transition hover:text-[#ee4d2d]">
            Quay lại Đăng nhập
          </Link>
        </div>
      </main>
    </div>
  )
}

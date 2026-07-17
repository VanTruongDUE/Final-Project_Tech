import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/authService'

function PasswordField({ id, label, value, onChange, children }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[180px_minmax(0,400px)] md:items-start">
      <label htmlFor={id} className="text-sm text-[#5b403b] md:pt-2 md:text-right">
        {label}
      </label>
      <div>
        <input
          id={id}
          type="password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
        />
        {children}
      </div>
    </div>
  )
}

export default function BuyerChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback({ type: '', message: '' })

    try {
      const result = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setFeedback({
        type: 'success',
        message: `${result.message} Bạn có thể đăng xuất và đăng nhập lại bằng mật khẩu mới.`,
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-[600px] min-w-0 rounded border border-[#e8e8e8] bg-white shadow-sm">
      <div className="border-b border-[#e8e8e8] px-6 py-5 md:px-8">
        <h1 className="text-xl font-bold text-[#1b1c1c]">Đổi Mật Khẩu</h1>
        <p className="mt-1 text-sm text-[#5b403b]">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      </div>

      {feedback.message ? (
        <div
          className={`mx-6 mt-6 rounded border px-4 py-3 text-sm md:mx-8 ${
            feedback.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <form className="max-w-[700px] space-y-6 p-6 md:p-8" onSubmit={handleSubmit}>
        <PasswordField id="current-password" label="Mật khẩu hiện tại" value={currentPassword} onChange={setCurrentPassword}>
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm text-[#ee4d2d] hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
        </PasswordField>

        <PasswordField id="new-password" label="Mật khẩu mới" value={newPassword} onChange={setNewPassword} />
        <PasswordField id="confirm-password" label="Xác nhận mật khẩu" value={confirmPassword} onChange={setConfirmPassword} />

        <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,400px)]">
          <div className="hidden md:block" />
          <button type="submit" disabled={isSubmitting} className="h-10 w-fit rounded bg-[#ee4d2d] px-8 text-sm font-semibold text-white transition hover:bg-[#d73211] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Đang cập nhật' : 'Xác nhận'}
          </button>
        </div>
      </form>
    </section>
  )
}

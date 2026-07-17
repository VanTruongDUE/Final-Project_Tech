import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { profileService } from '../../services/profileService'

const emptyProfile = { fullName: '', phone: '', gender: '', birthDate: '', avatarUrl: '' }

const toDateInputValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

function FormRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
      <div className="text-sm text-[#5b403b] md:text-right">{label}</div>
      <div>{children}</div>
    </div>
  )
}

export default function BuyerPersonalInfoPage() {
  const { currentUser, updateCurrentUser } = useAuth()
  const [profile, setProfile] = useState(emptyProfile)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      setIsLoading(true)
      try {
        const result = await profileService.getProfile()
        if (!isMounted) return
        setProfile({
          fullName: result.data.fullName,
          phone: result.data.phone,
          gender: result.data.gender,
          birthDate: toDateInputValue(result.data.birthDate),
          avatarUrl: result.data.avatarUrl,
        })
      } catch (error) {
        if (isMounted) setFeedback({ type: 'error', message: error.message })
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProfile()
    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const initials = profile.fullName
    ? profile.fullName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'TC'

  const handleChange = (field, value) => {
    setProfile((previous) => ({ ...previous, [field]: value }))
    setFeedback({ type: '', message: '' })
  }

  const handleSave = async () => {
    if (!profile.fullName.trim()) {
      setFeedback({ type: 'error', message: 'Vui lòng nhập họ và tên.' })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await profileService.updateProfile(profile)
      updateCurrentUser({
        ...currentUser,
        fullName: result.data.fullName,
        phone: result.data.phone,
        avatarUrl: result.data.avatarUrl,
      })
      setProfile((previous) => ({
        ...previous,
        fullName: result.data.fullName,
        phone: result.data.phone,
        gender: result.data.gender,
        birthDate: toDateInputValue(result.data.birthDate),
      }))
      setFeedback({ type: 'success', message: result.message })
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = 'h-10 w-full max-w-[440px] rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15'

  return (
    <section className="min-w-0 rounded border border-[#e8e8e8] bg-white shadow-sm">
      <div className="border-b border-[#e8e8e8] px-6 py-5 md:px-8">
        <h1 className="text-xl font-bold text-[#1b1c1c]">Thông Tin Cá Nhân</h1>
        <p className="mt-1 text-sm text-[#5b403b]">Quản lý thông tin hồ sơ từ tài khoản TechTonic</p>
      </div>

      {feedback.message ? (
        <div className={`mx-6 mt-5 rounded border px-4 py-3 text-sm md:mx-8 ${feedback.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {feedback.message}
        </div>
      ) : null}

      {isLoading ? <p className="p-8 text-sm text-[#5b403b]">Đang tải hồ sơ...</p> : (
        <div className="flex flex-col-reverse gap-10 p-6 md:p-8 lg:flex-row lg:items-start">
          <div className="w-full flex-1 space-y-6">
            <FormRow label="Tên đăng nhập">
              <input readOnly value={currentUser?.email?.split('@')[0] || ''} className={`${inputClass} bg-[#f5f5f5]`} />
            </FormRow>
            <FormRow label="Họ và tên">
              <input value={profile.fullName} onChange={(event) => handleChange('fullName', event.target.value)} className={inputClass} />
            </FormRow>
            <FormRow label="Email">
              <input readOnly value={currentUser?.email || ''} className={`${inputClass} bg-[#f5f5f5]`} />
            </FormRow>
            <FormRow label="Số điện thoại">
              <input type="tel" value={profile.phone} onChange={(event) => handleChange('phone', event.target.value)} className={inputClass} />
            </FormRow>
            <FormRow label="Giới tính">
              <div className="flex flex-wrap gap-6">
                {[['male', 'Nam'], ['female', 'Nữ'], ['other', 'Khác']].map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="gender" value={value} checked={profile.gender === value} onChange={(event) => handleChange('gender', event.target.value)} />
                    {label}
                  </label>
                ))}
              </div>
            </FormRow>
            <FormRow label="Ngày sinh">
              <input type="date" value={profile.birthDate} onChange={(event) => handleChange('birthDate', event.target.value)} className={inputClass} />
            </FormRow>
            <div className="grid md:grid-cols-[180px_minmax(0,1fr)]">
              <div />
              <button type="button" onClick={handleSave} disabled={isSubmitting} className="h-10 w-fit rounded bg-[#ee4d2d] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center border-b border-[#e8e8e8] pb-8 lg:w-64 lg:border-b-0 lg:border-l lg:pl-10">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Ảnh đại diện" className="h-24 w-24 rounded-full object-cover" /> : (
              <div className="grid h-24 w-24 place-items-center rounded-full border border-[#e8e8e8] bg-[#fff1ec] text-xl font-bold text-[#b22204]">{initials}</div>
            )}
            <p className="mt-4 text-center text-xs leading-5 text-[#5b403b]">Backend hiện hỗ trợ URL ảnh; tải file trực tiếp chưa có contract.</p>
          </div>
        </div>
      )}
    </section>
  )
}

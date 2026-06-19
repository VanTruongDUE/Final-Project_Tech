import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { authService } from '../../services/authService'
import { profileService } from '../../services/profileService'

const genderOptions = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
]

const days = Array.from({ length: 31 }, (_, index) => `${index + 1}`)
const months = Array.from({ length: 12 }, (_, index) => `Tháng ${index + 1}`)
const years = Array.from({ length: 60 }, (_, index) => `${2026 - index}`)

function maskEmail(email) {
  if (!email || !email.includes('@')) {
    return 'Chưa cập nhật'
  }

  const [name, domain] = email.split('@')
  return `${name.slice(0, 2)}${'*'.repeat(Math.max(2, name.length - 2))}@${domain}`
}

function maskPhone(phone) {
  if (!phone) {
    return 'Chưa cập nhật'
  }

  return `${'*'.repeat(Math.max(4, phone.length - 2))}${phone.slice(-2)}`
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
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    phone: '',
    gender: 'male',
    birthDay: '15',
    birthMonth: 'Tháng 8',
    birthYear: '1990',
  })
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const savedProfile = profileService.getProfile(currentUser)
    setProfile({
      username: savedProfile.username || currentUser?.email?.split('@')[0] || 'techtonic_user',
      fullName: savedProfile.fullName || '',
      phone: savedProfile.phone || '',
      gender: savedProfile.gender || 'male',
      birthDay: savedProfile.birthDay || '15',
      birthMonth: savedProfile.birthMonth || 'Tháng 8',
      birthYear: savedProfile.birthYear || '1990',
    })
  }, [currentUser])

  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'TC'

  const handleChange = (key, value) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [key]: value,
    }))
  }

  const handleSave = () => {
    if (!profile.username.trim()) {
      setFeedback('Vui lòng nhập tên đăng nhập.')
      return
    }

    if (!profile.fullName.trim()) {
      setFeedback('Vui lòng nhập tên.')
      return
    }

    const updatedProfile = profileService.updateProfile(currentUser.id, {
      ...profile,
      username: profile.username.trim(),
      fullName: profile.fullName.trim(),
      email: currentUser.email,
      phone: profile.phone.trim(),
    })

    const nextUser = {
      ...currentUser,
      fullName: updatedProfile.fullName,
    }

    localStorage.setItem(authService.getStorageKey(), JSON.stringify(nextUser))
    window.dispatchEvent(new Event('storage'))
    setFeedback('Thông tin cá nhân đã được lưu trên localStorage. Tên đăng nhập chỉ dùng để hiển thị, đăng nhập vẫn dùng email.')
  }

  return (
    <section className="min-w-0 rounded border border-[#e8e8e8] bg-white shadow-sm">
      <div className="border-b border-[#e8e8e8] px-6 py-5 md:px-8">
        <h1 className="text-xl font-bold text-[#1b1c1c]">Thông Tin Cá Nhân</h1>
        <p className="mt-1 text-sm text-[#5b403b]">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      {feedback ? <div className="mx-6 mt-5 rounded border border-[#f0d6cf] bg-[#fff8f6] px-4 py-3 text-sm text-[#8f4e43] md:mx-8">{feedback}</div> : null}

      <div className="flex flex-col-reverse gap-10 p-6 md:p-8 lg:flex-row lg:items-start">
        <div className="w-full flex-1 space-y-6">
          <FormRow label="Tên đăng nhập">
            <input
              type="text"
              value={profile.username}
              onChange={(event) => handleChange('username', event.target.value)}
              className="h-10 w-full max-w-[440px] rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
            />
          </FormRow>

          <FormRow label="Tên">
            <input
              type="text"
              value={profile.fullName}
              onChange={(event) => handleChange('fullName', event.target.value)}
              className="h-10 w-full max-w-[440px] rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
            />
          </FormRow>

          <FormRow label="Email">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-[#1b1c1c]">{maskEmail(currentUser?.email)}</span>
              <button type="button" className="text-sm font-semibold text-[#ee4d2d] hover:underline">
                Thay đổi
              </button>
            </div>
          </FormRow>

          <FormRow label="Số điện thoại">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="tel"
                value={profile.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                placeholder={maskPhone(profile.phone)}
                className="h-10 w-full max-w-[260px] rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              />
            </div>
          </FormRow>

          <FormRow label="Giới tính">
            <div className="flex flex-wrap items-center gap-6">
              {genderOptions.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm text-[#1b1c1c]">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={profile.gender === option.value}
                    onChange={(event) => handleChange('gender', event.target.value)}
                    className="h-4 w-4 border-[#e8e8e8] text-[#ee4d2d] focus:ring-[#ee4d2d]"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </FormRow>

          <FormRow label="Ngày sinh">
            <div className="grid max-w-[440px] grid-cols-1 gap-2 sm:grid-cols-3">
              <select
                value={profile.birthDay}
                onChange={(event) => handleChange('birthDay', event.target.value)}
                className="h-10 rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                value={profile.birthMonth}
                onChange={(event) => handleChange('birthMonth', event.target.value)}
                className="h-10 rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={profile.birthYear}
                onChange={(event) => handleChange('birthYear', event.target.value)}
                className="h-10 rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </FormRow>

          <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)]">
            <div className="hidden md:block" />
            <button type="button" onClick={handleSave} className="h-10 w-24 rounded bg-[#ee4d2d] text-sm font-semibold text-white transition hover:bg-[#d73211]">
              Lưu
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center border-b border-[#e8e8e8] pb-8 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-l lg:pl-10">
          <div className="grid h-24 w-24 place-items-center rounded-full border border-[#e8e8e8] bg-[#fff1ec] text-xl font-bold text-[#b22204]">
            {initials}
          </div>
          <button type="button" onClick={handleSave} className="mt-6 h-10 rounded border border-[#e8e8e8] bg-white px-4 text-sm font-semibold text-[#1b1c1c] transition hover:border-[#ee4d2d] hover:text-[#ee4d2d]">
            Chọn ảnh
          </button>
          <div className="mt-4 max-w-[200px] text-center text-xs leading-5 text-[#5b403b]">
            <p>Dung lượng file tối đa 1 MB</p>
            <p>Định dạng: .JPEG, .PNG</p>
          </div>
        </div>
      </div>
    </section>
  )
}

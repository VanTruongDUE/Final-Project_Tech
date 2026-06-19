import { useEffect, useMemo, useState } from 'react'
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
const years = Array.from({ length: 50 }, (_, index) => `${2025 - index}`)

function maskEmail(email) {
  if (!email || !email.includes('@')) {
    return 'Chưa cập nhật'
  }

  const [name, domain] = email.split('@')
  const visibleName = name.slice(0, 3)
  return `${visibleName}${'*'.repeat(Math.max(1, name.length - 3))}@${domain}`
}

function maskPhone() {
  return '********89'
}

function FieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-center">
      <label className="text-sm text-[#8f7069] md:pr-4 md:text-right">{label}</label>
      <div className="md:col-span-3">{children}</div>
    </div>
  )
}

export default function ProfilePage() {
  const { currentUser } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('male')
  const [birthDay, setBirthDay] = useState('15')
  const [birthMonth, setBirthMonth] = useState('Tháng 8')
  const [birthYear, setBirthYear] = useState('1990')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  useEffect(() => {
    const savedProfile = profileService.getProfile(currentUser)
    setFullName(savedProfile.fullName)
    setPhone(savedProfile.phone)
    setGender(savedProfile.gender)
    setBirthDay(savedProfile.birthDay)
    setBirthMonth(savedProfile.birthMonth)
    setBirthYear(savedProfile.birthYear)
  }, [currentUser])

  const username = useMemo(() => {
    if (!currentUser?.email) {
      return 'techtonic_user'
    }

    return currentUser.email.split('@')[0]
  }, [currentUser?.email])

  const initials = currentUser?.fullName
    ? currentUser.fullName
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'KH'

  const handleUpdateProfile = () => {
    if (!fullName.trim()) {
      setFeedbackMessage('Vui lòng nhập họ và tên.')
      return
    }

    const updatedProfile = profileService.updateProfile(currentUser.id, {
      fullName: fullName.trim(),
      email: currentUser.email,
      phone: phone.trim(),
      gender,
      birthDay,
      birthMonth,
      birthYear,
    })
    const nextUser = {
      ...currentUser,
      fullName: updatedProfile.fullName,
    }

    localStorage.setItem(authService.getStorageKey(), JSON.stringify(nextUser))
    window.dispatchEvent(new Event('storage'))
    setFeedbackMessage('Cập nhật hồ sơ thành công. Dữ liệu đã được lưu trên localStorage.')
  }

  const handleChangePassword = () => {
    try {
      const result = authService.changePassword({
        email: currentUser.email,
        currentPassword,
        newPassword,
        confirmPassword,
      })

      setFeedbackMessage(`${result.message} Bạn có thể đăng xuất và đăng nhập lại bằng mật khẩu mới.`)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setFeedbackMessage(error.message)
    }
  }

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_20px_0_rgba(0,0,0,0.05)] md:p-8">
        <div className="border-b border-[#e5e7eb] pb-5">
          <h1 className="text-3xl font-bold leading-tight text-[#1b1c1c] md:text-4xl">Hồ sơ của tôi</h1>
          <p className="mt-3 text-base leading-6 text-[#5b403b]">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
        </div>

        {feedbackMessage ? (
          <div className="mt-5 rounded-xl border border-[#f0d6cf] bg-[#fff8f6] px-4 py-3 text-sm text-[#8f4e43]">
            {feedbackMessage}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-8 md:flex-row">
          <form className="order-2 flex-1 space-y-6 md:order-1" onSubmit={(event) => event.preventDefault()}>
            <FieldRow label="Tên đăng nhập">
              <p className="text-xl text-[#1b1c1c]">{username}</p>
            </FieldRow>

            <FieldRow label="Họ và tên">
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="h-12 w-full rounded-xl border border-[#d8dce3] bg-white px-4 text-lg outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#b22204]/15"
              />
            </FieldRow>

            <FieldRow label="Email">
              <div className="flex flex-wrap items-center gap-3">
                <p className="flex-1 text-xl text-[#1b1c1c]">{maskEmail(currentUser?.email)}</p>
                <button type="button" className="text-lg text-[#b22204] underline underline-offset-2">
                  Thay đổi
                </button>
              </div>
            </FieldRow>

            <FieldRow label="Số điện thoại">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={maskPhone()}
                  className="h-12 flex-1 rounded-xl border border-[#d8dce3] bg-white px-4 text-lg outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#b22204]/15"
                />
              </div>
            </FieldRow>

            <FieldRow label="Giới tính">
              <div className="flex flex-wrap gap-5 pt-1">
                {genderOptions.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-2 text-lg text-[#1b1c1c]">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={gender === option.value}
                      onChange={(event) => setGender(event.target.value)}
                      className="h-5 w-5 border-[#d8dce3] text-[#b22204] focus:ring-[#b22204]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </FieldRow>

            <FieldRow label="Ngày sinh">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <select
                  value={birthDay}
                  onChange={(event) => setBirthDay(event.target.value)}
                  className="h-12 rounded-xl border border-[#d8dce3] bg-white px-4 text-lg outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#b22204]/15"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  value={birthMonth}
                  onChange={(event) => setBirthMonth(event.target.value)}
                  className="h-12 rounded-xl border border-[#d8dce3] bg-white px-4 text-lg outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#b22204]/15"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={birthYear}
                  onChange={(event) => setBirthYear(event.target.value)}
                  className="h-12 rounded-xl border border-[#d8dce3] bg-white px-4 text-lg outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#b22204]/15"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </FieldRow>

            <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-4">
              <div className="hidden md:block" />
              <div className="md:col-span-3">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="rounded-xl bg-[#b22204] px-10 py-3 text-lg font-medium text-white transition hover:bg-[#981b02]"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </form>

          <div className="order-1 flex flex-col items-center gap-4 border-b border-[#e5e7eb] pb-6 md:order-2 md:w-[240px] md:border-b-0 md:border-l md:border-[#e5e7eb] md:pb-0 md:pl-8">
            <div className="grid h-32 w-32 place-items-center rounded-full border-2 border-[#e5e7eb] bg-[#fff1ec] text-3xl font-bold text-[#b22204]">
              {initials}
            </div>
            <button
              type="button"
              onClick={handleUpdateProfile}
              className="rounded-xl border border-[#d8dce3] bg-white px-6 py-2.5 text-lg text-[#1b1c1c] transition hover:border-[#b22204] hover:text-[#b22204]"
            >
              Chọn Ảnh
            </button>
            <p className="max-w-[170px] text-center text-sm text-[#5b403b]">
              Dung lượng file tối đa 1 MB
              <br />
              Định dạng: .JPEG, .PNG
            </p>
          </div>
        </div>
      </div>

      <div id="change-password" className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-[0_1px_20px_0_rgba(0,0,0,0.05)] md:p-8">
        <div className="border-b border-[#e5e7eb] pb-5">
          <h2 className="text-[2.35rem] font-bold text-[#1b1c1c] md:text-[3rem]">Đổi mật khẩu nhanh</h2>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-end">
          <div>
            <label htmlFor="current-password" className="mb-3 block text-lg text-[#5b403b]">
              Mật khẩu hiện tại
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="h-14 w-full rounded-xl border border-[#d8dce3] bg-white px-4 text-lg outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#b22204]/15"
            />
          </div>

          <div>
            <label htmlFor="new-password" className="mb-3 block text-lg text-[#5b403b]">
              Mật khẩu mới
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="h-14 w-full rounded-xl border border-[#d8dce3] bg-white px-4 text-lg outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#b22204]/15"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-3 block text-lg text-[#5b403b]">
              Xác nhận mật khẩu mới
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-14 w-full rounded-xl border border-[#d8dce3] bg-white px-4 text-lg outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#b22204]/15"
            />
          </div>

          <button
            type="button"
            onClick={handleChangePassword}
            className="h-14 rounded-xl border border-[#b22204] bg-white px-6 text-lg font-medium text-[#b22204] transition hover:bg-[#fff1ec] lg:col-start-3"
          >
            Xác nhận đổi
          </button>
        </div>
      </div>
    </section>
  )
}

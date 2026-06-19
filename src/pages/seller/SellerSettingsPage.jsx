import { useEffect, useState } from 'react'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'

const defaultForm = {
  storeName: '',
  description: '',
  logoUrl: '',
  isActive: true,
  pickupName: '',
  pickupAddress: '',
  pickupPhone: '',
}

function SettingInput({ id, label, value, onChange, placeholder }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-xs font-semibold text-[#5b403b]">{label}</span>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
      />
    </label>
  )
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-[#ee4d2d]' : 'bg-[#c8c6c5]'}`}
      aria-pressed={checked}
      aria-label="Trạng thái hoạt động cửa hàng"
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

export default function SellerSettingsPage() {
  const { currentUser } = useAuth()
  const [form, setForm] = useState(defaultForm)
  const [savedForm, setSavedForm] = useState(defaultForm)
  const [message, setMessage] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const settingsResponse = sellerService.getSellerSettings(currentUser)

    if (!settingsResponse.success) {
      setLoadError(settingsResponse.message || 'Không thể tải cài đặt cửa hàng.')
      return
    }

    setForm(settingsResponse.data)
    setSavedForm(settingsResponse.data)
    setLoadError('')
  }, [currentUser])

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setMessage('')
  }

  const handleReset = () => {
    setForm(savedForm)
    setMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const response = sellerService.updateSellerSettings(currentUser, form)

    if (!response.success) {
      setMessage(response.message || 'Không thể cập nhật cài đặt cửa hàng.')
      return
    }

    setForm(response.data)
    setSavedForm(response.data)
    setMessage(response.message)
  }

  if (loadError) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#ba1a1a] shadow-sm">
          {loadError}
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#fbf9f9] p-4 pb-28 md:p-6 md:pb-6">
      <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header>
          <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1b1c1c] md:text-[40px]">Cài đặt cửa hàng</h1>
          <p className="mt-2 text-sm text-[#5b403b]">
            Quản lý thông tin hiển thị và trạng thái hoạt động của shop bạn trên TechToShop.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <section className="rounded-xl border border-[#e3beb6]/70 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-[#1b1c1c]">Thông tin shop</h2>

            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-start">
              <div className="group relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-[#e3beb6] bg-[#21aaa5]">
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt={form.storeName} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-lg font-bold text-[#b22204] shadow-md">
                    TTS
                  </div>
                )}
                <div className="absolute inset-0 hidden items-center justify-center bg-black/45 text-xs font-bold text-white group-hover:flex">
                  Logo mock
                </div>
              </div>

              <div className="grid min-w-0 flex-1 gap-4">
                <SettingInput
                  id="storeName"
                  label="Tên cửa hàng"
                  value={form.storeName}
                  onChange={(value) => updateField('storeName', value)}
                  placeholder="Nhập tên cửa hàng"
                />

                <SettingInput
                  id="logoUrl"
                  label="URL logo mock"
                  value={form.logoUrl}
                  onChange={(value) => updateField('logoUrl', value)}
                  placeholder="Dán URL ảnh nếu muốn đổi logo"
                />
              </div>
            </div>

            <label className="mt-5 block" htmlFor="storeDescription">
              <span className="mb-2 block text-xs font-semibold text-[#5b403b]">Mô tả shop</span>
              <textarea
                id="storeDescription"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                rows="5"
                className="w-full resize-none rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 py-3 text-sm leading-6 text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              />
            </label>
          </section>

          <aside className="flex flex-col gap-6">
            <section className="rounded-xl border border-[#e3beb6]/70 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-[#1b1c1c]">Trạng thái</h2>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-[#e3beb6] bg-[#f5f3f3] p-4">
                <div>
                  <p className="text-sm font-bold text-[#1b1c1c]">{form.isActive ? 'Đang hoạt động' : 'Tạm nghỉ'}</p>
                  <p className="mt-1 text-xs text-[#5b403b]">{form.isActive ? 'Khách có thể đặt hàng' : 'Shop không nhận đơn mới'}</p>
                </div>
                <ToggleSwitch checked={form.isActive} onChange={(value) => updateField('isActive', value)} />
              </div>
              <p className="mt-4 text-xs leading-5 text-[#8f7069]">
                Tắt tùy chọn này nếu bạn muốn tạm nghỉ. Cửa hàng sẽ chuyển sang chế độ không nhận đơn mới trong dữ liệu demo.
              </p>
            </section>

            <section className="rounded-xl border border-[#e3beb6]/70 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[#1b1c1c]">Địa chỉ lấy hàng</h2>
                <span className="text-xs font-bold text-[#ee4d2d]">Sửa</span>
              </div>

              <div className="grid gap-4">
                <SettingInput
                  id="pickupName"
                  label="Tên kho"
                  value={form.pickupName}
                  onChange={(value) => updateField('pickupName', value)}
                  placeholder="Tên kho lấy hàng"
                />
                <SettingInput
                  id="pickupPhone"
                  label="Số điện thoại"
                  value={form.pickupPhone}
                  onChange={(value) => updateField('pickupPhone', value)}
                  placeholder="Số điện thoại lấy hàng"
                />
                <label className="block" htmlFor="pickupAddress">
                  <span className="mb-2 block text-xs font-semibold text-[#5b403b]">Địa chỉ</span>
                  <textarea
                    id="pickupAddress"
                    value={form.pickupAddress}
                    onChange={(event) => updateField('pickupAddress', event.target.value)}
                    rows="3"
                    className="w-full resize-none rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 py-3 text-sm leading-6 text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                  />
                </label>
              </div>

              <div className="mt-5 flex gap-3 rounded-lg bg-[#fff8f6] p-3 text-sm text-[#5b403b]">
                <SellerIcon name="location_on" filled className="mt-0.5 text-[20px] text-[#b22204]" />
                <div>
                  <p className="font-bold text-[#1b1c1c]">{form.pickupName || 'Kho lấy hàng'}</p>
                  <p className="mt-1 leading-5">{form.pickupAddress || 'Chưa cập nhật địa chỉ'}</p>
                  <p className="mt-1">SĐT: {form.pickupPhone || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {message ? (
          <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${message.includes('Không') || message.includes('Vui lòng') ? 'border-[#ffdad6] bg-[#ffdad6]/40 text-[#ba1a1a]' : 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#15803D]'}`}>
            {message}
          </div>
        ) : null}

        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-end gap-3 border-t border-[#e3beb6] bg-white p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] md:static md:border-none md:bg-transparent md:p-0 md:shadow-none">
          <button type="button" onClick={handleReset} className="h-11 rounded-lg border border-[#ee4d2d] bg-white px-5 text-sm font-bold text-[#ee4d2d] transition hover:bg-[#fff1ec]">
            Hủy thay đổi
          </button>
          <button type="submit" className="h-11 rounded-lg bg-[#ee4d2d] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d73211]">
            Cập nhật Store
          </button>
        </div>
      </form>
    </section>
  )
}

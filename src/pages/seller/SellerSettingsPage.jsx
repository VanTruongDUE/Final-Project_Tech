import { useEffect, useState } from 'react'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'

const defaultForm = {
  storeName: '', description: '', logoUrl: '', contactEmail: '', contactPhone: '',
  addressLine: '', ward: '', district: '', province: '',
}

function SettingInput({ id, label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-xs font-semibold text-[#5b403b]">{label}</span>
      <input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 text-sm text-[#1b1c1c] outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15" />
    </label>
  )
}

export default function SellerSettingsPage() {
  const { currentUser } = useAuth()
  const [form, setForm] = useState(defaultForm)
  const [savedForm, setSavedForm] = useState(defaultForm)
  const [message, setMessage] = useState('')
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    sellerService.getSellerSettings(currentUser)
      .then((response) => {
        if (!isMounted) return
        if (!response.success) {
          setLoadError(response.message || 'Không thể tải cài đặt cửa hàng.')
          return
        }
        setForm(response.data)
        setSavedForm(response.data)
        setLoadError('')
      })
      .catch((error) => {
        if (isMounted) setLoadError(error.message || 'Không thể tải cài đặt cửa hàng.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => { isMounted = false }
  }, [currentUser])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    const response = await sellerService.updateSellerSettings(currentUser, form)
    setIsSaving(false)
    if (!response.success) {
      setMessage(response.message || 'Không thể cập nhật cài đặt cửa hàng.')
      return
    }
    setForm(response.data)
    setSavedForm(response.data)
    setMessage(response.message)
  }

  if (isLoading || loadError) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className={'rounded-xl border bg-white p-6 text-sm shadow-sm ' + (loadError ? 'border-[#e3beb6] text-[#ba1a1a]' : 'border-[#e3e2e2] text-[#5b403b]')}>
          {loadError || 'Đang tải thông tin cửa hàng...'}
        </div>
      </section>
    )
  }

  const fields = [
    ['storeName', 'Tên cửa hàng', 'Tên cửa hàng', 'text'],
    ['logoUrl', 'URL logo', 'https://...', 'text'],
    ['contactEmail', 'Email liên hệ', 'seller@example.com', 'email'],
    ['contactPhone', 'Số điện thoại liên hệ', 'Số điện thoại', 'text'],
    ['addressLine', 'Địa chỉ', 'Số nhà, tên đường', 'text'],
    ['ward', 'Phường/Xã', 'Phường/Xã', 'text'],
    ['district', 'Quận/Huyện', 'Quận/Huyện', 'text'],
    ['province', 'Tỉnh/Thành phố', 'Tỉnh/Thành phố', 'text'],
  ]

  return (
    <section className="min-h-screen bg-[#fbf9f9] p-4 pb-28 md:p-6">
      <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-[1100px] flex-col gap-5">
        <header>
          <h1 className="text-[28px] font-bold text-[#1b1c1c] md:text-[32px]">Cài đặt cửa hàng</h1>
          <p className="mt-2 text-sm text-[#5b403b]">Thông tin được tải và lưu trực tiếp trên hệ thống TechTonic.</p>
        </header>

        <section className="rounded-xl border border-[#e3beb6]/70 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <SellerIcon name="storefront" filled className="text-[#b22204]" />
            <h2 className="text-xl font-bold text-[#1b1c1c]">Thông tin shop</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {fields.slice(0, 4).map(([id, label, placeholder, type]) => (
              <SettingInput key={id} id={id} label={label} value={form[id]} type={type} placeholder={placeholder} onChange={(value) => updateField(id, value)} />
            ))}
          </div>
          <label className="mt-5 block" htmlFor="description">
            <span className="mb-2 block text-xs font-semibold text-[#5b403b]">Mô tả shop</span>
            <textarea id="description" value={form.description} onChange={(event) => updateField('description', event.target.value)} rows="5"
              className="w-full resize-none rounded-lg border border-[#e3beb6] bg-[#fbf9f9] px-4 py-3 text-sm leading-6 outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15" />
          </label>
        </section>

        <section className="rounded-xl border border-[#e3beb6]/70 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <SellerIcon name="location_on" filled className="text-[#b22204]" />
            <h2 className="text-xl font-bold text-[#1b1c1c]">Địa chỉ cửa hàng</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {fields.slice(4).map(([id, label, placeholder, type]) => (
              <SettingInput key={id} id={id} label={label} value={form[id]} type={type} placeholder={placeholder} onChange={(value) => updateField(id, value)} />
            ))}
          </div>
          <p className="mt-5 rounded-lg bg-[#fff8f6] p-3 text-xs leading-5 text-[#5b403b]">
            Trạng thái shop, chủ sở hữu, cấu hình vận chuyển và khuyến mãi không thuộc contract cập nhật store hiện tại nên không thể chỉnh tại màn này.
          </p>
        </section>

        {message ? <div className="rounded-lg border border-[#e3beb6] bg-white px-4 py-3 text-sm font-semibold text-[#5b403b]">{message}</div> : null}
        <div className="flex justify-end gap-3">
          <button type="button" disabled={isSaving} onClick={() => { setForm(savedForm); setMessage('') }} className="h-11 rounded-lg border border-[#ee4d2d] bg-white px-5 text-sm font-bold text-[#ee4d2d] disabled:opacity-60">Hủy thay đổi</button>
          <button type="submit" disabled={isSaving} className="h-11 rounded-lg bg-[#ee4d2d] px-5 text-sm font-bold text-white disabled:opacity-60">{isSaving ? 'Đang lưu...' : 'Cập nhật Store'}</button>
        </div>
      </form>
    </section>
  )
}

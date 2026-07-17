import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { buyerAddressService } from '../../services/buyerAddressService'

const emptyForm = {
  id: '', fullName: '', phone: '', street: '', ward: '', district: '', province: '', country: 'Việt Nam', isDefault: false,
}

function AddressForm({ form, onChange, onCancel, onSubmit, isSubmitting }) {
  const inputClass = 'h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15'
  const fields = [
    ['fullName', 'Họ tên người nhận', 'text'],
    ['phone', 'Số điện thoại', 'tel'],
    ['street', 'Địa chỉ cụ thể', 'text'],
    ['ward', 'Phường/Xã', 'text'],
    ['district', 'Quận/Huyện', 'text'],
    ['province', 'Tỉnh/Thành phố', 'text'],
    ['country', 'Quốc gia', 'text'],
  ]

  return (
    <form className="border-b border-[#e8e8e8] bg-[#fffaf7] p-6" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map(([field, label, type]) => (
          <label key={field} className={field === 'street' ? 'block md:col-span-2' : 'block'}>
            <span className="mb-2 block text-sm text-[#5b403b]">{label}</span>
            <input type={type} value={form[field]} onChange={(event) => onChange({ ...form, [field]: event.target.value })} className={inputClass} />
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-[#5b403b]">
          <input type="checkbox" checked={form.isDefault} onChange={(event) => onChange({ ...form, isDefault: event.target.checked })} />
          Đặt làm địa chỉ mặc định
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="h-10 rounded border border-[#e8e8e8] bg-white px-4 text-sm">Hủy</button>
          <button type="submit" disabled={isSubmitting} className="h-10 rounded bg-[#ee4d2d] px-4 text-sm font-medium text-white disabled:opacity-60">
            {isSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default function BuyerAddressPage() {
  const { currentUser } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const loadAddresses = async () => {
    setIsLoading(true)
    try {
      const result = await buyerAddressService.getAddresses()
      setAddresses(result.data)
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
      setAddresses([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.id) loadAddresses()
  }, [currentUser?.id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.fullName.trim() || !form.phone.trim() || !form.street.trim() || !form.province.trim()) {
      setFeedback({ type: 'error', message: 'Vui lòng nhập tên, số điện thoại, địa chỉ cụ thể và tỉnh/thành phố.' })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await buyerAddressService.saveAddress(form)
      setAddresses(result.data)
      setForm(emptyForm)
      setIsEditing(false)
      setFeedback({ type: 'success', message: result.message })
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetDefault = async (addressId) => {
    setIsSubmitting(true)
    try {
      const result = await buyerAddressService.setDefaultAddress(addressId)
      setAddresses(result.data)
      setFeedback({ type: 'success', message: result.message })
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (address) => {
    if (!window.confirm(`Xóa địa chỉ của ${address.fullName}?`)) return
    setIsSubmitting(true)
    try {
      const result = await buyerAddressService.deleteAddress(address.id)
      setAddresses(result.data)
      setFeedback({ type: 'success', message: result.message })
    } catch (error) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-w-0 rounded border border-[#e8e8e8] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#e8e8e8] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-xl font-bold text-[#1b1c1c]">Địa Chỉ Của Tôi</h1><p className="mt-1 text-sm text-[#5b403b]">Quản lý địa chỉ giao hàng từ tài khoản</p></div>
        <button type="button" onClick={() => { setForm(emptyForm); setIsEditing(true); setFeedback({ type: '', message: '' }) }} className="h-10 rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white">Thêm địa chỉ mới</button>
      </div>

      {feedback.message ? <div className={`border-b px-6 py-3 text-sm ${feedback.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{feedback.message}</div> : null}
      {isEditing ? <AddressForm form={form} onChange={setForm} onCancel={() => setIsEditing(false)} onSubmit={handleSubmit} isSubmitting={isSubmitting} /> : null}

      <div className="flex flex-col gap-6 p-6">
        {isLoading ? <p className="text-sm text-[#5b403b]">Đang tải địa chỉ...</p> : null}
        {!isLoading && addresses.length === 0 ? <p className="text-sm text-[#5b403b]">Bạn chưa có địa chỉ giao hàng. Hãy thêm địa chỉ trước khi thanh toán.</p> : null}
        {!isLoading && addresses.map((address, index) => (
          <article key={address.id} className={`flex flex-col gap-4 pb-6 md:flex-row md:justify-between ${index < addresses.length - 1 ? 'border-b border-[#e8e8e8]' : ''}`}>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3"><strong className="text-sm">{address.fullName}</strong><span className="text-sm text-[#5b403b]">{address.phone}</span></div>
              <p className="text-sm leading-6 text-[#5b403b]">{address.street}</p>
              <p className="text-sm leading-6 text-[#5b403b]">{address.city}{address.country ? `, ${address.country}` : ''}</p>
              {address.isDefault ? <span className="mt-2 inline-block rounded border border-[#ee4d2d] bg-[#fff1ec] px-2 py-0.5 text-xs text-[#ee4d2d]">Mặc định</span> : null}
            </div>
            <div className="flex flex-col gap-2 md:w-40">
              <button type="button" onClick={() => { setForm({ ...address }); setIsEditing(true); setFeedback({ type: '', message: '' }) }} className="text-sm text-[#05a]">Cập nhật</button>
              {!address.isDefault ? <button type="button" onClick={() => handleDelete(address)} className="text-sm text-[#ba1a1a]">Xóa</button> : null}
              <button type="button" disabled={address.isDefault || isSubmitting} onClick={() => handleSetDefault(address.id)} className="rounded border px-3 py-1.5 text-sm disabled:opacity-50">Thiết lập mặc định</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

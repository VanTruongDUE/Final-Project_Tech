import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { buyerAddressService } from '../../services/buyerAddressService'

const emptyForm = {
  id: '',
  fullName: '',
  phone: '',
  street: '',
  city: '',
  tagText: '',
  isDefault: false,
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function AddressForm({ form, onChange, onCancel, onSubmit }) {
  return (
    <form className="border-b border-[#e8e8e8] bg-[#fffaf7] p-6" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">Họ tên</span>
          <input
            type="text"
            value={form.fullName}
            onChange={(event) => onChange({ ...form, fullName: event.target.value })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">Số điện thoại</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => onChange({ ...form, phone: event.target.value })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-[#5b403b]">Địa chỉ cụ thể</span>
          <input
            type="text"
            value={form.street}
            onChange={(event) => onChange({ ...form, street: event.target.value })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">Quận/Huyện, Tỉnh/Thành phố</span>
          <input
            type="text"
            value={form.city}
            onChange={(event) => onChange({ ...form, city: event.target.value })}
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#5b403b]">Nhãn địa chỉ</span>
          <input
            type="text"
            value={form.tagText}
            onChange={(event) => onChange({ ...form, tagText: event.target.value })}
            placeholder="Ví dụ: Nhà riêng, Văn phòng"
            className="h-10 w-full rounded border border-[#e8e8e8] bg-white px-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-[#5b403b]">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(event) => onChange({ ...form, isDefault: event.target.checked })}
            className="h-4 w-4 rounded border-[#e8e8e8] text-[#ee4d2d] focus:ring-[#ee4d2d]"
          />
          Đặt làm địa chỉ mặc định
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded border border-[#e8e8e8] bg-white px-4 text-sm font-medium text-[#5b403b] transition hover:bg-[#f5f5f5]"
          >
            Hủy
          </button>
          <button type="submit" className="h-10 rounded bg-[#ee4d2d] px-4 text-sm font-medium text-white transition hover:bg-[#d73211]">
            Lưu địa chỉ
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
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    setAddresses(buyerAddressService.getAddresses(currentUser))
  }, [currentUser])

  const handleOpenCreate = () => {
    setForm(emptyForm)
    setIsEditing(true)
    setFeedback('')
  }

  const handleOpenEdit = (address) => {
    setForm({
      id: address.id,
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      tagText: address.tags.filter((tag) => tag !== 'Mặc định').join(', '),
      isDefault: address.isDefault,
    })
    setIsEditing(true)
    setFeedback('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.fullName.trim() || !form.phone.trim() || !form.street.trim() || !form.city.trim()) {
      setFeedback('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.')
      return
    }

    const nextAddresses = buyerAddressService.saveAddress(currentUser.id, {
      ...form,
      tags: form.tagText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    })

    setAddresses(nextAddresses)
    setForm(emptyForm)
    setIsEditing(false)
    setFeedback('Địa chỉ đã được lưu trên localStorage.')
  }

  const handleSetDefault = (addressId) => {
    setAddresses(buyerAddressService.setDefaultAddress(currentUser.id, addressId))
    setFeedback('Đã thiết lập địa chỉ mặc định.')
  }

  const handleDelete = (addressId) => {
    const address = addresses.find((item) => item.id === addressId)

    if (address?.isDefault) {
      setFeedback('Không thể xóa địa chỉ mặc định. Hãy chọn địa chỉ khác làm mặc định trước.')
      return
    }

    setAddresses(buyerAddressService.deleteAddress(currentUser.id, addressId))
    setFeedback('Đã xóa địa chỉ khỏi localStorage.')
  }

  return (
    <section className="min-w-0 rounded border border-[#e8e8e8] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#e8e8e8] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1b1c1c]">Địa Chỉ Của Tôi</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Quản lý thông tin địa chỉ giao hàng</p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#ee4d2d] px-4 text-sm font-semibold text-white transition hover:bg-[#d73211]"
        >
          <PlusIcon />
          Thêm địa chỉ mới
        </button>
      </div>

      {feedback ? <div className="border-b border-[#e8e8e8] bg-[#fff8f6] px-6 py-3 text-sm text-[#8f4e43]">{feedback}</div> : null}

      {isEditing ? <AddressForm form={form} onChange={setForm} onCancel={() => setIsEditing(false)} onSubmit={handleSubmit} /> : null}

      <div className="flex flex-col gap-6 p-6">
        {addresses.map((address, index) => {
          const tags = address.isDefault ? ['Mặc định', ...address.tags.filter((tag) => tag !== 'Mặc định')] : address.tags

          return (
            <article
              key={address.id}
              className={`flex flex-col gap-4 pb-6 md:flex-row md:items-start md:justify-between ${
                index < addresses.length - 1 ? 'border-b border-[#e8e8e8]' : ''
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="border-r border-[#e8e8e8] pr-4 text-sm font-semibold text-[#1b1c1c]">{address.fullName}</span>
                  <span className="text-sm text-[#5b403b]">(+84) {address.phone.replace(/^0/, '')}</span>
                </div>
                <div className="space-y-1 text-sm leading-6 text-[#5b403b]">
                  <p>{address.street}</p>
                  <p>{address.city}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <span
                      key={`${address.id}-${tag}`}
                      className={`rounded border px-2 py-0.5 text-xs font-medium ${
                        tag === 'Mặc định'
                          ? 'border-[#ee4d2d] bg-[#fff1ec] text-[#ee4d2d]'
                          : 'border-[#e8e8e8] text-[#5b403b]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:w-36 md:items-end">
                <div className="flex gap-4">
                  <button type="button" onClick={() => handleOpenEdit(address)} className="text-sm text-[#05a] transition hover:underline">
                    Cập nhật
                  </button>
                  {!address.isDefault ? (
                    <button type="button" onClick={() => handleDelete(address.id)} className="text-sm text-[#ba1a1a] transition hover:underline">
                      Xóa
                    </button>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={address.isDefault}
                  onClick={() => handleSetDefault(address.id)}
                  className="mt-2 w-full rounded border border-[#e8e8e8] bg-white px-3 py-1.5 text-sm text-[#1b1c1c] transition hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:bg-[#f5f5f5] disabled:text-[#8f7069] disabled:opacity-60"
                >
                  Thiết lập mặc định
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

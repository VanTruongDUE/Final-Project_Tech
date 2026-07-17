import { Link } from 'react-router-dom'

export default function CheckoutAddressForm({
  formData,
  errors,
  onChange,
  addresses,
  selectedAddressId,
  onSelectAddress,
  isLoading,
  apiError,
}) {
  const baseInputClass =
    'h-11 rounded-lg border bg-white px-4 text-sm text-[#1b1c1c] outline-none transition placeholder:text-[#c7b7b2] focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15'

  return (
    <section className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#fff1ec] text-[#ee4d2d]">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            local_shipping
          </span>
        </div>
        <h2 className="text-xl font-semibold text-[#1b1c1c]">Thông tin giao hàng</h2>
        <Link to="/profile/addresses" className="ml-auto text-xs font-bold text-[#ee4d2d] transition hover:text-[#d0011b]">Quản lý địa chỉ</Link>
      </div>

      {isLoading ? <p className="mb-4 text-sm text-[#5b403b]">Đang tải địa chỉ giao hàng...</p> : null}
      {apiError ? <div className="mb-4 rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{apiError}</div> : null}
      {!isLoading && !apiError && addresses.length === 0 ? (
        <div className="mb-4 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Bạn chưa có địa chỉ. <Link to="/profile/addresses" className="font-semibold underline">Thêm địa chỉ trước khi đặt hàng</Link>.
        </div>
      ) : null}
      {addresses.length > 0 ? (
        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-[#5b403b]">Địa chỉ đã lưu</span>
          <select value={selectedAddressId} onChange={(event) => onSelectAddress(event.target.value)} className="h-11 w-full rounded-lg border border-[#e3beb6] bg-white px-4 text-sm outline-none focus:border-[#ee4d2d]">
            {addresses.map((address) => <option key={address.id} value={address.id}>{address.fullName} — {address.street}, {address.province}{address.isDefault ? ' (Mặc định)' : ''}</option>)}
          </select>
        </label>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm text-[#5b403b]">Họ và tên người nhận</span>
          <input
            type="text"
            value={formData.fullName}
            onChange={(event) => onChange('fullName', event.target.value)}
            placeholder="Nhập họ và tên"
            className={`${baseInputClass} ${errors.fullName ? 'border-red-300 ring-2 ring-red-100' : 'border-[#e3beb6]'}`}
          />
          {errors.fullName ? <span className="text-xs text-red-600">{errors.fullName}</span> : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-[#5b403b]">Số điện thoại</span>
          <input
            type="tel"
            value={formData.phone}
            onChange={(event) => onChange('phone', event.target.value)}
            placeholder="Nhập số điện thoại"
            className={`${baseInputClass} ${errors.phone ? 'border-red-300 ring-2 ring-red-100' : 'border-[#e3beb6]'}`}
          />
          {errors.phone ? <span className="text-xs text-red-600">{errors.phone}</span> : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-[#5b403b]">Email (Tùy chọn)</span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => onChange('email', event.target.value)}
            placeholder="Nhập email"
            className={`${baseInputClass} ${errors.email ? 'border-red-300 ring-2 ring-red-100' : 'border-[#e3beb6]'}`}
          />
          {errors.email ? <span className="text-xs text-red-600">{errors.email}</span> : null}
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm text-[#5b403b]">Địa chỉ nhận hàng</span>
          <input
            type="text"
            value={formData.address}
            onChange={(event) => onChange('address', event.target.value)}
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
            className={`${baseInputClass} ${errors.address ? 'border-red-300 ring-2 ring-red-100' : 'border-[#e3beb6]'}`}
          />
          {errors.address ? <span className="text-xs text-red-600">{errors.address}</span> : null}
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm text-[#5b403b]">Ghi chú đơn hàng</span>
          <textarea
            rows="3"
            value={formData.note}
            onChange={(event) => onChange('note', event.target.value)}
            placeholder="Thêm ghi chú cho người bán hoặc đơn vị vận chuyển"
            className="rounded-lg border border-[#e3beb6] bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition placeholder:text-[#c7b7b2] focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
      </div>
    </section>
  )
}

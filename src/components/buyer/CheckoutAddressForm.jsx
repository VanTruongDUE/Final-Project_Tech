export default function CheckoutAddressForm({ formData, errors, onChange }) {
  return (
    <section className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#fff1ec] text-[#ee4d2d]">🚚</div>
        <h2 className="text-xl font-semibold text-[#1b1c1c]">Thông tin giao hàng</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm text-[#5b403b]">Họ và tên người nhận</span>
          <input
            type="text"
            value={formData.fullName}
            onChange={(event) => onChange('fullName', event.target.value)}
            placeholder="Nhập họ và tên"
            className={`h-12 rounded-lg border px-4 text-sm outline-none transition ${
              errors.fullName ? 'border-red-300 ring-2 ring-red-100' : 'border-[#e3beb6] focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15'
            }`}
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
            className={`h-12 rounded-lg border px-4 text-sm outline-none transition ${
              errors.phone ? 'border-red-300 ring-2 ring-red-100' : 'border-[#e3beb6] focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15'
            }`}
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
            className="h-12 rounded-lg border border-[#e3beb6] px-4 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm text-[#5b403b]">Địa chỉ nhận hàng</span>
          <input
            type="text"
            value={formData.address}
            onChange={(event) => onChange('address', event.target.value)}
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
            className={`h-12 rounded-lg border px-4 text-sm outline-none transition ${
              errors.address ? 'border-red-300 ring-2 ring-red-100' : 'border-[#e3beb6] focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15'
            }`}
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
            className="rounded-lg border border-[#e3beb6] px-4 py-3 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
          />
        </label>
      </div>
    </section>
  )
}

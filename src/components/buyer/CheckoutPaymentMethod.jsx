const paymentOptions = [
  {
    id: 'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi giao hàng',
    icon: '💵',
  },
  {
    id: 'bank',
    label: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản qua quét mã QR hoặc số tài khoản',
    icon: '🏦',
  },
]

export default function CheckoutPaymentMethod({ selectedPaymentId, onChange }) {
  return (
    <section className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#fff1ec] text-[#ee4d2d]">💳</div>
        <h2 className="text-xl font-semibold text-[#1b1c1c]">Phương thức thanh toán</h2>
      </div>

      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const isActive = option.id === selectedPaymentId

          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                isActive ? 'border-[#ee4d2d] bg-[#fff7f4]' : 'border-[#e3e2e2] hover:border-[#e3beb6]'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={isActive}
                onChange={() => onChange(option.id)}
                className="h-4 w-4 border-[#e3beb6] text-[#ee4d2d] focus:ring-[#ee4d2d]"
              />
              <span className="text-xl" aria-hidden="true">
                {option.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1b1c1c]">{option.label}</p>
                <p className="mt-1 text-sm text-[#5b403b]">{option.description}</p>
              </div>
            </label>
          )
        })}
      </div>
    </section>
  )
}

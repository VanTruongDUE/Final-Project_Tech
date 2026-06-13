import { shippingOptions } from './checkout-options'

export default function CheckoutShippingMethod({ selectedShippingId, onChange }) {
  return (
    <section className="rounded-lg border border-[#e3e2e2] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#fff1ec] text-[#ee4d2d]">📦</div>
        <h2 className="text-xl font-semibold text-[#1b1c1c]">Phương thức vận chuyển</h2>
      </div>

      <div className="space-y-3">
        {shippingOptions.map((option) => {
          const isActive = option.id === selectedShippingId

          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition ${
                isActive ? 'border-[#ee4d2d] bg-[#fff7f4]' : 'border-[#e3e2e2] hover:border-[#e3beb6]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={isActive}
                  onChange={() => onChange(option.id)}
                  className="h-4 w-4 border-[#e3beb6] text-[#ee4d2d] focus:ring-[#ee4d2d]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1b1c1c]">{option.label}</p>
                  <p className="mt-1 text-sm text-[#5b403b]">{option.description}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#1b1c1c]">
                {option.fee.toLocaleString('vi-VN')}đ
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}

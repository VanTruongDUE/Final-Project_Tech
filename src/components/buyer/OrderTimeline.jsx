import { ORDER_STATUS } from '../../services/orderService'

const timelineSteps = [
  { key: ORDER_STATUS.PENDING, label: 'Chờ xác nhận', icon: 'receipt_long' },
  { key: ORDER_STATUS.CONFIRMED, label: 'Đã xác nhận', icon: 'verified' },
  { key: 'PROCESSING', label: 'Đang xử lý', icon: 'inventory_2' },
  { key: ORDER_STATUS.SHIPPING, label: 'Đang giao', icon: 'local_shipping' },
  { key: ORDER_STATUS.COMPLETED, label: 'Hoàn thành', icon: 'check_circle' },
]

const activeIndexByStatus = {
  [ORDER_STATUS.PENDING]: 0,
  [ORDER_STATUS.CONFIRMED]: 1,
  [ORDER_STATUS.SHIPPING]: 3,
  [ORDER_STATUS.COMPLETED]: 4,
}

export default function OrderTimeline({ status }) {
  const isCancelled = status === ORDER_STATUS.CANCELLED
  const activeIndex = activeIndexByStatus[status] ?? 0

  if (isCancelled) {
    return (
      <section className="border border-[#f1d3d3] bg-[#fff7f7] p-4">
        <div className="flex items-center gap-3 bg-white px-4 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#ffe2e0] text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[22px]">cancel</span>
          </div>
          <div>
            <p className="font-semibold text-[#ba1a1a]">Đơn hàng đã hủy</p>
            <p className="text-sm text-[#7a4b44]">Đơn hàng đã được hủy và không tiếp tục xử lý.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border border-[#e8e8e8] bg-white p-4">
      <div className="relative hidden md:flex md:justify-between">
        <div className="absolute left-8 right-8 top-5 h-[3px] bg-[#e8e8e8]" />
        {timelineSteps.map((step, index) => {
          const isActive = index <= activeIndex
          const isCurrent = index === activeIndex

          return (
            <div key={step.key} className="relative z-10 flex min-w-[120px] flex-col items-center text-center">
              <div
                className={`grid h-10 w-10 place-items-center rounded-full border-4 border-white text-sm shadow-sm ${
                  isActive ? 'bg-[#ee4d2d] text-white' : 'bg-[#e8e8e8] text-[#8f7069]'
                } ${isCurrent ? 'scale-110' : ''}`}
              >
                <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
              </div>
              <p className={`mt-3 text-sm font-medium ${isCurrent ? 'text-[#ee4d2d]' : 'text-[#1b1c1c]'}`}>
                {step.label}
              </p>
              <p className="mt-1 text-[11px] text-[#8f7069]">
                {isCurrent ? 'Đang cập nhật' : isActive ? 'Đã ghi nhận' : ''}
              </p>
            </div>
          )
        })}
      </div>

      <div className="space-y-3 md:hidden">
        {timelineSteps.slice(0, activeIndex + 1).map((step, index) => {
          const isCurrent = index === activeIndex

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full ${
                  isCurrent ? 'bg-[#ee4d2d] text-white' : 'bg-[#f1f1f1] text-[#5b403b]'
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">{step.icon}</span>
              </div>
              <div>
                <p className={`text-sm font-medium ${isCurrent ? 'text-[#ee4d2d]' : 'text-[#1b1c1c]'}`}>
                  {step.label}
                </p>
                <p className="text-[11px] text-[#8f7069]">{isCurrent ? 'Đang cập nhật đơn hàng' : 'Đã ghi nhận'}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

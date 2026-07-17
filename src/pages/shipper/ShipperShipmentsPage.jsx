import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ShipperIcon from '../../components/shipper/ShipperIcon'
import { useAuth } from '../../contexts/useAuth'
import { shipperService } from '../../services/shipperService'

const statusFilters = [
  { value: 'all', label: 'Tất cả đơn' },
  { value: 'ASSIGNED', label: 'Đã phân công' },
  { value: 'PICKED_UP', label: 'Đã lấy hàng' },
  { value: 'IN_TRANSIT', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'FAILED', label: 'Thất bại' },
]

export default function ShipperShipmentsPage() {
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [shipmentsResponse, setShipmentsResponse] = useState({ success: true, data: [], meta: {} })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    shipperService
      .getShipperShipments(currentUser, { keyword, status })
      .then((response) => {
        if (isMounted) {
          setShipmentsResponse(response)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setShipmentsResponse({ success: false, data: [], message: error.message, meta: {} })
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [currentUser, keyword, status])

  const shipments = shipmentsResponse.success ? shipmentsResponse.data : []
  const counts = shipmentsResponse.meta?.counts || {}
  const totalCount = shipmentsResponse.meta?.totalCount || 0

  const filterTabs = statusFilters.map((filter) => ({
    ...filter,
    count: filter.value === 'all' ? totalCount : counts[filter.value] || 0,
  }))

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-[32px] font-bold text-[#1b1c1c]">Đơn được giao</h2>
          <p className="mt-1 text-sm text-[#5b403b]">Quản lý và theo dõi hàng đợi giao hàng hiện tại.</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <div className="relative min-w-0 sm:w-80">
            <ShipperIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" />
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm mã vận đơn hoặc người nhận..."
              className="w-full rounded-lg border border-[#e3beb6] bg-white py-2 pl-10 pr-4 text-sm text-[#1b1c1c] shadow-sm outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#ffdad3]/60"
            />
          </div>
          <button
            type="button"
            onClick={() => setKeyword((current) => current.trim())}
            className="flex items-center justify-center rounded-lg bg-[#b22204] px-3 py-2 text-white shadow-sm transition hover:bg-[#d63c1e]"
            aria-label="Tìm kiếm đơn giao"
          >
            <ShipperIcon name="arrow_forward" className="text-[18px]" />
          </button>
        </div>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {filterTabs.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatus(filter.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              status === filter.value ? 'bg-[#b22204] text-white shadow-sm' : 'border border-[#e3beb6] bg-white text-[#5b403b] hover:bg-[#f5f3f3]'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-[#e3beb6]/60 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e3beb6]/60 bg-[#f5f3f3] text-xs font-semibold uppercase tracking-wide text-[#5b403b]">
                <th className="px-4 py-3">Mã vận đơn</th>
                <th className="px-4 py-3">Người nhận</th>
                <th className="px-4 py-3">Địa chỉ giao hàng</th>
                <th className="px-4 py-3">COD</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Dự kiến giao</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3beb6]/40 text-sm text-[#1b1c1c]">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="group transition hover:bg-[#fbf9f9]">
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#b22204]">#{shipment.id}</span>
                      <button type="button" className="text-[#8f7069] opacity-0 transition hover:text-[#b22204] group-hover:opacity-100" aria-label={`Sao chép ${shipment.id}`}>
                        <ShipperIcon name="content_copy" className="text-[14px]" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-[#5b403b]">{shipment.orderId}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="font-semibold text-[#1b1c1c]">{shipment.receiverName}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#5b403b]">
                      <ShipperIcon name="phone_iphone" className="text-[13px]" />
                      {shipment.receiverPhone}
                    </p>
                  </td>
                  <td className="max-w-[280px] px-4 py-4 align-top text-[#5b403b]">{shipment.receiverAddress}</td>
                  <td className="px-4 py-4 align-top font-semibold text-[#1b1c1c]">{shipment.codLabel}</td>
                  <td className="px-4 py-4 align-top">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${shipment.statusMeta.className}`}>
                      <ShipperIcon name={shipment.statusMeta.icon} className="text-[14px]" />
                      {shipment.statusMeta.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-[#5b403b]">{shipment.estimatedDeliveryLabel}</td>
                  <td className="px-4 py-4 text-right align-top">
                    <Link
                      to={`/shipper/shipments/${shipment.id}`}
                      className="rounded border border-[#8f7069] px-3 py-1.5 text-xs font-semibold text-[#1b1c1c] opacity-100 transition hover:bg-[#f5f3f3] md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-sm font-medium text-[#5b403b]">
                    {isLoading ? 'Đang tải dữ liệu giao hàng...' : shipmentsResponse.message || 'Không tìm thấy đơn giao phù hợp.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#e3beb6]/60 px-4 py-3 text-xs font-medium text-[#5b403b]">
          <span>
            Hiển thị {shipments.length ? 1 : 0}-{shipments.length} trong {totalCount} đơn giao
          </span>
          <div className="flex gap-2">
            <button type="button" disabled className="grid h-8 w-8 place-items-center rounded border border-[#e3beb6] text-[#8f7069] disabled:opacity-50" aria-label="Trang trước">
              <ShipperIcon name="chevron_left" className="text-[18px]" />
            </button>
            <button type="button" disabled className="grid h-8 w-8 place-items-center rounded border border-[#e3beb6] text-[#8f7069] disabled:opacity-50" aria-label="Trang sau">
              <ShipperIcon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

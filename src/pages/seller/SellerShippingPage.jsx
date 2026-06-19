import { Link } from 'react-router-dom'
import { useState } from 'react'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'

const carrierOptions = [
  { value: 'all', label: 'Tất cả ĐVVC' },
  { value: 'GHN', label: 'Giao Hàng Nhanh' },
  { value: 'J&T', label: 'J&T Express' },
  { value: 'SPX', label: 'SPX Express' },
]

function ShippingStatCard({ stat }) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-[#e3beb6]/70 bg-white p-5 shadow-sm">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#ffdad3]/50" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5b403b]">{stat.title}</p>
          <p className={`mt-4 text-[40px] font-bold leading-none text-[#1b1c1c] ${stat.valueClassName || ''}`}>{stat.value}</p>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-full ${stat.iconClassName}`}>
          <SellerIcon name={stat.icon} className="text-[24px]" />
        </span>
      </div>
    </article>
  )
}

function ShippingStatusBadge({ meta }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${meta.className}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {meta.label}
    </span>
  )
}

export default function SellerShippingPage() {
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [carrier, setCarrier] = useState('all')
  const reportResponse = sellerService.getSellerShippingReport(currentUser, { keyword, carrier })

  if (!reportResponse.success) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#ba1a1a] shadow-sm">
          {reportResponse.message || 'Không thể tải dữ liệu vận chuyển.'}
        </div>
      </section>
    )
  }

  const { stats, rows } = reportResponse.data

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#f5f3f3] p-4 md:p-6">
      <div className="flex w-full min-w-0 flex-col gap-6 xl:pr-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[34px] font-bold leading-tight tracking-tight text-[#1b1c1c] md:text-[40px]">Quản lý vận chuyển</h1>
            <p className="mt-2 text-sm text-[#5b403b]">Theo dõi và quản lý trạng thái các đơn hàng đang giao dịch.</p>
          </div>
          <button
            type="button"
            onClick={() => window.alert('Xuất báo cáo đang là thao tác mock cho demo frontend.')}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#b22204] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#9a1d03]"
          >
            <SellerIcon name="download" className="text-[18px]" />
            Xuất báo cáo
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <ShippingStatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <section className="overflow-hidden rounded-xl border border-[#e3beb6]/70 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#e3beb6]/70 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid w-full gap-3 lg:grid-cols-[minmax(260px,1fr)_220px_260px]">
              <div className="relative">
                <SellerIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#8f7069]" />
                <input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Mã đơn hàng, mã vận đơn..."
                  className="h-12 w-full rounded-lg border border-[#e3beb6] bg-[#fbf9f9] pl-12 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                />
              </div>
              <select
                value={carrier}
                onChange={(event) => setCarrier(event.target.value)}
                className="h-12 rounded-lg border border-[#e3beb6] bg-white px-4 text-sm font-medium text-[#5b403b] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              >
                {carrierOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex h-12 items-center gap-2 rounded-lg border border-[#e3beb6] bg-white px-4 text-sm text-[#5b403b]">
                <SellerIcon name="calendar_today" className="text-[19px]" />
                01/10/2023 - 31/10/2023
              </div>
            </div>
            <button type="button" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#e3beb6] bg-[#f5f3f3] px-4 text-sm font-semibold text-[#1b1c1c] transition hover:bg-[#efeded]">
              <SellerIcon name="filter_list" className="text-[18px]" />
              Lọc nâng cao
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e3beb6]/70 bg-[#fbf9f9] text-xs font-bold uppercase tracking-[0.08em] text-[#5b403b]">
                  <th className="w-12 px-5 py-4">
                    <input type="checkbox" className="rounded border-[#e3beb6]" />
                  </th>
                  <th className="px-5 py-4">Mã đơn hàng</th>
                  <th className="px-5 py-4">Ngày đặt</th>
                  <th className="px-5 py-4">Đơn vị vận chuyển</th>
                  <th className="px-5 py-4">Mã vận đơn</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3beb6]/50">
                {rows.map((order) => (
                  <tr key={order.id} className={`group transition hover:bg-[#fbf9f9] ${order.shippingStatus === 'FAILED' ? 'bg-[#ffdad6]/20' : ''}`}>
                    <td className="px-5 py-4">
                      <input type="checkbox" className="rounded border-[#e3beb6]" />
                    </td>
                    <td className="px-5 py-4">
                      <Link to={`/seller/orders/${encodeURIComponent(order.id)}`} className="font-bold text-[#b22204] hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#5b403b]">
                      <div>{order.dateMeta.date}</div>
                      <div className="text-xs">{order.dateMeta.time}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#1b1c1c]">
                        <span className={`grid h-7 min-w-7 place-items-center rounded text-[10px] font-bold text-white ${order.carrier.colorClassName}`}>
                          {order.carrier.code}
                        </span>
                        {order.carrier.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-[#5b403b]">{order.trackingCode}</td>
                    <td className="px-5 py-4">
                      <ShippingStatusBadge meta={order.shippingStatusMeta} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" className="rounded-lg p-1.5 text-[#8f7069] transition hover:bg-[#fff1ec] hover:text-[#ee4d2d]" title="Xem hành trình">
                          <SellerIcon name="local_shipping" className="text-[20px]" />
                        </button>
                        <Link to={`/seller/orders/${encodeURIComponent(order.id)}`} className="rounded-lg p-1.5 text-[#8f7069] transition hover:bg-[#fff1ec] hover:text-[#ee4d2d]" title="Xem chi tiết">
                          <SellerIcon name="visibility" className="text-[20px]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#e3beb6]/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#5b403b]">
              Hiển thị 1-{rows.length} trên {reportResponse.meta.allCount} đơn hàng
            </p>
            <div className="flex items-center gap-2">
              <button type="button" disabled className="grid h-9 w-9 place-items-center rounded-lg border border-[#e3beb6] text-[#8f7069] opacity-60">
                <SellerIcon name="chevron_left" className="text-[18px]" />
              </button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg bg-[#b22204] text-sm font-bold text-white">
                1
              </button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg text-sm font-semibold text-[#1b1c1c]">2</button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg text-sm font-semibold text-[#1b1c1c]">3</button>
              <span className="grid h-9 w-9 place-items-center text-sm text-[#8f7069]">...</span>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-lg border border-[#e3beb6] text-[#5b403b]">
                <SellerIcon name="chevron_right" className="text-[18px]" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

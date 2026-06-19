import { useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

const rangeOptions = [
  { value: 'today', label: 'Hôm nay' },
  { value: '7days', label: '7 ngày' },
  { value: '30days', label: '30 ngày' },
]

function KpiCard({ label, value, trend, icon, featured = false }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#e3e2e2]/60 bg-white p-4 shadow-sm">
      <div className="absolute right-0 top-0 p-4 opacity-10">
        <AdminIcon name={icon} className="text-[64px]" filled />
      </div>
      <div className="relative z-10 mb-1 flex items-center gap-1 text-xs font-medium text-[#5b403b]">
        {label}
        {featured ? <AdminIcon name="info" className="text-[14px] text-[#8f7069]" /> : null}
      </div>
      <div className={`relative z-10 font-bold ${featured ? 'text-[32px] text-[#ee4d2d] md:text-[48px]' : 'mt-2 text-2xl text-[#1b1c1c]'}`}>{value}</div>
      <div className="relative z-10 mt-2 flex items-center gap-1 text-xs">
        <span className="flex items-center rounded bg-green-50 px-1 text-green-600">
          <AdminIcon name="trending_up" className="text-[12px]" />
          {trend}
        </span>
        <span className="text-[#5b403b]">so với kỳ trước</span>
      </div>
    </div>
  )
}

function RevenueChart({ data }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="relative h-[300px] overflow-hidden rounded-b-xl bg-[#fbf9f9] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e3beb6_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative z-10 flex h-full items-end gap-2 px-2 pt-8">
        {data.map((item) => {
          const height = Math.max(16, Math.round((item.value / maxValue) * 100))

          return (
            <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
              <div
                className="group relative w-full rounded-t bg-[#ffb4a4] shadow-sm transition hover:bg-[#d63c1e]"
                style={{ height: `${height}%` }}
                title={`${item.label}: ${item.valueLabel}`}
              >
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-[#e3e2e2] bg-white px-2 py-1 text-xs font-medium text-[#1b1c1c] shadow-sm group-hover:block">
                  {item.valueLabel}
                </div>
              </div>
              <span className="text-center text-[11px] text-[#5b403b]">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminStatisticsPage() {
  const [range, setRange] = useState('today')
  const [storeKeyword, setStoreKeyword] = useState('')
  const reportResponse = adminService.getAdminStatisticsReport({ range })
  const report = reportResponse.data
  const metrics = report.metrics
  const stores = report.storePerformance.filter((store) => store.name.toLowerCase().includes(storeKeyword.trim().toLowerCase()))

  return (
    <section className="flex w-full min-w-0 flex-col gap-6 bg-[#fbf9f9] p-3 md:p-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Báo cáo doanh thu toàn sàn</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Doanh thu được tính từ các đơn hàng đã hoàn tất thành công.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-[#e3e2e2] bg-white p-1">
            {rangeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${range === option.value ? 'bg-[#b22204] text-white' : 'text-[#5b403b] hover:bg-[#f5f3f3]'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => window.alert('Xuất báo cáo hiện đang ở chế độ mock Admin.')}
            className="flex items-center gap-1 rounded-lg bg-[#ee4d2d] px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#d44428]"
          >
            <AdminIcon name="download" className="text-[18px]" />
            Xuất báo cáo
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Tổng doanh thu" value={metrics.totalRevenueLabel} trend={metrics.revenueGrowth} icon="payments" featured />
        <KpiCard label="Đơn hàng hoàn tất" value={metrics.completedOrders.toLocaleString('vi-VN')} trend={metrics.orderGrowth} icon="check_circle" />
        <KpiCard label="Doanh thu trung bình/ngày" value={metrics.avgDailyRevenueLabel} trend="0.0%" icon="query_stats" />
        <div className="relative overflow-hidden rounded-xl border border-[#e3e2e2]/60 bg-white p-4 shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <AdminIcon name="storefront" className="text-[64px]" filled />
          </div>
          <div className="relative z-10 text-xs font-medium text-[#5b403b]">Cửa hàng có doanh thu</div>
          <div className="relative z-10 mt-2 text-2xl font-bold text-[#1b1c1c]">
            {metrics.storesWithRevenue} <span className="text-sm font-normal text-[#5b403b]">/ {metrics.totalStores}</span>
          </div>
          <div className="relative z-10 mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9e8e7]">
            <div className="h-1.5 rounded-full bg-[#ee4d2d]" style={{ width: `${Math.round((metrics.storesWithRevenue / metrics.totalStores) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#e3e2e2] bg-[#fbf9f9] p-4 md:flex-row md:items-center">
          <h2 className="text-xl font-semibold text-[#1b1c1c]">Doanh thu theo thời gian</h2>
          <button type="button" className="self-start rounded p-1 text-[#8f7069] transition hover:bg-[#f5f3f3] hover:text-[#b22204] md:self-auto" aria-label="Tùy chọn biểu đồ">
            <AdminIcon name="more_vert" className="text-[20px]" />
          </button>
        </div>
        <RevenueChart data={report.revenueTrend} />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#e3e2e2] bg-[#fbf9f9] p-4 md:flex-row md:items-center">
          <h2 className="text-xl font-semibold text-[#1b1c1c]">Hiệu suất cửa hàng</h2>
          <div className="relative w-full md:w-56">
            <AdminIcon name="search" className="absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-[#8f7069]" />
            <input
              type="search"
              value={storeKeyword}
              onChange={(event) => setStoreKeyword(event.target.value)}
              placeholder="Tìm cửa hàng..."
              className="h-9 w-full rounded-lg border border-[#e3e2e2] bg-white py-1 pl-8 pr-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204] focus:ring-1 focus:ring-[#b22204]/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e3e2e2] bg-[#f5f3f3] text-xs font-medium text-[#5b403b]">
                <th className="p-3 font-semibold">Tên cửa hàng</th>
                <th className="p-3 text-right font-semibold">Đơn hoàn tất</th>
                <th className="p-3 text-right font-semibold">Sản phẩm bán</th>
                <th className="p-3 text-right font-semibold">Doanh thu</th>
                <th className="p-3 text-right font-semibold">Thay đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e2] text-sm">
              {stores.map((store) => (
                <tr key={store.id} className="transition-colors hover:bg-[#fbf9f9]">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-[#ffdad3] text-xs font-bold text-[#8d1600]">{store.shortName}</div>
                      <span className="font-medium text-[#1b1c1c]">{store.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right text-[#1b1c1c]">{store.completedOrders.toLocaleString('vi-VN')}</td>
                  <td className="p-3 text-right text-[#1b1c1c]">{store.itemsSold.toLocaleString('vi-VN')}</td>
                  <td className="p-3 text-right font-semibold text-[#ee4d2d]">{store.revenueLabel}</td>
                  <td className={`p-3 text-right font-medium ${store.changeType === 'down' ? 'text-[#ba1a1a]' : store.changeType === 'flat' ? 'text-[#8f7069]' : 'text-green-600'}`}>{store.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#e3e2e2] p-3 text-xs font-medium text-[#5b403b]">
          <span>Hiển thị {stores.length ? 1 : 0}-{stores.length} trong {report.storePerformance.length} cửa hàng</span>
          <div className="flex gap-1">
            <button type="button" disabled className="flex h-7 w-7 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50">
              <AdminIcon name="chevron_left" className="text-[16px]" />
            </button>
            <button type="button" disabled className="flex h-7 w-7 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:opacity-50">
              <AdminIcon name="chevron_right" className="text-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

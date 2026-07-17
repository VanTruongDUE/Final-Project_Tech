import { useEffect, useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

const rangeOptions = [
  { value: 'today', label: 'Hôm nay' },
  { value: '7days', label: '7 ngày' },
  { value: '30days', label: '30 ngày' },
]

const chartTypeOptions = [
  { value: 'area', label: 'Vùng' },
  { value: 'line', label: 'Đường' },
  { value: 'bar', label: 'Cột' },
]

const orderStatusLabels = {
  PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', PROCESSING: 'Đang xử lý',
  READY_TO_SHIP: 'Chờ giao vận', SHIPPING: 'Đang giao', COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy', DELIVERY_FAILED: 'Giao thất bại',
}

function KpiCard({ label, value, trend, icon, featured = false }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#e3e2e2]/60 bg-white p-4 shadow-sm">
      <div className="absolute right-0 top-0 p-4 opacity-10">
        <AdminIcon name={icon} className="text-[44px]" filled />
      </div>
      <div className="relative z-10 mb-1 flex items-center gap-1 text-xs font-medium text-[#5b403b]">
        {label}
        {featured ? <AdminIcon name="info" className="text-[14px] text-[#8f7069]" /> : null}
      </div>
      <div className={`relative z-10 font-bold ${featured ? 'text-[28px] text-[#ee4d2d] md:text-[32px]' : 'mt-2 text-2xl text-[#1b1c1c]'}`}>{value}</div>
      {trend ? <div className="relative z-10 mt-2 text-xs text-[#5b403b]">{trend}</div> : <div className="relative z-10 mt-2 text-xs text-[#5b403b]">Trong khoảng đã chọn</div>}
    </div>
  )
}

function buildRevenuePath(data) {
  const maxValue = Math.max(...data.map((item) => item.value), 1)
  const stepX = data.length > 1 ? 100 / (data.length - 1) : 100
  const coordinates = data.map((item, index) => ({
    x: index * stepX,
    y: 50 - (item.value / maxValue) * 38,
  }))
  const path = coordinates.reduce((command, point, index) => {
    if (index === 0) {
      return `M${point.x},${point.y}`
    }

    const previous = coordinates[index - 1]
    const midpoint = (previous.x + point.x) / 2
    return `${command} Q${midpoint},${previous.y} ${point.x},${point.y}`
  }, '')

  return {
    path,
    area: `${path} L100,50 L0,50 Z`,
    coordinates,
    maxValue,
  }
}

function RevenueChart({ data, chartType }) {
  if (!data.length) {
    return <div className="grid h-[300px] place-items-center bg-[#fbf9f9] text-sm text-[#5b403b]">Không có doanh thu hoàn thành trong khoảng đã chọn.</div>
  }
  const chart = buildRevenuePath(data)

  return (
    <div className="relative h-[300px] overflow-hidden rounded-b-xl bg-[#fbf9f9] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e3beb6_1px,transparent_1px)] [background-size:24px_24px]" />
      {chartType === 'bar' ? (
        <div className="relative z-10 flex h-full items-end gap-2 px-2 pt-8">
          {data.map((item) => {
            const height = Math.max(16, Math.round((item.value / chart.maxValue) * 100))

            return (
              <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div className="group relative w-full rounded-t bg-[#ffb4a4] shadow-sm transition hover:bg-[#d63c1e]" style={{ height: `${height}%` }}>
                  <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-[#e3e2e2] bg-white px-2 py-1 text-xs font-medium text-[#1b1c1c] shadow-sm group-hover:block">
                    {item.label}: {item.valueLabel}
                  </div>
                </div>
                <span className="text-center text-[11px] text-[#5b403b]">{item.label}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <>
          <svg className="relative z-10 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 50">
            {chartType === 'area' ? <path d={chart.area} fill="#ffdad3" opacity="0.75" /> : null}
            <path d={chart.path} fill="none" stroke="#ee4d2d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
          </svg>
          {chart.coordinates.map((point, index) => {
            const item = data[index]

            return (
              <div
                key={item.label}
                className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${point.x}%`, top: `${point.y * 2}%` }}
              >
                <div className="h-3 w-3 rounded-full border-2 border-white bg-[#ee4d2d] shadow transition group-hover:scale-125" />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-[#e3e2e2] bg-white px-2 py-1 text-xs font-medium text-[#1b1c1c] shadow-sm group-hover:block">
                  {item.label}: {item.valueLabel}
                </div>
              </div>
            )
          })}
          <div className="absolute bottom-3 left-6 right-6 z-20 flex justify-between text-[11px] text-[#5b403b]">
            {data.map((item) => (
              <span key={item.label}>{item.label}</span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminStatisticsPage() {
  const [range, setRange] = useState('today')
  const [chartType, setChartType] = useState('area')
  const [storeKeyword, setStoreKeyword] = useState('')
  const [reportResponse, setReportResponse] = useState({ success: false, isLoading: true })

  useEffect(() => {
    let isMounted = true

    setReportResponse({ success: false, isLoading: true })
    Promise.resolve(adminService.getAdminStatisticsReport({ range }))
      .then((response) => {
        if (isMounted) setReportResponse(response)
      })
      .catch((error) => {
        if (isMounted) setReportResponse({ success: false, message: error.message })
      })

    return () => {
      isMounted = false
    }
  }, [range])

  if (reportResponse.isLoading) {
    return (
      <section className="flex w-full min-w-0 flex-col gap-6 bg-[#fbf9f9] p-3 md:p-6">
        <div className="rounded-xl border border-[#e3e2e2] bg-white p-5 text-sm text-[#5b403b] shadow-sm">Đang tải báo cáo Admin...</div>
      </section>
    )
  }

  if (!reportResponse.success) {
    return (
      <section className="flex w-full min-w-0 flex-col gap-6 bg-[#fbf9f9] p-3 md:p-6">
        <div className="rounded-xl border border-[#ffdad6] bg-white p-5 text-sm text-[#ba1a1a] shadow-sm">{reportResponse.message || 'Không thể tải báo cáo Admin.'}</div>
      </section>
    )
  }

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
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Tổng doanh thu" value={metrics.totalRevenueLabel} trend={metrics.revenueGrowth} icon="payments" featured />
        <KpiCard label="Đơn hàng hoàn tất" value={metrics.completedOrders.toLocaleString('vi-VN')} trend={metrics.orderGrowth} icon="check_circle" />
        <KpiCard label="Doanh thu trung bình/ngày" value={metrics.avgDailyRevenueLabel} icon="query_stats" />
        <div className="relative overflow-hidden rounded-xl border border-[#e3e2e2]/60 bg-white p-4 shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <AdminIcon name="storefront" className="text-[44px]" filled />
          </div>
          <div className="relative z-10 text-xs font-medium text-[#5b403b]">Cửa hàng có doanh thu</div>
          <div className="relative z-10 mt-2 text-2xl font-bold text-[#1b1c1c]">
            {metrics.storesWithRevenue} <span className="text-sm font-normal text-[#5b403b]">/ {metrics.totalStores}</span>
          </div>
          <div className="relative z-10 mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9e8e7]">
            <div className="h-1.5 rounded-full bg-[#ee4d2d]" style={{ width: `${Math.round((metrics.storesWithRevenue / Math.max(metrics.totalStores, 1)) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#e3e2e2] bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold text-[#1b1c1c]">Thống kê trạng thái đơn hàng</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(orderStatusLabels).map(([status, label]) => (
            <div key={status} className="rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] p-3">
              <p className="text-xs text-[#5b403b]">{label}</p>
              <p className="mt-1 text-xl font-bold text-[#b22204]">{Number(report.orderStatistics[status] || 0)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#e3e2e2] bg-[#fbf9f9] p-4 md:flex-row md:items-center">
          <h2 className="text-xl font-semibold text-[#1b1c1c]">Doanh thu theo thời gian</h2>
          <div className="flex self-start rounded-lg border border-[#e3e2e2] bg-white p-1 md:self-auto">
            {chartTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setChartType(option.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${chartType === option.value ? 'bg-[#b22204] text-white' : 'text-[#5b403b] hover:bg-[#f5f3f3]'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <RevenueChart data={report.revenueTrend} chartType={chartType} />
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e2] text-sm">
              {stores.length ? stores.map((store) => (
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
                </tr>
              )) : <tr><td colSpan="4" className="p-6 text-center text-[#5b403b]">Không có cửa hàng phát sinh doanh thu trong kỳ.</td></tr>}
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

      <div className="overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-sm">
        <div className="border-b border-[#e3e2e2] bg-[#fbf9f9] p-4"><h2 className="text-xl font-semibold text-[#1b1c1c]">Sản phẩm bán chạy theo SKU / biến thể</h2></div>
        {report.topProducts.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#e3e2e2] text-xs uppercase text-[#5b403b]"><tr><th className="p-3">Sản phẩm</th><th className="p-3">Cửa hàng</th><th className="p-3 text-right">Số lượng</th><th className="p-3 text-right">Doanh thu item</th></tr></thead>
              <tbody className="divide-y divide-[#e3e2e2]">
                {report.topProducts.map((product) => (
                  <tr key={product.id}><td className="p-3"><p className="font-semibold">{product.name}</p><p className="text-xs text-[#5b403b]">{product.skuCode || 'Chưa có SKU'} · {product.variantName}</p></td><td className="p-3">{product.storeName}</td><td className="p-3 text-right font-semibold">{product.sold.toLocaleString('vi-VN')}</td><td className="p-3 text-right font-semibold text-[#ee4d2d]">{product.revenueLabel}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="p-6 text-center text-sm text-[#5b403b]">Không có sản phẩm bán chạy trong kỳ.</p>}
      </div>
    </section>
  )
}

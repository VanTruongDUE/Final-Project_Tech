import { Link } from 'react-router-dom'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

function formatCompactVnd(value) {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1).replace('.0', '')}B VNĐ`
  }

  if (value >= 1000000) {
    return `${Math.round(value / 1000000)}M VNĐ`
  }

  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

function buildRevenuePath(points) {
  const maxValue = Math.max(...points.map((point) => point.value), 1)
  const stepX = points.length > 1 ? 100 / (points.length - 1) : 100
  const coordinates = points.map((point, index) => ({
    x: index * stepX,
    y: 50 - (point.value / maxValue) * 38,
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
  }
}

function MetricCard({ metric }) {
  if (metric.featured) {
    return (
      <div className="relative col-span-2 overflow-hidden rounded border border-blue-800 bg-gradient-to-br from-blue-900 to-blue-700 p-3 shadow md:col-span-4 lg:col-span-1">
        <div className="mb-1 flex items-start justify-between">
          <span className="text-xs font-medium text-blue-100">{metric.label}</span>
          <AdminIcon name={metric.icon} className="text-[18px] text-white" />
        </div>
        <div className="mt-1 text-xl font-semibold text-white">{metric.value}</div>
        <div className="mt-1 flex items-center text-xs font-medium text-blue-200">
          <AdminIcon name="arrow_upward" className="mr-1 text-[14px]" />
          {metric.trend}
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-1 flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500">{metric.label}</span>
        <AdminIcon name={metric.icon} className={`text-[18px] ${metric.iconClassName}`} />
      </div>
      <div className="text-xl font-semibold text-slate-900">{metric.value}</div>
      <div className="mt-1 flex items-center text-xs font-medium text-green-600">
        <AdminIcon name="trending_up" className="mr-1 text-[14px]" />
        {metric.trend}
      </div>
    </div>
  )
}

function RevenueTrend({ points }) {
  const chart = buildRevenuePath(points)

  return (
    <div className="rounded border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Xu hướng doanh thu</h2>
        <select className="rounded border border-slate-300 bg-slate-50 px-2 py-1 text-xs text-slate-700 outline-none">
          <option>30 ngày qua</option>
          <option>Năm nay</option>
        </select>
      </div>

      <div className="relative h-48 overflow-hidden rounded border border-dashed border-slate-300 bg-slate-50">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-100/30 to-transparent" />
        <svg className="relative h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 50">
          <path d={chart.area} fill="#dbeafe" opacity="0.75" />
          <path d={chart.path} fill="none" stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[11px] font-medium text-slate-500">
          {points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecentActivityTable({ activities }) {
  return (
    <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-3">
        <h2 className="text-sm font-bold text-slate-800">Hoạt động gần đây</h2>
        <button type="button" className="text-xs font-medium text-blue-600 hover:underline">
          Xem tất cả
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Đối tượng</th>
              <th className="px-4 py-2">Hành động</th>
              <th className="px-4 py-2">Thời gian</th>
              <th className="px-4 py-2 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.map((activity) => (
              <tr key={activity.id} className="transition-colors hover:bg-slate-50">
                <td className="flex items-center gap-2 px-4 py-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded ${activity.iconClassName}`}>
                    <AdminIcon name={activity.icon} className="text-[14px]" />
                  </div>
                  <span className="font-medium text-slate-800">{activity.entity}</span>
                </td>
                <td className="px-4 py-2 text-slate-600">{activity.action}</td>
                <td className="px-4 py-2 text-xs text-slate-500">{activity.time}</td>
                <td className="px-4 py-2 text-right">
                  <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${activity.statusClassName}`}>{activity.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ActionRequired({ alerts }) {
  const toneClassName = {
    red: 'border-red-100 bg-red-50 text-red-800',
    amber: 'border-amber-100 bg-amber-50 text-amber-800',
  }

  return (
    <div className="relative overflow-hidden rounded border border-red-200 bg-white p-3 shadow-sm">
      <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />
      <h2 className="mb-2 ml-1 flex items-center gap-2 text-sm font-bold text-slate-800">
        <AdminIcon name="warning" className="text-[18px] text-red-500" />
        Cần xử lý
      </h2>
      <div className="ml-1 space-y-2">
        {alerts.map((alert) => (
          <div key={alert.id} className={`flex items-center justify-between rounded border p-2 ${toneClassName[alert.tone]}`}>
            <div>
              <p className="text-xs font-semibold">{alert.title}</p>
              <p className="mt-0.5 text-[11px] opacity-80">{alert.description}</p>
            </div>
            {alert.to ? (
              <Link to={alert.to} className="rounded bg-white px-2 py-1 text-xs font-medium shadow-sm transition hover:bg-slate-50">
                {alert.actionLabel}
              </Link>
            ) : (
              <button type="button" className="rounded bg-white px-2 py-1 text-xs font-medium shadow-sm transition hover:bg-slate-50">
                {alert.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderStatus({ orderStatus }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="mb-2 text-sm font-bold text-slate-800">Trạng thái đơn hàng</h2>
      <div className="relative mb-2 flex h-32 items-center justify-center">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="20" />
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2563eb" strokeDasharray="251.2" strokeDashoffset="62.8" strokeWidth="20" />
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fbbf24" strokeDasharray="251.2" strokeDashoffset="213.5" strokeWidth="20" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-slate-800">{new Intl.NumberFormat('vi-VN').format(orderStatus.total)}</span>
          <span className="text-[10px] uppercase text-slate-500">Tổng</span>
        </div>
      </div>

      <div className="space-y-1">
        {orderStatus.segments.map((segment) => (
          <div key={segment.id} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded ${segment.colorClassName}`} />
              <span className="text-slate-600">{segment.label}</span>
            </div>
            <span className="font-medium text-slate-800">{segment.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const dashboardResponse = adminService.getDashboardStats()

  if (!dashboardResponse.success) {
    return (
      <section className="p-4">
        <div className="rounded border border-red-200 bg-white p-4 text-sm text-red-700">Không thể tải dashboard Admin.</div>
      </section>
    )
  }

  const { metrics, revenueTrend, recentActivity, alerts, orderStatus, lastUpdated, totals } = dashboardResponse.data

  return (
    <section className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 p-3 md:p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Tổng quan hệ thống</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi chỉ số toàn sàn và hoạt động mới nhất.</p>
        </div>
        <div className="text-xs text-slate-500">Cập nhật: {lastUpdated}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <RevenueTrend points={revenueTrend} />
          <RecentActivityTable activities={recentActivity} />
        </div>

        <div className="space-y-2">
          <ActionRequired alerts={alerts} />
          <OrderStatus orderStatus={orderStatus} />
        </div>
      </div>

      <p className="sr-only">
        Dashboard mock toàn sàn: {totals.users} người dùng, {totals.stores} cửa hàng, {totals.products} sản phẩm, {totals.orders} đơn hàng,
        doanh thu {formatCompactVnd(totals.revenue)}.
      </p>
    </section>
  )
}

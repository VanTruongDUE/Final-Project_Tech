import { Link } from 'react-router-dom'
import ShipperIcon from '../../components/shipper/ShipperIcon'
import { useAuth } from '../../contexts/useAuth'
import { shipperService } from '../../services/shipperService'

function MetricCard({ metric }) {
  return (
    <div className="flex min-h-[140px] flex-col justify-between rounded-xl border border-[#e3beb6]/50 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-xs font-medium text-[#5b403b]">{metric.label}</p>
        <div className={`rounded-lg p-1.5 ${metric.iconClassName}`}>
          <ShipperIcon name={metric.icon} className="text-[20px]" />
        </div>
      </div>
      <p className={`text-4xl font-bold ${metric.featured ? 'text-orange-800' : metric.danger ? 'text-red-800' : 'text-[#1b1c1c]'}`}>{metric.value}</p>
    </div>
  )
}

function StatusDistribution({ distribution }) {
  const success = distribution.successPercent
  const pending = distribution.pendingPercent
  const failed = Math.max(0, distribution.failedPercent)

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#e3beb6]/50 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1b1c1c]">Phân bố trạng thái</h3>
        <ShipperIcon name="more_vert" className="text-[22px] text-[#5b403b]" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#e3e2e2]">
            <div className="h-full bg-[#b22204]" style={{ width: `${success}%` }} />
            <div className="h-full bg-[#e3e2e2]" style={{ width: `${pending}%` }} />
            <div className="h-full bg-[#ba1a1a]" style={{ width: `${failed}%` }} />
          </div>
          <span className="w-10 text-xs font-medium text-[#5b403b]">{distribution.onTimeRate}%</span>
        </div>

        <p className="text-center text-sm text-[#1b1c1c]">Tỷ lệ giao thành công đang ổn định.</p>

        <div
          className="relative mx-auto mt-2 flex h-32 w-32 items-center justify-center rounded-full"
          style={{ background: `conic-gradient(#b22204 0% ${success}%, #e3e2e2 ${success}% ${success + pending}%, #ba1a1a ${success + pending}% 100%)` }}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white shadow-inner">
            <span className="text-xl font-semibold text-[#1b1c1c]">{distribution.total}</span>
            <span className="text-xs font-medium text-[#5b403b]">Tổng đơn</span>
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-5 text-xs font-medium text-[#5b403b]">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#b22204]" /> Thành công</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#e3e2e2]" /> Đang xử lý</span>
        </div>
      </div>
    </div>
  )
}

export default function ShipperDashboardPage() {
  const { currentUser } = useAuth()
  const dashboardResponse = shipperService.getShipperDashboard(currentUser)
  const dashboard = dashboardResponse.data

  if (!dashboardResponse.success) {
    return (
      <section className="p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#5b403b]">{dashboardResponse.message}</div>
      </section>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-4 md:p-6">
      <div>
        <h2 className="hidden text-[32px] font-bold text-[#1b1c1c] md:block">Tổng quan</h2>
        <p className="mt-1 text-sm text-[#5b403b]">Theo dõi hiệu suất giao hàng trong ngày và các đơn đang hoạt động.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboard.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatusDistribution distribution={dashboard.distribution} />

        <div className="overflow-hidden rounded-xl border border-[#e3beb6]/50 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#e3beb6]/50 bg-[#fbf9f9] p-4">
            <h3 className="text-lg font-semibold text-[#1b1c1c]">Đơn giao gần đây</h3>
            <Link to="/shipper/shipments" className="flex items-center gap-1 text-xs font-medium text-[#b22204] transition hover:text-[#d63c1e]">
              Xem tất cả
              <ShipperIcon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e3beb6]/50 bg-[#f5f3f3] text-xs font-medium text-[#5b403b]">
                  <th className="p-4 font-medium">Mã vận đơn</th>
                  <th className="hidden p-4 font-medium sm:table-cell">Mã đơn</th>
                  <th className="p-4 font-medium">Người nhận & địa chỉ</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3beb6]/30 text-sm text-[#1b1c1c]">
                {dashboard.recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="group transition hover:bg-[#fbf9f9]">
                    <td className="p-4 font-medium text-[#b22204]">#{shipment.id}</td>
                    <td className="hidden p-4 text-[#5b403b] sm:table-cell">{shipment.orderId}</td>
                    <td className="p-4">
                      <p className="font-medium text-[#1b1c1c]">{shipment.receiverName}</p>
                      <p className="mt-0.5 text-xs text-[#5b403b]">{shipment.receiverAddress}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${shipment.statusMeta.className}`}>{shipment.statusMeta.label}</span>
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/shipper/shipments/${shipment.id}`} className="rounded border border-[#8f7069] px-3 py-1 text-xs font-medium text-[#1b1c1c] opacity-100 transition hover:bg-[#f5f3f3] md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

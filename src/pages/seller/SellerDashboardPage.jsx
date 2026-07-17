import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SellerChartTooltip from '../../components/seller/SellerChartTooltip'
import SellerChartTypeToggle from '../../components/seller/SellerChartTypeToggle'
import SellerIcon from '../../components/seller/SellerIcon'
import SellerStatCard from '../../components/seller/SellerStatCard'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'
import { formatCurrency } from '../../utils/formatCurrency'

function formatToday() {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

function buildLineChart(points, maxValue) {
  const stepX = points.length > 1 ? 100 / (points.length - 1) : 100
  const coordinates = points.map((item, index) => ({
    x: index * stepX,
    y: 100 - (item.value / maxValue) * 86,
  }))
  const path = coordinates.reduce((command, point, index) => {
    if (index === 0) {
      return `M ${point.x},${point.y}`
    }

    const previous = coordinates[index - 1]
    const midpoint = (previous.x + point.x) / 2
    return `${command} C ${midpoint},${previous.y} ${midpoint},${point.y} ${point.x},${point.y}`
  }, '')

  return {
    coordinates,
    path,
    area: `${path} L 100,100 L 0,100 Z`,
  }
}

function buildPieGradient(points) {
  const total = points.reduce((sum, item) => sum + item.value, 0)
  let cursor = 0
  const colors = ['#b22204', '#ee4d2d', '#ffb4a4', '#d63c1e', '#8d1600', '#ffdad3', '#e3beb6']

  if (!total) {
    return '#efeded'
  }

  return `conic-gradient(${points
    .map((item, index) => {
      const start = cursor
      const end = cursor + (item.value / total) * 100
      cursor = end
      return `${colors[index % colors.length]} ${start}% ${end}%`
    })
    .join(', ')})`
}

function getDashboardOrderAction(orderStatus) {
  if (orderStatus === 'SHIPPING') {
    return { label: 'Theo dõi đơn', icon: 'local_shipping' }
  }

  if (orderStatus === 'COMPLETED' || orderStatus === 'CANCELLED') {
    return { label: 'Xem chi tiết', icon: 'visibility' }
  }

  return { label: 'Xử lý đơn', icon: 'arrow_forward' }
}

export default function SellerDashboardPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [chartType, setChartType] = useState('bar')
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null)
  const [dashboardResponse, setDashboardResponse] = useState({ success: false, isLoading: true })

  useEffect(() => {
    let isMounted = true

    setDashboardResponse({ success: false, isLoading: true })
    Promise.resolve(sellerService.getSellerDashboardStats(currentUser))
      .then((response) => {
        if (isMounted) setDashboardResponse(response)
      })
      .catch((error) => {
        if (isMounted) {
          setDashboardResponse({ success: false, message: error.message || 'Không thể tải dashboard seller.' })
        }
      })

    return () => {
      isMounted = false
    }
  }, [currentUser])

  const maxChartValue = useMemo(() => {
    if (!dashboardResponse.success) {
      return 100
    }

    return Math.max(...dashboardResponse.data.weekRevenue.map((item) => item.value), 20)
  }, [dashboardResponse])

  if (dashboardResponse.isLoading) {
    return (
      <section className="p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#5b403b] shadow-sm">
          Đang tải dashboard seller...
        </div>
      </section>
    )
  }

  if (!dashboardResponse.success) {
    return (
      <section className="p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#ba1a1a] shadow-sm">
          {dashboardResponse.message || 'Không thể tải dashboard seller.'}
        </div>
      </section>
    )
  }

  const { cards, quickActions, recentOrders, weekRevenue, store } = dashboardResponse.data
  const lineChart = buildLineChart(weekRevenue, maxChartValue)
  const pieGradient = buildPieGradient(weekRevenue)
  const totalWeekRevenue = weekRevenue.reduce((sum, item) => sum + item.value, 0)

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#f5f3f3]">
      <header className="sticky top-0 z-30 flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b border-[#e3beb6]/60 bg-white px-4 py-4 shadow-sm md:px-6">
        <div className="flex items-center gap-2 rounded-full border border-[#e3beb6]/50 bg-[#efeded] px-4 py-2 text-sm text-[#5b403b] shadow-sm">
          <SellerIcon name="calendar_today" className="text-[18px]" />
          <span className="capitalize">{formatToday()}</span>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="rounded-full p-2 text-[#5b403b] transition hover:bg-[#f5f3f3] hover:text-[#b22204]">
            <SellerIcon name="notifications" />
          </button>
          <div className="hidden items-center gap-2 rounded-lg p-2 transition hover:bg-[#f5f3f3] md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffdad3] font-bold text-[#b22204]">
              {currentUser?.fullName?.[0] || 'S'}
            </div>
            <span className="text-sm font-semibold text-[#1b1c1c]">{currentUser?.fullName || 'TechTonic Seller'}</span>
            <SellerIcon name="expand_more" className="text-[18px] text-[#8f7069]" />
          </div>
        </div>
      </header>

      <div className="flex w-full min-w-0 flex-col gap-6 p-4 md:p-6 xl:pr-8">
        <div className="mb-1">
          <h1 className="mb-1 text-[28px] font-bold tracking-tight text-[#1b1c1c] md:text-[32px]">Tổng quan hôm nay</h1>
          <p className="text-base text-[#5b403b]">Cập nhật số liệu kinh doanh mới nhất của gian hàng {store.storeName}.</p>
        </div>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <SellerStatCard key={card.id} card={card} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="min-w-0 rounded-xl border border-[#e3beb6]/30 bg-white p-4 shadow-sm xl:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[#1b1c1c]">Doanh thu 7 ngày qua</h2>
              <div className="flex flex-wrap items-center gap-3">
                <SellerChartTypeToggle value={chartType} onChange={setChartType} />
                <select className="h-10 rounded-md bg-[#efeded] px-4 py-2 text-sm text-[#1b1c1c] outline-none ring-0">
                  <option>7 ngày qua</option>
                  <option>30 ngày qua</option>
                  <option>Tháng này</option>
                </select>
              </div>
            </div>

            <div className="relative flex h-[320px] min-w-0 items-end gap-2 border-b border-[#e3beb6]/30 pl-10 md:gap-3" onMouseLeave={() => setHoveredChartPoint(null)}>
              <SellerChartTooltip item={hoveredChartPoint} className="absolute right-4 top-4" />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex w-8 flex-col justify-between pb-8 text-xs text-[#8f7069]">
                <span>20M</span>
                <span>15M</span>
                <span>10M</span>
                <span>5M</span>
                <span>0</span>
              </div>

              <div className="pointer-events-none absolute inset-0 left-10 flex flex-col justify-between pb-8">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className={`w-full ${index === 4 ? 'border-t border-[#e3beb6]/30' : 'border-t border-dashed border-[#e3beb6]/30'}`} />
                ))}
              </div>

              {chartType === 'bar'
                ? weekRevenue.map((item, index) => {
                    const isPeak = index === weekRevenue.length - 2
                    const height = `${Math.max(20, (item.value / maxChartValue) * 100)}%`

                    return (
                      <div
                        key={item.label}
                        className={`relative z-10 flex h-full min-w-0 flex-1 flex-col items-center justify-end ${index === 0 ? 'ml-2' : ''}`}
                        onMouseEnter={() =>
                          setHoveredChartPoint({
                            title: item.label,
                            subtitle: 'Doanh thu trong ngày',
                            value: formatCurrency(item.value * 1000000),
                          })
                        }
                      >
                        <div
                          className={`w-full max-w-12 rounded-t-sm transition-colors ${
                            isPeak ? 'bg-[#b22204] shadow-[0_0_10px_rgba(178,34,4,0.3)]' : 'bg-[#b22204]/30 hover:bg-[#b22204]'
                          }`}
                          style={{ height }}
                        />
                        <span className={`mt-2 text-xs ${isPeak ? 'font-semibold text-[#1b1c1c]' : 'text-[#8f7069]'}`}>{item.label}</span>
                      </div>
                    )
                  })
                : null}

              {chartType === 'line' ? (
                <div className="relative z-10 ml-2 flex h-full min-w-0 flex-1 flex-col justify-end pb-8">
                  <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="sellerDashboardGrowthGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#EE4D2D" stopOpacity="0.24" />
                        <stop offset="100%" stopColor="#EE4D2D" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={lineChart.area} fill="url(#sellerDashboardGrowthGradient)" />
                    <path d={lineChart.path} fill="none" stroke="#ffdad3" strokeWidth="6" vectorEffect="non-scaling-stroke" />
                    <path d={lineChart.path} fill="none" stroke="#B22204" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                    {weekRevenue.map((item, index) => {
                      const point = lineChart.coordinates[index]

                      return (
                        <g
                          key={item.label}
                          className="cursor-pointer"
                          onMouseEnter={() =>
                            setHoveredChartPoint({
                              title: item.label,
                              subtitle: 'Doanh thu trong ngày',
                              value: formatCurrency(item.value * 1000000),
                            })
                          }
                        >
                          <circle cx={point.x} cy={point.y} r="5" fill="transparent" />
                          <circle cx={point.x} cy={point.y} r="2.8" fill="#ffffff" stroke="#B22204" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                        </g>
                      )
                    })}
                  </svg>
                  <div className="mt-2 flex justify-between text-xs font-medium text-[#8f7069]">
                    {weekRevenue.map((item) => (
                      <span key={item.label}>{item.label}</span>
                    ))}
                  </div>
                </div>
              ) : null}

              {chartType === 'pie' ? (
                <div className="relative z-10 ml-2 grid h-full min-w-0 flex-1 grid-cols-1 items-center gap-5 pb-8 md:grid-cols-[260px_minmax(0,1fr)]">
                  <div className="mx-auto flex aspect-square w-full max-w-[230px] items-center justify-center rounded-full shadow-inner" style={{ background: pieGradient }}>
                    <div className="flex h-[62%] w-[62%] flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
                      <span className="text-xs font-medium text-[#8f7069]">Tổng tuần</span>
                      <span className="mt-1 text-lg font-semibold text-[#b22204]">{formatCurrency(totalWeekRevenue * 1000000)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    {weekRevenue.map((item, index) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-3 rounded-lg border border-[#e3beb6]/40 bg-[#fbf9f9] px-3 py-2 transition hover:border-[#b22204]/40 hover:bg-white"
                        onMouseEnter={() =>
                          setHoveredChartPoint({
                            title: item.label,
                            subtitle: 'Tỷ trọng doanh thu tuần',
                            value: formatCurrency(item.value * 1000000),
                          })
                        }
                      >
                        <span className="flex items-center gap-2 text-[#5b403b]">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: ['#b22204', '#ee4d2d', '#ffb4a4', '#d63c1e', '#8d1600', '#ffdad3', '#e3beb6'][index % 7] }}
                          />
                          {item.label}
                        </span>
                        <span className="font-semibold text-[#1b1c1c]">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex h-[320px] min-w-0 flex-col rounded-xl border border-[#e3beb6]/30 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#1b1c1c]">Hành động nhanh</h2>
            <div className="flex flex-1 flex-col gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    if (action.id === 'add') {
                      navigate('/seller/products/new')
                      return
                    }

                    if (action.id === 'ship') {
                      navigate('/seller/shipping')
                      return
                    }

                    if (action.id === 'promo') {
                      navigate('/seller/promotions/new')
                    }
                  }}
                  className="group flex w-full items-center justify-between rounded-lg border border-[#e3beb6]/50 p-3 text-left transition hover:bg-[#fbf9f9]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-md p-2 ${action.accentClassName}`}>
                      <SellerIcon name={action.icon} className="text-[24px]" />
                    </div>
                    <span className="text-sm font-semibold text-[#1b1c1c]">{action.label}</span>
                  </div>
                  <SellerIcon name="chevron_right" className="text-[20px] text-[#8f7069]" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl border border-[#e3beb6]/30 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e3beb6]/30 bg-[#fbf9f9] p-4">
            <h2 className="text-xl font-semibold text-[#1b1c1c]">Đơn hàng mới nhất cần xử lý</h2>
            <Link to="/seller/orders" className="flex items-center gap-1 text-sm font-semibold text-[#b22204] hover:underline">
              Xem tất cả
              <SellerIcon name="arrow_forward" className="text-[18px]" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="border-b border-[#e3beb6]/30 bg-[#efeded] text-xs uppercase tracking-wider text-[#8f7069]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã đơn hàng</th>
                  <th className="px-4 py-3 font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold">Sản phẩm</th>
                  <th className="px-4 py-3 text-right font-semibold">Tổng tiền</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3beb6]/30 text-sm text-[#1b1c1c]">
                {recentOrders.map((order) => {
                  const orderAction = getDashboardOrderAction(order.status)

                  return (
                    <tr key={order.id} className="group transition-colors hover:bg-[#fbf9f9]">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/seller/orders/${encodeURIComponent(order.id)}`)}
                          className="font-semibold text-[#1b1c1c] transition hover:text-[#b22204] hover:underline"
                        >
                          {order.id}
                        </button>
                      </td>
                      <td className="px-4 py-3">{order.customerName}</td>
                      <td className="px-4 py-3">{order.productName}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatCurrency(order.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${order.statusMeta.className}`}>{order.statusMeta.label}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/seller/orders/${encodeURIComponent(order.id)}`)}
                          aria-label={`${orderAction.label} ${order.id}`}
                          className="inline-flex min-w-[118px] items-center justify-center gap-1.5 rounded border border-[#b22204] px-3 py-1.5 text-sm font-semibold text-[#b22204] transition hover:bg-[#b22204] hover:text-white"
                        >
                          <SellerIcon name={orderAction.icon} className="text-[17px]" />
                          {orderAction.label}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  )
}

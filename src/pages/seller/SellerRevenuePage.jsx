import { useMemo, useState } from 'react'
import SellerChartTooltip from '../../components/seller/SellerChartTooltip'
import SellerChartTypeToggle from '../../components/seller/SellerChartTypeToggle'
import SellerIcon from '../../components/seller/SellerIcon'
import { useAuth } from '../../contexts/useAuth'
import { sellerService } from '../../services/sellerService'
import { formatCurrency } from '../../utils/formatCurrency'

const rangeOptions = [
  { value: '7d', label: '7 ngày qua' },
  { value: '30d', label: '30 ngày qua' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year', label: 'Năm nay' },
]

const pieColors = ['#b22204', '#ee4d2d', '#ffb4a4', '#d63c1e', '#8d1600', '#ffdad3', '#e3beb6']

function buildPieGradient(points) {
  const total = points.reduce((sum, item) => sum + item.value, 0)
  let cursor = 0

  if (!total) {
    return '#efeded'
  }

  return `conic-gradient(${points
    .map((item, index) => {
      const start = cursor
      const end = cursor + (item.value / total) * 100
      cursor = end
      return `${pieColors[index % pieColors.length]} ${start}% ${end}%`
    })
    .join(', ')})`
}

function formatChartDate(label) {
  return `${label}/${new Date().getFullYear()}`
}

function escapeCsvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function encodeUtf16Le(value) {
  const encodedValue = new Uint8Array(2 + value.length * 2)
  encodedValue[0] = 0xFF
  encodedValue[1] = 0xFE

  for (let index = 0; index < value.length; index += 1) {
    const characterCode = value.charCodeAt(index)
    encodedValue[2 + index * 2] = characterCode & 0xFF
    encodedValue[3 + index * 2] = characterCode >> 8
  }

  return encodedValue
}

function downloadRevenueExcelReport({ storeName, rangeLabel, rows, totalRevenue, orderCount, averageOrderValue }) {
  const summaryRows = [
    ['BÁO CÁO DOANH THU'],
    ['Gian hàng', storeName],
    ['Kỳ báo cáo', rangeLabel],
    ['Tổng doanh thu (VNĐ)', Math.round(totalRevenue)],
    ['Đơn hàng thành công', orderCount],
    ['Giá trị trung bình đơn (VNĐ)', Math.round(averageOrderValue)],
    [],
    ['STT', 'Mã SKU', 'Sản phẩm', 'Biến thể', 'Số lượng bán', 'Đơn giá (VNĐ)', 'Tổng doanh thu (VNĐ)'],
    ...rows.map((row) => [
      row.rank,
      row.sku,
      row.name,
      row.variantName || 'Mặc định',
      row.quantitySold,
      Math.round(row.unitPrice),
      Math.round(row.totalRevenue),
    ]),
  ]
  const spreadsheetContent = summaryRows
    .map((row) => row.map(escapeCsvCell).join('\t'))
    .join('\r\n')
  const blob = new Blob([encodeUtf16Le(spreadsheetContent)], { type: 'text/tab-separated-values;charset=utf-16le' })
  const downloadUrl = URL.createObjectURL(blob)
  const downloadLink = document.createElement('a')
  const exportedDate = new Date().toISOString().slice(0, 10)

  downloadLink.href = downloadUrl
  downloadLink.download = `bao-cao-doanh-thu-${exportedDate}.csv`
  document.body.appendChild(downloadLink)
  downloadLink.click()
  downloadLink.remove()
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)
}

function RevenueCard({ card }) {
  return (
    <div className="group relative flex min-h-28 flex-col justify-between overflow-hidden rounded-xl border border-[#e3e2e2] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-bl-full opacity-30 transition-transform duration-500 group-hover:scale-110 ${card.bgAccentClassName}`} />
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5b403b]">{card.title}</h3>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${card.iconWrapClassName}`}>
          <SellerIcon name={card.icon} className="text-[20px]" filled />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-end gap-1">
          <p className="text-[28px] font-bold leading-none text-[#b22204] md:text-[32px]">{card.value}</p>
          {card.suffix ? <span className="mb-1 text-xl font-semibold text-[#5b403b]">{card.suffix}</span> : null}
        </div>
        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${card.trendClassName}`}>
          <SellerIcon name={card.trendIcon} className="text-[16px]" />
          <span>{card.trendText}</span>
        </div>
      </div>
    </div>
  )
}

export default function SellerRevenuePage() {
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [range, setRange] = useState('30d')
  const [chartType, setChartType] = useState('line')
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null)
  const [exportMessage, setExportMessage] = useState('')
  const revenueResponse = sellerService.getSellerRevenueReport(currentUser, { keyword, range })

  const chartMeta = useMemo(() => {
    if (!revenueResponse.success) {
      return { points: '', area: '', maxValue: 1, labels: ['0', '0', '0', '0'] }
    }

    const points = revenueResponse.data.chart
    const maxValue = Math.max(...points.map((point) => point.value), 1)
    const stepX = points.length > 1 ? 100 / (points.length - 1) : 100
    const coordinates = points.map((point, index) => ({
      x: index * stepX,
      y: 100 - (point.value / maxValue) * 86,
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
      maxValue,
      labels: [maxValue, maxValue * 0.67, maxValue * 0.34, 0].map((value) => formatCurrency(value).replace('₫', '').trim()),
    }
  }, [revenueResponse])

  if (!revenueResponse.success) {
    return (
      <section className="min-h-screen bg-[#f5f3f3] p-4 md:p-6">
        <div className="rounded-xl border border-[#e3beb6] bg-white p-6 text-sm text-[#ba1a1a] shadow-sm">
          {revenueResponse.message || 'Không thể tải báo cáo doanh thu của seller.'}
        </div>
      </section>
    )
  }

  const { cards, chart, rows } = revenueResponse.data
  const { totalCount } = revenueResponse.meta
  const selectedRangeLabel = rangeOptions.find((option) => option.value === range)?.label || '30 ngày qua'
  const pieGradient = buildPieGradient(chart)
  const totalChartRevenue = chart.reduce((sum, point) => sum + point.value, 0)

  const handleExportExcel = () => {
    downloadRevenueExcelReport({
      storeName: revenueResponse.data.store.storeName,
      rangeLabel: selectedRangeLabel,
      rows,
      totalRevenue: revenueResponse.meta.totalRevenue,
      orderCount: revenueResponse.meta.orderCount,
      averageOrderValue: revenueResponse.meta.averageOrderValue,
    })
    setExportMessage(`Đã xuất ${rows.length} dòng doanh thu.`)
  }

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#f5f3f3]">
      <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-[#e3e2e2] bg-white/90 px-4 py-4 shadow-sm backdrop-blur-md md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1b1c1c] md:text-[32px]">Báo cáo doanh thu</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Tổng quan hiệu suất bán hàng của bạn.</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-4">
          <div className="relative">
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="h-10 cursor-pointer appearance-none rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] py-2 pl-4 pr-10 text-xs font-medium text-[#1b1c1c] outline-none transition hover:border-[#e3beb6] focus:border-transparent focus:ring-2 focus:ring-[#b22204]"
            >
              {rangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SellerIcon name="calendar_today" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" />
          </div>
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#ee4d2d] px-4 text-xs font-medium text-white shadow-sm transition hover:bg-[#d73211]"
          >
            <SellerIcon name="download" className="text-[20px]" />
            Xuất Excel
          </button>
          {exportMessage ? <p className="basis-full text-right text-xs font-medium text-[#15803D]" role="status">{exportMessage}</p> : null}
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 p-4 md:px-10 md:py-7">
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {cards.map((card) => (
            <RevenueCard key={card.id} card={card} />
          ))}
        </section>

        <section className="relative flex flex-col gap-6 rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm md:p-6 lg:p-7" onMouseLeave={() => setHoveredChartPoint(null)}>
          <SellerChartTooltip item={hoveredChartPoint} className="absolute right-6 top-20" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[20px] font-semibold text-[#1b1c1c]">Biểu đồ doanh thu ({selectedRangeLabel})</h2>
            <div className="flex flex-wrap items-center gap-3">
              <SellerChartTypeToggle value={chartType} onChange={setChartType} />
              <span className="flex items-center gap-1 text-xs font-medium text-[#5b403b]">
                <span className="block h-3 w-3 rounded-full bg-[#ee4d2d]" />
                Doanh thu
              </span>
            </div>
          </div>

          {chartType === 'pie' ? (
            <div className="grid min-h-[320px] grid-cols-1 items-center gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center rounded-full shadow-inner" style={{ background: pieGradient }}>
                <div className="flex h-[62%] w-[62%] flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
                  <span className="text-xs font-medium text-[#5b403b]">Tổng kỳ</span>
                  <span className="mt-1 text-lg font-semibold text-[#b22204]">{formatCurrency(totalChartRevenue)}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                {chart.map((point, index) => (
                  <div
                    key={point.label}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] px-3 py-2 transition hover:border-[#b22204]/40 hover:bg-white"
                    onMouseEnter={() =>
                      setHoveredChartPoint({
                        title: formatChartDate(point.label),
                        subtitle: 'Doanh thu trong kỳ',
                        value: formatCurrency(point.value),
                      })
                    }
                  >
                    <span className="flex items-center gap-2 text-[#5b403b]">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                      {point.label}
                    </span>
                    <span className="font-semibold text-[#1b1c1c]">{formatCurrency(point.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid h-[320px] min-w-0 grid-cols-[72px_minmax(0,1fr)] gap-3 lg:h-[340px]">
              <div className="flex flex-col items-end justify-between pb-8 pt-10 text-xs font-medium text-[#5b403b]">
                {chartMeta.labels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="relative min-w-0">
                <div className="relative h-[calc(100%-32px)] border-b border-l border-[#e3e2e2]">
                  <div className="pointer-events-none absolute inset-0 top-[33%] border-t border-[#e3e2e2] opacity-60" />
                  <div className="pointer-events-none absolute inset-0 top-[66%] border-t border-[#e3e2e2] opacity-60" />

                  {chartType === 'line' ? (
                    <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="sellerRevenueChartGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#EE4D2D" stopOpacity="0.24" />
                          <stop offset="100%" stopColor="#EE4D2D" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={chartMeta.area} fill="url(#sellerRevenueChartGradient)" />
                      <path d={chartMeta.path} fill="none" stroke="#ffdad3" strokeWidth="6" vectorEffect="non-scaling-stroke" />
                      <path d={chartMeta.path} fill="none" stroke="#EE4D2D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                      {chart.map((point, index) => {
                        const coordinate = chartMeta.coordinates[index]
                        const isMarked = index === Math.floor(chart.length / 2) || index === chart.length - 1

                        return (
                          <g
                            key={point.label}
                            className="cursor-pointer"
                            onMouseEnter={() =>
                              setHoveredChartPoint({
                                title: formatChartDate(point.label),
                                subtitle: 'Doanh thu trong kỳ',
                                value: formatCurrency(point.value),
                              })
                            }
                          >
                            <circle cx={coordinate.x} cy={coordinate.y} r="5" fill="transparent" />
                            <circle
                              cx={coordinate.x}
                              cy={coordinate.y}
                              r={isMarked ? '3' : '2.5'}
                              fill="#ffffff"
                              stroke="#EE4D2D"
                              strokeWidth="1.4"
                              vectorEffect="non-scaling-stroke"
                            />
                          </g>
                        )
                      })}
                    </svg>
                  ) : null}

                  {chartType === 'bar' ? (
                    <div className="absolute inset-0 flex items-end gap-3 px-3">
                      {chart.map((point) => {
                        const isPeak = point.value === chartMeta.maxValue
                        const height = `${Math.max(2, (point.value / chartMeta.maxValue) * 100)}%`

                        return (
                          <div
                            key={point.label}
                            className="flex h-full min-w-0 flex-1 items-end justify-center"
                            onMouseEnter={() =>
                              setHoveredChartPoint({
                                title: formatChartDate(point.label),
                                subtitle: 'Doanh thu trong kỳ',
                                value: formatCurrency(point.value),
                              })
                            }
                          >
                            <div
                              className={`w-full max-w-14 rounded-t-sm transition-colors ${
                                isPeak ? 'bg-[#b22204] shadow-[0_0_10px_rgba(178,34,4,0.25)]' : 'bg-[#ee4d2d]/35 hover:bg-[#ee4d2d]'
                              }`}
                              style={{ height }}
                              aria-label={`${point.label}: ${formatCurrency(point.value)}`}
                            />
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs font-medium text-[#5b403b]">
                  {chart.map((point) => (
                    <span key={point.label}>{point.label}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mb-8 flex flex-col overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#e3e2e2] bg-[#fbf9f9] p-6 md:flex-row md:items-center md:justify-between">
            <h2 className="text-[20px] font-semibold text-[#1b1c1c]">Chi tiết doanh thu theo SKU / biến thể</h2>
            <div className="relative w-full md:w-64">
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm sản phẩm, biến thể, SKU..."
                className="h-10 w-full rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] py-2 pl-10 pr-4 text-sm text-[#1b1c1c] outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#b22204]"
              />
              <SellerIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e3e2e2] bg-[#f5f3f3] text-xs font-semibold uppercase text-[#5b403b]">
                  <th className="w-16 px-6 py-4 font-semibold">STT</th>
                  <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                  <th className="px-6 py-4 text-right font-semibold">Số lượng bán</th>
                  <th className="px-6 py-4 text-right font-semibold">Đơn giá</th>
                  <th className="px-6 py-4 text-right font-semibold">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e2e2] text-sm text-[#1b1c1c]">
                {rows.length ? (
                  rows.map((row) => (
                    <tr key={row.id} className="group transition-colors hover:bg-white/60">
                      <td className="px-6 py-4 text-[#5b403b]">{row.rank}</td>
                      <td className="flex items-center gap-4 px-6 py-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#e3e2e2] bg-[#efeded]">
                          <img src={row.imageUrl} alt={row.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1b1c1c] transition-colors group-hover:text-[#b22204]">{row.name}</p>
                          <p className="mt-1 text-xs font-semibold text-[#8f3a28]">Biến thể: {row.variantName || 'Mặc định'}</p>
                          <p className="mt-0.5 break-all text-xs font-medium text-[#5b403b]">SKU: {row.sku}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">{row.quantitySold}</td>
                      <td className="px-6 py-4 text-right text-[#5b403b]">{formatCurrency(row.unitPrice)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-[#b22204]">{formatCurrency(row.totalRevenue)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#5b403b]">
                      Không có dữ liệu doanh thu phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-[#e3e2e2] bg-[#fbf9f9] p-4">
            <p className="text-xs font-medium text-[#5b403b]">Hiển thị 1 - {rows.length} trong số {totalCount} SKU</p>
            <div className="flex items-center gap-1">
              <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e3e2e2] text-[#5b403b] disabled:opacity-50">
                <SellerIcon name="chevron_left" className="text-[20px]" />
              </button>
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md bg-[#b22204] text-xs font-semibold text-white shadow-sm">
                1
              </button>
              <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e3e2e2] text-[#5b403b] disabled:opacity-50">
                <SellerIcon name="chevron_right" className="text-[20px]" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

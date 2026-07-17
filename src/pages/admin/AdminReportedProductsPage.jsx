import { useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'IGNORED', label: 'Đã bỏ qua' },
  { value: 'WARNED', label: 'Đã cảnh báo' },
  { value: 'REMOVED', label: 'Đã gỡ bỏ' },
]

const statusMeta = {
  PENDING: { label: 'Chờ xử lý', className: 'bg-amber-100 text-amber-800' },
  IGNORED: { label: 'Đã bỏ qua', className: 'bg-slate-100 text-slate-700' },
  WARNED: { label: 'Đã cảnh báo', className: 'bg-[#ffdad3] text-[#8d1600]' },
  REMOVED: { label: 'Đã gỡ bỏ', className: 'bg-red-100 text-red-800' },
}

function ReportStatusBadge({ status }) {
  const meta = statusMeta[status] || statusMeta.PENDING

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>{meta.label}</span>
}

function SummaryCard({ icon, label, value, helper, className }) {
  return (
    <div className="rounded-lg border border-[#e3e2e2] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#5b403b]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#1b1c1c]">{value}</p>
          <p className="mt-1 text-xs text-[#8f7069]">{helper}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${className}`}>
          <AdminIcon name={icon} className="text-[22px]" />
        </div>
      </div>
    </div>
  )
}

export default function AdminReportedProductsPage() {
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [reason, setReason] = useState('all')
  const [, setRefreshKey] = useState(0)

  const response = adminService.getAdminReportedProducts({ keyword, status, reason })
  const reports = response.success ? response.data : []
  const summary = response.meta?.summary || { totalReports: 0, pending: 0, removed: 0 }
  const reasons = response.meta?.reasons || []

  const handleStatusChange = (reportId, nextStatus) => {
    adminService.updateReportedProductStatus(reportId, nextStatus)
    setRefreshKey((current) => current + 1)
  }

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 p-3 md:p-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b22204]">Quản trị báo cáo</p>
          <h1 className="mt-1 text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Báo cáo sản phẩm</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Theo dõi và xử lý các sản phẩm bị người dùng báo cáo.</p>
        </div>
        <div className="relative w-full xl:max-w-md">
          <AdminIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" />
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm kiếm báo cáo..."
            className="h-11 w-full rounded-lg border border-[#e3e2e2] bg-white py-2 pl-10 pr-4 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204]"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard icon="flag" label="Tổng số báo cáo" value={summary.totalReports.toLocaleString('vi-VN')} helper="Tổng lượt báo cáo từ người dùng" className="bg-[#ffdad3] text-[#b22204]" />
        <SummaryCard icon="pending_actions" label="Chờ xử lý" value={summary.pending.toLocaleString('vi-VN')} helper="Lượt báo cáo cần kiểm tra" className="bg-amber-100 text-amber-700" />
        <SummaryCard icon="delete" label="Đã gỡ bỏ" value={summary.removed} helper="Sản phẩm đã xử lý gỡ bỏ" className="bg-red-100 text-red-700" />
      </div>

      <div className="rounded-lg border border-[#e3e2e2] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded-lg border border-[#e3e2e2] bg-white px-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="h-10 rounded-lg border border-[#e3e2e2] bg-white px-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204]"
            >
              <option value="all">Tất cả lý do</option>
              {reasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e3beb6] bg-white px-4 text-sm font-medium text-[#1b1c1c]">
            <AdminIcon name="sort" className="text-[18px]" />
            Sắp xếp
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e3e2e2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left text-sm">
            <thead className="border-b border-[#e3e2e2] bg-[#f5f3f3] text-xs font-semibold uppercase text-[#5b403b]">
              <tr>
                <th className="px-4 py-3">Tên sản phẩm</th>
                <th className="px-4 py-3">Người bán</th>
                <th className="px-4 py-3 text-center">Số báo cáo</th>
                <th className="px-4 py-3">Lý do phổ biến</th>
                <th className="px-4 py-3">Ngày báo cáo</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e2]">
              {reports.length ? (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#fbf9f9]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#e9e8e7] text-[#5b403b]">
                          <AdminIcon name="inventory_2" className="text-[22px]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1b1c1c]">{report.productName}</p>
                          <p className="text-xs text-[#8f7069]">#{report.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#1b1c1c]">{report.sellerName}</td>
                    <td className="px-4 py-4 text-center font-semibold text-[#b22204]">{report.reportCount}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-[#ffdad3] px-2.5 py-1 text-xs font-medium text-[#8d1600]">{report.reason}</span>
                    </td>
                    <td className="px-4 py-4 text-[#5b403b]">{report.reportedAt}</td>
                    <td className="px-4 py-4 text-center">
                      <ReportStatusBadge status={report.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => handleStatusChange(report.id, 'IGNORED')} className="rounded-lg border border-[#e3e2e2] px-3 py-1.5 text-xs font-semibold text-[#5b403b] hover:bg-[#f5f3f3]">
                          Bỏ qua
                        </button>
                        <button type="button" onClick={() => handleStatusChange(report.id, 'WARNED')} className="rounded-lg border border-[#e3beb6] px-3 py-1.5 text-xs font-semibold text-[#b22204] hover:bg-[#ffdad3]">
                          Cảnh báo
                        </button>
                        <button type="button" onClick={() => handleStatusChange(report.id, 'REMOVED')} className="rounded-lg bg-[#b22204] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#d63c1e]">
                          Gỡ bỏ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#5b403b]">
                    Không có báo cáo sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã phê duyệt' },
  { value: 'REJECTED', label: 'Đã từ chối' },
]

const statusMeta = {
  PENDING: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-800' },
  APPROVED: { label: 'Đã phê duyệt', className: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Đã từ chối', className: 'bg-red-100 text-red-800' },
}

function StatusBadge({ status }) {
  const meta = statusMeta[status] || statusMeta.PENDING

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>{meta.label}</span>
}

function KpiCard({ icon, label, value, tone }) {
  const toneClass = {
    pending: 'bg-[#fff3db] text-[#9a5b00]',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div className="rounded-lg border border-[#e3e2e2] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[#5b403b]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#1b1c1c]">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${toneClass[tone]}`}>
          <AdminIcon name={icon} className="text-[22px]" />
        </div>
      </div>
    </div>
  )
}

export default function AdminStoreApprovalsPage() {
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')
  const [, setRefreshKey] = useState(0)

  const response = adminService.getAdminStoreApprovals({ keyword, status, category })
  const approvals = response.success ? response.data : []
  const summary = response.meta?.summary || { pending: 0, approved: 0, rejected: 0 }
  const categories = response.meta?.categories || []

  const handleStatusChange = (approvalId, nextStatus) => {
    adminService.updateStoreApprovalStatus(approvalId, nextStatus)
    setRefreshKey((current) => current + 1)
  }

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 p-3 md:p-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b22204]">Quản trị cửa hàng</p>
          <h1 className="mt-1 text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Duyệt cửa hàng</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Quản lý và phê duyệt đăng ký mở cửa hàng mới trên toàn sàn.</p>
        </div>
        <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e3beb6] bg-white px-4 text-sm font-medium text-[#1b1c1c] shadow-sm">
          <AdminIcon name="filter_list" className="text-[18px]" />
          Bộ lọc
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard icon="pending_actions" label="Đang chờ duyệt" value={summary.pending} tone="pending" />
        <KpiCard icon="verified" label="Đã phê duyệt" value={summary.approved} tone="approved" />
        <KpiCard icon="cancel" label="Đã từ chối" value={summary.rejected} tone="rejected" />
      </div>

      <div className="rounded-lg border border-[#e3e2e2] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <AdminIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#5b403b]" />
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm tên cửa hàng, người đại diện..."
              className="h-10 w-full rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] py-2 pl-10 pr-4 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204]"
            />
          </div>

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
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 rounded-lg border border-[#e3e2e2] bg-white px-3 text-sm text-[#1b1c1c] outline-none focus:border-[#b22204]"
            >
              <option value="all">Tất cả ngành hàng</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e3e2e2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-[#e3e2e2] bg-[#f5f3f3] text-xs font-semibold uppercase text-[#5b403b]">
              <tr>
                <th className="px-4 py-3">Tên cửa hàng</th>
                <th className="px-4 py-3">Người đại diện</th>
                <th className="px-4 py-3">Ngày đăng ký</th>
                <th className="px-4 py-3">Ngành hàng</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e2]">
              {approvals.length ? (
                approvals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-[#fbf9f9]">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#1b1c1c]">{approval.storeName}</p>
                      <p className="text-xs text-[#8f7069]">#{approval.id}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-[#1b1c1c]">{approval.representative}</p>
                      <p className="text-xs text-[#5b403b]">{approval.email}</p>
                    </td>
                    <td className="px-4 py-4 text-[#5b403b]">{approval.registeredAt}</td>
                    <td className="px-4 py-4 text-[#1b1c1c]">{approval.category}</td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={approval.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(approval.id, 'APPROVED')}
                          disabled={approval.status === 'APPROVED'}
                          className="rounded-lg bg-[#b22204] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#d63c1e] disabled:cursor-not-allowed disabled:bg-[#e3e2e2] disabled:text-[#8f7069]"
                        >
                          Phê duyệt
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(approval.id, 'REJECTED')}
                          disabled={approval.status === 'REJECTED'}
                          className="rounded-lg border border-[#e3beb6] px-3 py-1.5 text-xs font-semibold text-[#b22204] transition hover:bg-[#ffdad3] disabled:cursor-not-allowed disabled:border-[#e3e2e2] disabled:text-[#8f7069]"
                        >
                          Từ chối
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#5b403b]">
                    Không có hồ sơ cửa hàng phù hợp.
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

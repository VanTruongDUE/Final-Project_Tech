import { useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { adminService } from '../../services/adminService'

const roleOptions = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SELLER', label: 'Seller' },
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'SHIPPER', label: 'Shipper' },
]

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'LOCKED', label: 'Đã khóa' },
  { value: 'PENDING', label: 'Chờ duyệt' },
]

const roleMeta = {
  ADMIN: { label: 'Admin', className: 'bg-[#ffdad3] text-[#8d1600]' },
  SELLER: { label: 'Seller', className: 'bg-[#ffb4a4]/30 text-[#db3514]' },
  CUSTOMER: { label: 'Customer', className: 'bg-[#e9e8e7] text-[#5b403b]' },
  SHIPPER: { label: 'Shipper', className: 'bg-blue-100 text-blue-700' },
}

const statusMeta = {
  ACTIVE: { label: 'Đang hoạt động', className: 'bg-[#16A34A]/10 text-[#166534]', dotClassName: 'bg-[#16A34A]' },
  LOCKED: { label: 'Đã khóa', className: 'bg-[#DC2626]/10 text-[#991B1B]', dotClassName: 'bg-[#DC2626]' },
  PENDING: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-800', dotClassName: 'bg-amber-500' },
}

function UserAvatar({ user }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e3e2e2] bg-[#ffdad3] text-sm font-semibold text-[#8d1600]">
      {user.fullName.charAt(0)}
    </div>
  )
}

function UserStatusBadge({ status }) {
  const meta = statusMeta[status] || statusMeta.PENDING

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClassName}`} />
      {meta.label}
    </span>
  )
}

export default function AdminUsersPage() {
  const [keyword, setKeyword] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [, setRefreshKey] = useState(0)

  const usersResponse = adminService.getAdminUsers({ keyword, role, status })

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'
    adminService.updateUserStatus(user.id, nextStatus)
    setRefreshKey((current) => current + 1)
  }

  const users = usersResponse.success ? usersResponse.data : []
  const totalCount = usersResponse.meta?.totalCount || 0
  const allCount = usersResponse.meta?.allCount || 0

  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-3 md:p-6 lg:p-12">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1c] md:text-[32px]">Quản lý tài khoản</h1>
          <p className="mt-1 text-sm text-[#5b403b]">Xem, tìm kiếm và quản lý tất cả tài khoản trong hệ thống TechToShop.</p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <AdminIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#8f7069]" />
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo tên, email..."
              className="h-10 w-full rounded-lg border border-[#e3e2e2] bg-white py-2 pl-10 pr-3 text-sm text-[#1b1c1c] outline-none transition placeholder:text-[#5b403b] focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/30"
            />
          </div>

          <div className="relative">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-10 cursor-pointer appearance-none rounded-lg border border-[#e3e2e2] bg-white py-2 pl-3 pr-10 text-sm font-medium text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/30"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <AdminIcon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8f7069]" />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 cursor-pointer appearance-none rounded-lg border border-[#e3e2e2] bg-white py-2 pl-3 pr-10 text-sm font-medium text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/30"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <AdminIcon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8f7069]" />
          </div>

          <button
            type="button"
            onClick={() => window.alert('Thêm tài khoản hiện đang ở chế độ mock Admin.')}
            className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#ee4d2d] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#d63c1e]"
          >
            <AdminIcon name="add" className="text-[18px]" />
            Thêm tài khoản
          </button>
        </div>
      </header>

      <div className="flex flex-col overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="border-b border-[#e3e2e2] bg-[#f5f3f3]">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5b403b]">Tài khoản</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5b403b]">Liên hệ</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5b403b]">Vai trò</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5b403b]">Trạng thái</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5b403b]">Ngày tạo</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5b403b]">Hoạt động</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#5b403b]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e2e2]">
              {users.length ? (
                users.map((user) => {
                  const roleInfo = roleMeta[user.role] || roleMeta.CUSTOMER
                  const isLocked = user.status === 'LOCKED'

                  return (
                    <tr key={user.id} className={`group transition-colors hover:bg-[#efeded] ${isLocked ? 'bg-white/60' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />
                          <div>
                            <div className={`text-sm font-medium text-[#1b1c1c] ${isLocked ? 'line-through decoration-[#8f7069]/50' : ''}`}>{user.fullName}</div>
                            <div className="text-xs text-[#5b403b]">{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`text-sm text-[#1b1c1c] ${isLocked ? 'opacity-60' : ''}`}>{user.email}</div>
                        <div className={`text-[13px] text-[#5b403b] ${isLocked ? 'opacity-60' : ''}`}>{user.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${roleInfo.className}`}>{roleInfo.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <UserStatusBadge status={user.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5b403b]">{user.createdAt}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#1b1c1c]">{user.activityCount}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => window.alert(`Xem chi tiết ${user.fullName} hiện đang ở chế độ mock Admin.`)}
                            className="rounded-md p-1.5 text-[#5b403b] transition hover:bg-[#e9e8e7] hover:text-[#ee4d2d]"
                            title="Xem chi tiết"
                          >
                            <AdminIcon name="visibility" className="text-[20px]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            className={`rounded-md p-1.5 transition ${
                              isLocked ? 'text-[#5b403b] hover:bg-[#16A34A]/10 hover:text-[#166534]' : 'text-[#5b403b] hover:bg-[#ffdad6] hover:text-[#ba1a1a]'
                            }`}
                            title={isLocked ? 'Mở khóa' : 'Khóa tài khoản'}
                          >
                            <AdminIcon name={isLocked ? 'lock_open' : 'person_off'} className="text-[20px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#5b403b]">
                    Không có tài khoản phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#e3e2e2] bg-white px-4 py-3">
          <p className="text-[13px] text-[#5b403b]">
            Hiển thị <span className="font-medium text-[#1b1c1c]">{users.length ? 1 : 0}</span> đến{' '}
            <span className="font-medium text-[#1b1c1c]">{totalCount}</span> trong <span className="font-medium text-[#1b1c1c]">{allCount}</span> kết quả
          </p>
          <div className="flex items-center gap-1">
            <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:cursor-not-allowed disabled:opacity-50">
              <AdminIcon name="chevron_left" className="text-[18px]" />
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-[#ee4d2d] bg-[#ee4d2d]/10 text-sm font-medium text-[#ee4d2d]">
              1
            </button>
            <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded border border-[#e3e2e2] text-[#8f7069] disabled:cursor-not-allowed disabled:opacity-50">
              <AdminIcon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

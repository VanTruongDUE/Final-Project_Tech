import { useState } from 'react'
import AdminIcon from '../../components/admin/AdminIcon'
import { useAuth } from '../../contexts/useAuth'
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

function RoleChangeModal({ user, role, error, onRoleChange, onClose, onSave }) {
  if (!user) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4" role="presentation">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSave()
        }}
        className="w-full max-w-md overflow-hidden rounded-xl border border-[#e3e2e2] bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-change-title"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#e3e2e2] px-5 py-4">
          <div>
            <h2 id="role-change-title" className="text-xl font-bold text-[#1b1c1c]">Đổi vai trò tài khoản</h2>
            <p className="mt-1 text-sm text-[#5b403b]">{user.fullName} · {user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#5b403b] transition hover:bg-[#f5f3f3]"
            aria-label="Đóng hộp đổi vai trò"
          >
            <AdminIcon name="close" className="text-[20px]" />
          </button>
        </header>

        <div className="space-y-4 p-5">
          <div>
            <label htmlFor="account-role" className="mb-2 block text-sm font-semibold text-[#1b1c1c]">Vai trò mới</label>
            <div className="relative">
              <select
                id="account-role"
                value={role}
                onChange={(event) => onRoleChange(event.target.value)}
                className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-[#e3e2e2] bg-white px-3 pr-10 text-sm font-medium text-[#1b1c1c] outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/25"
              >
                {roleOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <AdminIcon name="expand_more" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8f7069]" />
            </div>
          </div>

          <div className="flex gap-3 rounded-lg bg-[#fff4f1] p-3 text-sm leading-5 text-[#5b403b]">
            <AdminIcon name="info" className="mt-0.5 shrink-0 text-[19px] text-[#b22204]" />
            <p>Quyền truy cập mới sẽ được áp dụng khi tài khoản này đăng nhập lại.</p>
          </div>

          {error ? <p className="text-sm font-medium text-[#ba1a1a]">{error}</p> : null}
        </div>

        <footer className="flex justify-end gap-2 border-t border-[#e3e2e2] bg-[#fbf9f9] px-5 py-4">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-[#e3e2e2] bg-white px-4 text-sm font-semibold text-[#5b403b] transition hover:bg-[#f5f3f3]">
            Hủy
          </button>
          <button
            type="submit"
            disabled={role === user.role}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#ee4d2d] px-4 text-sm font-semibold text-white transition hover:bg-[#d63c1e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <AdminIcon name="save" className="text-[18px]" />
            Lưu vai trò
          </button>
        </footer>
      </form>
    </div>
  )
}

function UserDetailModal({ user, canChangeRole, onChangeRole, onClose, onToggleStatus }) {
  if (!user) {
    return null
  }

  const roleInfo = roleMeta[user.role] || roleMeta.CUSTOMER
  const isLocked = user.status === 'LOCKED'

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-3">
      <div className="flex max-h-[92vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-xl bg-[#fbf9f9] shadow-2xl">
        <header className="flex flex-col gap-4 border-b border-[#e3e2e2] bg-white p-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 gap-4">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-1 text-xs font-medium text-[#5b403b]">
                <span>Tài khoản</span>
                <AdminIcon name="chevron_right" className="text-[16px]" />
                <span className="text-[#1b1c1c]">Chi tiết</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="truncate text-2xl font-bold text-[#1b1c1c]">{user.fullName}</h2>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${roleInfo.className}`}>{roleInfo.label}</span>
                <UserStatusBadge status={user.status} />
              </div>
              <p className="mt-1 text-sm text-[#5b403b]">#{user.id} · {user.username} · {user.source}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onChangeRole(user)}
              disabled={!canChangeRole}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#ee4d2d] bg-white px-4 text-sm font-semibold text-[#b22204] transition hover:bg-[#fff4f1] disabled:cursor-not-allowed disabled:border-[#e3e2e2] disabled:text-[#8f7069] disabled:hover:bg-white"
              title={canChangeRole ? 'Đổi vai trò' : 'Không thể tự đổi vai trò đang đăng nhập'}
            >
              <AdminIcon name="manage_accounts" className="text-[19px]" />
              Đổi vai trò
            </button>
            <button
              type="button"
              onClick={() => onToggleStatus(user)}
              className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
                isLocked ? 'bg-green-600 text-white hover:bg-green-700' : 'border border-[#ba1a1a] bg-white text-[#ba1a1a] hover:bg-[#ffdad6]'
              }`}
            >
              <AdminIcon name={isLocked ? 'lock_open' : 'person_off'} className="text-[18px]" />
              {isLocked ? 'Mở khóa' : 'Khóa tài khoản'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#e3e2e2] bg-white text-[#5b403b] transition hover:bg-[#f5f3f3]"
              aria-label="Đóng chi tiết tài khoản"
            >
              <AdminIcon name="close" className="text-[20px]" />
            </button>
          </div>
        </header>

        <div className="overflow-y-auto p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-[#1b1c1c]">Tổng quan tài khoản</h3>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {user.stats.map((item) => (
                    <div key={item.label} className="rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] p-3">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#ffdad3] text-[#b22204]">
                        <AdminIcon name={item.icon} className="text-[19px]" />
                      </div>
                      <p className="text-xs font-medium text-[#5b403b]">{item.label}</p>
                      <p className="mt-1 text-lg font-bold text-[#1b1c1c]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#1b1c1c]">Quyền truy cập</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {user.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-3 rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] p-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-[#e9e8e7] text-[#5b403b]">
                        <AdminIcon name="verified_user" className="text-[17px]" />
                      </div>
                      <span className="text-sm font-medium text-[#1b1c1c]">{permission}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-[#1b1c1c]">Hoạt động gần đây</h3>
                <div className="space-y-4">
                  {user.activity.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ffdad3] text-[#b22204]">
                        <AdminIcon name={item.icon} className="text-[16px]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1c]">{item.label}</p>
                        <p className="mt-0.5 text-xs text-[#8f7069]">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-[#e3e2e2] pb-3 text-lg font-semibold text-[#1b1c1c]">
                  <AdminIcon name="contact_mail" className="text-[22px] text-[#b22204]" />
                  Liên hệ
                </h3>
                <div className="space-y-3 text-sm text-[#1b1c1c]">
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-[#5b403b]">{user.phone}</p>
                  <p className="text-[#5b403b]">Tên đăng nhập: {user.username}</p>
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-[#e3e2e2] pb-3 text-lg font-semibold text-[#1b1c1c]">
                  <AdminIcon name="security" className="text-[22px] text-[#b22204]" />
                  Bảo mật
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#5b403b]">Xác minh</span>
                    <span className="font-semibold text-[#1b1c1c]">{user.verified ? 'Đã xác minh' : 'Chờ duyệt'}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[#5b403b]">Lần đăng nhập cuối</span>
                    <span className="text-right font-semibold text-[#1b1c1c]">{user.lastLogin}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[#5b403b]">Ngày tạo</span>
                    <span className="font-semibold text-[#1b1c1c]">{user.createdAt}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-[#e3e2e2] bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#1b1c1c]">
                  <AdminIcon name="admin_panel_settings" className="text-[22px] text-[#b22204]" />
                  Ghi chú quản trị
                </h3>
                <p className="text-sm leading-6 text-[#5b403b]">
                  Dữ liệu tài khoản đang phục vụ demo frontend. Trạng thái và vai trò được lưu bằng localStorage.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsersPage() {
  const { currentUser } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [roleEditorUser, setRoleEditorUser] = useState(null)
  const [nextRole, setNextRole] = useState('CUSTOMER')
  const [roleError, setRoleError] = useState('')
  const [, setRefreshKey] = useState(0)

  const usersResponse = adminService.getAdminUsers({ keyword, role, status })
  const selectedUserResponse = selectedUserId ? adminService.getAdminUserById(selectedUserId) : null
  const selectedUser = selectedUserResponse?.success ? selectedUserResponse.data : null

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'
    adminService.updateUserStatus(user.id, nextStatus)
    setRefreshKey((current) => current + 1)
  }

  const isCurrentUser = (user) => user.email.toLowerCase() === currentUser?.email?.toLowerCase()

  const openRoleEditor = (user) => {
    if (isCurrentUser(user)) {
      return
    }

    setRoleEditorUser(user)
    setNextRole(user.role)
    setRoleError('')
  }

  const closeRoleEditor = () => {
    setRoleEditorUser(null)
    setRoleError('')
  }

  const handleSaveRole = () => {
    if (!roleEditorUser) {
      return
    }

    const response = adminService.updateUserRole(roleEditorUser.id, nextRole)

    if (!response.success) {
      setRoleError(response.message || 'Không thể cập nhật vai trò.')
      return
    }

    closeRoleEditor()
    setRefreshKey((current) => current + 1)
  }

  const users = usersResponse.success ? usersResponse.data : []
  const totalCount = usersResponse.meta?.totalCount || 0
  const allCount = usersResponse.meta?.allCount || 0

  return (
    <section className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 p-3 md:p-6">
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
                        <button
                          type="button"
                          onClick={() => openRoleEditor(user)}
                          disabled={isCurrentUser(user)}
                          className="inline-flex items-center gap-1.5 rounded-full transition hover:ring-2 hover:ring-[#ee4d2d]/20 disabled:cursor-not-allowed disabled:hover:ring-0"
                          title={isCurrentUser(user) ? 'Vai trò của tài khoản đang đăng nhập' : 'Nhấn để đổi vai trò'}
                        >
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${roleInfo.className}`}>{roleInfo.label}</span>
                          {!isCurrentUser(user) ? <AdminIcon name="edit" className="text-[16px] text-[#8f7069]" /> : null}
                        </button>
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
                            onClick={() => setSelectedUserId(user.id)}
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

      <UserDetailModal
        user={selectedUser}
        canChangeRole={selectedUser ? !isCurrentUser(selectedUser) : false}
        onChangeRole={openRoleEditor}
        onClose={() => setSelectedUserId('')}
        onToggleStatus={handleToggleStatus}
      />
      <RoleChangeModal
        user={roleEditorUser}
        role={nextRole}
        error={roleError}
        onRoleChange={(value) => {
          setNextRole(value)
          setRoleError('')
        }}
        onClose={closeRoleEditor}
        onSave={handleSaveRole}
      />
    </section>
  )
}

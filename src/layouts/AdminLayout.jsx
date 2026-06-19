import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import AdminIcon from '../components/admin/AdminIcon'
import { useAuth } from '../contexts/useAuth'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/orders', label: 'Đơn hàng', icon: 'shopping_bag' },
  { to: '/admin/stores', label: 'Cửa hàng', icon: 'store' },
  { label: 'Sản phẩm', icon: 'inventory_2', disabled: true },
  { to: '/admin/users', label: 'Người dùng', icon: 'people' },
  { to: '/admin/statistics', label: 'Báo cáo', icon: 'analytics' },
]

function AdminNavLink({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded p-2 text-xs font-medium transition-all ${
          isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      <AdminIcon name={item.icon} className="text-[20px]" filled={item.end} />
      <span>{item.label}</span>
    </NavLink>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-4 shadow-sm md:px-6">
        <div className="flex items-center gap-2">
          <AdminIcon name="storefront" className="hidden text-[24px] text-[#b22204] md:block" />
          <span className="hidden text-lg font-semibold tracking-tight text-white md:block">TechToShop</span>
          <span className="text-sm font-semibold text-white md:hidden">Admin</span>
        </div>

        <div className="flex items-center gap-4">
          <button type="button" className="text-slate-300 transition hover:text-white" aria-label="Thông báo">
            <AdminIcon name="notifications" />
          </button>
          <button type="button" className="text-slate-300 transition hover:text-white" aria-label="Cài đặt">
            <AdminIcon name="settings" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-600 bg-slate-700 text-sm font-semibold text-white">
            {currentUser?.fullName?.[0] || 'A'}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
        <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-[240px] flex-col border-r border-slate-800 bg-slate-900 py-4 shadow-md md:flex">
          <div className="px-4 pb-6">
            <button
              type="button"
              onClick={() => window.alert('Thêm sản phẩm hiện đang ở chế độ mock Admin.')}
              className="flex w-full items-center justify-center gap-2 rounded bg-[#b22204] px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#d63c1e]"
            >
              <AdminIcon name="add" className="text-[18px]" />
              Thêm sản phẩm
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to || item.label}>
                  {item.disabled ? (
                    <button type="button" disabled className="flex w-full cursor-not-allowed items-center gap-3 rounded p-2 text-left text-xs font-medium text-slate-500">
                      <AdminIcon name={item.icon} className="text-[20px]" />
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <AdminNavLink item={item} />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto px-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded p-2 text-left text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <AdminIcon name="logout" className="text-[20px]" />
              Đăng xuất
            </button>
          </div>
        </aside>

        <div className="w-full border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              item.disabled ? (
                <button key={item.label} type="button" disabled className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400">
                  {item.label}
                </button>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`
                  }
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </div>
        </div>

        <main className="w-full min-w-0 flex-1 bg-slate-50 md:ml-[240px] md:w-[calc(100%-240px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

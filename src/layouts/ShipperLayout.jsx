import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import ShipperIcon from '../components/shipper/ShipperIcon'
import { useAuth } from '../contexts/useAuth'

const navItems = [
  { to: '/shipper/dashboard', label: 'Tổng quan', icon: 'dashboard', end: true },
  { to: '/shipper/shipments', label: 'Đơn được giao', icon: 'local_shipping' },
]

const passiveItems = [
  { label: 'Chi tiết vận chuyển', icon: 'inventory_2' },
  { label: 'Cập nhật trạng thái', icon: 'edit_notifications' },
]

function ShipperNavLink({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
          isActive ? 'bg-[#db3514] text-white' : 'text-[#5b403b] hover:bg-[#e9e8e7] hover:text-[#b22204]'
        }`
      }
    >
      <ShipperIcon name={item.icon} className="text-[22px]" filled={item.end} />
      <span>{item.label}</span>
    </NavLink>
  )
}

function PassiveNavItem({ item }) {
  return (
    <button type="button" disabled className="flex w-full cursor-not-allowed items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#8f7069] opacity-70">
      <ShipperIcon name={item.icon} className="text-[22px]" />
      <span>{item.label}</span>
    </button>
  )
}

export default function ShipperLayout() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fbf9f9] text-[#1b1c1c]">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col gap-2 border-r border-[#e3beb6] bg-[#f5f3f3] px-4 py-6 shadow-md md:flex">
        <div className="mb-4 flex items-center gap-2 px-2">
          <ShipperIcon name="shopping_cart" className="text-[28px] text-[#b22204]" filled />
          <h1 className="text-xl font-bold tracking-tight text-[#b22204]">TechToShop</h1>
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-[#e3beb6] bg-[#ffdad3] text-sm font-bold text-[#8d1600]">
            {currentUser?.fullName?.slice(0, 2).toUpperCase() || 'SP'}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[#1b1c1c]">{currentUser?.fullName || 'Shipper TechTonic'}</h2>
            <p className="text-xs font-medium uppercase tracking-wide text-[#5b403b]">SHIPPER ROLE</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <ShipperNavLink key={item.to} item={item} />
          ))}
          {passiveItems.map((item) => (
            <PassiveNavItem key={item.label} item={item} />
          ))}
        </nav>

        <button
          type="button"
          onClick={() => window.alert('Tạo lượt giao mới hiện đang ở chế độ mock Shipper.')}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#b22204] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d63c1e]"
        >
          <ShipperIcon name="add" className="text-[18px]" />
          Giao hàng mới
        </button>

        <NavLink
          to="/"
          end
          className="flex items-center justify-center gap-2 rounded-lg border border-[#e3beb6] bg-white px-4 py-2 text-sm font-semibold text-[#b22204] transition hover:border-[#b22204] hover:bg-[#fff1ec]"
        >
          <ShipperIcon name="storefront" className="text-[18px]" />
          Về sàn
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-4 border-t border-[#e3beb6] px-4 py-3 text-sm font-semibold text-[#5b403b] transition hover:bg-[#e9e8e7] hover:text-[#b22204]"
        >
          <ShipperIcon name="logout" className="text-[22px]" />
          Đăng xuất
        </button>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e3beb6] bg-white px-4 shadow-sm md:ml-64 md:px-6">
        <div className="flex items-center gap-2">
          <ShipperIcon name="menu" className="text-[24px] text-[#1b1c1c] md:hidden" />
          <h1 className="text-xl font-bold text-[#b22204] md:hidden">TechToShop</h1>
          <div className="hidden items-center rounded-full border border-[#e3beb6] bg-[#f5f3f3] px-4 py-2 md:flex">
            <ShipperIcon name="search" className="text-[20px] text-[#5b403b]" />
            <input type="search" placeholder="Tìm đơn giao..." className="w-48 border-none bg-transparent px-2 text-sm text-[#1b1c1c] outline-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className="hidden items-center gap-2 rounded-lg border border-[#e3beb6] bg-white px-3 py-2 text-sm font-semibold text-[#b22204] transition hover:bg-[#fff1ec] sm:flex"
          >
            <ShipperIcon name="storefront" className="text-[18px]" />
            Về sàn
          </NavLink>
          <button type="button" className="hidden items-center gap-2 rounded-lg bg-[#b22204] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d63c1e] sm:flex">
            <ShipperIcon name="add" className="text-[18px]" />
            Giao hàng mới
          </button>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-[#5b403b] transition hover:bg-[#f5f3f3]" aria-label="Thông báo">
            <ShipperIcon name="notifications" className="text-[22px]" />
          </button>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-[#5b403b] transition hover:bg-[#f5f3f3]" aria-label="Tài khoản">
            <ShipperIcon name="account_circle" className="text-[24px]" />
          </button>
        </div>
      </header>

      <main className="w-full min-w-0 md:ml-64 md:w-[calc(100%-16rem)]">
        <Outlet />
      </main>
    </div>
  )
}

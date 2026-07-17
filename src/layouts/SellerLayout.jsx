import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import SellerIcon from '../components/seller/SellerIcon'
import { useAuth } from '../contexts/useAuth'

const navItems = [
  { to: '/seller/dashboard', label: 'Dashboard', icon: 'dashboard', end: true, filled: true },
  { to: '/seller/orders', label: 'Đơn hàng', icon: 'shopping_bag' },
  { to: '/seller/products', label: 'Sản phẩm', icon: 'inventory_2' },
  { to: '/seller/inventory', label: 'Kho hàng', icon: 'warehouse' },
  { to: '/seller/promotions', label: 'Khuyến mãi', icon: 'campaign' },
  { to: '/seller/revenue', label: 'Báo cáo', icon: 'analytics' },
  { to: '/seller/messages', label: 'Tin nhắn', icon: 'chat' },
  { to: '/seller/settings', label: 'Cài đặt', icon: 'settings' },
]

function NavItem({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 text-sm font-medium transition-all ${
          isActive
            ? 'rounded-r-full border-l-4 border-[#ee4d2d] bg-[#ee4d2d]/10 text-[#ee4d2d]'
            : 'rounded-lg text-[#5b403b] hover:bg-[#e9e8e7] hover:text-[#b22204]'
        }`
      }
    >
      <SellerIcon name={item.icon} filled={item.filled} className="text-[20px]" />
      <span>{item.label}</span>
    </NavLink>
  )
}

export default function SellerLayout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f3f3] text-[#1b1c1c]">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-[280px] flex-col border-r border-[#e3beb6] bg-white py-6 shadow-md md:flex">
        <div className="flex items-center gap-3 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b22204] text-xl font-bold text-white shadow-sm">TTS</div>
          <div>
            <h1 className="text-[20px] font-semibold text-[#b22204]">TechToShop</h1>
            <p className="mt-0.5 text-xs text-[#5b403b]">TechToShop Panel</p>
          </div>
        </div>

        <div className="mx-6 mt-6">
          <button
            type="button"
            onClick={() => navigate('/seller/products/new')}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#b22204] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9a1d03]"
          >
            <SellerIcon name="add" className="text-[20px]" />
            Thêm sản phẩm mới
          </button>
        </div>

        <div className="mx-6 mt-3">
          <NavLink
            to="/"
            end
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e3beb6] bg-[#fff8f6] px-4 py-2.5 text-sm font-semibold text-[#b22204] transition hover:border-[#b22204] hover:bg-[#fff1ec]"
          >
            <SellerIcon name="storefront" className="text-[20px]" />
            Về trang mua sắm
          </NavLink>
        </div>

        <nav className="mt-6 flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        <div className="mx-3 mt-auto border-t border-[#e3beb6] pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-[#5b403b] transition hover:bg-[#e9e8e7] hover:text-[#b22204]"
          >
            <SellerIcon name="logout" className="text-[20px]" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="border-b border-[#e3beb6] bg-white px-4 py-4 shadow-sm md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#b22204]">TechToShop</h1>
            <p className="text-xs text-[#8f7069]">Seller Panel</p>
          </div>
          <div className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className="rounded-lg border border-[#e3beb6] px-3 py-2 text-sm font-medium text-[#b22204] transition hover:bg-[#fff1ec]"
            >
              Về sàn
            </NavLink>
            <button type="button" onClick={handleLogout} className="rounded-lg border border-[#e3beb6] px-3 py-2 text-sm font-medium text-[#5b403b]">
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  isActive ? 'bg-[#ee4d2d] text-white' : 'border border-[#e3beb6] text-[#5b403b]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <main className="w-full min-w-0 flex-1 md:ml-[280px] md:w-[calc(100%-280px)]">
        <Outlet />
      </main>
    </div>
  )
}

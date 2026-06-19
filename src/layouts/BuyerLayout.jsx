import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import { useCart } from '../contexts/useCart'
import FloatingChatButton from '../components/buyer/FloatingChatButton'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6h15l-2 8H8L6 3H3" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  )
}

function AccountIcon({ name }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
    className: 'h-5 w-5',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  switch (name) {
    case 'profile':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c1.6-4 4.2-6 8-6s6.4 2 8 6" />
        </svg>
      )
    case 'address':
      return (
        <svg {...commonProps}>
          <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'bank':
      return (
        <svg {...commonProps}>
          <path d="M3 9l9-5 9 5" />
          <path d="M5 10h14" />
          <path d="M6 10v7" />
          <path d="M10 10v7" />
          <path d="M14 10v7" />
          <path d="M18 10v7" />
          <path d="M4 19h16" />
        </svg>
      )
    case 'orders':
      return (
        <svg {...commonProps}>
          <path d="M7 3h10v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2V3z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      )
    case 'notifications':
      return (
        <svg {...commonProps}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...commonProps}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M21 4v16" />
        </svg>
      )
    default:
      return null
  }
}

function SidebarChildAction({ label, active, to }) {
  const className = `block w-full rounded px-2 py-2 text-left text-sm transition ${
    active ? 'font-medium text-[#b22204]' : 'text-[#5b403b] hover:bg-[#f5f3f3] hover:text-[#b22204]'
  }`

  return (
    <NavLink to={to} end className={className}>
      {label}
    </NavLink>
  )
}

function SidebarTopAction({ icon, label, active = false, to }) {
  const className = `flex w-full items-center gap-3 rounded px-2 py-2 text-left text-sm transition ${
    active ? 'font-medium text-[#b22204]' : 'text-[#5b403b] hover:bg-[#f5f3f3] hover:text-[#b22204]'
  }`

  return (
    <NavLink to={to} end className={className}>
      <span className="grid h-7 w-7 place-items-center text-[#5b403b]">
        <AccountIcon name={icon} />
      </span>
      <span>{label}</span>
    </NavLink>
  )
}

export default function BuyerLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const { cartCount } = useCart()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(location.pathname.startsWith('/profile'))

  const firstName = currentUser?.fullName?.split(' ')[0] || 'Khách hàng'
  const initials = currentUser?.fullName
    ? currentUser.fullName
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'KH'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f5f5f5] text-[#1b1c1c]">
      <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white shadow-sm">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[2rem] font-extrabold tracking-tight text-[#b22204]">
              TechToShop
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-[#5b403b] md:flex">
              <Link to="/products" className="hover:text-[#b22204]">
                Danh mục
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="h-12 w-72 rounded-full border border-[#e5e7eb] bg-[#fbf9f9] pl-5 pr-11 text-sm outline-none transition focus:border-[#b22204] focus:ring-2 focus:ring-[#b22204]/15"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f7069]">
                <SearchIcon />
              </span>
            </div>

            <Link
              to="/cart"
              className="relative grid h-11 w-11 place-items-center rounded-full text-[#1b1c1c] transition hover:bg-[#f5f3f3]"
              aria-label="Giỏ hàng"
            >
              <CartIcon />
              {cartCount > 0 ? (
                <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[#b22204] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            <div className="hidden items-center gap-3 text-sm md:flex">
              <span className="text-[#b22204]">{firstName}</span>
              <span className="text-[#d1d5db]">|</span>
              <button type="button" onClick={handleLogout} className="text-[#5b403b] hover:text-[#b22204]">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1280px] flex-1 grid-cols-1 gap-4 px-4 py-8 md:grid-cols-12 md:px-6">
        <aside className="h-fit rounded-2xl bg-white p-4 shadow-[0_1px_20px_0_rgba(0,0,0,0.05)] md:col-span-3">
          <div className="mb-4 flex items-center gap-3 border-b border-[#e5e7eb] px-2 pb-4">
            <div className="grid h-14 w-14 place-items-center rounded-full border border-[#e5e7eb] bg-[#fff1ec] text-sm font-bold text-[#b22204]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold leading-snug text-[#1b1c1c]">{currentUser?.fullName}</p>
              <p className="mt-2 text-sm text-[#8f7069]">Thành viên Bạc</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
              aria-expanded={isAccountMenuOpen}
              className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-sm font-medium text-[#1b1c1c] transition hover:bg-[#f5f3f3]"
            >
              <span className="grid h-7 w-7 place-items-center text-[#2563eb]">
                <AccountIcon name="profile" />
              </span>
              <span className="flex-1">Tài Khoản Của Tôi</span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={`h-4 w-4 text-[#8f7069] transition-transform duration-300 ${
                  isAccountMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                isAccountMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="ml-10 space-y-1 pb-1">
                <SidebarChildAction label="Hồ Sơ" active={location.pathname === '/profile'} to="/profile" />
                <SidebarChildAction
                  label="Đổi Mật Khẩu"
                  active={location.pathname === '/profile/change-password'}
                  to="/profile/change-password"
                />
                <SidebarChildAction
                  label="Những Thiết Lập Riêng Tư"
                  active={location.pathname === '/profile/privacy'}
                  to="/profile/privacy"
                />
              </div>
            </div>

            <SidebarTopAction icon="bank" label="Ngân Hàng" active={location.pathname === '/profile/banks'} to="/profile/banks" />
            <SidebarTopAction icon="address" label="Địa Chỉ" active={location.pathname === '/profile/addresses'} to="/profile/addresses" />
            <SidebarTopAction icon="orders" label="Đơn Hàng" active={location.pathname.startsWith('/orders')} to="/orders" />
            <SidebarTopAction icon="notifications" label="Thông Báo" active={location.pathname === '/profile/notifications'} to="/profile/notifications" />

            <div className="my-3 border-t border-[#e5e7eb]" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-sm text-[#5b403b] transition hover:bg-[#f5f3f3] hover:text-[#b22204]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f5f3f3]">
                <AccountIcon name="logout" />
              </span>
              <span>Đăng xuất</span>
            </button>
          </nav>
        </aside>

        <section className="min-w-0 md:col-span-9">
          <Outlet />
        </section>
      </main>

      <footer className="mt-12 border-t border-[#e5e7eb] bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-10 text-sm text-[#1b1c1c] md:grid-cols-3 md:px-6">
          <div>
            <p className="text-2xl font-bold text-[#b22204]">TechToShop</p>
            <p className="mt-4 text-[#5b403b]">© 2024 TechToShop. All rights reserved.</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">Thông tin</p>
            <div className="mt-4 space-y-2 text-[#5b403b]">
              <p>Về chúng tôi</p>
              <p>Liên hệ</p>
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold">Pháp lý</p>
            <div className="mt-4 space-y-2 text-[#5b403b]">
              <p>Chính sách bảo mật</p>
              <p>Điều khoản sử dụng</p>
            </div>
          </div>
        </div>
      </footer>

      <FloatingChatButton currentUser={currentUser} />
    </div>
  )
}

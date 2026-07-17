import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { useCart } from '../contexts/useCart'
import { ROLES, resolveRoleHome } from '../utils/roles'
import FloatingChatButton from '../components/buyer/FloatingChatButton'

const authPaths = ['/login', '/register', '/forgot-password', '/verify-otp', '/reset-password']

function StorefrontIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5 5.8 4h12.4L20 10.5" />
      <path d="M4 10.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M5.5 11.5V20h13v-8.5" />
    </svg>
  )
}

function SearchIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function CartIcon({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h2.4l2 10.4a2.2 2.2 0 0 0 2.2 1.8h6.8a2.2 2.2 0 0 0 2.1-1.6L21 9H7.2" />
      <path d="M10 12h8" />
      <circle cx="10" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function BellIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function HelpIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.7 2.7 0 1 1 4.7 1.8c-.9.6-1.4 1.1-1.4 2.2" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function GlobeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="m8 12 8-6" />
      <path d="m8 12 8 6" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16v12H4z" />
      <path d="m4 8 8 6 8-6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.9a2 2 0 0 1-.6 1.8l-1.4 1.4a16 16 0 0 0 6.6 6.6l1.4-1.4a2 2 0 0 1 1.8-.6l2.9.4A2 2 0 0 1 22 16.9Z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-6-5.6-6-11a6 6 0 1 1 12 0c0 5.4-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  )
}

function BrandLogo({ light = false }) {
  return (
    <Link to="/" className={`flex shrink-0 items-center gap-2 font-bold tracking-tight ${light ? 'text-white' : 'text-[#ee4d2d]'}`}>
      <StorefrontIcon className={`h-8 w-8 ${light ? 'text-white' : 'text-[#ee4d2d]'}`} />
      <span className="text-[28px] leading-none">TechToShop</span>
    </Link>
  )
}

export default function PublicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const { cartCount } = useCart()
  const [keyword, setKeyword] = useState('')

  const accountLink =
    currentUser?.role === 'CUSTOMER' || currentUser?.role === 'SELLER' || currentUser?.role === 'ADMIN'
      ? '/profile'
      : resolveRoleHome(currentUser?.role)
  const isSeller = currentUser?.role === ROLES.SELLER
  const isAdmin = currentUser?.role === ROLES.ADMIN
  const isAuthPage = authPaths.includes(location.pathname)
  const handleSearch = (event) => {
    event.preventDefault()
    const trimmedKeyword = keyword.trim()
    navigate(trimmedKeyword ? `/products?keyword=${encodeURIComponent(trimmedKeyword)}` : '/products')
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#fbf9f9] text-[#1b1c1c]">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#1b1c1c]">
      <header className="sticky top-0 z-40 bg-[#ee4d2d] text-white shadow-sm">
        <div className="mx-auto w-full max-w-[1200px] px-3 py-2">
          <div className="hidden items-center justify-between pb-2 text-[12px] text-white/85 md:flex">
            <div className="flex items-center gap-4">
              <Link to={isAdmin ? '/admin/dashboard' : '/seller/dashboard'} className="hover:text-white">
                {isAdmin ? 'Kênh quản trị' : isSeller ? 'Quản lý shop' : 'Kênh người bán'}
              </Link>
              <span>Tải ứng dụng</span>
              <span className="flex items-center gap-1">
                Theo dõi TechToShop <GlobeIcon className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <BellIcon className="h-3.5 w-3.5" />
                Thông báo
              </span>
              <span className="flex items-center gap-1">
                <HelpIcon className="h-3.5 w-3.5" />
                Hỗ trợ
              </span>
              {currentUser ? (
                <button type="button" onClick={handleLogout} className="hover:text-white">
                  Đăng xuất
                </button>
              ) : (
                <>
                  <Link to="/register" className="border-b-2 border-white pb-[2px] font-bold text-white">
                    Đăng ký
                  </Link>
                  <span className="h-3 border-l border-white/50" />
                  <Link to="/login" className="hover:text-white">
                    Đăng nhập
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-2 md:gap-8">
            <div className="flex items-center gap-5">
              <BrandLogo light />
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `hidden border-l border-white/25 pl-5 text-sm font-medium transition md:block ${
                    isActive ? 'text-white' : 'text-white/90 hover:text-white'
                  }`
                }
              >
                Danh mục
              </NavLink>
            </div>

            <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 md:flex md:max-w-3xl">
              <div className="flex w-full overflow-hidden rounded-sm bg-white p-1 shadow-sm">
                <input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Tìm sản phẩm, thương hiệu và shop"
                  className="h-9 min-w-0 flex-1 border-none px-3 text-sm text-[#1b1c1c] outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="grid h-9 w-16 place-items-center rounded-sm bg-[#ee4d2d] text-white transition hover:bg-[#d73211]"
                  aria-label="Tìm kiếm"
                >
                  <SearchIcon />
                </button>
              </div>
            </form>

            <nav className="flex shrink-0 items-center gap-2 text-sm text-white">
              {currentUser ? (
                <Link
                  to={accountLink}
                  className="inline-flex max-w-[150px] truncate rounded-sm border border-white/40 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 md:hidden"
                >
                  {currentUser.fullName}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex h-10 items-center rounded-sm border border-white/40 px-3 text-xs font-semibold text-white transition hover:bg-white/10 md:hidden"
                >
                  Đăng nhập
                </Link>
              )}

              <Link
                to="/cart"
                className="relative grid h-11 w-11 place-items-center rounded-md text-white transition hover:bg-white/10"
                aria-label="Giỏ hàng"
              >
                <CartIcon className="h-7 w-7" />
                {cartCount > 0 ? (
                  <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full border-2 border-[#ee4d2d] bg-white px-1 text-[10px] font-bold leading-none text-[#ee4d2d]">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              {currentUser ? (
                <>
                  {isSeller ? (
                    <Link
                      to="/seller/dashboard"
                      className="hidden rounded-sm border border-white px-4 py-2 font-semibold text-white transition hover:bg-white/10 md:inline-flex"
                    >
                      Kênh người bán
                    </Link>
                  ) : null}
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="hidden rounded-sm border border-white px-4 py-2 font-semibold text-white transition hover:bg-white/10 md:inline-flex"
                    >
                      Kênh quản trị
                    </Link>
                  ) : null}
                  <Link
                    to={accountLink}
                    className="hidden max-w-[180px] truncate rounded-sm border border-white/80 px-4 py-2 font-semibold text-white hover:bg-white/10 md:inline-flex"
                  >
                    {currentUser.fullName}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-sm bg-white px-4 py-2 font-semibold text-[#ee4d2d] transition hover:bg-[#fff1ec]"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden rounded-sm border border-white px-4 py-2 font-semibold text-white transition hover:bg-white/10 md:inline-flex"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="hidden rounded-sm bg-white px-4 py-2 font-semibold text-[#ee4d2d] transition hover:bg-[#f8f8f8] md:inline-flex"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm sản phẩm, thương hiệu và shop"
                className="h-10 w-full rounded-full border-none bg-white pl-4 pr-10 text-sm text-[#1b1c1c] outline-none"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f7069] transition hover:text-[#ee4d2d]"
                aria-label="Tìm kiếm"
              >
                <SearchIcon />
              </button>
            </form>
          </div>

          <div className="hidden gap-3 pb-1 text-[12px] text-white/85 md:flex">
            {['iPhone 15 Pro Max', 'Tai nghe không dây', 'Bàn phím cơ', 'Đồng hồ thông minh'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => navigate(`/products?keyword=${encodeURIComponent(item)}`)}
                className="transition hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-[#e3e2e2] bg-white">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-3 py-12 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <BrandLogo />
            <p className="max-w-xs text-sm leading-6 text-[#8f7069]">
              Nền tảng thương mại điện tử hàng đầu, cung cấp giải pháp mua sắm nhanh chóng, tiện lợi và an toàn cho người dùng.
            </p>
            <div className="flex gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f5f3f3] text-[#5b403b] transition hover:text-[#ee4d2d]">
                <ShareIcon />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f5f3f3] text-[#5b403b] transition hover:text-[#ee4d2d]">
                <MailIcon />
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-[#1b1c1c]">Thông tin</h3>
            <div className="space-y-3 text-sm text-[#8f7069]">
              <p>Về chúng tôi</p>
              <p>Liên hệ</p>
              <p>Chính sách bảo mật</p>
              <p>Điều khoản sử dụng</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-[#1b1c1c]">Hỗ trợ khách hàng</h3>
            <div className="space-y-4 text-sm text-[#8f7069]">
              <div className="flex items-start gap-3">
                <PhoneIcon />
                <div>
                  <p className="font-semibold text-[#1b1c1c]">Hotline: 1900 xxxx</p>
                  <p className="text-xs">(1000đ/phút, 8-21h kể cả T7, CN)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <LocationIcon />
                <p>Tòa nhà TechToShop, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e3e2e2] bg-[#f5f3f3]">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-3 px-3 py-4 text-xs text-[#8f7069] md:flex-row">
            <p>© 2024 TechToShop. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span>Thanh toán an toàn:</span>
              <div className="flex gap-2">
                {['VISA', 'ATM'].map((method) => (
                  <span key={method} className="grid h-6 w-10 place-items-center rounded border border-[#e3e2e2] bg-white font-bold">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <FloatingChatButton currentUser={currentUser} />
    </div>
  )
}

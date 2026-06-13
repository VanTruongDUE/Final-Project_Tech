import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { useCart } from '../contexts/useCart'
import { resolveRoleHome } from '../utils/roles'

const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-otp',
  '/reset-password',
]

const navLinkClass = ({ isActive }) =>
  `hidden h-full items-center px-4 text-sm font-semibold transition md:flex ${
    isActive ? 'border-b-2 border-white text-white' : 'text-white/90 hover:text-white'
  }`

function StorefrontIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10.5 5.8 4h12.4L20 10.5" />
      <path d="M4 10.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M5.5 11.5V20h13v-8.5" />
    </svg>
  )
}

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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6h15l-2 8H8L6 3H3" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  )
}

function BrandLogo({ compact = false }) {
  return (
    <Link
      to="/"
      className={`flex shrink-0 items-center gap-2 font-bold tracking-tight ${
        compact ? 'text-xl text-[#ee4d2d]' : 'text-2xl text-white'
      }`}
    >
      <StorefrontIcon className={compact ? 'h-7 w-7 text-[#ee4d2d]' : 'h-8 w-8 text-white'} />
      <span>TechToShop</span>
    </Link>
  )
}

export default function PublicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const { cartCount } = useCart()
  const [keyword, setKeyword] = useState('')

  const isAuthPage = authPaths.includes(location.pathname)
  const isProductDetailPage = location.pathname.startsWith('/products/') && location.pathname !== '/products'

  const handleSearch = (event) => {
    event.preventDefault()
    const trimmedKeyword = keyword.trim()

    navigate(trimmedKeyword ? `/products?keyword=${encodeURIComponent(trimmedKeyword)}` : '/products')
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#fbf9f9] text-[#1b1c1c]">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9] text-[#1b1c1c]">
      {isProductDetailPage ? (
        <header className="sticky top-0 z-40 border-b border-[#e3e2e2] bg-white shadow-sm">
          <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-3 md:px-4">
            <div className="flex items-center gap-8">
              <BrandLogo compact />
              <NavLink
                to="/products"
                className="hidden text-sm font-medium text-[#5b403b] hover:text-[#ee4d2d] md:block"
              >
                Danh mục
              </NavLink>
            </div>

            <nav className="flex items-center gap-3 text-sm">
              <Link
                to="/cart"
                className="relative grid h-10 w-10 place-items-center rounded text-[#1b1c1c] hover:bg-[#fff1ec]"
                aria-label="Giỏ hàng"
              >
                <CartIcon />
                {cartCount > 0 ? (
                  <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#ee4d2d] px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
              {currentUser ? (
                <>
                  <Link to={resolveRoleHome(currentUser.role)} className="font-semibold text-[#ee4d2d]">
                    {currentUser.fullName}
                  </Link>
                  <button type="button" onClick={handleLogout} className="text-[#5b403b] hover:text-[#ee4d2d]">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-semibold text-[#ee4d2d]">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="rounded bg-[#ee4d2d] px-4 py-2 font-semibold text-white">
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
      ) : (
        <header className="sticky top-0 z-40 bg-[#ee4d2d] text-white shadow-sm">
          <div className="mx-auto max-w-[1200px] px-3 md:px-4">
            <div className="flex min-h-[72px] items-center justify-between gap-4 md:min-h-[80px]">
              <div className="flex items-center gap-5">
                <BrandLogo />
                <div className="hidden items-center gap-4 border-l border-white/20 pl-5 md:flex">
                  <NavLink to="/products" className={navLinkClass}>
                    Danh mục
                  </NavLink>
                </div>
              </div>

              <form
                onSubmit={handleSearch}
                className="hidden min-w-0 flex-1 md:flex md:max-w-2xl md:items-center md:px-6"
              >
                <div className="relative w-full">
                  <input
                    type="search"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Tìm kiếm sản phẩm, cửa hàng..."
                    className="h-12 w-full rounded-full border-none bg-white pl-4 pr-12 text-sm text-[#1b1c1c] outline-none ring-0"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#ee4d2d] text-white transition hover:bg-[#d73211]"
                    aria-label="Tìm kiếm"
                  >
                    <SearchIcon />
                  </button>
                </div>
              </form>

              <nav className="flex shrink-0 items-center gap-2 text-sm md:gap-3">
                {!currentUser ? (
                  <Link
                    to="/login"
                    className="inline-flex h-10 items-center rounded-full border border-white/40 px-3 text-xs font-semibold text-white transition hover:bg-white/10 md:hidden"
                  >
                    Đăng nhập
                  </Link>
                ) : (
                  <Link
                    to={resolveRoleHome(currentUser.role)}
                    className="inline-flex max-w-[110px] truncate rounded-full border border-white/40 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 md:hidden"
                  >
                    {currentUser.fullName}
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="relative grid h-10 w-10 place-items-center rounded text-white/90 transition hover:bg-white/10 hover:text-white"
                  aria-label="Giỏ hàng"
                >
                  <CartIcon />
                  {cartCount > 0 ? (
                    <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full border-2 border-[#ee4d2d] bg-white px-1 text-[10px] font-bold text-[#ee4d2d]">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>
                {currentUser ? (
                  <>
                    <Link
                      to={resolveRoleHome(currentUser.role)}
                      className="hidden max-w-[160px] truncate rounded border border-white/80 px-4 py-2 font-semibold transition hover:bg-white/10 md:inline-flex"
                    >
                      {currentUser.fullName}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded bg-white px-4 py-2 font-semibold text-[#ee4d2d] transition hover:bg-[#fff1ec]"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="hidden rounded border border-white px-4 py-2 font-semibold transition hover:bg-white/10 md:inline-flex"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="hidden rounded bg-white px-4 py-2 font-semibold text-[#ee4d2d] transition hover:bg-[#f8f8f8] md:inline-flex"
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
                  placeholder="Tìm kiếm..."
                  className="h-10 w-full rounded-full border-none bg-white pl-4 pr-10 text-sm text-[#1b1c1c] outline-none ring-0"
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
          </div>
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#e3e2e2] bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-3 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-4">
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-[#ee4d2d]">
              <span className="grid h-9 w-9 place-items-center rounded border border-[#ee4d2d]/30 text-sm">
                TS
              </span>
              TechTonic Commerce
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#5b403b]">
              Nền tảng thương mại điện tử hàng đầu, cung cấp giải pháp mua sắm nhanh chóng, tiện
              lợi và an toàn cho người dùng.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              {['Facebook', 'Instagram', 'TikTok'].map((channel) => (
                <span
                  key={channel}
                  className="rounded-full bg-[#f5f3f3] px-3 py-1.5 text-[#5b403b] transition hover:text-[#ee4d2d]"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
            <div className="mt-4 space-y-3 text-sm text-[#5b403b]">
              <p>Trung tâm trợ giúp</p>
              <p>Hotline: 1900 xxxx</p>
              <p>Hướng dẫn mua hàng</p>
              <p>Hỗ trợ đổi trả</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Chính sách</h3>
            <div className="mt-4 space-y-3 text-sm text-[#5b403b]">
              <p>Về chúng tôi</p>
              <p>Liên hệ</p>
              <p>Chính sách bảo mật</p>
              <p>Điều khoản sử dụng</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Thanh toán an toàn</h3>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#5b403b]">
              {['VISA', 'ATM', 'MoMo', 'VNPay'].map((method) => (
                <span
                  key={method}
                  className="rounded border border-[#e3e2e2] bg-[#f8f8f8] px-3 py-2"
                >
                  {method}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-3 text-sm text-[#5b403b]">
              <p>Tòa nhà TechToShop, Quận 1, TP. Hồ Chí Minh</p>
              <p>Theo dõi chúng tôi để cập nhật ưu đãi mới mỗi ngày.</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#e3e2e2] py-4 text-center text-xs text-[#5b403b]">
          © 2024 TechToShop. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

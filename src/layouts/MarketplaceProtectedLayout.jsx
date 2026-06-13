import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'
import { useCart } from '../contexts/useCart'
import { resolveRoleHome } from '../utils/roles'

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

export default function MarketplaceProtectedLayout() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { cartCount } = useCart()
  const [keyword, setKeyword] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()
    const trimmedKeyword = keyword.trim()
    navigate(trimmedKeyword ? `/products?keyword=${encodeURIComponent(trimmedKeyword)}` : '/products')
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9] text-[#1b1c1c]">
      <header className="sticky top-0 z-40 border-b border-[#e3e2e2] bg-white shadow-sm">
        <div className="mx-auto max-w-[1200px] px-3 md:px-4">
          <div className="flex min-h-[64px] items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-2xl font-bold tracking-tight text-[#ee4d2d]">
                TechToShop
              </Link>
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative w-64">
                  <input
                    type="search"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="h-10 w-full rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] pl-10 pr-4 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f7069]">
                    <SearchIcon />
                  </span>
                </div>
              </form>
            </div>

            <NavLink to="/products" className="hidden text-sm font-medium text-[#5b403b] hover:text-[#ee4d2d] md:block">
              Danh mục
            </NavLink>

            <div className="flex items-center gap-2 md:gap-3">
              <Link
                to="/cart"
                className="relative grid h-10 w-10 place-items-center rounded text-[#ee4d2d] transition hover:bg-[#fff1ec]"
                aria-label="Giỏ hàng"
              >
                <CartIcon />
                {cartCount > 0 ? (
                  <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#ee4d2d] px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              <div className="hidden items-center gap-3 border-l border-[#e3e2e2] pl-3 md:flex">
                <Link to={resolveRoleHome(currentUser.role)} className="text-sm font-semibold text-[#ee4d2d]">
                  {currentUser.fullName}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded bg-[#ee4d2d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d73211]"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="h-10 w-full rounded-lg border border-[#e3e2e2] bg-[#fbf9f9] pl-10 pr-4 text-sm outline-none transition focus:border-[#ee4d2d] focus:ring-2 focus:ring-[#ee4d2d]/15"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f7069]">
                <SearchIcon />
              </span>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#e3e2e2] bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-10 md:grid-cols-3">
          <div>
            <p className="text-2xl font-bold text-[#ee4d2d]">TechToShop</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#5b403b]">
              Nền tảng thương mại điện tử hiện đại, mang lại trải nghiệm mua sắm rõ ràng, nhanh chóng và chuyên nghiệp.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#1b1c1c]">Liên kết hữu ích</h3>
            <div className="mt-3 space-y-2 text-sm text-[#5b403b]">
              <p>Về chúng tôi</p>
              <p>Liên hệ</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#1b1c1c]">Chính sách</h3>
            <div className="mt-3 space-y-2 text-sm text-[#5b403b]">
              <p>Chính sách bảo mật</p>
              <p>Điều khoản sử dụng</p>
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

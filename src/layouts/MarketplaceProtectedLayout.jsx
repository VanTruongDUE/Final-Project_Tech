import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6h15l-2 8H8L6 3H3" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  )
}

const popularKeywords = ['Tai nghe bluetooth', 'Đồng hồ thông minh', 'Nồi chiên không dầu', 'Son tint']

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
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#1b1c1c]">
      <header className="sticky top-0 z-40 bg-[#ee4d2d] text-white shadow-sm">
        <div className="mx-auto w-full max-w-[1200px] px-3 py-2">
          <div className="hidden items-center justify-between pb-2 text-[12px] text-white/85 md:flex">
            <div className="flex items-center gap-4">
              <Link to="/" className="transition hover:text-white">
                Kênh người mua
              </Link>
              <Link to="/products" className="transition hover:text-white">
                Sản phẩm
              </Link>
              <span>Theo dõi TechToShop</span>
            </div>
            <div className="flex items-center gap-4">
              {currentUser?.role === 'SELLER' ? (
                <Link to="/seller/dashboard" className="transition hover:text-white">
                  Kênh người bán
                </Link>
              ) : null}
              <Link to="/messages" className="transition hover:text-white">
                Tin nhắn
              </Link>
              <Link to="/orders" className="transition hover:text-white">
                Đơn mua
              </Link>
              <Link to="/profile" className="font-semibold text-white transition hover:opacity-85">
                {currentUser?.fullName || 'Tài khoản'}
              </Link>
              <button type="button" onClick={handleLogout} className="transition hover:text-white">
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-2 md:gap-8">
            <Link to="/" className="flex shrink-0 items-center gap-2 text-xl font-bold text-white md:text-2xl">
              <span className="material-symbols-outlined text-[30px]">shopping_bag</span>
              <span>TechToShop</span>
            </Link>

            <form onSubmit={handleSearch} className="hidden flex-1 md:block">
              <div className="flex w-full overflow-hidden rounded-sm bg-white p-1 shadow-sm">
                <input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Tìm kiếm sản phẩm, thương hiệu và shop"
                  className="h-9 min-w-0 flex-1 border-none px-3 text-sm text-[#1b1c1c] outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="grid h-9 w-16 place-items-center rounded-sm bg-[#ee4d2d] text-white transition hover:bg-[#d64124]"
                  aria-label="Tìm kiếm"
                >
                  <SearchIcon />
                </button>
              </div>
            </form>

            <div className="flex shrink-0 items-center gap-3">
              {currentUser?.role === 'SELLER' ? (
                <Link
                  to="/seller/dashboard"
                  className="hidden rounded-sm border border-white/70 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 lg:block"
                >
                  Quản lý shop
                </Link>
              ) : null}
              <Link to="/cart" className="relative block p-2 text-white transition hover:opacity-85" aria-label="Giỏ hàng">
                <CartIcon />
                {cartCount > 0 ? (
                  <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full border border-[#ee4d2d] bg-white px-1 text-[11px] font-bold leading-none text-[#ee4d2d]">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
              <Link
                to="/profile"
                className="hidden max-w-[180px] truncate rounded-sm border border-white/70 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:block"
              >
                {currentUser?.fullName || 'Tài khoản'}
              </Link>
            </div>
          </div>

          <form onSubmit={handleSearch} className="pb-2 md:hidden">
            <div className="flex w-full overflow-hidden rounded-sm bg-white p-1 shadow-sm">
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="h-9 min-w-0 flex-1 border-none px-3 text-sm text-[#1b1c1c] outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="grid h-9 w-12 place-items-center rounded-sm bg-[#ee4d2d] text-white"
                aria-label="Tìm kiếm"
              >
                <SearchIcon />
              </button>
            </div>
          </form>

          <div className="hidden gap-3 pb-1 text-[12px] text-white/85 md:flex">
            {popularKeywords.map((item) => (
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

      <footer className="mt-8 border-t border-[#e8e8e8] bg-[#f5f5f5]">
        <div className="mx-auto w-full max-w-[1200px] px-3 py-10">
          <div className="mb-8">
            <p className="mb-4 text-lg font-bold text-[#ee4d2d]">TechToShop</p>
            <div className="flex flex-wrap gap-4 text-sm text-[#5b403b]">
              <Link to="/products" className="underline transition hover:text-[#ee4d2d]">
                Sản phẩm
              </Link>
              <Link to="/orders" className="underline transition hover:text-[#ee4d2d]">
                Đơn mua
              </Link>
              <Link to="/messages" className="underline transition hover:text-[#ee4d2d]">
                Tin nhắn
              </Link>
              <Link to="/cart" className="underline transition hover:text-[#ee4d2d]">
                Giỏ hàng
              </Link>
            </div>
          </div>
          <div className="border-t border-[#e8e8e8] pt-6 text-center text-sm text-[#8f7069]">
            © 2024 TechToShop. All Rights Reserved.
          </div>
        </div>
      </footer>

      <FloatingChatButton currentUser={currentUser} />
    </div>
  )
}

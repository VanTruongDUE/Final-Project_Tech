import { Link, Outlet } from 'react-router-dom'

export default function CheckoutLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9] text-[#1b1c1c]">
      <header className="sticky top-0 z-40 border-b border-[#e3beb6] bg-[#ee4d2d] text-white shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-white/80"
          >
            <span aria-hidden="true">←</span>
            Trở về giỏ hàng
          </Link>

          <Link to="/" className="text-2xl font-bold tracking-tight">
            TechToShop
          </Link>

          <div className="w-24" aria-hidden="true" />
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-[#e3e2e2] bg-[#f5f3f3]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3 md:px-8">
          <div className="text-2xl font-bold text-[#ee4d2d]">TechToShop</div>
          <div className="text-sm text-[#5b403b] md:text-center">© 2024 TechToShop. All rights reserved.</div>
          <div className="flex flex-wrap gap-4 text-sm text-[#5b403b] md:justify-end">
            <span>Về chúng tôi</span>
            <span>Liên hệ</span>
            <span>Chính sách bảo mật</span>
            <span>Điều khoản sử dụng</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

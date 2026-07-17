import { Link, Outlet } from 'react-router-dom'
import FloatingChatButton from '../components/buyer/FloatingChatButton'
import { useAuth } from '../contexts/useAuth'

export default function CheckoutLayout() {
  const { currentUser } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9] text-[#1b1c1c]">
      <header className="sticky top-0 z-40 h-16 border-b border-[#e3beb6] bg-[#ee4d2d] text-white shadow-sm">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-white/80"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
            Trở về giỏ hàng
          </Link>

          <Link to="/" className="text-2xl font-bold tracking-tight">
            TechToShop
          </Link>

          <div className="w-12" aria-hidden="true" />
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-[#e3e2e2] bg-[#f5f3f3]">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-6 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="text-2xl font-bold text-[#ee4d2d]">TechToShop</div>
          <div className="flex justify-center text-sm text-[#5b403b]">© 2024 TechToShop. All rights reserved.</div>
          <div className="flex flex-wrap justify-end gap-4 text-sm text-[#5b403b]">
            <span>Về chúng tôi</span>
            <span>Liên hệ</span>
            <span>Chính sách bảo mật</span>
            <span>Điều khoản sử dụng</span>
          </div>
        </div>
      </footer>

      <FloatingChatButton currentUser={currentUser} />
    </div>
  )
}

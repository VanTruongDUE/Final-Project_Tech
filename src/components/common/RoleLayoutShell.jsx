import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'

const baseLinkClass =
  'block rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900'

export default function RoleLayoutShell({
  areaName,
  accentClass,
  navItems,
  welcomeTitle,
  welcomeText,
}) {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="w-full rounded-3xl bg-slate-950 p-6 text-white shadow-xl lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-80">
          <div className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${accentClass}`}>
            {areaName}
          </div>
          <h2 className="mt-5 text-2xl font-bold">{welcomeTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{welcomeText}</p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Đăng nhập</p>
            <p className="mt-2 text-base font-semibold">{currentUser?.fullName}</p>
            <p className="text-sm text-slate-300">{currentUser?.email}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${baseLinkClass} ${isActive ? 'bg-white text-slate-950' : 'text-slate-300'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white hover:text-slate-950"
          >
            Đăng xuất
          </button>
        </aside>

        <main className="flex-1 py-2">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

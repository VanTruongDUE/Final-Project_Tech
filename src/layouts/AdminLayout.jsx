import RoleLayoutShell from '../components/common/RoleLayoutShell'

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Tong quan', end: true },
  { to: '/admin/users', label: 'Tai khoan' },
  { to: '/admin/stores', label: 'Cua hang' },
  { to: '/admin/orders', label: 'Don hang' },
  { to: '/admin/statistics', label: 'Thong ke' },
]

export default function AdminLayout() {
  return (
    <RoleLayoutShell
      areaName="Admin Area"
      accentClass="bg-rose-400/15 text-rose-200"
      navItems={adminNavItems}
      welcomeTitle="Bang dieu khien quan tri he thong"
      welcomeText="Khu vuc nay duoc bao ve cho ADMIN de demo phan quyen, dieu huong va vung thao tac rieng."
    />
  )
}

import RoleLayoutShell from '../components/common/RoleLayoutShell'

const sellerNavItems = [
  { to: '/seller/dashboard', label: 'Tổng quan', end: true },
  { to: '/seller/products', label: 'Sản phẩm' },
  { to: '/seller/orders', label: 'Đơn hàng' },
  { to: '/seller/revenue', label: 'Doanh thu' },
]

export default function SellerLayout() {
  return (
    <RoleLayoutShell
      areaName="Seller Center"
      accentClass="bg-amber-400/15 text-amber-200"
      navItems={sellerNavItems}
      welcomeTitle="Trung tâm vận hành của nhà bán"
      welcomeText="Khu vực này dành cho nhà bán theo dõi tổng quan, quản lý sản phẩm và xử lý đơn hàng trong cùng một luồng."
    />
  )
}

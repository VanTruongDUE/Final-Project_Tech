import RoleLayoutShell from '../components/common/RoleLayoutShell'

const buyerNavItems = [
  { to: '/cart', label: 'Giỏ hàng' },
  { to: '/checkout', label: 'Thanh toán' },
  { to: '/orders', label: 'Lịch sử đơn hàng' },
  { to: '/profile', label: 'Tài khoản' },
]

export default function BuyerLayout() {
  return (
    <RoleLayoutShell
      areaName="Customer Area"
      accentClass="bg-cyan-400/15 text-cyan-200"
      navItems={buyerNavItems}
      welcomeTitle="Không gian mua sắm của khách hàng"
      welcomeText="Đây là khu vực riêng cho CUSTOMER, hỗ trợ quản lý giỏ hàng, thanh toán và lịch sử đơn hàng."
    />
  )
}

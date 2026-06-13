import RoleLayoutShell from '../components/common/RoleLayoutShell'

const shipperNavItems = [
  { to: '/shipper/dashboard', label: 'Tong quan', end: true },
  { to: '/shipper/shipments', label: 'Van chuyen' },
]

export default function ShipperLayout() {
  return (
    <RoleLayoutShell
      areaName="Shipper Area"
      accentClass="bg-emerald-400/15 text-emerald-200"
      navItems={shipperNavItems}
      welcomeTitle="Khong gian giao van cho shipper"
      welcomeText="Layout rieng cho SHIPPER giup demo dashboard giao hang, danh sach don va route chi tiet van chuyen."
    />
  )
}

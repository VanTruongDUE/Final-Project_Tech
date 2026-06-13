import { Navigate, Route, Routes } from 'react-router-dom'
import { ROLES } from '../utils/roles'
import PublicLayout from '../layouts/PublicLayout'
import BuyerLayout from '../layouts/BuyerLayout'
import CheckoutLayout from '../layouts/CheckoutLayout'
import MarketplaceProtectedLayout from '../layouts/MarketplaceProtectedLayout'
import SellerLayout from '../layouts/SellerLayout'
import AdminLayout from '../layouts/AdminLayout'
import ShipperLayout from '../layouts/ShipperLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/public/HomePage'
import ProductListPage from '../pages/public/ProductListPage'
import ProductDetailPage from '../pages/public/ProductDetailPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import VerifyOtpPage from '../pages/auth/VerifyOtpPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import CartPage from '../pages/buyer/CartPage'
import CheckoutPage from '../pages/buyer/CheckoutPage'
import OrderHistoryPage from '../pages/buyer/OrderHistoryPage'
import ProfilePage from '../pages/buyer/ProfilePage'
import SellerDashboardPage from '../pages/seller/SellerDashboardPage'
import SellerProductsPage from '../pages/seller/SellerProductsPage'
import SellerOrdersPage from '../pages/seller/SellerOrdersPage'
import SellerRevenuePage from '../pages/seller/SellerRevenuePage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminStoresPage from '../pages/admin/AdminStoresPage'
import AdminOrdersPage from '../pages/admin/AdminOrdersPage'
import AdminStatisticsPage from '../pages/admin/AdminStatisticsPage'
import ShipperDashboardPage from '../pages/shipper/ShipperDashboardPage'
import ShipperShipmentsPage from '../pages/shipper/ShipperShipmentsPage'
import ShipperShipmentDetailPage from '../pages/shipper/ShipperShipmentDetailPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />}>
        <Route element={<MarketplaceProtectedLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
        </Route>
        <Route element={<CheckoutLayout />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
        <Route element={<BuyerLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.SELLER]} />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/seller/revenue" element={<SellerRevenuePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/stores" element={<AdminStoresPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.SHIPPER]} />}>
        <Route element={<ShipperLayout />}>
          <Route path="/shipper/dashboard" element={<ShipperDashboardPage />} />
          <Route path="/shipper/shipments" element={<ShipperShipmentsPage />} />
          <Route path="/shipper/shipments/:id" element={<ShipperShipmentDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

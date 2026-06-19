export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
  SHIPPER: 'SHIPPER',
}

export const ROLE_LABELS = {
  [ROLES.CUSTOMER]: 'Khách hàng',
  [ROLES.SELLER]: 'Seller',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SHIPPER]: 'Shipper',
}

export const ROLE_DEFAULT_ROUTES = {
  [ROLES.CUSTOMER]: '/',
  [ROLES.SELLER]: '/',
  [ROLES.ADMIN]: '/',
  [ROLES.SHIPPER]: '/shipper/dashboard',
}

export const resolveRoleHome = (role) => ROLE_DEFAULT_ROUTES[role] || '/login'

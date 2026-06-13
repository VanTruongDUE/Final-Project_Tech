export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
  SHIPPER: 'SHIPPER',
}

export const ROLE_LABELS = {
  [ROLES.CUSTOMER]: 'Khach hang',
  [ROLES.SELLER]: 'Seller',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SHIPPER]: 'Shipper',
}

export const ROLE_DEFAULT_ROUTES = {
  [ROLES.CUSTOMER]: '/',
  [ROLES.SELLER]: '/seller/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.SHIPPER]: '/shipper/dashboard',
}

export const resolveRoleHome = (role) => ROLE_DEFAULT_ROUTES[role] || '/login'

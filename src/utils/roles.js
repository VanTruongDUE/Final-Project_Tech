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
  [ROLES.SELLER]: '/seller/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.SHIPPER]: '/shipper/dashboard',
}

export const ROLE_PRIORITY = [ROLES.ADMIN, ROLES.SELLER, ROLES.SHIPPER, ROLES.CUSTOMER]

export const resolvePrimaryRole = (roles = []) =>
  ROLE_PRIORITY.find((role) => roles.includes(role)) || ROLES.CUSTOMER

export const resolveRoleHome = (roleOrRoles) => {
  const role = Array.isArray(roleOrRoles) ? resolvePrimaryRole(roleOrRoles) : roleOrRoles
  return ROLE_DEFAULT_ROUTES[role] || '/login'
}

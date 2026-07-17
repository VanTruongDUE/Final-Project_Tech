import { ROLES } from '../utils/roles'

export const mockUsers = [
  {
    id: 1,
    email: 'customer@techtonic.vn',
    password: '123456',
    role: ROLES.CUSTOMER,
    fullName: 'TechTonic Customer',
  },
  {
    id: 2,
    email: 'seller@techtonic.vn',
    password: '123456',
    role: ROLES.SELLER,
    fullName: 'TechTonic Seller',
  },
  {
    id: 3,
    email: 'admin@techtonic.vn',
    password: '123456',
    role: ROLES.ADMIN,
    fullName: 'TechTonic Admin',
  },
  {
    id: 4,
    email: 'shipper@techtonic.vn',
    password: '123456',
    role: ROLES.SHIPPER,
    fullName: 'TechTonic Shipper',
  },
]

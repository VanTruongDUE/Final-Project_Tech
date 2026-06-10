export const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

export const categories = [
  { id: "fashion", name: "Thời trang", icon: "👕" },
  { id: "tech", name: "Công nghệ", icon: "📱" },
  { id: "home", name: "Nhà cửa", icon: "🛋️" },
  { id: "beauty", name: "Làm đẹp", icon: "💄" },
  { id: "grocery", name: "Bách hóa", icon: "🛒" },
  { id: "sport", name: "Thể thao", icon: "⚽" },
  { id: "book", name: "Sách", icon: "📚" },
  { id: "toy", name: "Đồ chơi", icon: "🧸" },
  { id: "mom", name: "Mẹ & Bé", icon: "🍼" },
  { id: "auto", name: "Ô tô - Xe máy", icon: "🚗" },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  sold: number;
  image: string;
  category: string;
  store: string;
  stock: number;
  discount?: number;
};

const img = (q: string, i: number) =>
  `https://images.unsplash.com/photo-${q}?w=600&auto=format&fit=crop&q=70&ixlib=rb-4.0.3&seed=${i}`;

export const products: Product[] = [
  { id: "p1", name: "Áo thun nam basic cotton 100%", price: 189000, oldPrice: 299000, rating: 4.8, sold: 2340, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=70", category: "fashion", store: "Coolmate Official", stock: 150, discount: 37 },
  { id: "p2", name: "Tai nghe Bluetooth chống ồn TWS Pro", price: 1290000, oldPrice: 1990000, rating: 4.7, sold: 1820, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=70", category: "tech", store: "Sound Hub Store", stock: 85, discount: 35 },
  { id: "p3", name: "Đèn led để bàn cảm ứng 3 chế độ", price: 359000, oldPrice: 499000, rating: 4.9, sold: 980, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=70", category: "home", store: "Home Plus", stock: 60, discount: 28 },
  { id: "p4", name: "Son lì lâu trôi M.A.C đỏ tươi #ruby", price: 489000, rating: 4.9, sold: 5210, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=70", category: "beauty", store: "Beauty Lab" , stock: 200 },
  { id: "p5", name: "iPhone 15 Pro Max 256GB chính hãng VN/A", price: 28990000, oldPrice: 32990000, rating: 5.0, sold: 420, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=70", category: "tech", store: "Apple Authorized", stock: 25, discount: 12 },
  { id: "p6", name: "Giày sneaker nam phong cách Hàn Quốc", price: 459000, oldPrice: 690000, rating: 4.6, sold: 1340, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=70", category: "fashion", store: "Urban Step", stock: 90, discount: 33 },
  { id: "p7", name: "Bộ nồi chảo chống dính 5 món Inox 304", price: 1490000, oldPrice: 2290000, rating: 4.8, sold: 670, image: "https://images.unsplash.com/photo-1584990347449-a8da1b4c0d3a?w=600&q=70", category: "home", store: "Kitchen Master", stock: 40, discount: 35 },
  { id: "p8", name: "Bánh quy bơ Đan Mạch hộp thiếc 454g", price: 159000, rating: 4.5, sold: 8900, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=70", category: "grocery", store: "Mini Mart", stock: 500 },
  { id: "p9", name: "Bóng đá da PU số 5 tiêu chuẩn FIFA", price: 219000, rating: 4.7, sold: 1230, image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600&q=70", category: "sport", store: "Sport World", stock: 120 },
  { id: "p10", name: "Sách Đắc Nhân Tâm - Bìa cứng tái bản", price: 89000, oldPrice: 129000, rating: 4.9, sold: 4560, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=70", category: "book", store: "Fahasa Online", stock: 300, discount: 31 },
  { id: "p11", name: "Đồng hồ thông minh Galaxy Watch 6", price: 5990000, oldPrice: 7490000, rating: 4.7, sold: 540, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=70", category: "tech", store: "Samsung Official", stock: 35, discount: 20 },
  { id: "p12", name: "Túi xách nữ da bò công sở cao cấp", price: 690000, oldPrice: 1190000, rating: 4.6, sold: 320, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=70", category: "fashion", store: "Lady Bag", stock: 50, discount: 42 },
];

export const banners = [
  { title: "Siêu sale tháng 6", sub: "Giảm đến 50% toàn ngành hàng", color: "from-indigo-500 via-violet-500 to-pink-500" },
  { title: "Free ship 0Đ", sub: "Đơn từ 99K - toàn quốc", color: "from-orange-500 via-rose-500 to-red-500" },
  { title: "Hàng chính hãng", sub: "Cam kết hoàn tiền 200%", color: "from-emerald-500 via-teal-500 to-cyan-500" },
];

export type Order = {
  id: string;
  customer: string;
  product: string;
  qty: number;
  total: number;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  date: string;
  address: string;
  payment: "COD" | "Banking" | "Momo";
};

export const orders: Order[] = [
  { id: "DH-20260601-001", customer: "Nguyễn Văn An", product: "Tai nghe Bluetooth TWS Pro", qty: 1, total: 1290000, status: "shipping", date: "08/06/2026", address: "Q.1, TP. Hồ Chí Minh", payment: "COD" },
  { id: "DH-20260601-002", customer: "Trần Thị Bình", product: "Áo thun nam basic", qty: 3, total: 567000, status: "delivered", date: "07/06/2026", address: "Cầu Giấy, Hà Nội", payment: "Banking" },
  { id: "DH-20260601-003", customer: "Lê Quốc Cường", product: "iPhone 15 Pro Max", qty: 1, total: 28990000, status: "confirmed", date: "08/06/2026", address: "Hải Châu, Đà Nẵng", payment: "Banking" },
  { id: "DH-20260601-004", customer: "Phạm Minh Đức", product: "Bộ nồi chảo chống dính", qty: 1, total: 1490000, status: "pending", date: "09/06/2026", address: "Q.7, TP. Hồ Chí Minh", payment: "COD" },
  { id: "DH-20260601-005", customer: "Hoàng Thu Hà", product: "Son lì M.A.C", qty: 2, total: 978000, status: "delivered", date: "06/06/2026", address: "Ba Đình, Hà Nội", payment: "Momo" },
  { id: "DH-20260601-006", customer: "Vũ Đình Khang", product: "Giày sneaker nam", qty: 1, total: 459000, status: "cancelled", date: "05/06/2026", address: "Q.10, TP. Hồ Chí Minh", payment: "COD" },
  { id: "DH-20260601-007", customer: "Đặng Mai Linh", product: "Đèn led cảm ứng", qty: 2, total: 718000, status: "shipping", date: "08/06/2026", address: "Thanh Khê, Đà Nẵng", payment: "Banking" },
  { id: "DH-20260601-008", customer: "Bùi Quang Huy", product: "Đồng hồ Galaxy Watch 6", qty: 1, total: 5990000, status: "confirmed", date: "09/06/2026", address: "Long Biên, Hà Nội", payment: "Banking" },
];

export const statusLabel: Record<Order["status"], { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700 border-blue-200" },
  shipping: { label: "Đang giao", color: "bg-violet-100 text-violet-700 border-violet-200" },
  delivered: { label: "Đã giao", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Đã huỷ", color: "bg-rose-100 text-rose-700 border-rose-200" },
};

export const revenueData = [
  { month: "T1", revenue: 120, orders: 320 },
  { month: "T2", revenue: 145, orders: 380 },
  { month: "T3", revenue: 180, orders: 410 },
  { month: "T4", revenue: 210, orders: 470 },
  { month: "T5", revenue: 240, orders: 520 },
  { month: "T6", revenue: 295, orders: 610 },
];

export const categoryShare = [
  { name: "Thời trang", value: 35 },
  { name: "Công nghệ", value: 28 },
  { name: "Nhà cửa", value: 18 },
  { name: "Làm đẹp", value: 12 },
  { name: "Khác", value: 7 },
];

export const users = [
  { id: "U001", name: "Nguyễn Văn An", email: "an.nv@gmail.com", role: "Khách hàng", status: "active", joined: "01/03/2025", orders: 24 },
  { id: "U002", name: "Trần Thị Bình", email: "binh.tt@gmail.com", role: "Khách hàng", status: "active", joined: "12/03/2025", orders: 18 },
  { id: "U003", name: "Coolmate Official", email: "shop@coolmate.me", role: "Người bán", status: "active", joined: "05/01/2025", orders: 1240 },
  { id: "U004", name: "Lê Quốc Cường", email: "cuong.lq@gmail.com", role: "Shipper", status: "active", joined: "20/02/2025", orders: 320 },
  { id: "U005", name: "Beauty Lab", email: "contact@beautylab.vn", role: "Người bán", status: "pending", joined: "08/06/2026", orders: 0 },
  { id: "U006", name: "Phạm Minh Đức", email: "duc.pm@gmail.com", role: "Khách hàng", status: "blocked", joined: "15/04/2025", orders: 3 },
];

export const stores = [
  { id: "S001", name: "Coolmate Official", owner: "Phạm Văn Coolmate", products: 234, orders: 1240, revenue: 890, rating: 4.9, status: "active" },
  { id: "S002", name: "Sound Hub Store", owner: "Nguyễn Sound Hub", products: 89, orders: 540, revenue: 420, rating: 4.7, status: "active" },
  { id: "S003", name: "Beauty Lab", owner: "Trần Beauty", products: 12, orders: 0, revenue: 0, rating: 0, status: "pending" },
  { id: "S004", name: "Apple Authorized", owner: "Lê Apple VN", products: 45, orders: 320, revenue: 4200, rating: 5.0, status: "active" },
  { id: "S005", name: "Urban Step", owner: "Vũ Urban", products: 156, orders: 720, revenue: 280, rating: 4.6, status: "active" },
];

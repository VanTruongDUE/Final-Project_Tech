# TechTonic Commerce - Frontend

TechTonic Commerce là frontend cho đồ án sàn thương mại điện tử đa ngành, hỗ trợ nhiều vai trò người dùng: Customer, Seller, Admin và Shipper. Dự án được xây dựng bằng ReactJS, Tailwind CSS và React Router, hiện chạy độc lập bằng mock data và localStorage để phục vụ demo frontend.

Repository tham chiếu: [Final-Project_Tech - Front-End](https://github.com/VanTruongDUE/Final-Project_Tech/tree/Front-End)

## Mục lục

- [Tổng quan chức năng](#tổng-quan-chức-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Tài khoản demo](#tài-khoản-demo)
- [Route chính](#route-chính)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Mock data và localStorage](#mock-data-và-localstorage)
- [Quy chuẩn UI](#quy-chuẩn-ui)
- [Kiểm tra chất lượng](#kiểm-tra-chất-lượng)
- [Ghi chú cho phát triển tiếp](#ghi-chú-cho-phát-triển-tiếp)

## Tổng quan chức năng

### Public / Customer

- Xem trang chủ marketplace.
- Xem danh sách sản phẩm, tìm kiếm, lọc và sắp xếp.
- Xem chi tiết sản phẩm, SKU và thông tin cửa hàng.
- Thêm sản phẩm vào giỏ hàng.
- Checkout mock và tạo đơn hàng.
- Xem lịch sử đơn hàng và chi tiết đơn hàng.
- Nhắn tin với cửa hàng.
- Quản lý hồ sơ, địa chỉ, ngân hàng và đổi mật khẩu.

### Seller

- Dashboard tổng quan cửa hàng.
- Quản lý danh sách sản phẩm.
- Tạo sản phẩm mới có SKU mặc định hoặc nhiều biến thể SKU.
- Chỉnh sửa sản phẩm và xem biến thể.
- Quản lý kho hàng theo SKU.
- Quản lý đơn hàng và cập nhật trạng thái đơn.
- Quản lý vận chuyển.
- Quản lý khuyến mãi.
- Xem báo cáo doanh thu.
- Nhắn tin với khách hàng.
- Cấu hình cửa hàng.

### Admin

- Dashboard quản trị hệ thống.
- Quản lý tài khoản người dùng.
- Đổi vai trò tài khoản trong môi trường mock.
- Quản lý cửa hàng.
- Duyệt cửa hàng.
- Quản lý đơn hàng toàn sàn.
- Duyệt sản phẩm mới.
- Quản lý sản phẩm bị báo cáo.
- Xem thống kê hệ thống.

### Shipper

- Dashboard giao hàng.
- Xem danh sách đơn vận chuyển.
- Xem chi tiết vận chuyển và cập nhật trạng thái giao hàng.

## Công nghệ sử dụng

- ReactJS 19
- JavaScript
- React Router
- Tailwind CSS
- Vite
- ESLint
- Mock data + localStorage

Dự án hiện không sử dụng:

- TypeScript
- Redux
- Bootstrap
- Material UI
- Ant Design
- API thật trong chế độ demo mặc định

## Yêu cầu môi trường

Nên dùng:

- Node.js 20 hoặc mới hơn
- npm 10 hoặc mới hơn

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

## Cài đặt và chạy dự án

Clone repository:

```bash
git clone https://github.com/VanTruongDUE/Final-Project_Tech.git
cd Final-Project_Tech
git checkout Front-End
```

Cài dependencies:

```bash
npm install
```

Tạo file môi trường nếu cần:

```bash
cp .env.example .env
```

Chạy dev server:

```bash
npm run dev
```

Mặc định Vite thường chạy tại:

```txt
http://localhost:5173
```

Build production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Tài khoản demo

| Vai trò | Email | Mật khẩu | Trang sau đăng nhập |
|---|---|---|---|
| Customer | `customer@techtonic.vn` | `123456` | `/` |
| Seller | `seller@techtonic.vn` | `123456` | `/seller/dashboard` |
| Admin | `admin@techtonic.vn` | `123456` | `/admin/dashboard` |
| Shipper | `shipper@techtonic.vn` | `123456` | `/shipper/dashboard` |

## Route chính

### Public/Auth

| Route | Mô tả |
|---|---|
| `/` | Trang chủ marketplace |
| `/products` | Danh sách sản phẩm |
| `/products/:id` | Chi tiết sản phẩm |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/forgot-password` | Quên mật khẩu |
| `/verify-otp` | Xác thực OTP |
| `/reset-password` | Đặt lại mật khẩu |

### Buyer/Customer

| Route | Mô tả |
|---|---|
| `/cart` | Giỏ hàng |
| `/checkout` | Thanh toán |
| `/orders` | Lịch sử đơn hàng |
| `/orders/:id` | Chi tiết đơn hàng |
| `/messages` | Danh sách hội thoại |
| `/messages/:conversationId` | Chi tiết hội thoại |
| `/profile` | Thông tin cá nhân |
| `/profile/banks` | Tài khoản ngân hàng |
| `/profile/addresses` | Địa chỉ nhận hàng |
| `/profile/change-password` | Đổi mật khẩu |
| `/profile/privacy` | Quyền riêng tư |

### Seller

| Route | Mô tả |
|---|---|
| `/seller/dashboard` | Dashboard seller |
| `/seller/products` | Danh sách sản phẩm |
| `/seller/products/new` | Thêm sản phẩm mới, hỗ trợ biến thể SKU |
| `/seller/products/:productId/edit` | Chỉnh sửa sản phẩm |
| `/seller/inventory` | Quản lý kho hàng theo SKU |
| `/seller/shipping` | Quản lý vận chuyển |
| `/seller/promotions` | Danh sách khuyến mãi |
| `/seller/promotions/new` | Tạo khuyến mãi |
| `/seller/orders` | Danh sách đơn hàng |
| `/seller/orders/:orderId` | Chi tiết đơn hàng |
| `/seller/revenue` | Báo cáo doanh thu |
| `/seller/messages` | Danh sách hội thoại seller |
| `/seller/messages/:conversationId` | Chi tiết hội thoại seller |
| `/seller/settings` | Cài đặt cửa hàng |

### Admin

| Route | Mô tả |
|---|---|
| `/admin/dashboard` | Dashboard admin |
| `/admin/users` | Quản lý tài khoản |
| `/admin/stores` | Quản lý cửa hàng |
| `/admin/store-approvals` | Duyệt cửa hàng |
| `/admin/orders` | Quản lý đơn hàng toàn sàn |
| `/admin/statistics` | Thống kê |
| `/admin/reported-products` | Sản phẩm bị báo cáo |
| `/admin/product-approvals` | Duyệt sản phẩm mới |

### Shipper

| Route | Mô tả |
|---|---|
| `/shipper/dashboard` | Dashboard shipper |
| `/shipper/shipments` | Danh sách đơn vận chuyển |
| `/shipper/shipments/:id` | Chi tiết vận chuyển |

## Cấu trúc thư mục

```txt
src/
├── assets/       # Tài nguyên tĩnh dùng trong frontend
├── components/   # Component tái sử dụng theo từng role/khu vực
├── contexts/     # React Context, ví dụ AuthContext
├── layouts/      # Layout Public, Buyer, Seller, Admin, Shipper
├── mocks/        # Dữ liệu mock: products, users...
├── pages/        # Các page theo role
├── routes/       # AppRoutes và ProtectedRoute
├── services/     # Service layer xử lý mock/localStorage
├── styles/       # Style bổ sung nếu có
└── utils/        # Hàm tiện ích, role, helper...
```

Các thư mục quan trọng khác:

```txt
UI-Flow/           # HTML/UI reference dùng làm chuẩn khi code giao diện
DB/                # Tài liệu hoặc script database nếu có
public/            # Static public assets
dist/              # Build output, sinh ra sau npm run build
DEMO_CHECKLIST.md  # Checklist demo chức năng
CODEX_CONTEXT.md   # Ghi chú quy tắc làm việc của dự án
```

## Mock data và localStorage

Frontend hiện chạy độc lập bằng mock data. Một số thao tác được lưu trong localStorage để refresh trang vẫn giữ trạng thái demo, ví dụ:

- Đăng nhập/đăng xuất mock.
- Đăng ký tài khoản demo.
- Reset mật khẩu mock.
- Giỏ hàng.
- Checkout và tạo đơn hàng.
- Tin nhắn Buyer/Seller.
- Sản phẩm do Seller tạo.
- SKU, biến thể, tồn kho.
- Trạng thái đơn hàng.
- Trạng thái cửa hàng/sản phẩm trong Admin.
- Override vai trò tài khoản trong Admin.

File `.env.example` có biến:

```env
VITE_DATA_SOURCE=mock
```

Trong giai đoạn hiện tại, `mock` là chế độ mặc định. Khi backend sẵn sàng, service layer có thể được mở rộng để gọi API thật.

## Quy chuẩn UI

Dự án có thư mục `UI-Flow` chứa các màn HTML tham chiếu. Khi phát triển UI mới hoặc chỉnh sửa UI hiện có, nên:

- Tìm màn tương ứng trong `UI-Flow` trước.
- Bám màu sắc, spacing, card, table, form, button, sidebar và typography đã có.
- Không tự tạo theme mới nếu UI-Flow đã có chuẩn.
- Giữ text tiếng Việt đúng UTF-8.
- Không để icon Material Symbols hiển thị thành chữ thô trên UI.
- Không tạo horizontal scroll toàn trang; bảng nhiều cột nên nằm trong card có `overflow-x-auto`.

## Kiểm tra chất lượng

Chạy lint:

```bash
npm run lint
```

Chạy build:

```bash
npm run build
```

Nếu dùng PowerShell trên Windows và bị chặn `npm.ps1`, có thể chạy:

```bash
npm.cmd run lint
npm.cmd run build
```

Lưu ý: Vite có thể cảnh báo bundle lớn hơn 500 kB sau khi build. Đây là cảnh báo tối ưu hiệu năng, không nhất thiết là lỗi build.

## Ghi chú cho phát triển tiếp

- Tích hợp backend Node.js và SQL Server khi API sẵn sàng.
- Chuẩn hóa lại service layer để chuyển dần từ mock/localStorage sang API.
- Bổ sung test tự động nếu dự án yêu cầu.
- Tối ưu code splitting nếu bundle production quá lớn.
- Rà soát lại các luồng Admin/Seller trước khi demo chính thức.

## Đẩy thay đổi lên GitHub

Sau khi kiểm tra ổn, có thể commit và push lên branch `Front-End`:

```bash
git status
git add README.md
git commit -m "docs: complete frontend README"
git push origin Front-End
```

Nếu muốn commit thêm các thay đổi code khác ngoài README, hãy kiểm tra kỹ `git status` và tách commit theo từng nhóm chức năng để lịch sử Git rõ ràng.

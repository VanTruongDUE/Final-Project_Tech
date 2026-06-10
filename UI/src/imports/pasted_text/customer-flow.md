Hãy hoàn thiện toàn bộ Customer Flow gồm các frame sau:


Frame "/login" Mục tiêu: Customer đăng nhập vào hệ thống. UI cần có:


Bố cục form đăng nhập rõ ràng.

Logo hoặc tên hệ thống "TechTonic Ecommerce".

Tiêu đề "Đăng nhập".

Input email hoặc số điện thoại.

Input mật khẩu.

Checkbox "Ghi nhớ đăng nhập" nếu phù hợp.

Link "Quên mật khẩu?".

Nút chính màu cam hoặc xanh: "Đăng nhập".

Link chuyển sang đăng ký: "Chưa có tài khoản? Đăng ký".

Có khu minh họa đơn giản hoặc background nhẹ.

Hiển thị thông báo lỗi mẫu nếu đăng nhập sai.


Frame "/register" Mục tiêu: Customer tạo tài khoản mới. UI cần có:


Tiêu đề "Đăng ký tài khoản".

Form gồm:


Họ và tên

Email

Số điện thoại

Mật khẩu

Xác nhận mật khẩu

Checkbox đồng ý điều khoản.

Nút "Đăng ký".

Link chuyển sang đăng nhập.

Ghi chú nhỏ rằng người dùng đăng ký mặc định là CUSTOMER.

Form phải sạch, dễ đọc, dễ code.


Frame "/forgot-password" Mục tiêu: Customer yêu cầu gửi OTP qua email. UI cần có:


Tiêu đề "Quên mật khẩu".

Mô tả ngắn: nhập email để nhận mã OTP.

Input email.

Nút "Gửi mã OTP".

Link quay lại đăng nhập.

Có trạng thái mẫu: gửi mã thành công.


Frame "/verify-otp" Mục tiêu: Customer nhập mã OTP. UI cần có:


Tiêu đề "Xác minh OTP".

Mô tả email đã được che một phần, ví dụ "ba***@gmail.com".

6 ô nhập OTP hoặc input OTP rõ ràng.

Nút "Xác nhận".

Link "Gửi lại mã".

Hiển thị thời gian còn lại giả lập.

Có thông báo lỗi mẫu khi OTP sai.


Frame "/reset-password" Mục tiêu: Customer đặt lại mật khẩu mới. UI cần có:


Tiêu đề "Đặt lại mật khẩu".

Input mật khẩu mới.

Input xác nhận mật khẩu mới.

Nút "Cập nhật mật khẩu".

Ghi chú yêu cầu mật khẩu.

Thông báo thành công mẫu.


Frame "/" Mục tiêu: Trang chủ mua hàng. UI cần có:


Header ecommerce gồm:


Logo

Search bar

Danh mục

Giỏ hàng

Thông báo

Profile/Login

Hero banner lớn.

Danh mục nổi bật.

Sản phẩm nổi bật.

Sản phẩm bán chạy.

Shop nổi bật hoặc gợi ý cửa hàng.

CTA rõ ràng.

Footer đơn giản.

Product card cần có ảnh, tên, giá, rating, đã bán, tên shop.


Frame "/products" Mục tiêu: Customer xem và lọc danh sách sản phẩm. UI cần có:


Header ecommerce.

Breadcrumb hoặc tiêu đề "Tất cả sản phẩm".

Sidebar hoặc khu filter gồm:


Danh mục

Khoảng giá

Rating

Trạng thái còn hàng

Sort dropdown:


Mới nhất

Giá thấp đến cao

Giá cao đến thấp

Bán chạy

Product grid.

Pagination.

Empty state nhỏ nếu không có sản phẩm.

Product card đồng bộ với Design System.


Frame "/products/" Mục tiêu: Customer xem chi tiết sản phẩm và thêm vào giỏ. UI cần có:


Header ecommerce.

Gallery ảnh sản phẩm bên trái.

Thông tin sản phẩm bên phải:


Tên sản phẩm

Rating

Đã bán

Giá hiện tại

Giá cũ nếu có

Tồn kho

Số lượng chọn

Nút "Thêm vào giỏ"

Nút "Mua ngay"

Thông tin cửa hàng:


Tên shop

Trạng thái shop

Nút "Xem shop"

Nút "Chat với shop"

Tabs hoặc section:


Mô tả sản phẩm

Thông số

Đánh giá

UI phải rõ chất ecommerce.


Frame "/cart" Mục tiêu: Customer xem giỏ hàng và chọn sản phẩm thanh toán. UI cần có:


Header ecommerce.

Tiêu đề "Giỏ hàng".

Danh sách sản phẩm nhóm theo shop/store.

Checkbox chọn từng sản phẩm.

Ảnh sản phẩm.

Tên sản phẩm.

Giá.

Quantity stepper.

Thành tiền từng dòng.

Nút xóa sản phẩm.

Khu tổng tiền cố định bên phải hoặc phía dưới:


Tổng sản phẩm

Tạm tính

Giảm giá nếu có

Tổng thanh toán

Nút "Tiến hành thanh toán".

Empty cart state nếu cần.


Frame "/checkout" Mục tiêu: Customer xác nhận đơn hàng. UI cần có:


Header ecommerce.

Tiêu đề "Thanh toán".

Khu địa chỉ nhận hàng:


Tên người nhận

Số điện thoại

Địa chỉ

Nút thay đổi địa chỉ

Danh sách sản phẩm theo shop.

Phương thức thanh toán:


COD

Chuyển khoản ngân hàng

Voucher hoặc mã giảm giá dạng mở rộng.

Tóm tắt đơn hàng:


Tạm tính

Phí vận chuyển

Giảm giá

Tổng tiền

Nút CTA nổi bật "Đặt hàng".

Ghi chú khách hàng.


Frame "/my-orders" Mục tiêu: Customer xem lịch sử đơn hàng. UI cần có:


Header ecommerce.

Tiêu đề "Đơn hàng của tôi".

Tabs trạng thái:


Tất cả

Chờ xác nhận

Đã xác nhận

Đang xử lý

Đang giao

Hoàn thành

Đã hủy

Danh sách đơn hàng dạng card hoặc table.

Mỗi đơn có:


Mã đơn

Tên shop

Sản phẩm đại diện

Tổng tiền

Trạng thái badge

Nút "Xem chi tiết"

Nút "Hủy đơn" nếu trạng thái PENDING

Nút "Đánh giá" nếu COMPLETED

Có filter/search theo mã đơn.


Frame "/my-orders/" Mục tiêu: Customer xem chi tiết đơn hàng. UI cần có:


Header ecommerce.

Mã đơn hàng.

Status badge.

Order Timeline:


PENDING

CONFIRMED

PROCESSING

SHIPPING

COMPLETED

Thông tin người nhận.

Thông tin shop.

Danh sách sản phẩm trong đơn.

Tóm tắt tiền:


Tạm tính

Phí ship

Giảm giá

Tổng thanh toán

Nút thao tác:


Hủy đơn nếu còn PENDING

Nhắn tin shop

Đánh giá nếu COMPLETED

Có ghi chú trạng thái hiện tại.


Frame "/reviews/create/" Mục tiêu: Customer đánh giá sản phẩm đã mua. UI cần có:


Header ecommerce hoặc layout đơn giản.

Thông tin sản phẩm:


Ảnh

Tên sản phẩm

Tên shop

Rating sao 1–5.

Textarea nhận xét.

Gợi ý nội dung đánh giá.

Nút "Gửi đánh giá".

Nút "Hủy".

Ghi chú: chỉ đánh giá khi đơn đã hoàn thành.


Frame "/messages" Mục tiêu: Customer nhắn tin với cửa hàng. UI cần có:


Layout chat gồm 2 phần:


Sidebar danh sách shop/conversation

Khung chat chính

Danh sách shop bên trái:


Avatar shop

Tên shop

Tin nhắn cuối

Thời gian

Badge unread nếu có

Khung chat:


Header tên shop

Tin nhắn hai chiều

Tin nhắn của customer và seller khác màu

Ô nhập tin nhắn

Nút gửi

Có thể có liên kết đơn hàng nếu conversation gắn order.


Frame "/profile" Mục tiêu: Customer quản lý thông tin cá nhân. UI cần có:


Header ecommerce.

Sidebar nhỏ cho tài khoản:


Hồ sơ

Địa chỉ

Đổi mật khẩu

Đơn hàng

Đăng xuất

Khu thông tin cá nhân:


Avatar

Họ tên

Email

Số điện thoại

Giới tính

Ngày sinh

Nút "Cập nhật"

Khu địa chỉ mặc định.

Khu đổi mật khẩu ngắn:


Mật khẩu hiện tại

Mật khẩu mới

Xác nhận mật khẩu mới
Yêu cầu cuối cùng:


Đảm bảo toàn bộ Customer Flow có cùng style.

Header phải thống nhất giữa các trang mua hàng.

Button, input, badge, card phải đồng bộ với Design System.

Không để font quá nhỏ.

Không để nội dung bị tràn hoặc bị cắt.

Layout phải dễ nhìn ở mức demo.

UI phải đủ rõ để sau này code lại bằng ReactJS components:


Header

AuthForm

ProductCard

ProductGrid

CartItem

CheckoutSummary

OrderCard

OrderTimeline

ReviewForm

ChatBox

ProfileForm
Sau khi hoàn thành:


Báo lại frame nào đã được hoàn thiện.

Báo nếu có frame nào gặp lỗi hoặc còn cần tôi review thủ công.
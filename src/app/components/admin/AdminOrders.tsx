export default function AdminOrders() {
  return (
    <div className="flex-1 p-4 md:p-6 bg-slate-50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Quản lý Đơn hàng</h2>
            <p className="text-sm text-slate-500 mt-1">Theo dõi và xử lý đơn hàng toàn hệ thống.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg border border-slate-300 px-4 py-2 shadow-sm cursor-pointer hover:border-[#EE4D2D] transition-colors">
              <span className="material-symbols-outlined text-slate-400 mr-2 text-lg">calendar_today</span>
              <span className="text-sm text-slate-900">7 ngày qua</span>
              <span className="material-symbols-outlined text-slate-400 ml-2 text-lg">arrow_drop_down</span>
            </div>
            <button className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 rounded-lg py-2 px-4 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-lg">download</span>
              Xuất CSV
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined text-lg">pending_actions</span>
              </div>
              <span className="text-xs font-medium text-slate-500">Chờ xác nhận</span>
            </div>
            <span className="text-2xl font-semibold text-[#EE4D2D]">124</span>
            <span className="text-xs text-slate-500 ml-2">+12% hôm nay</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-lg">local_shipping</span>
              </div>
              <span className="text-xs font-medium text-slate-500">Đang giao</span>
            </div>
            <span className="text-2xl font-semibold text-slate-900">345</span>
            <span className="text-xs text-slate-500 ml-2">Bình thường</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined text-lg">check_circle</span>
              </div>
              <span className="text-xs font-medium text-slate-500">Hoàn thành</span>
            </div>
            <span className="text-2xl font-semibold text-slate-900">1,892</span>
            <span className="text-xs text-slate-500 ml-2">+5% tuần này</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <span className="material-symbols-outlined text-lg">cancel</span>
              </div>
              <span className="text-xs font-medium text-slate-500">Đã hủy</span>
            </div>
            <span className="text-2xl font-semibold text-slate-900">12</span>
            <span className="text-xs text-red-600 ml-2">Cần chú ý</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-t-xl p-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <div className="relative w-full max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D] transition-all"
                placeholder="Tìm mã đơn hàng, tên khách..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 cursor-pointer hover:border-[#EE4D2D] transition-colors">
              <span className="text-sm text-slate-600">Cửa hàng:</span>
              <span className="text-sm text-slate-900 font-medium">Tất cả</span>
              <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-[#EE4D2D]/10 text-[#EE4D2D] border border-[#EE4D2D]/20 rounded-full px-4 py-1.5 text-xs font-medium">Tất cả</button>
            <button className="bg-slate-50 text-slate-600 border border-slate-300 rounded-full px-4 py-1.5 text-xs font-medium hover:bg-slate-100 transition-colors">Chờ xử lý</button>
            <button className="bg-slate-50 text-slate-600 border border-slate-300 rounded-full px-4 py-1.5 text-xs font-medium hover:bg-slate-100 transition-colors">Đang giao</button>
            <button className="bg-slate-50 text-slate-600 border border-slate-300 rounded-full px-4 py-1.5 text-xs font-medium hover:bg-slate-100 transition-colors">Hoàn thành</button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-xs uppercase font-semibold tracking-wider">
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Cửa Hàng</th>
                <th className="p-4">Ngày Đặt</th>
                <th className="p-4 text-right">Tổng Tiền</th>
                <th className="p-4 text-center">Thanh Toán</th>
                <th className="p-4 text-center">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200">
              {/* Row 1 */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="p-4 font-semibold text-[#EE4D2D]">#ORD-8821</td>
                <td className="p-4 text-slate-900">Nguyễn Văn A</td>
                <td className="p-4 text-slate-600">TechToShop Official Store</td>
                <td className="p-4 text-slate-600">24/10/2024 14:30</td>
                <td className="p-4 text-right font-semibold text-slate-900">₫1,250,000</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Chưa TT
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded border border-[#EE4D2D] text-[#EE4D2D] bg-[#EE4D2D]/10 text-xs font-medium">
                    Chờ xác nhận
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-[#EE4D2D] hover:text-[#d44428] font-medium text-xs">Chi tiết</button>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="p-4 font-semibold text-[#EE4D2D]">#ORD-8820</td>
                <td className="p-4 text-slate-900">Trần Thị B</td>
                <td className="p-4 text-slate-600">TechToShop Electronics</td>
                <td className="p-4 text-slate-600">24/10/2024 10:15</td>
                <td className="p-4 text-right font-semibold text-slate-900">₫5,400,000</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Đã TT
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded border border-blue-500 text-blue-700 bg-blue-50 text-xs font-medium">
                    Đang giao
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-[#EE4D2D] hover:text-[#d44428] font-medium text-xs">Chi tiết</button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="p-4 font-semibold text-[#EE4D2D]">#ORD-8819</td>
                <td className="p-4 text-slate-900">Lê Hoàng C</td>
                <td className="p-4 text-slate-600">TechToShop Official Store</td>
                <td className="p-4 text-slate-600">23/10/2024 16:45</td>
                <td className="p-4 text-right font-semibold text-slate-900">₫320,000</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Đã TT
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded border border-slate-300 text-slate-700 bg-slate-50 text-xs font-medium">
                    Hoàn thành
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-[#EE4D2D] hover:text-[#d44428] font-medium text-xs">Chi tiết</button>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="p-4 font-semibold text-[#EE4D2D]">#ORD-8818</td>
                <td className="p-4 text-slate-900">Phạm Thị D</td>
                <td className="p-4 text-slate-600">TechToShop Fashion</td>
                <td className="p-4 text-slate-600">23/10/2024 09:20</td>
                <td className="p-4 text-right font-semibold text-slate-900">₫850,000</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Chưa TT
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded border border-red-500 text-red-700 bg-red-50 text-xs font-medium">
                    Đã hủy
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-[#EE4D2D] hover:text-[#d44428] font-medium text-xs">Chi tiết</button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
            <span>Hiển thị 1-10 của 1,245 đơn hàng</span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded bg-[#EE4D2D] text-white flex items-center justify-center font-medium">1</button>
              <button className="w-8 h-8 rounded border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center">2</button>
              <button className="w-8 h-8 rounded border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center">3</button>
              <span className="px-2">...</span>
              <button className="p-2 rounded border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

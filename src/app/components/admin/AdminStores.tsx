export default function AdminStores() {
  return (
    <div className="flex-1 p-4 md:p-6 bg-slate-50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Quản lý Cửa hàng</h1>
            <p className="text-sm text-slate-500 mt-1">Giám sát và quản lý trạng thái các đối tác bán hàng.</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EE4D2D]/10 flex items-center justify-center text-[#EE4D2D]">
              <span className="material-symbols-outlined text-2xl">store</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Tổng Cửa hàng</p>
              <p className="text-2xl font-semibold text-slate-900">1,248</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Đang hoạt động</p>
              <p className="text-2xl font-semibold text-slate-900">1,180</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <span className="material-symbols-outlined text-2xl">block</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Tạm ngưng</p>
              <p className="text-2xl font-semibold text-slate-900">45</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined text-2xl">pending_actions</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Chờ duyệt</p>
              <p className="text-2xl font-semibold text-slate-900">23</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-t-lg p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D] transition-colors"
              placeholder="Tìm theo Tên, ID, Chủ sở hữu..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:border-[#EE4D2D]">
              <option>Tất cả trạng thái</option>
              <option>Đang hoạt động</option>
              <option>Tạm ngưng</option>
              <option>Không hoạt động</option>
            </select>
            <button className="px-4 py-2 border border-slate-300 rounded-md flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-b-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="p-4">Cửa hàng</th>
                <th className="p-4">Store ID</th>
                <th className="p-4">Chủ sở hữu</th>
                <th className="p-4 text-right">Sản phẩm</th>
                <th className="p-4 text-right">Đơn hàng</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4">Ngày tạo</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Row 1 - TechZone */}
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#EE4D2D]/10 flex items-center justify-center text-[#EE4D2D] font-bold text-lg">
                      T
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">TechZone</p>
                      <p className="text-xs text-slate-500">Hà Nội</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-500 font-mono text-sm">#SHP-9921</td>
                <td className="p-4 text-slate-900">Nguyễn Văn A</td>
                <td className="p-4 text-right font-medium">342</td>
                <td className="p-4 text-right font-medium text-[#EE4D2D]">12,540</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Đang hoạt động
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-sm">12/05/2022</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="text-slate-400 hover:text-[#EE4D2D] transition-colors" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="text-slate-400 hover:text-red-600 transition-colors" title="Đình chỉ">
                      <span className="material-symbols-outlined text-[20px]">block</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 2 - Fashion Hub */}
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                      F
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Fashion Hub</p>
                      <p className="text-xs text-slate-500">TP.HCM</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-500 font-mono text-sm">#SHP-8843</td>
                <td className="p-4 text-slate-900">Trần Thị B</td>
                <td className="p-4 text-right font-medium">128</td>
                <td className="p-4 text-right font-medium">4,210</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Đang hoạt động
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-sm">08/11/2023</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="text-slate-400 hover:text-[#EE4D2D] transition-colors" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="text-slate-400 hover:text-red-600 transition-colors" title="Đình chỉ">
                      <span className="material-symbols-outlined text-[20px]">block</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 3 - HomeMart (Suspended) */}
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors bg-red-50/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg opacity-60">
                      H
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 opacity-70">HomeMart</p>
                      <p className="text-xs text-red-600">Vi phạm CS</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-500 font-mono text-sm">#SHP-7712</td>
                <td className="p-4 text-slate-900">Lê Hoàng C</td>
                <td className="p-4 text-right font-medium opacity-70">56</td>
                <td className="p-4 text-right font-medium opacity-70">890</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                    Tạm ngưng
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-sm">22/01/2024</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="text-slate-400 hover:text-[#EE4D2D] transition-colors" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="text-slate-400 hover:text-green-600 transition-colors" title="Khôi phục">
                      <span className="material-symbols-outlined text-[20px]">settings_backup_restore</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 4 - Gia Dụng Thông Minh (Inactive) */}
              <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined w-10 h-10 flex items-center justify-center text-slate-400 bg-slate-100 rounded">storefront</span>
                    <div>
                      <p className="font-semibold text-slate-900">Gia Dụng Thông Minh</p>
                      <p className="text-xs text-slate-500">Đà Nẵng</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-500 font-mono text-sm">#SHP-9005</td>
                <td className="p-4 text-slate-900">Phạm Thị D</td>
                <td className="p-4 text-right font-medium">215</td>
                <td className="p-4 text-right font-medium">1,450</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-300">
                    Không hoạt động
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-sm">05/04/2024</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="text-slate-400 hover:text-[#EE4D2D] transition-colors" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t border-slate-200 bg-slate-50">
            <span className="text-sm text-slate-600">Hiển thị 1-4 trên 1,248 cửa hàng</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-400 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#EE4D2D] text-white font-medium text-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-sm">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-sm">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

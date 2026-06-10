export default function AdminAccounts() {
  return (
    <div className="flex-1 p-4 md:p-6 bg-slate-50 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Quản lý tài khoản</h1>
          <p className="text-sm text-slate-500 mt-1">Xem, tìm kiếm và quản lý tất cả tài khoản trong hệ thống TechToShop.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              className="w-full h-10 pl-10 pr-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-[#EE4D2D] transition-shadow placeholder:text-slate-400"
              placeholder="Tìm theo tên, email..."
              type="text"
            />
          </div>
          <div className="relative">
            <select className="appearance-none h-10 pl-3 pr-10 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-[#EE4D2D] cursor-pointer">
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
              <option value="shipper">Shipper</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
          </div>
          <button className="h-10 px-4 bg-[#EE4D2D] hover:bg-[#d44428] text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap">
            <span className="material-symbols-outlined text-lg">add</span>
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tài khoản</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Liên hệ</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Vai trò</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ngày tạo</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Row 1: Admin */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuB6tEhMQ1-D7Q_yZRbepf6vaQcz2_F1yFALQQWwUraN5h-oMhVZ24hfwj-S5tLA2PxpI_uHAWucnG7lyFTlXmkWjg021QS4KtKKdoEgx_vZ3eqJabLQUtFz8x8dgIKe1FmV5pzV33WU_eH033Ga2keJ1u2tw2e7q0Hm2_J5i_7oN6-UgAkY8hcbUlxTBXEi3331uI00uN_jZJdTii-mrbd6pMESDkiUbFDd5cM2QxWxXVLe90bsuc05ldSrqwX6ZFOniimQ32mbc"
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Nguyễn Thị Hằng</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-slate-900">hang.nguyen@techtoshop.vn</div>
                  <div className="text-xs text-slate-500">090 123 4567</div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#EE4D2D]/10 text-[#EE4D2D]">
                    Admin
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    Đang hoạt động
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-slate-500">12/10/2023</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-[#EE4D2D] hover:bg-slate-100 rounded-md transition-colors" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Đình chỉ">
                      <span className="material-symbols-outlined text-[20px]">person_off</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 2: Seller */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 text-orange-700 font-medium text-base">
                      T
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Trần Văn Bình</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-slate-900">binh.tran@techstore.vn</div>
                  <div className="text-xs text-slate-500">098 765 4321</div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Seller
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    Đang hoạt động
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-slate-500">05/11/2023</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-[#EE4D2D] hover:bg-slate-100 rounded-md transition-colors" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Đình chỉ">
                      <span className="material-symbols-outlined text-[20px]">person_off</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 3: Buyer - Suspended */}
              <tr className="hover:bg-slate-50 transition-colors group bg-slate-50/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100 grayscale"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW5CEw1blx-q3JMQL8zqlQzuId9duGGomL9FlHrs1noitZq8HpwA2CZqAWhEeKy7zG-ZQvf31YhNSgx9CGRVcrOo3uW7QEXeboVDOBLJp0v2hEVmiS-S_YlT6S0XBDaY66X5BSxWrrMVyeun4ffdkZ0Vz2-8o6P-SdDvqDnBIsuCxZLurhxf0sgbBM4UWhcC-KsaZYj4Ib34KIouguAj6HsZQEz6O083WWkrvJNWjxRHdZkG2umET7ZyjAHnqpSLdsoAgsKcLAXdI"
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-900 line-through decoration-slate-400">Lê Minh Tuấn</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-slate-900 opacity-60">tuan.le@gmail.com</div>
                  <div className="text-xs text-slate-500 opacity-60">091 234 5678</div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    Buyer
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    Đình chỉ
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-slate-500">20/01/2024</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-[#EE4D2D] hover:bg-slate-100 rounded-md transition-colors" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="Khôi phục">
                      <span className="material-symbols-outlined text-[20px]">lock_open</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 4: Buyer - Active */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pink-100 text-pink-700 font-medium text-base">
                      P
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Phạm Mai Phương</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-slate-900">phuong.pm@hotmail.com</div>
                  <div className="text-xs text-slate-500">Chưa cập nhật</div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    Buyer
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    Đang hoạt động
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-slate-500">02/03/2024</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-[#EE4D2D] hover:bg-slate-100 rounded-md transition-colors" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Đình chỉ">
                      <span className="material-symbols-outlined text-[20px]">person_off</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 5: Shipper */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVJNIaFTUO_ZlSqyH3bSQgmTO4lKCae9C5E8J-GaucwLiDJPJh6JrnHaOjLdQRNAaCuZRYOIMQIAH4fISN-yJuQAFHgngn7WCuDkJotEWRoPG06s5dwHCE5bcOTtAtqF_ltrPCzFElbk8jINViRQhjjFsdgNQhhUbi1U5-hQa0VT0ap0Qv86O674j4LnTwtAavNLC7hY45tw36hEJJUBXzTsiZuaylLFXsdHT-1GBO8uCbhA6CDGGe4dHu_OFT8spYA2tLhZdKE_c"
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-900">Phạm Hoàng</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-slate-900">hoang.ship@logistics.vn</div>
                  <div className="text-xs text-slate-500">+84 933 445 566</div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    Shipper
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    Đang hoạt động
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-slate-500">02/03/2024</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-[#EE4D2D] hover:bg-slate-100 rounded-md transition-colors" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Đình chỉ">
                      <span className="material-symbols-outlined text-[20px]">person_off</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-600">
            Hiển thị <span className="font-medium text-slate-900">1</span> đến <span className="font-medium text-slate-900">5</span> trong <span className="font-medium text-slate-900">124</span> kết quả
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-400 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border-2 border-[#EE4D2D] bg-[#EE4D2D]/10 text-[#EE4D2D] text-sm font-medium">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition-colors">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

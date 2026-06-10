export default function AdminProducts() {
  return (
    <div className="flex-1 p-4 md:p-6 bg-slate-50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Product Management</h2>
            <p className="text-sm text-slate-500">Global view of all products across the platform.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D] text-sm"
                placeholder="Search by SKU or Name..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-600">Category</label>
            <select className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D] bg-white">
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Garden</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-600">Store</label>
            <select className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D] bg-white">
              <option value="">All Stores</option>
              <option value="storeA">MegaMart</option>
              <option value="storeB">TechZone</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-600">Status</label>
            <select className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D] bg-white">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Apply Filters
            </button>
          </div>
        </section>

        {/* Product Table */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-slate-600 uppercase">Product</th>
                  <th className="p-4 text-xs font-semibold text-slate-600 uppercase">SKU</th>
                  <th className="p-4 text-xs font-semibold text-slate-600 uppercase">Store</th>
                  <th className="p-4 text-xs font-semibold text-slate-600 uppercase">Price</th>
                  <th className="p-4 text-xs font-semibold text-slate-600 uppercase">Stock/Sold</th>
                  <th className="p-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-600 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Row 1 */}
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        alt="Wireless Headphones"
                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqcX2RuRb2zsXg5xVJ5Qk808uJ7keNSBXIdhQeVBpO_5CJk3g9_Fod520R4vg3BEWwDlrQlRu4rY1UX6QKWifuK2ARNucpQGAsE9iOqxu_9-nreskHg5E7A4F4xCHxJBZEvvSV_gBSucuvzVjRLqkKPuwPQKDnHW4NtbYR-ucCKk74o6cVMUAjpFoNTIxkiW0hjJwhGglmZjPnOQ2hk8NCK5eJIqNHtjHvUrhKpSq1_coIyu8uFbKbM92MrBDdw7i64PVqNempxLo"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 line-clamp-1">Pro Wireless Headphones V2</p>
                        <p className="text-xs text-slate-500">Electronics</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">WH-PRO-002</td>
                  <td className="p-4"><span className="text-sm font-medium text-slate-900">TechZone</span></td>
                  <td className="p-4 text-sm font-semibold text-[#EE4D2D]">₫1,250,000</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm">145</span>
                      <span className="text-xs text-slate-500">Sold: 890</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-slate-400 hover:text-[#EE4D2D] transition-colors p-1" title="View Details">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Suspend Product">
                        <span className="material-symbols-outlined text-[20px]">block</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        alt="Smart Watch"
                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuiOwO8g0zHYVm7kBDVMJ1OPUgjn09X7U98I15eX-M3_2yss5R3Iqgp-AHLS7H64UybrLlO_CSOxnHhP-ZTYdLc9Xd0DkHinYSVL6rdQf0ZFJBwtDkN3VumO2f1T5T_24A1KR7n2qv0RFFkcJK_i4uoJgfXAFwhI99cp5wgdlA6ljk5r6K-B2YIxLHPq2TuYJRRqnbWu6MrDlAUuTElQVnik-oMy_2U4xM0bvhi_yyo6XmGiu4QGM4IjCjkkKkdBWglTsZKs2IcQI"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 line-clamp-1">Minimalist Smart Watch Sport</p>
                        <p className="text-xs text-slate-500">Electronics</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">SW-MIN-001</td>
                  <td className="p-4"><span className="text-sm font-medium text-slate-900">TechZone</span></td>
                  <td className="p-4 text-sm font-semibold text-[#EE4D2D]">₫850,000</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-red-600 font-medium">12</span>
                      <span className="text-xs text-slate-500">Sold: 450</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Suspended
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-slate-400 hover:text-[#EE4D2D] transition-colors p-1" title="View Details">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="text-slate-400 hover:text-green-600 transition-colors p-1" title="Reactivate Product">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-2xl">image</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 line-clamp-1">Cotton Basic T-Shirt</p>
                        <p className="text-xs text-slate-500">Fashion</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">TS-BAS-BLK</td>
                  <td className="p-4"><span className="text-sm font-medium text-slate-900">Apparel Hub</span></td>
                  <td className="p-4 text-sm font-semibold text-[#EE4D2D]">₫150,000</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm">500+</span>
                      <span className="text-xs text-slate-500">Sold: 2k+</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-slate-400 hover:text-[#EE4D2D] transition-colors p-1" title="View Details">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Suspend Product">
                        <span className="material-symbols-outlined text-[20px]">block</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
            <p className="text-xs text-slate-600">Showing 1 to 10 of 2,450 entries</p>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-[#EE4D2D] hover:bg-[#EE4D2D]/10 rounded transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#EE4D2D] text-white text-xs font-semibold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors">3</button>
              <span className="text-slate-400 text-xs">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors">245</button>
              <button className="p-1 text-slate-400 hover:text-[#EE4D2D] hover:bg-[#EE4D2D]/10 rounded transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="flex-1 p-4 md:p-6 bg-slate-50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">System Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Global metrics and recent activity.</p>
          </div>
          <div className="text-xs text-slate-500">Last updated: Just now</div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          {/* Total Users */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500">Total Users</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">group</span>
            </div>
            <div className="text-2xl font-semibold text-slate-900">1.2k</div>
            <div className="text-xs text-green-600 mt-1 flex items-center font-medium">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              +5.2%
            </div>
          </div>

          {/* Total Stores */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500">Total Stores</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">store</span>
            </div>
            <div className="text-2xl font-semibold text-slate-900">450</div>
            <div className="text-xs text-green-600 mt-1 flex items-center font-medium">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              +12 new
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500">Total Products</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">inventory</span>
            </div>
            <div className="text-2xl font-semibold text-slate-900">15k</div>
            <div className="text-xs text-green-600 mt-1 flex items-center font-medium">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              +300
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500">Total Orders</span>
              <span className="material-symbols-outlined text-blue-600 text-lg">local_shipping</span>
            </div>
            <div className="text-2xl font-semibold text-slate-900">8.2k</div>
            <div className="text-xs text-green-600 mt-1 flex items-center font-medium">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              +1.5%
            </div>
          </div>

          {/* Total Revenue - Highlighted */}
          <div className="bg-gradient-to-br from-[#EE4D2D] to-[#d44428] p-4 rounded-lg shadow-md col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-orange-100">Total Revenue</span>
              <span className="material-symbols-outlined text-white text-lg">account_balance_wallet</span>
            </div>
            <div className="text-2xl font-semibold text-white mt-1">1.2B VNĐ</div>
            <div className="text-xs text-orange-200 mt-1 flex items-center font-medium">
              <span className="material-symbols-outlined text-sm mr-1">arrow_upward</span>
              +15.3% vs last month
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Revenue Chart - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Chart Card */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-slate-800">Revenue Trend</h3>
                <select className="text-xs border border-slate-300 rounded py-1 px-2 bg-slate-50 text-slate-700">
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-48 bg-slate-50 rounded flex items-center justify-center border border-dashed border-slate-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-100/30 to-transparent"></div>
                <svg className="w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 100 50">
                  <path className="text-blue-200" d="M0,40 Q10,35 20,40 T40,30 T60,25 T80,15 T100,20 L100,50 L0,50 Z" fill="currentColor"></path>
                  <path className="text-blue-600" d="M0,40 Q10,35 20,40 T40,30 T60,25 T80,15 T100,20" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
                </svg>
                <span className="absolute text-xs text-slate-500 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">Interactive Chart Canvas</span>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="text-base font-semibold text-slate-800">Recent Activity</h3>
                <a className="text-xs font-medium text-[#EE4D2D] hover:underline" href="#">View All</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2">Entity</th>
                      <th className="px-4 py-2">Action</th>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                          <span className="material-symbols-outlined text-sm">storefront</span>
                        </div>
                        <span className="font-medium text-slate-800">Mega Electronics</span>
                      </td>
                      <td className="px-4 py-2 text-slate-600">Registered new store</td>
                      <td className="px-4 py-2 text-slate-500 text-xs">2 mins ago</td>
                      <td className="px-4 py-2 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Pending</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                          <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                        <span className="font-medium text-slate-800">Nguyen Van A</span>
                      </td>
                      <td className="px-4 py-2 text-slate-600">Placed order #8821</td>
                      <td className="px-4 py-2 text-slate-500 text-xs">15 mins ago</td>
                      <td className="px-4 py-2 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Completed</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center text-red-600">
                          <span className="material-symbols-outlined text-sm">inventory_2</span>
                        </div>
                        <span className="font-medium text-slate-800">iPhone 15 Pro Max</span>
                      </td>
                      <td className="px-4 py-2 text-slate-600">Reported by 5 users</td>
                      <td className="px-4 py-2 text-slate-500 text-xs">1 hr ago</td>
                      <td className="px-4 py-2 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Flagged</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Alerts & Charts */}
          <div className="space-y-4">
            {/* Action Required Alerts */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
              <div className="border-l-4 border-red-500 pl-3">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-red-500 text-lg">warning</span>
                  Action Required
                </h3>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50 border border-red-100 rounded flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-red-800">Store Approvals</p>
                      <p className="text-[11px] text-red-600 mt-0.5">24 awaiting review</p>
                    </div>
                    <button className="text-xs font-medium text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition-colors">Review</button>
                  </div>
                  <div className="p-2 bg-amber-50 border border-amber-100 rounded flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-amber-800">Reported Products</p>
                      <p className="text-[11px] text-amber-600 mt-0.5">12 items flagged</p>
                    </div>
                    <button className="text-xs font-medium text-amber-800 bg-white border border-amber-200 px-2 py-1 rounded hover:bg-amber-100 transition-colors">Check</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Order Status</h3>
              <div className="flex items-center justify-center h-32 relative mb-3">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-slate-100" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="20"></circle>
                  <circle className="text-[#EE4D2D]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="60" strokeWidth="20"></circle>
                  <circle className="text-amber-400" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="200" strokeWidth="20"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-slate-800">8.2k</span>
                  <span className="text-[10px] text-slate-500 uppercase">Total</span>
                </div>
              </div>
              {/* Legend */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#EE4D2D]"></span>
                    <span className="text-slate-600">Completed</span>
                  </div>
                  <span className="font-medium text-slate-800">75%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
                    <span className="text-slate-600">Processing</span>
                  </div>
                  <span className="font-medium text-slate-800">15%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-200"></span>
                    <span className="text-slate-600">Cancelled</span>
                  </div>
                  <span className="font-medium text-slate-800">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

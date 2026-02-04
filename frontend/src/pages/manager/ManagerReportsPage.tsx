import React, { useState } from 'react';
import { ChevronDown, Printer, Download, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('Tháng này');
  const [selectedArea, setSelectedArea] = useState('Quận 1');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');

  // Chart data for 7-day collection trend
  const chartData = [
    { day: 'T2', value: 65, maxValue: 85 },
    { day: 'T3', value: 78, maxValue: 88 },
    { day: 'T4', value: 52, maxValue: 92 },
    { day: 'T5', value: 85, maxValue: 95 },
    { day: 'T6', value: 75, maxValue: 88 },
    { day: 'T7', value: 68, maxValue: 98 },
    { day: 'CN', value: 62, maxValue: 85 },
  ];

  const maxChartValue = 100;

  const topStaff = [
    { name: 'Trần Văn B', avatar: '👤', percentage: 98 },
    { name: 'Lê Thị C', avatar: '👤', percentage: 92 },
  ];

  const recentCollection = {
    id: '#RT-0921',
    staff: 'Trần Văn B',
    location: 'P. Bến Nghé, Q1',
    weight: '450 kg',
    status: 'Hoàn thành',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-8 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Thống kê hoạt động</h2>
          <p className="text-gray-600">Theo dõi hiệu suất và xu hướng thu gom rác thải theo thời gian thực.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-700">{selectedMonth}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-700">Khu vực: {selectedArea}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm text-gray-700">Trạng thái: {selectedStatus}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xóa bộ lọc
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Waste Collected */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tổng rác thu gom</span>
              <span className="text-xs text-green-600 flex items-center gap-1">
                +12.5% <TrendingUp className="w-3 h-3" />
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">1,245 <span className="text-lg text-gray-500">tấn</span></div>
            <div className="h-1 bg-blue-500 rounded-full w-3/4 mt-4"></div>
          </div>

          {/* Overload Points */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Điểm quá tải</span>
              <span className="text-xs text-amber-600 flex items-center gap-1">
                +3 <TrendingUp className="w-3 h-3" />
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">18 <span className="text-lg text-gray-500">điểm</span></div>
            <div className="h-1 bg-amber-500 rounded-full w-1/3 mt-4"></div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tỷ lệ hoàn thành</span>
              <span className="text-xs text-green-600 flex items-center gap-1">
                +2.1%
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">94.2%</div>
            <div className="h-1 bg-teal-500 rounded-full w-full mt-4"></div>
          </div>

          {/* New Assignments */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Phân ảnh mới</span>
              <span className="text-xs text-red-600 flex items-center gap-1">
                -2 <TrendingDown className="w-3 h-3" />
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
            <div className="h-1 bg-red-500 rounded-full w-1/4 mt-4"></div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Collection Trend Chart */}
          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Xu hướng thu gom (7 ngày qua)</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">Chi tiết</button>
            </div>
            
            <div className="flex items-end justify-between gap-4 h-64">
              {chartData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <div 
                      className="w-full bg-blue-100 rounded-t-lg relative"
                      style={{ height: `${(item.maxValue / maxChartValue) * 100}%` }}
                    >
                      <div 
                        className="w-full bg-blue-500 rounded-t-lg absolute bottom-0"
                        style={{ height: `${(item.value / item.maxValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Waste Status Donut */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Trạng thái thùng rác</h3>
            
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Green segment - 60% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray={`${60 * 2.51} ${40 * 2.51}`}
                    strokeDashoffset="0"
                  />
                  {/* Orange segment - 25% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="12"
                    strokeDasharray={`${25 * 2.51} ${75 * 2.51}`}
                    strokeDashoffset={`-${60 * 2.51}`}
                  />
                  {/* Red segment - 15% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray={`${15 * 2.51} ${85 * 2.51}`}
                    strokeDashoffset={`-${85 * 2.51}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-gray-900">850</div>
                  <div className="text-sm text-gray-500">TỔNG SỐ THÙNG</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Trống / Bình thường</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">60%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Sắp đầy (Warning)</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Quá tải (Overloaded)</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top Staff */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top nhân viên</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {topStaff.map((staff, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg">{staff.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">{staff.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${staff.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{staff.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Collection */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Nhật ký thu gom gần đây</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
            </div>

            <div className="border border-gray-200 rounded-lg">
              <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="text-xs font-medium text-gray-600 uppercase">Mã lộ trình</div>
                <div className="text-xs font-medium text-gray-600 uppercase">Nhân viên</div>
                <div className="text-xs font-medium text-gray-600 uppercase">Khu vực</div>
                <div className="text-xs font-medium text-gray-600 uppercase">Khối lượng</div>
                <div className="text-xs font-medium text-gray-600 uppercase">Trạng thái</div>
              </div>
              
              <div className="grid grid-cols-5 gap-4 px-4 py-4 items-center">
                <div className="text-sm font-medium text-gray-900">{recentCollection.id}</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">👤</span>
                  </div>
                  <span className="text-sm text-gray-700">{recentCollection.staff}</span>
                </div>
                <div className="text-sm text-gray-700">{recentCollection.location}</div>
                <div className="text-sm text-gray-900 font-medium">{recentCollection.weight}</div>
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    ● {recentCollection.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="fixed top-24 right-8 flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm">
            <Printer className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">In báo cáo</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Xuất Excel</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
import React from 'react';

const RecentCollectionTable = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-800 text-lg">
          Nhật ký thu gom gần đây
        </h3>
        <button className="text-blue-500 text-sm font-medium hover:underline">
          Xem tất cả
        </button>
      </div>

      {/* Table Content */}
      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest pb-4 px-2">
          <div>Mã lộ trình</div>
          <div>Nhân viên</div>
          <div className="text-center">Khu vực</div>
          <div className="text-center">Khối lượng</div>
          <div className="text-right">Trạng thái</div>
        </div>

        {/* Row Item */}
        <div className="grid grid-cols-5 items-center py-5 px-2 border-t border-gray-50 hover:bg-gray-50 transition-colors">
          {/* ID */}
          <div className="text-sm font-medium text-gray-500">
            #RT - 0921
          </div>

          {/* Staff */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200">
              <img 
                src="https://i.pravatar.cc/150?u=b" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">Trần Văn B</span>
          </div>

          {/* Area */}
          <div className="text-sm text-gray-500 text-center">
            P. Bến Nghé, Q1
          </div>

          {/* Weight */}
          <div className="text-sm font-bold text-gray-700 text-center">
            450 kg
          </div>

          {/* Status */}
          <div className="flex justify-end">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-500 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Hoàn thành
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentCollectionTable;
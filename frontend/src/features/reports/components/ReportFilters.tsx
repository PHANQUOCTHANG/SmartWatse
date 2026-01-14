import React from 'react';
import { 
  Calendar, 
  MapPin, 
  SlidersHorizontal, 
  ChevronDown, 
  Printer, 
  Download 
} from "lucide-react";

const FilterItem = ({ icon: Icon, label }) => (
  <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl bg-white text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-all">
    <Icon size={18} className="text-gray-400" />
    <span>{label}</span>
    <ChevronDown size={14} className="text-gray-400 ml-1" />
  </button>
);

const ReportHeader = () => {
  return (
    <div className="w-full space-y-6 mb-8">
      {/* Top Header: Title and Action Buttons */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Thống kê hoạt động</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Theo dõi hiệu suất và xu hướng thu gom rác thải theo thời gian thực.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
            <Printer size={18} />
            In báo cáo
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-100 transition-all">
            <Download size={18} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3">
        <FilterItem icon={Calendar} label="Tháng này" />
        <FilterItem icon={MapPin} label="Khu vực: Quận 1" />
        <FilterItem icon={SlidersHorizontal} label="Trạng thái: Tất cả" />

        <button className="ml-auto text-blue-500 text-sm font-bold hover:text-blue-600 transition-colors">
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default ReportHeader;
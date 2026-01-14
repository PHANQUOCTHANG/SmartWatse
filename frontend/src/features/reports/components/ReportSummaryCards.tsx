import React from 'react';
import { 
  Recycle, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";

const Card = ({ title, value, unit, trend, trendColor, barColor, icon: Icon, colorTheme }) => {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-44 cursor-pointer">
      
      {/* Background Decor (Watermark Icon) */}
      <div className={`absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 ${colorTheme.text}`}>
        <Icon size={120} strokeWidth={1} />
      </div>

      {/* Header: Title & Trend Badge */}
      <div className="relative z-10 flex items-start justify-between">
        <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <div className={`flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-[11px] font-black shadow-sm ${trendColor}`}>
          {trend.includes('+') ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
          {trend}
        </div>
      </div>

      {/* Body: Value & Icon */}
      <div className="relative z-10 flex justify-between items-end">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-gray-800 tracking-tight leading-none">
              {value}
            </span>
            {unit && <span className="text-sm font-bold text-gray-400">{unit}</span>}
          </div>
        </div>
        
        {/* Main Icon Badge */}
        <div className={`p-3 rounded-2xl ${colorTheme.bg} ${colorTheme.text} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* Bottom accent bar - Glow effect */}
      <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${barColor} mx-6 rounded-t-full opacity-80 group-hover:opacity-100 group-hover:h-2 transition-all`} />
    </div>
  );
};

const ReportSummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-gray-50/50 rounded-3xl">
      {/* Card 1: Tổng rác thu gom */}
      <Card
        title="Tổng rác thu gom"
        value="1,245"
        unit="tấn"
        trend="+12.5%"
        trendColor="bg-emerald-50 text-emerald-600"
        barColor="bg-blue-500"
        colorTheme={{ bg: 'bg-blue-50', text: 'text-blue-500' }}
        icon={Recycle}
      />

      {/* Card 2: Điểm quá tải */}
      <Card
        title="Điểm quá tải"
        value="18"
        unit="điểm"
        trend="+3"
        trendColor="bg-orange-50 text-orange-600"
        barColor="bg-orange-400"
        colorTheme={{ bg: 'bg-orange-50', text: 'text-orange-500' }}
        icon={AlertTriangle}
      />

      {/* Card 3: Tỷ lệ hoàn thành */}
      <Card
        title="Tỷ lệ hoàn thành"
        value="94.2"
        unit="%"
        trend="+2.1%"
        trendColor="bg-emerald-50 text-emerald-600"
        barColor="bg-emerald-500"
        colorTheme={{ bg: 'bg-emerald-50', text: 'text-emerald-500' }}
        icon={CheckCircle}
      />

      {/* Card 4: Phản ánh mới */}
      <Card
        title="Phản ánh mới"
        value="5"
        trend="-2"
        trendColor="bg-emerald-50 text-emerald-600"
        barColor="bg-rose-500"
        colorTheme={{ bg: 'bg-rose-50', text: 'text-rose-500' }}
        icon={AlertCircle}
      />
    </div>
  );
};

export default ReportSummaryCards;
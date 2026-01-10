import React from 'react';

const CollectionTrendChart = () => {
  const data = [
    { day: "T2", main: 45, sub: 25 },
    { day: "T3", main: 65, sub: 20 },
    { day: "T4", main: 35, sub: 40 },
    { day: "T5", main: 80, sub: 15 },
    { day: "T6", main: 60, sub: 30 },
    { day: "T7", main: 55, sub: 45 },
    { day: "CN", main: 30, sub: 50 },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-800 text-lg">
          Xu hướng thu gom (7 ngày qua)
        </h3>
        <button className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
          Chi tiết
        </button>
      </div>

      {/* Chart Area */}
      <div className="h-64 flex items-end justify-between px-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            {/* Column Container */}
            <div className="w-10 sm:w-12 flex flex-col justify-end h-48 bg-transparent overflow-hidden rounded-t-sm">
              {/* Light blue part (Sub/Remaining) */}
              <div 
                className="bg-blue-100 w-full transition-all duration-500 ease-out"
                style={{ height: `${item.sub}%` }}
              />
              {/* Dark blue part (Main/Current) */}
              <div 
                className="bg-blue-600 w-full transition-all duration-500 ease-out"
                style={{ height: `${item.main}%` }}
              />
            </div>

            {/* Label */}
            <span className="text-xs font-medium text-gray-400 mt-4">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionTrendChart;
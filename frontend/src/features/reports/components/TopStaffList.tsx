import React from 'react';

const TopStaffList = () => {
  const staffData = [
    { name: "Trần Văn B", rate: 98, color: "bg-emerald-500", avatar: "B", bg: "bg-emerald-100", text: "text-emerald-700" },
    { name: "Lê Thị C", rate: 92, color: "bg-blue-500", avatar: "C", bg: "bg-blue-100", text: "text-blue-700" },
    { name: "Nguyễn Văn A", rate: 85, color: "bg-orange-500", avatar: "A", bg: "bg-orange-100", text: "text-orange-700" },
    { name: "Phạm Minh M", rate: 78, color: "bg-purple-500", avatar: "M", bg: "bg-purple-100", text: "text-purple-700" },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-800 text-lg tracking-tight">Top nhân viên</h3>
        <button className="text-blue-500 text-xs font-bold hover:underline uppercase tracking-wider">
          Tất cả
        </button>
      </div>

      {/* List */}
      <div className="space-y-7">
        {staffData.map((s, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar Circle */}
              <div className={`w-9 h-9 rounded-full ${s.bg} ${s.text} flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform`}>
                {s.avatar}
              </div>
              
              {/* Name & Rate */}
              <div className="flex-1">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {s.name}
                  </span>
                  <span className={`text-xs font-black ${s.text.replace('700', '600')}`}>
                    {s.rate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative w-full h-2 bg-gray-50 rounded-full overflow-hidden shadow-inner">
              <div
                className={`absolute top-0 left-0 h-full ${s.color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.05)]`}
                style={{ width: `${s.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStaffList;
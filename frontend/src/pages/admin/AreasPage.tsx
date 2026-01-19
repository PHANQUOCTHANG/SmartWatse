import React from "react";
import StatCard from "@/components/admin/StatCard";
import AreaTable from "@/components/admin/AreaTable";
import { DownloadCloud, Plus } from "lucide-react";

const AreasPage: React.FC = () => {
  const stats = [
    {
      title: "Tổng số khu vực",
      value: "24",
      delta: "+2 tháng nay",
      icon: <DownloadCloud className="w-5 h-5 text-sky-500" />,
    },
    {
      title: "Số Quận/Huyện",
      value: "5",
      delta: "Quản lý cấp cao",
      icon: <Plus className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "Tổng điểm thu gom",
      value: "1,240",
      delta: "Thùng rác công cộng",
      icon: <Plus className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Cảnh báo đầy",
      value: "12",
      delta: "Cần xử lý gấp",
      icon: <Plus className="w-5 h-5 text-red-500" />,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Cấu trúc Khu vực Đô thị</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý danh sách Quận, Phường và phân bổ tài nguyên.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white rounded shadow text-sm hover:bg-slate-50">
            <DownloadCloud className="w-4 h-4" /> Xuất Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded shadow text-sm hover:opacity-95">
            <Plus className="w-4 h-4" /> Thêm khu vực mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            delta={s.delta}
            icon={s.icon}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <AreaTable />
      </div>
    </div>
  );
};

export default AreasPage;

import React from "react";
import StatCard from "@/components/admin/StatCard";
import CollectionPointsTable from "@/components/admin/CollectionPointsTable";
import { DownloadCloud, Plus, MapPin } from "lucide-react";

const CollectionPointsPage: React.FC = () => {
  const stats = [
    {
      title: "Tổng điểm thu gom",
      value: "1,240",
      delta: "+5% so với tháng trước",
      icon: <DownloadCloud className="w-5 h-5 text-sky-500" />,
    },
    {
      title: "Cần thu gom",
      value: "45",
      delta: "(Đỏ/Vàng)",
      icon: <MapPin className="w-5 h-5 text-red-500" />,
    },
    {
      title: "Đã thu hôm nay",
      value: "120",
      delta: "Hoàn thành 98%",
      icon: <Plus className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Hoạt động",
      value: "1,100",
      delta: "",
      icon: <Plus className="w-5 h-5 text-sky-500" />,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý Điểm thu gom</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Danh sách và trạng thái các điểm tập kết trong hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white rounded shadow text-sm hover:bg-slate-50">
            <DownloadCloud className="w-4 h-4" /> Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded shadow text-sm hover:opacity-95">
            <Plus className="w-4 h-4" /> Thêm điểm mới
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
        <CollectionPointsTable />
      </div>
    </div>
  );
};

export default CollectionPointsPage;

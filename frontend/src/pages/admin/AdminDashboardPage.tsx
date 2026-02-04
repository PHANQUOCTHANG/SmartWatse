import React from "react";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import ActiveStaffList from "@/components/admin/ActiveStaffList";
import {
  Database,
  AlertTriangle,
  Bell,
  Truck,
  DownloadCloud,
  Plus,
} from "lucide-react";

const AdminDashboardPage: React.FC = () => {
  /* ================== DATA ================== */
  const stats = [
    {
      title: "Tổng số thùng rác",
      value: "1,240",
      delta: "+12",
      color: "bg-white",
      accent: "text-slate-700",
      icon: <Database className="w-5 h-5 text-sky-500" />,
    },
    {
      title: "Cảnh báo quá tải",
      value: "15",
      delta: "Cần xử lý ngay",
      color: "bg-white",
      accent: "text-slate-700",
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    },
    {
      title: "Phản ánh chờ xử lý",
      value: "8",
      delta: "Mới hôm nay",
      color: "bg-white",
      accent: "text-slate-700",
      icon: <Bell className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "Xe đang hoạt động",
      value: "12/15",
      delta: "Hiệu suất 80%",
      color: "bg-white",
      accent: "text-slate-700",
      icon: <Truck className="w-5 h-5 text-sky-500" />,
    },
  ];

  const chartData = [
    { name: "T2", value: 2 },
    { name: "T3", value: 4 },
    { name: "T4", value: 6 },
    { name: "T5", value: 5 },
    { name: "T6", value: 8 },
    { name: "T7", value: 3 },
    { name: "CN", value: 6 },
  ];

  /* ================== EXPORT REPORT ================== */
  const handleExportReport = () => {
    const now = new Date().toLocaleString("vi-VN");

    const csvData = [
      ["BÁO CÁO TỔNG QUAN HỆ THỐNG"],
      ["Thời gian xuất", now],
      [],
      ["Chỉ số", "Giá trị"],
      ["Tổng số thùng rác", "1,240"],
      ["Cảnh báo quá tải", "15"],
      ["Phản ánh chờ xử lý", "8"],
      ["Xe đang hoạt động", "12/15"],
      [],
      ["Lượng rác thu gom (7 ngày)"],
      ["Ngày", "Giá trị"],
      ...chartData.map((item) => [item.name, item.value]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bao-cao-he-thong.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* ================== UI ================== */
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tổng quan hệ thống</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded shadow text-sm hover:bg-slate-50"
          >
            <DownloadCloud className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            delta={s.delta}
            color={s.color}
            accent={s.accent}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 space-y-6">
          <ChartCard data={chartData} title="Lượng rác thu gom (7 ngày)" />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Trash Status */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-medium mb-3">Trạng thái thùng rác</h2>

            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Trống (Dưới 50%)</span>
                </div>
                <span className="text-sm text-gray-600">60%</span>
              </li>

              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span>Sắp đầy (50–80%)</span>
                </div>
                <span className="text-sm text-gray-600">35%</span>
              </li>

              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Quá tải (&gt;80%)</span>
                </div>
                <span className="text-sm text-gray-600">5%</span>
              </li>
            </ul>
          </div>

          {/* Active Staff */}
          <ActiveStaffList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

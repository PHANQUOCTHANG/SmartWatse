import React from "react";
import StatCard from "@/components/admin/StatCard";
import UsersTable from "@/components/admin/UsersTable";
import { DownloadCloud, Plus } from "lucide-react";

const UsersPage: React.FC = () => {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "12,540",
      delta: "+24",
      icon: <DownloadCloud className="w-5 h-5 text-sky-500" />,
    },
    {
      title: "Nhân viên (Staff)",
      value: "340",
      delta: "",
      icon: <Plus className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "Cư dân (Citizen)",
      value: "12,185",
      delta: "",
      icon: <Plus className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Mới đăng ký",
      value: "25",
      delta: "+12%",
      icon: <Plus className="w-5 h-5 text-violet-500" />,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Danh sách người dùng</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý tài khoản, phân quyền và theo dõi hoạt động của người dùng
            hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white rounded shadow text-sm hover:bg-slate-50">
            <DownloadCloud className="w-4 h-4" /> Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded shadow text-sm hover:opacity-95">
            <Plus className="w-4 h-4" /> Thêm người dùng
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
        <UsersTable />
      </div>
    </div>
  );
};

export default UsersPage;

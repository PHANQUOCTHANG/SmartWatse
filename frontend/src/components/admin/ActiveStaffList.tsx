import React from "react";

const sample = [
  {
    id: 1,
    name: "Trần Văn B",
    vehicle: "29C-12345",
    area: "Quận 1",
    status: "Đang thu gom",
  },
  {
    id: 2,
    name: "Lê Hoàng C",
    vehicle: "29C-56789",
    area: "Quận Bình Thạnh",
    status: "Đang di chuyển",
  },
  {
    id: 3,
    name: "Nguyễn Thị D",
    vehicle: "29C-99999",
    area: "Quận 3",
    status: "Tạm dừng",
  },
];

const statusBadge = (status: string) => {
  if (status === "Đang thu gom") return "bg-green-50 text-green-700";
  if (status === "Đang di chuyển") return "bg-blue-50 text-blue-700";
  return "bg-yellow-50 text-yellow-700";
};

const initials = (name: string) => {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const ActiveStaffList: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Nhân viên đang hoạt động</h2>
        <a className="text-sm text-blue-600" href="#">
          Xem tất cả
        </a>
      </div>

      <ul className="space-y-3">
        {sample.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 hover:bg-accent/60 p-2 rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                {initials(s.name)}
              </div>
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-500">
                  Xe: {s.vehicle} · {s.area}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(
                  s.status
                )}`}
              >
                {s.status}
              </div>
              <button className="text-sm text-primary hover:underline">
                Chi tiết
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveStaffList;

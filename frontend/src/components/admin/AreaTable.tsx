import React, { useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";

type Area = {
  id: number;
  code: string;
  name: string;
  district: string;
  binCount: number;
  status: "Ổn định" | "Cảnh báo nhẹ" | "Quá tải" | "Chưa gán";
  manager?: string;
};

const sampleAreas: Area[] = [
  {
    id: 1,
    code: "KV001",
    name: "Phường Bến Nghé",
    district: "Quận 1",
    binCount: 45,
    status: "Ổn định",
    manager: "Nguyễn Văn A",
  },
  {
    id: 2,
    code: "KV002",
    name: "Phường Đa Kao",
    district: "Quận 1",
    binCount: 32,
    status: "Cảnh báo nhẹ",
    manager: "Trần Thị B",
  },
  {
    id: 3,
    code: "KV003",
    name: "Phường 25",
    district: "Quận Bình Thạnh",
    binCount: 58,
    status: "Quá tải",
    manager: "Lê Văn C",
  },
  {
    id: 4,
    code: "KV004",
    name: "Phường 6",
    district: "Quận 3",
    binCount: 24,
    status: "Ổn định",
  },
];

const statusClass = (s: Area["status"]) => {
  switch (s) {
    case "Ổn định":
      return "bg-green-50 text-green-700";
    case "Cảnh báo nhẹ":
      return "bg-amber-50 text-amber-700";
    case "Quá tải":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const AreaTable: React.FC = () => {
  const [query, setQuery] = useState("");
  const [areas] = useState<Area[]>(sampleAreas);

  const filtered = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.code.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3 pl-3">MÃ KHU VỰC</th>
            <th className="py-3">TÊN KHU VỰC</th>
            <th className="py-3">THUỘC QUẬN/HUYỆN</th>
            <th className="py-3">SỐ LƯỢNG THÙNG RÁC</th>
            <th className="py-3">TRẠNG THÁI</th>
            <th className="py-3">NGƯỜI QUẢN LÝ</th>
            <th className="py-3 text-right pr-3">THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr
              key={a.id}
              className="border-b hover:bg-accent/60 transition-colors"
            >
              <td className="py-4 pl-3 text-sm font-medium">{a.code}</td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                    📍
                  </div>
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-gray-500">Khu vực</div>
                  </div>
                </div>
              </td>
              <td className="py-4">{a.district}</td>
              <td className="py-4">{a.binCount}</td>
              <td className="py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(
                    a.status,
                  )}`}
                >
                  {a.status}
                </span>
              </td>
              <td className="py-4">
                {a.manager ?? (
                  <span className="text-sm text-gray-400">Chưa gán</span>
                )}
              </td>
              <td className="py-4 text-right pr-3">
                <div className="inline-flex items-center gap-2">
                  <button className="p-2 rounded hover:bg-slate-100">
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded hover:bg-slate-100">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AreaTable;

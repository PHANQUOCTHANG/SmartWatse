import React, { useState } from "react";
import { Search, MapPin, Edit2, Trash2, Eye } from "lucide-react";

type Point = {
  id: number;
  name: string;
  address: string;
  area: string;
  status: "Trống" | "Sắp đầy" | "Quá tải";
  fillPercent: number;
  active: boolean;
  lastUpdated: string;
};

const sample: Point[] = [
  {
    id: 1,
    name: "Điểm tập kết Chợ Lớn",
    address: "12 Đường Hải Thượng Lãn Ông",
    area: "Q.5",
    status: "Sắp đầy",
    fillPercent: 75,
    active: true,
    lastUpdated: "10 phút trước",
  },
  {
    id: 2,
    name: "Khu dân cư Time City",
    address: "458 Minh Khai, Q. Hai Bà Trưng",
    area: "Q.Hai Bà Trưng",
    status: "Trống",
    fillPercent: 10,
    active: true,
    lastUpdated: "1 giờ trước",
  },
  {
    id: 3,
    name: "Bãi rác tạm số 5",
    address: "Ngõ 192 Lê Trọng Tấn",
    area: "Q.Tân Bình",
    status: "Quá tải",
    fillPercent: 98,
    active: false,
    lastUpdated: "2 ngày trước",
  },
  {
    id: 4,
    name: "Cụm CN Tân Bình",
    address: "Đường số 4, KCN Tân Bình",
    area: "KCN Tân Bình",
    status: "Trống",
    fillPercent: 5,
    active: true,
    lastUpdated: "30 phút trước",
  },
];

const statusClass = (s: Point["status"]) => {
  if (s === "Trống") return "bg-green-50 text-green-700";
  if (s === "Sắp đầy") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
};

const CollectionPointsTable: React.FC = () => {
  const [query, setQuery] = useState("");
  const [points] = useState<Point[]>(sample);

  const filtered = points.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-slate-50 rounded-md px-3 py-2 w-full md:w-1/2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            className="bg-transparent flex-1 ml-2 outline-none text-sm"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <select className="px-3 py-2 border rounded bg-white text-sm">
            <option>Trạng thái</option>
            <option>Trống</option>
            <option>Sắp đầy</option>
            <option>Quá tải</option>
          </select>
          <select className="px-3 py-2 border rounded bg-white text-sm">
            <option>Mức chứa</option>
          </select>
        </div>
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3 pl-3">TÊN ĐIỂM</th>
            <th className="py-3">VỊ TRÍ</th>
            <th className="py-3">TRẠNG THÁI / MỨC</th>
            <th className="py-3">HOẠT ĐỘNG</th>
            <th className="py-3">CẬP NHẬT CUỐI</th>
            <th className="py-3 text-right pr-3">HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr
              key={p.id}
              className="border-b hover:bg-accent/40 transition-colors"
            >
              <td className="py-4 pl-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">#ID-{p.id}</div>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                    📍
                  </div>
                  <div className="text-sm text-gray-700">{p.address}</div>
                </div>
              </td>
              <td className="py-4 w-72">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                      <div
                        className={`${
                          p.fillPercent >= 80
                            ? "bg-red-500"
                            : p.fillPercent >= 50
                            ? "bg-yellow-400"
                            : "bg-green-500"
                        } h-2 rounded`}
                        style={{ width: `${p.fillPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium">{p.fillPercent}%</div>
                </div>
                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </div>
              </td>
              <td className="py-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={p.active}
                    readOnly
                    className="toggle-checkbox"
                  />
                  <span className="text-sm text-gray-700">
                    {p.active ? "Active" : "Inactive"}
                  </span>
                </label>
              </td>
              <td className="py-4">{p.lastUpdated}</td>
              <td className="py-4 text-right pr-3">
                <div className="inline-flex items-center gap-2">
                  <button className="p-2 rounded hover:bg-slate-100">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded hover:bg-slate-100">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </button>
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

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Hiển thị 1-{filtered.length} trong tổng số {points.length} kết quả
        </div>
        <div className="inline-flex items-center gap-2">
          <button className="px-2 py-1 border rounded">&lt;</button>
          <button className="px-3 py-1 bg-primary text-primary-foreground rounded">
            1
          </button>
          <button className="px-2 py-1 border rounded">2</button>
          <button className="px-2 py-1 border rounded">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default CollectionPointsTable;

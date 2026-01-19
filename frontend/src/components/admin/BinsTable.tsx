import React, { useState } from "react";
import { Search, Eye, Trash2, Edit2 } from "lucide-react";

type Bin = {
  id: number;
  code: string;
  address: string;
  area: string;
  fillPercent: number;
  status: "Quá tải" | "Sắp đầy" | "Bình thường";
  battery: number; // percent
  lastCollected: string;
};

const sampleBins: Bin[] = [
  {
    id: 1,
    code: "TRASH-001",
    address: "123 Nguyễn Huệ, Q.1",
    area: "Quận 1",
    fillPercent: 95,
    status: "Quá tải",
    battery: 80,
    lastCollected: "2 ngày trước",
  },
  {
    id: 2,
    code: "TRASH-045",
    address: "45 Lê Lợi, Q.1",
    area: "Quận 1",
    fillPercent: 72,
    status: "Sắp đầy",
    battery: 45,
    lastCollected: "5 giờ trước",
  },
  {
    id: 3,
    code: "TRASH-089",
    address: "88 Võ Văn Tân, Q.3",
    area: "Quận 3",
    fillPercent: 25,
    status: "Bình thường",
    battery: 92,
    lastCollected: "1 giờ trước",
  },
  {
    id: 4,
    code: "TRASH-102",
    address: "Công viên 23/9",
    area: "Công cộng",
    fillPercent: 10,
    status: "Bình thường",
    battery: 12,
    lastCollected: "30 phút trước",
  },
];

const fillBarClass = (p: number) => {
  if (p >= 80) return "bg-red-500";
  if (p >= 50) return "bg-yellow-400";
  return "bg-green-500";
};

const BinsTable: React.FC = () => {
  const [query, setQuery] = useState("");
  const [bins] = useState<Bin[]>(sampleBins);

  const filtered = bins.filter(
    (b) =>
      b.code.toLowerCase().includes(query.toLowerCase()) ||
      b.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-slate-50 rounded-md px-3 py-2 w-full md:w-1/2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm ID & vị trí"
            className="bg-transparent flex-1 ml-2 outline-none text-sm"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <select className="px-3 py-2 border rounded bg-white text-sm">
            <option>Tất cả khu vực</option>
          </select>
          <select className="px-3 py-2 border rounded bg-white text-sm">
            <option>Trạng thái</option>
            <option>Bình thường</option>
            <option>Sắp đầy</option>
            <option>Quá tải</option>
          </select>
          <button className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm">
            Thêm thùng rác mới
          </button>
        </div>
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3 pl-3">ID & VỊ TRÍ</th>
            <th className="py-3">KHU VỰC</th>
            <th className="py-3">MỨC ĐẦY HIỆN TẠI</th>
            <th className="py-3">PIN</th>
            <th className="py-3">THU GOM LẦN CUỐI</th>
            <th className="py-3 text-right pr-3">THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b) => (
            <tr
              key={b.id}
              className="border-b hover:bg-accent/40 transition-colors"
            >
              <td className="py-4 pl-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center">
                    🗑️
                  </div>
                  <div>
                    <div className="font-medium">{b.code}</div>
                    <div className="text-xs text-gray-500">{b.address}</div>
                  </div>
                </div>
              </td>
              <td className="py-4">{b.area}</td>
              <td className="py-4 w-80">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                      <div
                        className={`${fillBarClass(b.fillPercent)} h-2 rounded`}
                        style={{ width: `${b.fillPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium">
                    {b.fillPercent}%
                  </div>
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      b.battery > 50
                        ? "bg-green-500"
                        : b.battery > 20
                        ? "bg-yellow-400"
                        : "bg-red-500"
                    }`}
                  />
                  <div className="text-sm text-gray-700">{b.battery}%</div>
                </div>
              </td>
              <td className="py-4">{b.lastCollected}</td>
              <td className="py-4 text-right pr-3">
                <div className="inline-flex items-center gap-2">
                  <button className="p-2 rounded hover:bg-slate-100">
                    <Eye className="w-4 h-4 text-gray-600" />
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
          Hiển thị 1-{filtered.length} trong tổng số {bins.length}
        </div>
        <div className="inline-flex items-center gap-2">
          <button className="px-2 py-1 border rounded">Trước</button>
          <button className="px-3 py-1 bg-primary text-primary-foreground rounded">
            1
          </button>
          <button className="px-2 py-1 border rounded">2</button>
          <button className="px-2 py-1 border rounded">Sau</button>
        </div>
      </div>
    </div>
  );
};

export default BinsTable;

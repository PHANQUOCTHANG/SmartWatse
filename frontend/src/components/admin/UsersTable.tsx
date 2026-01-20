import React, { useState } from "react";
import { Search, MoreVertical, Pencil, Trash2 } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Staff" | "Citizen";
  status: "Hoạt động" | "Offline" | "Đã khóa";
  lastLogin: string;
};

const sampleUsers: User[] = [
  {
    id: 1,
    name: "Nguyễn Thị Mai",
    email: "mai.nguyen@smartwaste.vn",
    role: "Manager",
    status: "Hoạt động",
    lastLogin: "15 phút trước",
  },
  {
    id: 2,
    name: "Lê Văn Minh",
    email: "minh.le@garbagecol.com",
    role: "Staff",
    status: "Offline",
    lastLogin: "2 ngày trước",
  },
  {
    id: 3,
    name: "Trần Quốc Toàn",
    email: "toan.tq@gmail.com",
    role: "Citizen",
    status: "Hoạt động",
    lastLogin: "5 giờ trước",
  },
  {
    id: 4,
    name: "Phạm Thu Hương",
    email: "huong.pham@smartwaste.vn",
    role: "Admin",
    status: "Hoạt động",
    lastLogin: "Vừa xong",
  },
  {
    id: 5,
    name: "User Spam 01",
    email: "spam.acc@tempemail.com",
    role: "Citizen",
    status: "Đã khóa",
    lastLogin: "1 tháng trước",
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const RolePill: React.FC<{ role: User["role"] }> = ({ role }) => {
  const map: Record<User["role"], string> = {
    Admin: "bg-violet-100 text-violet-700",
    Manager: "bg-sky-100 text-sky-700",
    Staff: "bg-amber-100 text-amber-700",
    Citizen: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[role]}`}>
      {role}
    </span>
  );
};

const StatusDot: React.FC<{ status: User["status"] }> = ({ status }) => {
  const color =
    status === "Hoạt động"
      ? "bg-green-500"
      : status === "Offline"
      ? "bg-gray-400"
      : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
      <span className="text-sm text-gray-700">{status}</span>
    </div>
  );
};

const UsersTable: React.FC = () => {
  const [query, setQuery] = useState("");
  const [users] = useState<User[]>(sampleUsers);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-slate-50 rounded-md px-3 py-2 w-full md:w-1/2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            className="bg-transparent flex-1 ml-2 outline-none text-sm"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <select className="px-3 py-2 border rounded bg-white text-sm">
            <option>Tất cả vai trò</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Staff</option>
            <option>Citizen</option>
          </select>
          <select className="px-3 py-2 border rounded bg-white text-sm">
            <option>Tất cả trạng thái</option>
            <option>Hoạt động</option>
            <option>Offline</option>
            <option>Đã khóa</option>
          </select>
          <button className="px-3 py-2 border rounded bg-white text-sm">
            Lọc
          </button>
        </div>
      </div>

      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3 pl-3">
              <input type="checkbox" />
            </th>
            <th className="py-3">Họ và tên</th>
            <th className="py-3">Vai trò</th>
            <th className="py-3">Trạng thái</th>
            <th className="py-3">Đăng nhập cuối</th>
            <th className="py-3 text-right pr-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr
              key={u.id}
              className="border-b hover:bg-accent/40 transition-colors"
            >
              <td className="py-4 pl-3">
                <input type="checkbox" />
              </td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">
                    {initials(u.name)}
                  </div>
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <RolePill role={u.role} />
              </td>
              <td className="py-4">
                <StatusDot status={u.status} />
              </td>
              <td className="py-4">{u.lastLogin}</td>
              <td className="py-4 text-right pr-3">
                <div className="inline-flex items-center gap-2">
                  <button className="p-2 rounded hover:bg-slate-100">
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded hover:bg-slate-100">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded hover:bg-slate-100">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Hiển thị 1 đến {filtered.length} trong tổng số {users.length} kết quả
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

export default UsersTable;

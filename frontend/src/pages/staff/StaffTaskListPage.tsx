import { useMemo, useState } from "react";
import clsx from "clsx"; // FIX: Thêm dòng này để hết lỗi ReferenceError
import TaskSummary from "@/features/task/components/TaskSummary";
import TaskCard from "@/features/task/components/TaskCard";

// Dữ liệu mẫu chuẩn theo UI SmartWaste
const MOCK_TASKS = [
  {
    id: "TASK-2023-001",
    title: "Chợ Bến Thành (Cửa Nam)",
    address: "Đ. Lê Lợi, Phường Bến Thành, Quận 1",
    lat: 10.7719,
    lng: 106.6983,
    status: "OVERLOADED",
    timeAgo: "15 phút trước",
  },
  {
    id: "TASK-2023-005",
    title: "Công viên 23/9 (Khu B)",
    address: "Đ. Phạm Ngũ Lão, P. Phạm Ngũ Lão, Q.1",
    lat: 10.7692,
    lng: 106.6948,
    status: "FULL",
    timeAgo: "1 giờ trước",
  },
  {
    id: "TASK-2023-008",
    title: "Dinh Độc Lập (Cổng sau)",
    address: "Đ. Nguyễn Du, Phường Bến Thành, Quận 1",
    lat: 10.777,
    lng: 106.6953,
    status: "SCHEDULED",
    timeAgo: "2 giờ trước",
  },
  {
    id: "TASK-2023-012",
    title: "Trường THPT Nguyễn Thị Minh Khai",
    address: "Đ. Điện Biên Phủ, Phường 7, Quận 3",
    lat: 10.782,
    lng: 106.689,
    status: "SCHEDULED",
    timeAgo: "3 giờ trước",
  },
  {
    id: "TASK-2023-015",
    title: "Bảo tàng Thành phố (Khu A)",
    address: "Đ. Nguyễn Hữu Cảnh, Quận Bình Thạnh",
    lat: 10.8,
    lng: 106.72,
    status: "OVERLOADED",
    timeAgo: "30 phút trước",
  },
  {
    id: "TASK-2023-018",
    title: "Sân vận động Quốc gia",
    address: "Đ. Phan Đình Phùng, P. 3, Quận Phú Nhuận",
    lat: 10.81,
    lng: 106.66,
    status: "FULL",
    timeAgo: "45 phút trước",
  },
  {
    id: "TASK-2023-022",
    title: "Chợ Lớn (Thành Ô Market)",
    address: "Đ. Trần Hưng Đạo, Quận 5",
    lat: 10.76,
    lng: 106.67,
    status: "COMPLETED",
    timeAgo: "4 giờ trước",
  },
  {
    id: "TASK-2023-025",
    title: "Khu công viên Tao Đàn",
    address: "Đ. Nguyễn Thượng Hiền, Quận 1",
    lat: 10.765,
    lng: 106.7,
    status: "SCHEDULED",
    timeAgo: "5 giờ trước",
  },
  {
    id: "TASK-2023-028",
    title: "Cung Văn hóa Hữu nghị Việt Xô",
    address: "Đ. Lê Thánh Tôn, Quận 1",
    lat: 10.773,
    lng: 106.703,
    status: "OVERLOADED",
    timeAgo: "20 phút trước",
  },
  {
    id: "TASK-2023-031",
    title: "Thư viện Thành phố",
    address: "Đ. Phan Chu Trinh, Quận 1",
    lat: 10.778,
    lng: 106.697,
    status: "FULL",
    timeAgo: "1.5 giờ trước",
  },
  {
    id: "TASK-2023-034",
    title: "Bệnh viện Nhân dân 115",
    address: "Đ. Nguyễn Văn Thủ, Quận 1",
    lat: 10.756,
    lng: 106.7,
    status: "COMPLETED",
    timeAgo: "6 giờ trước",
  },
  {
    id: "TASK-2023-037",
    title: "Trung tâm mua sắm Takashimaya",
    address: "Đ. Nguyễn Huệ, Quận 1",
    lat: 10.773,
    lng: 106.704,
    status: "SCHEDULED",
    timeAgo: "2.5 giờ trước",
  },
];

export default function StaffTaskListPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = ["Tất cả", "Chưa hoàn thành", "Ưu tiên cao", "Đã xong"];

  // Mapping tab text -> status filters
  const statusMap: Record<string, string[]> = {
    "Tất cả": ["OVERLOADED", "FULL", "SCHEDULED", "COMPLETED"],
    "Chưa hoàn thành": ["OVERLOADED", "FULL", "SCHEDULED"],
    "Ưu tiên cao": ["OVERLOADED"],
    "Đã xong": ["COMPLETED"],
  };

  // Filter logic: search + tab status
  const filteredTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const allowedStatuses = statusMap[activeTab];

    return MOCK_TASKS.filter((task) => {
      // Status filter
      const statusMatch = allowedStatuses.includes(task.status);

      // Search filter (title, address, id)
      const searchMatch =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.address.toLowerCase().includes(term) ||
        task.id.toLowerCase().includes(term);

      return statusMatch && searchMatch;
    });
  }, [searchTerm, activeTab]);

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#F8F9FA] custom-scrollbar">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
          Danh sách nhiệm vụ
        </h1>
        <button className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 relative hover:bg-gray-50 transition-colors">
          <span className="material-symbols-outlined text-gray-600">
            notifications
          </span>
          <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* SUMMARY CARDS SECTION */}
      <TaskSummary />

      {/* SEARCH & FILTER BAR SECTION */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        {/* Search Input */}
        <div className="flex-1 w-full relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm khu vực hoặc mã nhiệm vụ..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto w-full md:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                activeTab === tab
                  ? "bg-black text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TASK GRID SECTION */}
      <div
        className="grid gap-8 pb-10"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          justifyItems: "center",
        }}
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="w-full max-w-[380px]">
              <TaskCard task={task} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">
              inbox
            </span>
            <p className="text-gray-500 font-semibold">
              Không tìm thấy nhiệm vụ nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

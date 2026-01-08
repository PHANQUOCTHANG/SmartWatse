import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskDetailHeader from "@/features/task/components/detail/TaskDetailHeader";
import TaskBinList from "@/features/task/components/detail/TaskBinList";
import TaskMapPanel from "@/features/task/components/detail/TaskMapPanel";
import { TaskBin } from "@/features/task/types/task-detail.type";

const MOCK_BINS: TaskBin[] = [
  {
    id: "B-103",
    name: "B-103",
    address: "123 Nguyễn Huệ",
    status: "OVERLOADED",
    location: [10.775, 106.702],
  },
  {
    id: "B-104",
    name: "B-104",
    address: "45 Lê Lợi",
    status: "PENDING",
    location: [10.772, 106.701],
  },
  {
    id: "B-105",
    name: "B-105",
    address: "88 Đồng Khởi",
    status: "PENDING",
    location: [10.776, 106.704],
  },
  {
    id: "B-101",
    name: "B-101",
    address: "2 Công Xã Paris",
    status: "COMPLETED",
    location: [10.779, 106.699],
  },
];

export default function StaffTaskDetailPage() {
  const navigate = useNavigate();
  const [selectedBinId, setSelectedBinId] = useState<string | null>("B-103");

  // Filter state: trạng thái và từ khóa tìm kiếm
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const statusTabs = ["Tất cả", "OVERLOADED", "PENDING", "COMPLETED"];

  // Hàm Toggle: Nhấn cái đang mở thì đóng, nhấn cái khác thì mở
  const handleSelectBin = (bin: TaskBin) => {
    setSelectedBinId((prev) => (prev === bin.id ? null : bin.id));
  };

  // Danh sách thùng đã lọc theo trạng thái và tìm kiếm
  const filteredBins = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return MOCK_BINS.filter((b) => {
      const statusMatch =
        statusFilter === "Tất cả" || b.status === statusFilter;
      const searchMatch =
        !term ||
        b.name.toLowerCase().includes(term) ||
        b.address.toLowerCase().includes(term) ||
        b.id.toLowerCase().includes(term);

      return statusMatch && searchMatch;
    });
  }, [searchTerm, statusFilter]);

  // Nếu bin đang chọn bị lọc ra, bỏ chọn
  useEffect(() => {
    if (selectedBinId && !filteredBins.some((b) => b.id === selectedBinId)) {
      setSelectedBinId(null);
    }
  }, [filteredBins, selectedBinId]);

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
            <button
              onClick={() => navigate("/staff/tasks")}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Quay lại danh sách"
            >
              <span className="material-symbols-outlined text-base text-gray-600">
                arrow_back
              </span>
            </button>
            <span>Nhiệm vụ của tôi</span>
            <span className="material-symbols-outlined text-base">
              chevron_right
            </span>
            <span className="text-gray-800">Tuyến #TR-2023-10-25</span>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* PANEL TRÁI */}
          <div className="w-full md:w-[450px] h-1/2 md:h-auto flex flex-col border-b md:border-b-0 md:border-r border-gray-100 bg-white z-10 md:shrink-0">
            <TaskDetailHeader totalBins={12} completedBins={5} />

            {/* Filter bar */}
            <div className="px-4 py-3 border-b border-gray-100 bg-white">
              <div className="flex gap-2 items-center">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm tên, mã hoặc địa chỉ thùng..."
                  className="flex-1 pl-3 pr-2 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="ml-2 py-2 px-3 bg-white border border-gray-100 rounded-lg text-sm"
                >
                  {statusTabs.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              <TaskBinList
                bins={filteredBins}
                activeBinId={selectedBinId || undefined}
                onSelectBin={handleSelectBin}
              />
            </div>
            <div className="p-4 border-t border-gray-100">
              <button className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">
                Tạm dừng tuyến đường
              </button>
            </div>
          </div>

          {/* PANEL PHẢI: Truyền dữ liệu sang để hiện Marker */}
          <div className="w-full md:flex-1 h-1/2 md:h-auto flex-1">
            <TaskMapPanel bins={filteredBins} activeBinId={selectedBinId} />
          </div>
        </div>
      </div>
    </div>
  );
}

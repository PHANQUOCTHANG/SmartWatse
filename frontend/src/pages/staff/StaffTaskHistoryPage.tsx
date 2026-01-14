import { useState, useMemo } from "react";
import HistoryStats from "@/features/task/components/history/HistoryStats";
import HistoryTable from "@/features/task/components/history/HistoryTable";
import {
  TaskHistoryItem,
  TaskHistoryStats,
} from "@/features/task/types/task-history.type";

const MOCK_STATS: TaskHistoryStats = {
  monthlyTasks: 24,
  taskDiff: 2,
  totalWeight: "1,250 kg",
  avgWeightPerDay: "52kg",
  avgTimePerRoute: "45 phút",
  timeDiff: "5 phút",
};

// Dữ liệu mẫu với nhiều bản ghi để test phân trang
const MOCK_HISTORY: TaskHistoryItem[] = [
  {
    id: "#WM-2023-089",
    date: "20/10/2023",
    timeRange: "08:30 - 09:15",
    area: "Quận 1 - Zone A",
    weight: "450 kg",
    status: "Hoàn thành",
    progress: { current: 45, total: 45 },
  },
  {
    id: "#WM-2023-088",
    date: "19/10/2023",
    timeRange: "14:00 - 15:20",
    area: "Quận 3 - P. Võ Thị Sáu",
    weight: "310 kg",
    status: "Hoàn thành",
    progress: { current: 32, total: 32 },
  },
  {
    id: "#WM-2023-087",
    date: "18/10/2023",
    timeRange: "09:30 - 10:45",
    area: "Q. Bình Thạnh - P.12",
    weight: "540 kg",
    status: "Cảnh báo đầy",
    progress: { current: 45, total: 50 },
  },
  {
    id: "#WM-2023-086",
    date: "17/10/2023",
    timeRange: "10:00 - 11:30",
    area: "Quận 5 - Zone B",
    weight: "380 kg",
    status: "Hoàn thành",
    progress: { current: 38, total: 38 },
  },
  {
    id: "#WM-2023-085",
    date: "16/10/2023",
    timeRange: "07:45 - 09:00",
    area: "Quận 10 - P. Hòa Bình",
    weight: "420 kg",
    status: "Hoàn thành",
    progress: { current: 42, total: 42 },
  },
  {
    id: "#WM-2023-084",
    date: "15/10/2023",
    timeRange: "15:30 - 16:45",
    area: "Quận 4 - Zone C",
    weight: "490 kg",
    status: "Hoàn thành",
    progress: { current: 49, total: 49 },
  },
  {
    id: "#WM-2023-083",
    date: "14/10/2023",
    timeRange: "08:00 - 09:30",
    area: "Quận 1 - Zone D",
    weight: "360 kg",
    status: "Hoàn thành",
    progress: { current: 36, total: 36 },
  },
  {
    id: "#WM-2023-082",
    date: "13/10/2023",
    timeRange: "13:00 - 14:20",
    area: "Quận 7 - P. 1",
    weight: "530 kg",
    status: "Cảnh báo đầy",
    progress: { current: 48, total: 50 },
  },
  {
    id: "#WM-2023-081",
    date: "12/10/2023",
    timeRange: "09:15 - 10:45",
    area: "Quận 6 - Zone E",
    weight: "410 kg",
    status: "Hoàn thành",
    progress: { current: 41, total: 41 },
  },
  {
    id: "#WM-2023-080",
    date: "11/10/2023",
    timeRange: "14:30 - 15:50",
    area: "Quận 8 - P. 2",
    weight: "470 kg",
    status: "Hoàn thành",
    progress: { current: 47, total: 47 },
  },
  {
    id: "#WM-2023-079",
    date: "10/10/2023",
    timeRange: "07:30 - 09:00",
    area: "Quận 2 - Zone F",
    weight: "390 kg",
    status: "Hoàn thành",
    progress: { current: 39, total: 39 },
  },
  {
    id: "#WM-2023-078",
    date: "09/10/2023",
    timeRange: "15:00 - 16:30",
    area: "Quận 12 - P. 5",
    weight: "510 kg",
    status: "Hoàn thành",
    progress: { current: 51, total: 51 },
  },
  {
    id: "#WM-2023-077",
    date: "08/10/2023",
    timeRange: "08:45 - 10:15",
    area: "Quận 9 - Zone G",
    weight: "440 kg",
    status: "Hoàn thành",
    progress: { current: 44, total: 44 },
  },
  {
    id: "#WM-2023-076",
    date: "07/10/2023",
    timeRange: "13:30 - 14:50",
    area: "Quận 11 - P. 8",
    weight: "480 kg",
    status: "Hoàn thành",
    progress: { current: 48, total: 48 },
  },
  {
    id: "#WM-2023-075",
    date: "06/10/2023",
    timeRange: "09:00 - 10:30",
    area: "Thủ Đức - Zone H",
    weight: "520 kg",
    status: "Cảnh báo đầy",
    progress: { current: 49, total: 50 },
  },
];

export default function StaffTaskHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logic: search + date range
  const filteredHistory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return MOCK_HISTORY.filter((item) => {
      // Search filter (area, id)
      const searchMatch =
        !term ||
        item.area.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term);

      // Date range filter
      let dateMatch = true;
      if (fromDate || toDate) {
        const itemDate = new Date(item.date.split("/").reverse().join("-"));
        if (fromDate) {
          const from = new Date(fromDate);
          dateMatch = dateMatch && itemDate >= from;
        }
        if (toDate) {
          const to = new Date(toDate);
          dateMatch = dateMatch && itemDate <= to;
        }
      }

      return searchMatch && dateMatch;
    });
  }, [searchTerm, fromDate, toDate]);

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background-light">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <HistoryStats stats={MOCK_STATS} />

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-[#dbe6df] shadow-sm">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#61896f]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm kiếm khu vực hoặc mã..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f0f4f2] border border-[#dbe6df] rounded-lg text-sm"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-[#f0f4f2] border border-[#dbe6df] rounded-lg text-sm"
              placeholder="Từ ngày"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-[#f0f4f2] border border-[#dbe6df] rounded-lg text-sm"
              placeholder="Đến ngày"
            />
          </div>
        </div>

        <HistoryTable items={paginatedHistory} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-[#dbe6df] disabled:opacity-50 hover:bg-[#f0f4f2]"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-primary text-white font-bold"
                    : "border border-[#dbe6df] hover:bg-[#f0f4f2]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-[#dbe6df] disabled:opacity-50 hover:bg-[#f0f4f2]"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import {
  Search,
  PlusCircle,
  FolderOpen,
  Engineering,
  Wrench,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Send,
  MoreVertical,
  ArrowRight,
  Loader,
} from "lucide-react";
import { useFeedbacks } from "@/features/feedback/hooks/useFeedbacks";
import { useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";

const ReportStatus: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { feedbacks, isLoading } = useFeedbacks(
    10,
    user?.id ? { citizenId: user.id } : undefined,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Transform API data to match UI expectations
  const reports = useMemo(
    () =>
      feedbacks.map((feedback) => ({
        id: feedback.id,
        title: feedback.description?.substring(0, 50) || "Phản ánh mới",
        location:
          feedback.collectionPointId?.address ||
          feedback.areaId?.name ||
          "Không xác định",
        time: new Date(feedback.createdAt).toLocaleDateString("vi-VN"),
        status:
          feedback.status?.toLowerCase() === "new"
            ? "sent"
            : feedback.status?.toLowerCase() || "sent",
        statusText:
          {
            new: "Mới gửi",
            processing: "Đang xử lý",
            resolved: "Đã hoàn thành",
          }[feedback.status?.toLowerCase() || "new"] || "Chờ tiếp nhận",
        image:
          feedback.imageUrls?.[0] ||
          "https://via.placeholder.com/400x300?text=No+Image",
        description: feedback.description,
        imageUrls: feedback.imageUrls || [],
      })),
    [feedbacks],
  );

  // Filter reports based on search and status
  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const matchesSearch =
          report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || report.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [reports, searchTerm, statusFilter],
  );

  // Calculate statistics from real data
  const stats = useMemo(
    () => ({
      total: reports.length,
      processing: reports.filter((r) => r.status === "processing").length,
      completed: reports.filter((r) => r.status === "resolved").length,
    }),
    [reports],
  );

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101822] text-[#111418] dark:text-white p-4 md:p-8 font-['Public_Sans',sans-serif]">
      <div className="mx-auto flex flex-col gap-8">
        {/* Tiêu đề & Nút hành động */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Trạng thái phản ánh
            </h1>
            <p className="text-[#60728a] dark:text-[#9ca3af] text-sm md:text-base">
              Theo dõi tiến độ xử lý các vấn đề môi trường bạn đã báo cáo
            </p>
          </div>
          {/* <button
            onClick={() => navigate("/citizen/report/create")}
            className="flex items-center justify-center gap-2 bg-[#1973f0] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <PlusCircle size={20} />
            Gửi phản ánh mới
          </button> */}
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<FolderOpen size={20} />}
            label="Tổng số phản ánh"
            value={String(stats.total)}
            color="blue"
          />
          <StatCard
            icon={<Wrench size={20} />}
            label="Đang xử lý"
            value={String(stats.processing)}
            color="yellow"
          />
          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Đã hoàn thành"
            value={String(stats.completed)}
            color="green"
          />
        </div>

        {/* Thanh tìm kiếm và lọc */}
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-[#1a222d] rounded-2xl border border-[#e5e7eb] dark:border-[#2a3441] shadow-sm items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#60728a]"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã phản ánh hoặc địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e5e7eb] dark:border-[#2a3441] bg-[#f6f7f8] dark:bg-[#101822] focus:ring-2 focus:ring-[#1973f0]/30 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:flex-none px-4 py-3 rounded-xl border border-[#e5e7eb] dark:border-[#2a3441] bg-white dark:bg-[#1a222d] text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1973f0]/30 cursor-pointer min-w-[160px]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="sent">Mới gửi</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Đã hoàn thành</option>
            </select>
            <input
              type="date"
              className="flex-1 md:flex-none px-4 py-3 rounded-xl border border-[#e5e7eb] dark:border-[#2a3441] bg-white dark:bg-[#1a222d] text-sm font-semibold outline-none focus:ring-2 focus:ring-[#1973f0]/30"
            />
          </div>
        </div>

        {/* Danh sách thẻ phản ánh */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="text-[#1973f0] animate-spin" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#60728a] dark:text-[#9ca3af] font-semibold">
              Chưa có phản ánh nào
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedReports.map((report) => (
                <div
                  key={report.id}
                  className="group flex flex-col bg-white dark:bg-[#1a222d] rounded-2xl border border-[#e5e7eb] dark:border-[#2a3441] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Ảnh & Badge Trạng thái */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute top-3 right-3 z-10">
                      <StatusBadge
                        status={report.status}
                        text={report.statusText}
                      />
                    </div>
                    <img
                      src={report.image}
                      alt={report.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Nội dung */}
                  <div className="flex flex-col flex-1 p-5 space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#60728a] dark:text-[#9ca3af] uppercase tracking-wider">
                          {report.id}
                        </span>
                        <span className="text-[10px] font-semibold text-[#60728a] dark:text-[#9ca3af] flex items-center gap-1">
                          <Clock size={12} /> {report.time}
                        </span>
                      </div>
                      <h3
                        className="text-lg font-bold line-clamp-1"
                        title={report.title}
                      >
                        {report.title}
                      </h3>
                    </div>

                    <div className="flex items-start gap-2 min-h-[40px]">
                      <MapPin
                        size={16}
                        className="text-[#60728a] mt-0.5 flex-shrink-0"
                      />
                      <p className="text-sm text-[#60728a] dark:text-[#9ca3af] line-clamp-2 leading-relaxed">
                        {report.location}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-[#2a3441] mt-auto">
                      <button
                        onClick={() => navigate(`/my-reports/${report.id}`)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f6f7f8] dark:bg-[#2a3441] hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-[#1973f0] font-bold text-sm transition-all group/btn"
                      >
                        {report.status === "resolved"
                          ? "Xem kết quả"
                          : "Xem chi tiết"}
                        <ArrowRight
                          size={14}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#e5e7eb] dark:border-[#2a3441] text-[#60728a] hover:bg-white dark:hover:bg-[#1a222d] transition-colors shadow-sm disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                        currentPage === i + 1
                          ? "bg-[#1973f0] text-white shadow-md"
                          : "border border-[#e5e7eb] dark:border-[#2a3441] hover:bg-white dark:hover:bg-[#1a222d]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#e5e7eb] dark:border-[#2a3441] text-[#60728a] hover:bg-white dark:hover:bg-[#1a222d] transition-colors shadow-sm disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        <footer className="mt-8 pb-12 text-center border-t border-[#e5e7eb] dark:border-[#2a3441] pt-8">
          <p className="text-xs font-medium text-[#60728a] dark:text-[#9ca3af]">
            © 2023 EcoWaste Management. Hệ thống theo dõi xử lý rác thải đô thị.
          </p>
        </footer>
      </div>
    </div>
  );
};

// --- Sub-components để cấu trúc gọn gàng hơn ---

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "yellow" | "green";
}> = ({ icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    yellow:
      "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  };

  return (
    <div className="flex flex-col p-6 bg-white dark:bg-[#1a222d] rounded-2xl border border-[#e5e7eb] dark:border-[#2a3441] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${colors[color]}`}>{icon}</div>
        <span className="text-[#60728a] dark:text-[#9ca3af] font-semibold text-sm">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string; text: string }> = ({
  status,
  text,
}) => {
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
        {text}
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200 border border-green-200 dark:border-green-700 backdrop-blur-md">
        <CheckCircle2 size={12} />
        {text}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200 border border-blue-200 dark:border-blue-700 backdrop-blur-md">
      <Send size={12} />
      {text}
    </span>
  );
};

export default ReportStatus;

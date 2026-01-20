import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const REPORTS = [
  {
    id: "RP-2023-088",
    displayId: "#RP-2023-088",
    title: "Rác thải ủn ủ tại ngã tư Lê Lợi",
    status: "Đang xử lý",
    statusColor: "bg-yellow-500",
    location: "Ngã tư Lê Lợi, Nguyễn Huệ, Phường Bến Nghé, Quận 1",
    date: "2 giờ trước",
    image: "https://via.placeholder.com/300x200/1a1a1a/ffffff?text=Garbage",
    description: "Rác thải được để lại gây ô nhiễm",
    progress: 45,
  },
  {
    id: "RP-2023-082",
    displayId: "#RP-2023-082",
    title: "Thùng rác bị vỡ nắp",
    status: "Đã hoàn thành",
    statusColor: "bg-green-500",
    location: "Trước số nhà 156 Trần Hưng Đạo, Quận 5",
    date: "15/10/2023",
    image: "https://via.placeholder.com/300x200/2d5016/ffffff?text=Broken+Bin",
    description: "Thùng rác bị hư hỏng cần thay thế",
    progress: 100,
  },
  {
    id: "RP-2023-091",
    displayId: "#RP-2023-091",
    title: "Phế thải xây dựng đó tràm",
    status: "Vừa gửi",
    statusColor: "bg-blue-500",
    location: "Bãi đất trống khô đằm cạnh Nam Long, Quận 7",
    date: "Vừa gửi",
    image: "https://via.placeholder.com/300x200/8b9d6f/ffffff?text=Waste",
    description: "Phế liệu xây dựng được vứt bừa bãi",
    progress: 0,
  },
  {
    id: "RP-2023-087",
    displayId: "#RP-2023-087",
    title: "Ô nhiễm đường phố",
    status: "Đang xử lý",
    statusColor: "bg-yellow-500",
    location: "Đường Nguyễn Huệ, Quận 1",
    date: "3 ngày trước",
    image: "https://via.placeholder.com/300x200/1f5233/ffffff?text=Pollution",
    description: "Đường phố lớn bẩn thỉu gây mất vệ sinh",
    progress: 60,
  },
  {
    id: "RP-2023-086",
    displayId: "#RP-2023-086",
    title: "Rác thải nguy hiểm",
    status: "Đã hoàn thành",
    statusColor: "bg-green-500",
    location: "Hẻm 12 Trần Bình Trọng, Quận 5",
    date: "1 tuần trước",
    image: "https://via.placeholder.com/300x200/4a2c2a/ffffff?text=Hazard",
    description: "Rác thải có chứa chất độc hại",
    progress: 100,
  },
  {
    id: "RP-2023-085",
    displayId: "#RP-2023-085",
    title: "Xe vệ sinh bỏ lơ",
    status: "Vừa gửi",
    statusColor: "bg-blue-500",
    location: "Ngã tư Lê Lợi, Quận 1",
    date: "1 giờ trước",
    image: "https://via.placeholder.com/300x200/2d3e2d/ffffff?text=Truck",
    description: "Xe vệ sinh không làm sạch tường nhà",
    progress: 10,
  },
];

export default function CitizenReportPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const stats = [
    {
      icon: "folder",
      label: "Tổng số phản ánh",
      value: "12",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: "schedule",
      label: "Đang xử lý",
      value: "4",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: "check_circle",
      label: "Đã hoàn thành",
      value: "8",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const statusOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Vừa gửi", value: "Vừa gửi" },
    { label: "Đang xử lý", value: "Đang xử lý" },
    { label: "Đã hoàn thành", value: "Đã hoàn thành" },
  ];

  const filteredReports = REPORTS.filter((report) => {
    const matchSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" || report.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* HEADER SECTION */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/citizen/report/new")}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            <span className="material-symbols-outlined">add</span>
            Gửi phản ánh mới
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={clsx(
                "rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:border-primary/30 transition-all",
                stat.bgColor
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className={clsx("text-4xl font-black mt-2", stat.color)}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={clsx(
                    "material-symbols-outlined text-3xl p-3 rounded-xl",
                    stat.color,
                    "bg-white/50"
                  )}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS SECTION */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, địa chỉ phản ánh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                    filterStatus === option.value
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Date Filter */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
        </div>

        {/* REPORTS GRID */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              search_off
            </span>
            <p className="text-gray-500 font-medium">
              Không tìm thấy phản ánh nào
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Hãy thử thay đổi bộ lọc hoặc tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportCard({ report }: { report: (typeof REPORTS)[0] }) {
  const navigate = useNavigate();

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Vừa gửi":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Đang xử lý":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "Đã hoàn thành":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "Vừa gửi":
        return "bg-blue-500";
      case "Đang xử lý":
        return "bg-orange-500";
      case "Đã hoàn thành":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200 group flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={report.image}
          alt={report.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm",
              getStatusBadgeStyle(report.status)
            )}
          >
            <span className={clsx("size-2 rounded-full", report.statusColor)} />
            {report.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* ID & Date */}
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-bold text-gray-500">
            {report.displayId}
          </span>
          <span className="text-xs text-gray-400">{report.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition">
          {report.title}
        </h3>

        {/* Location */}
        <div className="flex gap-2 mb-4 text-xs text-gray-600">
          <span className="material-symbols-outlined text-sm shrink-0">
            location_on
          </span>
          <p className="line-clamp-2">{report.location}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-600">Tiến độ xử lý</p>
            <p className="text-xs font-bold text-primary">{report.progress}%</p>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={clsx(
                "h-full transition-all duration-300",
                getProgressColor(report.status)
              )}
              style={{ width: `${report.progress}%` }}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-4 line-clamp-2">
          {report.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate(`/citizen/report/${report.id}`)}
            className="flex-1 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">info</span>
            Chi tiết
          </button>
          <button
            onClick={() => navigate(`/citizen/report/${report.id}`)}
            className="flex-1 px-4 py-2 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_outward
            </span>
            Kết quả
          </button>
        </div>
      </div>
    </div>
  );
}

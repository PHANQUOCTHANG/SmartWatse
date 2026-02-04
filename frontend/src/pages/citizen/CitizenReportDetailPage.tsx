import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clsx from "clsx";

// Mock data - In production, fetch from API
const REPORT_DETAIL = {
  id: "RP-2023-088",
  displayId: "#RP-2023-088",
  title: "Rác thải ủn ủ tại ngã tư Lê Lợi",
  status: "Đang xử lý",
  statusColor: "bg-orange-500",
  description:
    "Rác thải được để lại ở ngã tư Lê Lợi gây ô nhiễm môi trường và mất vệ sinh đô thị. Cần được xử lý gấp.",
  location: {
    address: "Ngã tư Lê Lợi, Nguyễn Huệ, Phường Bến Nghé, Quận 1",
    lat: 10.7769,
    lng: 106.7009,
  },
  date: "2 giờ trước",
  reportedAt: "24/10/2023 14:30",
  images: [
    "https://via.placeholder.com/800x600/1a1a1a/ffffff?text=Garbage+1",
    "https://via.placeholder.com/800x600/2d2d2d/ffffff?text=Garbage+2",
  ],
  progress: 45,
  priority: "Cao",
  category: "Rác thải bừa bãi",

  // Timeline updates
  updates: [
    {
      id: 1,
      status: "Tiếp nhận",
      time: "24/10/2023 14:30",
      description:
        "Phản ánh của bạn đã được tiếp nhận và đưa vào hệ thống xử lý.",
      by: "Hệ thống",
      type: "success",
    },
    {
      id: 2,
      status: "Đã giao cho đơn vị",
      time: "24/10/2023 15:00",
      description: "Đã giao cho đội vệ sinh khu vực Quận 1 xử lý.",
      by: "Admin",
      type: "info",
    },
    {
      id: 3,
      status: "Đang xử lý",
      time: "24/10/2023 16:45",
      description: "Đội vệ sinh đã đến địa điểm và bắt đầu xử lý.",
      by: "Staff - Trần Văn B",
      type: "processing",
    },
  ],

  comments: [
    {
      id: 1,
      author: "Nguyễn Văn A",
      avatar: "NA",
      time: "1 giờ trước",
      text: "Cảm ơn đã xử lý nhanh, hy vọng sẽ sạch sẽ hơn!",
      isOwner: true,
    },
    {
      id: 2,
      author: "Trần Văn B",
      avatar: "TB",
      time: "30 phút trước",
      text: "Dạ, hiện tại chúng tôi đang tiến hành dọn dẹp. Sẽ xong trước 18:00 hôm nay.",
      isStaff: true,
    },
  ],
};

export default function CitizenReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [commentText, setCommentText] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Vừa gửi":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: "info",
          color: "bg-blue-500",
        };
      case "Đang xử lý":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          icon: "schedule",
          color: "bg-orange-500",
        };
      case "Đã hoàn thành":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: "check_circle",
          color: "bg-green-500",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: "help",
          color: "bg-gray-400",
        };
    }
  };

  const statusStyle = getStatusColor(REPORT_DETAIL.status);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* IMAGE SECTION */}
          <div className="relative h-64 md:h-96 overflow-hidden bg-gray-200">
            <img
              src={REPORT_DETAIL.images[0]}
              alt={REPORT_DETAIL.title}
              className="w-full h-full object-cover"
            />
            {/* STATUS BADGE */}
            <div className="absolute top-6 left-6">
              <span
                className={clsx(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm",
                  statusStyle.bg,
                  statusStyle.text
                )}
              >
                <span
                  className={clsx("size-3 rounded-full", statusStyle.color)}
                />
                {REPORT_DETAIL.status}
              </span>
            </div>

            {/* PRIORITY BADGE */}
            <div className="absolute top-6 right-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-700 backdrop-blur-sm border border-red-200">
                <span className="material-symbols-outlined text-base">
                  priority_high
                </span>
                {REPORT_DETAIL.priority}
              </span>
            </div>

            {/* IMAGE COUNTER */}
            <div className="absolute bottom-6 right-6 px-3 py-2 bg-black/50 text-white rounded-lg text-sm font-bold">
              1 / {REPORT_DETAIL.images.length}
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="p-6 md:p-8 space-y-6">
            {/* HEADER */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-bold text-gray-500">
                  {REPORT_DETAIL.displayId}
                </span>
                <span className="text-sm text-gray-400">
                  {REPORT_DETAIL.reportedAt}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                {REPORT_DETAIL.title}
              </h1>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                  {REPORT_DETAIL.category}
                </span>
              </div>
            </div>

            {/* LOCATION */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                    <span className="material-symbols-outlined text-primary text-xl">
                      location_on
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                    Địa điểm
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {REPORT_DETAIL.location.address}
                  </p>
                  <button className="mt-3 text-primary font-bold text-sm hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      open_in_new
                    </span>
                    Xem trên bản đồ
                  </button>
                </div>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                  Tiến độ xử lý
                </p>
                <p className="text-2xl font-black text-primary">
                  {REPORT_DETAIL.progress}%
                </p>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={clsx(
                    "h-full transition-all duration-300",
                    statusStyle.color
                  )}
                  style={{ width: `${REPORT_DETAIL.progress}%` }}
                />
              </div>
            </div>

            {/* TABS */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-4 mb-6 border-b border-gray-200">
                {[
                  { id: "overview", label: "Tổng quan", icon: "info" },
                  { id: "timeline", label: "Lịch sử xử lý", icon: "timeline" },
                  { id: "comments", label: "Bình luận", icon: "comment" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px]",
                      activeTab === tab.id
                        ? "text-primary border-primary"
                        : "text-gray-600 border-transparent hover:text-gray-900"
                    )}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Mô tả chi tiết
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {REPORT_DETAIL.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-xl">
                    <StatItem label="Trạng thái" value={REPORT_DETAIL.status} />
                    <StatItem label="Ưu tiên" value={REPORT_DETAIL.priority} />
                    <StatItem
                      label="Loại"
                      value={REPORT_DETAIL.category.split(" ")[0]}
                    />
                    <StatItem label="Ngày gửi" value="24/10/2023" />
                  </div>

                  {/* IMAGE GALLERY */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Hình ảnh phản ánh
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {REPORT_DETAIL.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-lg overflow-hidden bg-gray-200 aspect-video hover:shadow-lg transition cursor-pointer group"
                        >
                          <img
                            src={img}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold">
                            {idx + 1}/{REPORT_DETAIL.images.length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-6">
                  {REPORT_DETAIL.updates.map((update, idx) => (
                    <div key={update.id} className="flex gap-6">
                      {/* Timeline dot and line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={clsx(
                            "size-4 rounded-full border-4 border-white z-10",
                            update.type === "success"
                              ? "bg-green-500"
                              : update.type === "processing"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          )}
                        />
                        {idx < REPORT_DETAIL.updates.length - 1 && (
                          <div className="w-1 h-16 bg-gradient-to-b from-gray-300 to-transparent mt-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-900">
                              {update.status}
                            </p>
                            <p className="text-sm text-gray-500">{update.by}</p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {update.time}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-2">
                          {update.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-6">
                  {/* COMMENTS LIST */}
                  <div className="space-y-4">
                    {REPORT_DETAIL.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                      >
                        <div
                          className={clsx(
                            "size-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0",
                            comment.isStaff
                              ? "bg-gradient-to-br from-orange-400 to-orange-600"
                              : "bg-gradient-to-br from-blue-400 to-blue-600"
                          )}
                        >
                          {comment.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">
                              {comment.author}
                            </p>
                            {comment.isStaff && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
                                Staff
                              </span>
                            )}
                            {comment.isOwner && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                                Người báo cáo
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {comment.time}
                          </p>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* COMMENT INPUT */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex gap-4">
                      <div className="size-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
                        NA
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Viết bình luận của bạn..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">
                            Hủy
                          </button>
                          <button className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition">
                            Bình luận
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">edit</span>
            Chỉnh sửa
          </button>
          <button className="flex-1 px-6 py-3 border-2 border-red-300 text-red-600 font-bold rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">delete</span>
            Xóa phản ánh
          </button>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

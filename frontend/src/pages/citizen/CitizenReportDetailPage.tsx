import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader,
  MessageSquare,
  ImageIcon,
} from "lucide-react";
import { feedbackApi } from "@/features/feedback/api/feedbackApi";
import { IFeedback, FeedbackStatus } from "@/features/feedback/types";
import { toast } from "sonner";

export default function CitizenReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<IFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [commentText, setCommentText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!reportId) return;
      try {
        setIsLoading(true);
        const data = await feedbackApi.getById(reportId);
        setFeedback(data);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
        toast.error("Không thể tải chi tiết phản ánh");
        navigate("/my-reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [reportId, navigate]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case FeedbackStatus.NEW:
        return {
          label: "Mới",
          color:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
          bgColor: "bg-blue-500",
          icon: AlertCircle,
        };
      case FeedbackStatus.PROCESSING:
        return {
          label: "Đang xử lý",
          color:
            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
          bgColor: "bg-orange-500",
          icon: Loader,
        };
      case FeedbackStatus.RESOLVED:
        return {
          label: "Đã xử lý",
          color:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
          bgColor: "bg-green-500",
          icon: CheckCircle2,
        };
      default:
        return {
          label: "Chờ tiếp nhận",
          color:
            "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
          bgColor: "bg-gray-500",
          icon: AlertCircle,
        };
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case FeedbackStatus.NEW:
        return 33;
      case FeedbackStatus.PROCESSING:
        return 66;
      case FeedbackStatus.RESOLVED:
        return 100;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#101822] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#101822] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Không tìm thấy phản ánh
          </p>
          <button
            onClick={() => navigate("/my-reports")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(feedback.status);
  const progress = getProgressPercentage(feedback.status);
  const images = feedback.imageUrls || [];
  const currentImage = images[currentImageIndex] || "";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101822] p-4 md:p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/my-reports")}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold dark:text-white">
            Chi tiết phản ánh
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#1a222d] rounded-2xl border border-gray-200 dark:border-[#2a3441] shadow-sm overflow-hidden">
          {/* Image Section */}
          {images.length > 0 && (
            <div className="relative h-80 bg-gray-900 overflow-hidden">
              <img
                src={currentImage}
                alt="Feedback evidence"
                className="w-full h-full object-cover"
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusInfo.color}`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${statusInfo.bgColor}`}
                  />
                  {statusInfo.label}
                </span>
              </div>

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev - 1 + images.length) % images.length,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) => (prev + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  {feedback.id}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold dark:text-white mb-3">
                {feedback.description?.substring(0, 60) || "Phản ánh"}
              </h2>
            </div>

            {/* Location */}
            <div className="border-t border-gray-200 dark:border-[#2a3441] pt-6">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                    Địa điểm
                  </p>
                  <p className="text-lg font-semibold dark:text-white">
                    {feedback.areaId?.name ||
                      feedback.binId?.code ||
                      "Không xác định"}
                  </p>
                  {feedback.binId?.address && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {feedback.binId.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="border-t border-gray-200 dark:border-[#2a3441] pt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Tiến độ xử lý
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {progress}%
                </p>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${statusInfo.bgColor}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 dark:border-[#2a3441] pt-6">
              <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-[#2a3441] -mx-6 md:-mx-8 px-6 md:px-8">
                {[
                  { id: "overview", label: "Tổng quan" },
                  { id: "images", label: "Hình ảnh" },
                  { id: "comments", label: "Bình luận" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors border-b-2 -mb-0.5 ${
                      activeTab === tab.id
                        ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                        : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold dark:text-white mb-3">
                      Mô tả chi tiết
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {feedback.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-[#2a3441] p-6 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                        Trạng thái
                      </p>
                      <p className="text-sm font-bold dark:text-white">
                        {statusInfo.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                        Khu vực
                      </p>
                      <p className="text-sm font-bold dark:text-white">
                        {feedback.areaId?.name || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                        Thùng rác
                      </p>
                      <p className="text-sm font-bold dark:text-white">
                        {feedback.binId?.code || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                        Ngày gửi
                      </p>
                      <p className="text-sm font-bold dark:text-white">
                        {new Date(feedback.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "images" && (
                <div>
                  {images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 aspect-video hover:shadow-lg transition cursor-pointer group"
                          onClick={() => setCurrentImageIndex(idx)}
                        >
                          <img
                            src={img}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold">
                            {idx + 1}/{images.length}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Không có hình ảnh
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Chưa có bình luận nào
                    </p>
                  </div>

                  {/* Comment Input */}
                  <div className="border-t border-gray-200 dark:border-[#2a3441] pt-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                        U
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Viết bình luận của bạn..."
                          className="w-full px-4 py-3 border border-gray-200 dark:border-[#2a3441] dark:bg-[#2a3441] dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button className="px-4 py-2 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                            Hủy
                          </button>
                          <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
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

        {/* Action Buttons */}
        <div className="flex justify-center mt-6">
          <button className="px-6 py-3 border-2 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            Xóa phản ánh
          </button>
        </div>
      </div>
    </div>
  );
}

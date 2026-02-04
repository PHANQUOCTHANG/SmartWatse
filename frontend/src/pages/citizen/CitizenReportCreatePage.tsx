import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Send,
  Search,
  Filter,
  Clock,
  ArrowRight,
  Loader,
} from "lucide-react";
import { useFeedbackMetadata } from "@/features/feedback/hooks/useFeedbackMetadata";
import { feedbackApi } from "@/features/feedback/api/feedbackApi";
import { toast } from "sonner";
import { useFeedbacks } from "@/features/feedback/hooks/useFeedbacks";
import { useAppSelector } from "@/store/hooks";

const CitizenReportCreatePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    areas,
    collectionPoints,
    bins,
    isLoading: isLoadingMetadata,
    fetchCollectionPoints,
    fetchBins,
  } = useFeedbackMetadata();
  const { feedbacks, refreshFeedbacks } = useFeedbacks(
    6,
    user?.id ? { citizenId: user.id } : undefined,
  );

  // Form state
  const [areaId, setAreaId] = useState("");
  const [collectionPointId, setCollectionPointId] = useState("");
  const [binId, setBinId] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search state for history
  const [searchQuery, setSearchQuery] = useState("");

  // Handle area selection - fetch collection points
  const handleAreaChange = (newAreaId: string) => {
    setAreaId(newAreaId);
    setCollectionPointId(""); // Reset collection point
    setBinId(""); // Reset bin
    fetchCollectionPoints(newAreaId);
  };

  // Handle collection point selection - fetch bins
  const handleCollectionPointChange = (newCollectionPointId: string) => {
    setCollectionPointId(newCollectionPointId);
    setBinId(""); // Reset bin
    fetchBins(newCollectionPointId);
  };

  // Filter history by search
  const filteredHistory = feedbacks.filter((report) =>
    report.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        // Add file to uploaded files
        setUploadedFiles((prev) => [...prev, file]);

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrls((prev) => [...prev, previewUrl]);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newUrls = prev.filter((_, i) => i !== index);
      // Clean up object URL
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Bạn cần đăng nhập để gửi phản ánh");
      return;
    }

    if (!description.trim()) {
      toast.error("Vui lòng nhập nội dung phản ánh");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("citizenId", user.id);
      if (areaId) formData.append("areaId", areaId);
      if (collectionPointId)
        formData.append("collectionPointId", collectionPointId);
      if (binId) formData.append("binId", binId);
      formData.append("description", description);

      // Add all uploaded files to FormData
      uploadedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await feedbackApi.create(formData);

      toast.success("Gửi phản ánh thành công!");

      // Reset form
      setAreaId("");
      setCollectionPointId("");
      setBinId("");
      setDescription("");
      setUploadedFiles([]);
      setPreviewUrls([]);

      // Refresh history
      refreshFeedbacks();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Có lỗi khi gửi phản ánh");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "RESOLVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "NEW":
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return "Đang xử lý";
      case "RESOLVED":
        return "Đã xử lý";
      case "NEW":
      default:
        return "Chờ tiếp nhận";
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101822] text-[#111418] dark:text-white p-4 md:p-8 font-['Public_Sans',sans-serif]">
      <div className="mx-auto flex flex-col gap-8">
        {/* Tiêu đề trang */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Gửi phản ánh mới
          </h1>
          <p className="text-[#60728a] dark:text-[#9ca3af]">
            Hãy giúp chúng tôi giữ gìn thành phố xanh - sạch - đẹp bằng cách báo
            cáo các vấn đề môi trường.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: Form gửi phản ánh */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 md:p-8 shadow-sm dark:border-[#2a3441] dark:bg-[#1a222d]">
              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                {/* Khu vực */}
                <div className="flex flex-col gap-4">
                  <label className="text-base font-semibold">
                    Khu vực <span className="text-gray-400">(tùy chọn)</span>
                  </label>
                  <select
                    value={areaId}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    disabled={isLoadingMetadata}
                    className="w-full rounded-xl border border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#1f2937] px-4 py-3.5 text-base focus:ring-2 focus:ring-[#1973f0]/50 outline-none transition-all disabled:opacity-50"
                  >
                    <option value="">-- Chọn khu vực --</option>
                    {areas.map((area) => (
                      <option
                        key={area._id || area.id}
                        value={area._id || area.id || ""}
                      >
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Điểm thu gom */}
                <div className="flex flex-col gap-4">
                  <label className="text-base font-semibold">
                    Điểm thu gom{" "}
                    <span className="text-gray-400">(tùy chọn)</span>
                  </label>
                  <select
                    value={collectionPointId}
                    onChange={(e) =>
                      handleCollectionPointChange(e.target.value)
                    }
                    disabled={!areaId || isLoadingMetadata}
                    className="w-full rounded-xl border border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#1f2937] px-4 py-3.5 text-base focus:ring-2 focus:ring-[#1973f0]/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Chọn điểm thu gom --</option>
                    {collectionPoints.map((point) => (
                      <option key={point.id} value={point.id}>
                        {point.name} - {point.address || "Không có địa chỉ"}
                      </option>
                    ))}
                  </select>
                  {!areaId && (
                    <p className="text-xs text-[#9ca3af]">
                      Vui lòng chọn khu vực trước
                    </p>
                  )}
                </div>

                {/* Thùng rác */}
                <div className="flex flex-col gap-4">
                  <label className="text-base font-semibold">
                    Thùng rác <span className="text-gray-400">(tùy chọn)</span>
                  </label>
                  <select
                    value={binId}
                    onChange={(e) => setBinId(e.target.value)}
                    disabled={!collectionPointId || isLoadingMetadata}
                    className="w-full rounded-xl border border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#1f2937] px-4 py-3.5 text-base focus:ring-2 focus:ring-[#1973f0]/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Chọn thùng rác --</option>
                    {bins.map((bin) => (
                      <option
                        key={bin._id || bin.id}
                        value={bin._id || bin.id || ""}
                      >
                        {bin.code} - {bin.address || "Không có địa chỉ"}
                      </option>
                    ))}
                  </select>
                  {!collectionPointId && (
                    <p className="text-xs text-[#9ca3af]">
                      Vui lòng chọn điểm thu gom trước
                    </p>
                  )}
                </div>

                {/* Hình ảnh */}
                <div className="flex flex-col gap-4">
                  <label className="text-base font-semibold">
                    Hình ảnh minh chứng{" "}
                    <span className="text-gray-400">(tùy chọn)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* Upload Placeholder */}
                    <label className="aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#dbdfe6] dark:border-[#2a3441] bg-gray-50 dark:bg-[#1f2937] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2a3441] transition-all group">
                      <Upload
                        className="text-[#60728a] group-hover:text-[#1973f0] group-hover:-translate-y-1 transition-all"
                        size={28}
                      />
                      <span className="text-xs font-semibold text-[#60728a] mt-2">
                        Tải ảnh lên
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                      />
                    </label>

                    {/* Thumbnails */}
                    {previewUrls.map((previewUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-[#e5e7eb] dark:border-[#2a3441] shadow-sm"
                      >
                        <img
                          src={previewUrl}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mô tả */}
                <div className="flex flex-col gap-4">
                  <label className="text-base font-semibold flex items-center gap-2">
                    Mô tả chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    className="min-h-[140px] w-full resize-none rounded-2xl border border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#1f2937] px-4 py-4 text-base focus:ring-2 focus:ring-[#1973f0]/50 outline-none transition-all"
                    placeholder="Nhập thêm thông tin về tình trạng rác thải (thời gian phát hiện, mức độ nghiêm trọng...)..."
                  />
                  <div className="text-xs text-[#9ca3af]">
                    {description.length}/1000 ký tự
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingMetadata}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#1973f0] px-6 py-4 text-lg font-bold text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Gửi phản ánh ngay
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Cột phải: Lịch sử phản ánh */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold tracking-tight">
                Lịch sử phản ánh
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Tìm mã #RPT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#1f2937] pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1973f0]/30 transition-all"
                  />
                </div>
                <button className="p-2.5 rounded-xl border border-[#dbdfe6] dark:border-[#2a3441] bg-white dark:bg-[#1a222d] text-[#60728a] hover:bg-gray-50 transition-all">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[800px] pr-1 custom-scrollbar">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-[#60728a]">
                  <p className="text-sm font-semibold">Chưa có phản ánh nào</p>
                </div>
              ) : (
                filteredHistory.map((report) => (
                  <div
                    key={report.id}
                    className="group flex flex-col gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 dark:border-[#2a3441] dark:bg-[#1a222d]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-[#2a3441] shadow-inner">
                          <div className="w-5 h-5 rounded-full bg-[#1973f0]" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold">
                            {report.areaId?.name || "Không xác định"}
                          </p>
                          <p className="text-[10px] font-semibold text-[#60728a] uppercase tracking-wider">
                            {report.id}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${getStatusColor(
                          report.status,
                        )}`}
                      >
                        {getStatusLabel(report.status)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-[#4b5563] dark:text-[#9ca3af] leading-relaxed line-clamp-2">
                        {report.description}
                      </p>

                      {report.imageUrls && report.imageUrls.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {report.imageUrls.slice(0, 3).map((url, idx) => (
                            <div
                              key={idx}
                              className="h-20 w-20 rounded-lg overflow-hidden shadow-sm"
                            >
                              <img
                                src={url}
                                alt={`Proof ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {report.imageUrls.length > 3 && (
                            <div className="h-20 w-20 rounded-lg overflow-hidden shadow-sm bg-gray-100 dark:bg-[#2a3441] flex items-center justify-center">
                              <p className="text-xs font-bold text-[#60728a]">
                                +{report.imageUrls.length - 3}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#2a3441]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#9ca3af]">
                          <Clock size={12} />
                          {new Date(report.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </div>
                        <button className="text-[#1973f0] text-xs font-bold flex items-center gap-1 hover:underline">
                          Chi tiết <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {filteredHistory.length > 0 && (
                <button className="py-3 text-sm font-bold text-[#60728a] hover:text-[#1973f0] transition-all flex items-center justify-center gap-2">
                  Xem tất cả lịch sử phản ánh
                </button>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-8 pb-12 text-center border-t border-[#e5e7eb] dark:border-[#2a3441] pt-8">
          <p className="text-xs font-medium text-[#60728a] dark:text-[#9ca3af]">
            © 2024 EnviroClean Management System. Cùng nhau bảo vệ môi trường
            sống.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CitizenReportCreatePage;

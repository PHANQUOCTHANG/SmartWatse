import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Trash2,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { IFeedback, FeedbackStatus } from "../types";
import FeedbackStatusBadge from "./FeedbackStatusBadge";
import { feedbackApi } from "../api/feedbackApi";
import { toast } from "sonner";

interface FeedbackViewModalProps {
  feedbackId: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (
    feedbackId: string,
    status: FeedbackStatus,
  ) => Promise<void>;
  onDelete?: (feedbackId: string) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

export default function FeedbackViewModal({
  feedbackId,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
  onRefresh,
}: FeedbackViewModalProps) {
  const [feedback, setFeedback] = useState<IFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<FeedbackStatus | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen || !feedbackId) return;

    const loadFeedback = async () => {
      try {
        setIsLoading(true);
        const data = await feedbackApi.getById(feedbackId);
        setFeedback(data);
      } catch (error) {
        console.error("Failed to load feedback:", error);
        toast.error("Lỗi tải dữ liệu phản hồi");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, [isOpen, feedbackId]);

  useEffect(() => {
    if (!feedback) {
      setPendingStatus(null);
    }
  }, [feedback]);

  if (!isOpen) {
    console.log("Modal is closed, isOpen:", isOpen);
    return null;
  }

  console.log("Modal is open, rendering with feedbackId:", feedbackId);

  const handleStatusChange = async () => {
    if (!feedback || !pendingStatus || pendingStatus === feedback.status)
      return;

    try {
      setIsUpdating(true);
      if (onStatusChange) {
        await onStatusChange(feedback.id, pendingStatus);
      }
      toast.success("Cập nhật trạng thái thành công");

      // Gọi refresh callback nếu có - chờ hoàn thành trước khi đóng modal
      if (onRefresh) {
        await onRefresh();
      }

      setPendingStatus(null);
      // Đóng modal sau khi cập nhật và refresh thành công
      onClose();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!feedback) return;

    try {
      setIsUpdating(true);
      if (onDelete) {
        await onDelete(feedback.id);
      }
      toast.success("Xóa phản hồi thành công");
      setShowDeleteConfirm(false);

      // Gọi refresh callback nếu có - chờ hoàn thành trước khi đóng modal
      if (onRefresh) {
        await onRefresh();
      }

      onClose();
    } catch (error) {
      console.error("Failed to delete feedback:", error);
      toast.error("Xóa phản hồi thất bại");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: FeedbackStatus) => {
    switch (status) {
      case FeedbackStatus.NEW:
        return <AlertCircle className="w-5 h-5" />;
      case FeedbackStatus.PROCESSING:
        return <RefreshCw className="w-5 h-5" />;
      case FeedbackStatus.RESOLVED:
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Chi tiết phản hồi
            </h2>
            <p className="text-xs text-gray-500 mt-1">ID: {feedbackId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : feedback ? (
            <>
              {/* Status Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(feedback.status)}
                    <div>
                      <p className="text-sm text-gray-600">Trạng thái xử lý</p>
                      <p className="text-lg font-semibold text-gray-900">
                        <FeedbackStatusBadge status={feedback.status} />
                      </p>
                    </div>
                  </div>

                  {/* Status Select */}
                  <select
                    value={pendingStatus || feedback.status}
                    onChange={(e) =>
                      setPendingStatus(e.target.value as FeedbackStatus)
                    }
                    disabled={isUpdating}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 disabled:opacity-50 cursor-pointer transition"
                  >
                    <option value={FeedbackStatus.NEW}>Mới</option>
                    <option value={FeedbackStatus.PROCESSING}>
                      Đang xử lý
                    </option>
                    <option value={FeedbackStatus.RESOLVED}>
                      Đã giải quyết
                    </option>
                  </select>
                </div>
              </div>

              {/* Citizen Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Thông tin người gửi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Tên người dùng</p>
                      <p className="font-medium text-gray-900">
                        {feedback.citizenId?.fullName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {feedback.citizenId?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-900">
                        {feedback.citizenId?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Ngày gửi</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(feedback.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Bin Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Area */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Khu vực liên quan
                    </h3>
                  </div>
                  {feedback.areaId ? (
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Tên khu vực</p>
                        <p className="font-medium text-gray-900">
                          {feedback.areaId.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Loại</p>
                        <p className="font-medium text-gray-900">
                          {feedback.areaId.type}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Không có thông tin</p>
                  )}
                </div>

                {/* Bin */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Trash2 className="w-5 h-5 text-orange-600" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Thùng rác liên quan
                    </h3>
                  </div>
                  {feedback.binId ? (
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Mã thùng</p>
                        <p className="font-medium text-gray-900">
                          {feedback.binId.code}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Địa chỉ</p>
                        <p className="font-medium text-gray-900 text-sm">
                          {feedback.binId.address || "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Không có thông tin</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Nội dung phản hồi
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {feedback.description}
                </p>
              </div>

              {/* Image */}
              {feedback.imageUrl && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Hình ảnh minh chứng
                  </h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={feedback.imageUrl}
                      alt="Feedback evidence"
                      className="w-full h-auto object-cover max-h-96"
                    />
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Ngày tạo</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(feedback.createdAt)}
                    </p>
                  </div>
                  {feedback.updatedAt && (
                    <div>
                      <p className="text-gray-500">Cập nhật lần cuối</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(feedback.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Không thể tải dữ liệu</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Đóng
          </button>

          {pendingStatus && pendingStatus !== feedback?.status && (
            <button
              onClick={handleStatusChange}
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          )}

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isUpdating}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 transition"
          >
            Xóa
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc muốn xóa phản hồi này? Hành động này không thể hoàn
                tác.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isUpdating ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

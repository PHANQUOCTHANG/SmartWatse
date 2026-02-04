import {
  Pencil,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { areaApi } from "@/features/area/api/areaApi";
import { scheduleApi } from "@/features/schedule/api/scheduleApi";
import { toast } from "sonner";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

interface TaskDetailCardProps {
  schedule?: any;
  onClose?: () => void;
  isEditing?: boolean;
  onEditChange?: (isEditing: boolean) => void;
  onRefresh?: () => void;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Không hoạt động",
    DONE: "Hoàn thành",
    IN_PROGRESS: "Đang thực hiện",
    ALERT: "Cảnh báo",
  };
  return labels[status] || status;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "text-green-600",
    INACTIVE: "text-gray-600",
    DONE: "text-blue-600",
    IN_PROGRESS: "text-yellow-600",
    ALERT: "text-red-600",
  };
  return colors[status] || "text-gray-600";
}

function getFrequencyLabel(frequency: string): string {
  const labels: Record<string, string> = {
    DAILY: "Hàng ngày",
    hàng_ngày: "Hàng ngày",
    WEEKLY: "Hàng tuần",
    hàng_tuần: "Hàng tuần",
    MONTHLY: "Hàng tháng",
    hàng_tháng: "Hàng tháng",
  };
  return labels[frequency] || frequency;
}

export default function TaskDetailCard({
  schedule,
  onClose,
  isEditing: parentIsEditing = false,
  onEditChange,
  onRefresh,
}: TaskDetailCardProps) {
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const [areas, setAreas] = useState<any[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState(
    schedule
      ? {
          name: schedule.name || "",
          areaId: schedule.areaId?.id || schedule.areaId?._id || "",
          scheduledDate: new Date(schedule.scheduledDate)
            .toISOString()
            .split("T")[0],
          startTime: schedule.startTime || "",
          endTime: schedule.endTime || "",
          frequency: schedule.frequency || "",
        }
      : {
          name: "",
          areaId: "",
          scheduledDate: "",
          startTime: "",
          endTime: "",
          frequency: "",
        },
  );

  console.log(formData);

  // Sync formData when schedule changes
  useEffect(() => {
    if (schedule) {
      setFormData({
        name: schedule.name || "",
        areaId: schedule.areaId?.id || schedule.areaId?._id || "",
        scheduledDate: new Date(schedule.scheduledDate)
          .toISOString()
          .split("T")[0],
        startTime: schedule.startTime || "",
        endTime: schedule.endTime || "",
        frequency: schedule.frequency || "",
      });
    }
  }, [schedule]);

  const isEditing = parentIsEditing || localIsEditing;

  // Fetch areas when component mounts or when entering edit mode
  useEffect(() => {
    if (isEditing && areas.length === 0) {
      fetchAreas();
    }
  }, [isEditing]);

  const fetchAreas = async () => {
    try {
      setIsLoadingAreas(true);
      const response = await areaApi.getAll({ page: 1, limit: 100 });
      setAreas(response.data || []);
    } catch (error) {
      console.error("Lỗi khi fetch danh sách khu vực:", error);
      toast.error("Không thể tải danh sách khu vực");
    } finally {
      setIsLoadingAreas(false);
    }
  };

  const handleEditClick = () => {
    const newEditState = !isEditing;
    setLocalIsEditing(newEditState);
    onEditChange?.(newEditState);
  };

  const handleCancel = () => {
    setLocalIsEditing(false);
    onEditChange?.(false);
  };

  const handleDelete = async () => {
    if (!schedule?.id) return;

    try {
      setIsSubmitting(true);
      await scheduleApi.delete(schedule.id);
      toast.success("Đã xóa lịch trình thành công");
      setIsDeleteModalOpen(false);
      // Chỉ đóng panel, không reload
      onClose?.();
    } catch (error) {
      console.error("Lỗi khi xóa lịch trình:", error);
      toast.error("Không thể xóa lịch trình");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.areaId || !formData.scheduledDate) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: formData.name,
        areaId: formData.areaId,
        scheduledDate: formData.scheduledDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        frequency: formData.frequency,
      };

      await scheduleApi.update(schedule.id, payload);

      toast.success("Cập nhật lịch trình thành công");
      handleCancel();

      // Refresh cả lịch và chi tiết
      onRefresh?.();
    } catch (error: any) {
      console.error("Lỗi khi cập nhật lịch trình:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Cập nhật lịch trình thất bại";
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!schedule) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
        <div className="py-8 text-gray-500">
          <p className="text-sm">Chọn một lịch trình từ calendar</p>
          <p className="text-xs mt-1">để xem chi tiết</p>
        </div>
      </div>
    );
  }

  const scheduledDate = new Date(schedule.scheduledDate);
  const formattedDate = scheduledDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Chỉnh sửa lịch trình
            </h3>
            <p className="text-xs text-gray-500">Cập nhật thông tin</p>
          </div>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Tên lịch trình */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tên lịch trình
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isSubmitting}
              placeholder="Nhập tên lịch trình"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
            />
          </div>

          {/* Ngày & Khu vực */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ngày thực hiện
              </label>
              <input
                type="date"
                value={formData.scheduledDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Khu vực
              </label>
              <select
                value={formData.areaId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, areaId: e.target.value })
                }
                disabled={isLoadingAreas || isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
              >
                <option value="">
                  {isLoadingAreas ? "Đang tải..." : "Chọn khu vực"}
                </option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bắt đầu
              </label>
              <input
                type="time"
                value={formData.startTime || ""}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Kết thúc
              </label>
              <input
                type="time"
                value={formData.endTime || ""}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Tần suất */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Tần suất
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "DAILY", label: "Hàng ngày" },
                { value: "WEEKLY", label: "Hàng tuần" },
                { value: "MONTHLY", label: "Hàng tháng" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, frequency: option.value })
                  }
                  disabled={isSubmitting}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50 ${
                    formData.frequency === option.value
                      ? "bg-blue-100 text-blue-600 border border-blue-300"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isSubmitting}
              className="px-3 py-2 border border-red-300 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
              title="Xóa lịch trình"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Chi tiết lịch trình
          </h3>
          <p className="text-xs text-gray-500">Thông tin đầy đủ</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <Pencil size={14} />
            Chỉnh sửa
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-1 text-sm text-red-600 hover:underline disabled:opacity-50"
            disabled={isSubmitting}
            title="Xóa lịch trình"
          >
            <Trash2 size={14} />
            Xóa
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 text-sm">
        {/* Schedule Name */}
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-blue-500 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Tên lịch trình</div>
            <div className="font-semibold text-gray-900">{schedule.name}</div>
          </div>
        </div>

        {/* Area */}
        <div className="flex items-start gap-3">
          <MapPin size={16} className="text-orange-500 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Khu vực</div>
            <div className="font-semibold text-gray-900">
              {schedule.areaId?.name || "N/A"}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-start gap-3">
          <Calendar size={16} className="text-gray-400 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Ngày thực hiện</div>
            <div className="font-medium text-gray-900">{formattedDate}</div>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock size={16} className="text-gray-400 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Thời gian</div>
            <div className="font-medium text-gray-900">
              {schedule.startTime} – {schedule.endTime}
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-purple-500 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Tần suất</div>
            <div className="font-medium text-gray-900">
              {getFrequencyLabel(schedule.frequency || "")}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Trạng thái</span>
            <span
              className={`text-xs font-semibold ${getStatusColor(schedule.status)}`}
            >
              {getStatusLabel(schedule.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        taskName={schedule.name}
        isDeleting={isSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}

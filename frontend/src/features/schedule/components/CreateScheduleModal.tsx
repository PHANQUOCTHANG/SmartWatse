import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { areaApi } from "@/features/area/api/areaApi";
import { scheduleApi } from "@/features/schedule/api/scheduleApi";
import { toast } from "sonner";
import {
  RecurrenceFrequency,
  getFrequencyLabel,
} from "../utils/recurringHelper";
import { ScheduleFormValues } from "@/features/schedule/schemas/schedule.schema";

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onRefresh?: () => void;
}

interface CreateScheduleFormData {
  name: string;
  areaId: string; // Changed from district to areaId
  scheduledDate: string; // This is correct
  startTime: string;
  endTime: string;
  frequency: RecurrenceFrequency;
}

export default function CreateScheduleModal({
  isOpen,
  onClose,
  onSuccess,
  onRefresh,
}: CreateScheduleModalProps) {
  const [formData, setFormData] = useState<CreateScheduleFormData>({
    name: "",
    areaId: "",
    scheduledDate: new Date().toISOString().substring(0, 10),
    startTime: "08:00",
    endTime: "09:00",
    frequency: "hàng_ngày",
  });

  const [areas, setAreas] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateScheduleFormData>>({});

  // Lấy danh sách khu vực khi mở Modal
  useEffect(() => {
    if (isOpen) {
      const fetchAreas = async () => {
        try {
          setIsLoadingAreas(true);
          const response = await areaApi.getAll({ page: 1, limit: 100 });
          setAreas(Array.isArray(response.data) ? response.data : []);
        } catch {
          toast.error("Không thể tải danh sách khu vực");
          setAreas([]);
        } finally {
          setIsLoadingAreas(false);
        }
      };
      fetchAreas();
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateScheduleFormData> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Vui lòng nhập tên lịch trình";
    }
    if (!formData.areaId) {
      newErrors.areaId = "Vui lòng chọn khu vực";
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Vui lòng chọn ngày bắt đầu";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Vui lòng chọn giờ bắt đầu";
    }
    if (!formData.endTime) {
      newErrors.endTime = "Vui lòng chọn giờ kết thúc";
    }
    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = "Giờ kết thúc phải sau giờ bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Gọi API tạo lịch
      await scheduleApi.create({
        name: formData.name,
        areaId: formData.areaId,
        scheduledDate: formData.scheduledDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        frequency: formData.frequency,
      } as ScheduleFormValues);

      toast.success("Tạo lịch thu gom thành công!");

      // Reset form
      setFormData({
        name: "",
        areaId: "",
        scheduledDate: new Date().toISOString().substring(0, 10),
        startTime: "08:00",
        endTime: "09:00",
        frequency: "hàng_ngày",
      });
      setErrors({});

      onClose();
      onRefresh?.();
      onSuccess?.();
    } catch (error) {
      toast.error("Lỗi tạo lịch trình");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a222d] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e7eb] dark:border-[#2a3441] sticky top-0 bg-white dark:bg-[#1a222d] z-10">
          <h2 className="text-xl font-bold text-[#111418] dark:text-white">
            Tạo lịch thu gom
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#2a3441] rounded-lg transition-colors"
          >
            <X size={20} className="text-[#60728a]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tên lịch trình */}
          <div>
            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
              Tên lịch trình <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ví dụ: Thu gom rác hữu cơ"
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0f1419] border border-[#e5e7eb] dark:border-[#2a3441] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[#111418] dark:text-white placeholder-[#94a3b8]"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Khu vực */}
          <div>
            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
              Khu vực <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.areaId}
              onChange={(e) =>
                setFormData({ ...formData, areaId: e.target.value })
              }
              disabled={isLoadingAreas}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0f1419] border border-[#e5e7eb] dark:border-[#2a3441] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[#111418] dark:text-white disabled:opacity-50"
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
            {errors.areaId && (
              <p className="text-red-500 text-xs mt-1">{errors.areaId}</p>
            )}
          </div>

          {/* Ngày bắt đầu */}
          <div>
            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white dark:bg-[#0f1419] border border-[#e5e7eb] dark:border-[#2a3441] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[#111418] dark:text-white"
            />
            {errors.scheduledDate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.scheduledDate}
              </p>
            )}
          </div>

          {/* Giờ bắt đầu và kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                Giờ bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white dark:bg-[#0f1419] border border-[#e5e7eb] dark:border-[#2a3441] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[#111418] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111418] dark:text-white mb-2">
                Giờ kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white dark:bg-[#0f1419] border border-[#e5e7eb] dark:border-[#2a3441] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[#111418] dark:text-white"
              />
            </div>
          </div>
          {errors.startTime && (
            <p className="text-red-500 text-xs">{errors.startTime}</p>
          )}
          {errors.endTime && (
            <p className="text-red-500 text-xs">{errors.endTime}</p>
          )}

          {/* Kiểu lặp */}
          <div>
            <label className="block text-sm font-medium text-[#111418] dark:text-white mb-3">
              Kiểu lặp <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  "hàng_ngày",
                  "hàng_tuần",
                  "hàng_tháng",
                ] as RecurrenceFrequency[]
              ).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: freq })}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formData.frequency === freq
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-[#2a3441] text-[#60728a] dark:text-[#94a3b8] hover:bg-gray-200 dark:hover:bg-[#3a4451]"
                  }`}
                >
                  {getFrequencyLabel(freq)}
                </button>
              ))}
            </div>

            {/* Mô tả kiểu lặp */}
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-900 dark:text-blue-200 font-medium">
                {formData.frequency === "hàng_ngày" &&
                  "📅 Lịch sẽ lặp mỗi ngày từ ngày bắt đầu"}
                {formData.frequency === "hàng_tuần" &&
                  `📅 Lịch sẽ lặp vào mỗi ${["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"][new Date(formData.scheduledDate).getDay()]}`}
                {formData.frequency === "hàng_tháng" &&
                  `📅 Lịch sẽ lặp vào ngày ${new Date(formData.scheduledDate).getDate()} hàng tháng`}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#e5e7eb] dark:border-[#2a3441]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-[#2a3441] text-[#111418] dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-[#3a4451] transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingAreas}
              className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo lịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

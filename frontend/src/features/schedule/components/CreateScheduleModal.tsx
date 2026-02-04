import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { areaApi } from "@/features/area/api/areaApi";
import { scheduleApi } from "@/features/schedule/api/scheduleApi";
import { toast } from "sonner";

// Enum chuẩn để đồng bộ với Backend
enum ScheduleFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onRefresh?: () => void;
}

export default function CreateScheduleModal({
  isOpen,
  onClose,
  onSuccess,
  onRefresh,
}: CreateScheduleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    areaId: "", // Lưu trữ ID (ObjectId), không phải tên
    scheduledDate: "",
    startTime: "08:00",
    endTime: "17:00",
    frequency: ScheduleFrequency.DAILY,
  });

  const [areas, setAreas] = useState<any[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy danh sách khu vực khi mở Modal
  useEffect(() => {
    if (isOpen) {
      const fetchAreas = async () => {
        try {
          setIsLoadingAreas(true);
          const response = await areaApi.getAll({ page: 1, limit: 100 });
          // Đảm bảo response.data là mảng
          setAreas(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          toast.error("Không thể tải danh sách khu vực");
        } finally {
          setIsLoadingAreas(false);
        }
      };
      fetchAreas();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra dữ liệu bắt buộc
    if (!formData.name || !formData.areaId || !formData.scheduledDate) {
      toast.error("Vui lòng nhập tên, ngày và chọn khu vực");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        // Đảm bảo gửi ISO String để Backend lưu vào kiểu Date
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
      };

      console.log("📤 Payload sent to API:", payload);

      await scheduleApi.create(payload);

      toast.success("Đã tạo lịch trình thu gom");
      onRefresh?.();
      onSuccess?.(); // Gọi hàm load lại dữ liệu ở trang Lịch
      handleClose();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi lưu dữ liệu";
      toast.error(`❌ ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      areaId: "",
      scheduledDate: "",
      startTime: "08:00",
      endTime: "17:00",
      frequency: ScheduleFrequency.DAILY,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">
            Thêm lịch trình mới
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-200 rounded-full transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên lịch trình */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Tên lịch trình
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Thu gom rác Phường 1"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ngày thực hiện */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Khu vực - Đây là phần FIX LỖI areaId */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Khu vực
              </label>
              <select
                required
                value={formData.areaId}
                onChange={(e) =>
                  setFormData({ ...formData, areaId: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">
                  {isLoadingAreas ? "Đang tải..." : "Chọn khu vực"}
                </option>
                {areas.map(
                  (area) => (
                    console.log(area),
                    (
                      // QUAN TRỌNG: value={area._id} để gửi ID về server thay vì gửi tên
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    )
                  ),
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Giờ bắt đầu */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            {/* Giờ kết thúc */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Giờ kết thúc
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Tần suất */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Tần suất lặp lại
            </label>
            <div className="flex gap-2">
              {[
                { v: ScheduleFrequency.DAILY, l: "Hàng ngày" },
                { v: ScheduleFrequency.WEEKLY, l: "Hàng tuần" },
                { v: ScheduleFrequency.MONTHLY, l: "Hàng tháng" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: opt.v })}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${
                    formData.frequency === opt.v
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          {/* Nút bấm */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu lịch trình"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

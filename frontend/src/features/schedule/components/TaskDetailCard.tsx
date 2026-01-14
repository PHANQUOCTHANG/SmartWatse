import { Pencil, Clock, User, Route } from "lucide-react";

export default function TaskDetailCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Chi tiết nhiệm vụ
          </h3>
          <p className="text-xs text-gray-500">
            Thông tin tuyến & phân công
          </p>
        </div>

        <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
          <Pencil size={14} />
          Chỉnh sửa
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 text-sm">
        {/* Route */}
        <div className="flex items-start gap-3">
          <Route size={16} className="text-gray-400 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Tuyến</div>
            <div className="font-medium text-gray-900">
              Route A – Sáng
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <Clock size={16} className="text-gray-400 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Thời gian</div>
            <div className="font-medium text-gray-900">
              09:30 – 11:30
            </div>
          </div>
        </div>

        {/* Staff */}
        <div className="flex items-start gap-3">
          <User size={16} className="text-gray-400 mt-0.5" />
          <div>
            <div className="text-xs text-gray-500">Nhân viên</div>
            <div className="font-medium text-gray-900">
              Trần Văn B
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">
              Tiến độ thu gom
            </span>
            <span className="text-xs font-medium text-gray-600">
              45%
            </span>
          </div>

          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-yellow-400 transition-all"
              style={{ width: "45%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

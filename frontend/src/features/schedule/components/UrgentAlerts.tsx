import { AlertTriangle, Navigation } from "lucide-react";

export default function UrgentAlerts() {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} className="text-red-600" />
        <h3 className="text-sm font-semibold text-red-700">
          CẦN XỬ LÝ NGAY
        </h3>
      </div>

      {/* Alert item */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">
              Thùng #102 – Quá tải
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              Đường Nguyễn Trãi
            </div>
          </div>

          <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
            98%
          </span>
        </div>

        <button
          className="
            mt-3 w-full
            flex items-center justify-center gap-2
            text-sm font-medium
            rounded-lg
            bg-red-600
            text-white
            hover:bg-red-700
            transition
            h-9
          "
        >
          <Navigation size={14} />
          Điều phối xe ngay
        </button>
      </div>
    </div>
  );
}

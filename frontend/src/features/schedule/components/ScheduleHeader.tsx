import { Plus, Filter } from "lucide-react";

export default function ScheduleHeader() {
  return (
    <div className="flex items-center justify-between">
      {/* LEFT */}
      <div>
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Lịch trình &amp; Phân công
        </h1>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-500">
          Quản lý lịch trình thu gom rác thải theo thời gian thực
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* Filter */}
        <button
          className="
            h-10 px-4
            flex items-center gap-2
            text-sm font-medium
            rounded-lg
            border border-gray-200
            bg-white
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >
          <Filter size={16} />
          Bộ lọc
        </button>

        {/* Create */}
        <button
          className="
            h-10 px-4
            flex items-center gap-2
            text-sm font-medium
            rounded-lg
            bg-blue-600
            text-white
            hover:bg-blue-700
            transition
            shadow-sm
          "
        >
          <Plus size={16} />
          Tạo Lịch Mới
        </button>
      </div>
    </div>
  );
}

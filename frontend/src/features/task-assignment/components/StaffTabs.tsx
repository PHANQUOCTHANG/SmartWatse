import { useState } from "react"
import StaffCard from "./StaffCard"

const StaffTabs = () => {
  const [tab, setTab] = useState<"ready" | "busy">("ready")

  return (
    <div className="bg-white rounded-xl border p-4 h-full flex flex-col">

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setTab("ready")}
          className={`flex-1 py-1.5 text-sm rounded-lg border transition
            ${
              tab === "ready"
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "text-gray-500 hover:bg-gray-50"
            }`}
        >
          Sẵn sàng (8)
        </button>

        <button
          onClick={() => setTab("busy")}
          className={`flex-1 py-1.5 text-sm rounded-lg border transition
            ${
              tab === "busy"
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "text-gray-500 hover:bg-gray-50"
            }`}
        >
          Đang bận (12)
        </button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Tìm nhân viên hoặc xe..."
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* List */}
      <div className="space-y-2 overflow-y-auto pr-1">
        {tab === "ready" && (
          <>
            <StaffCard
              name="Trần Minh Tuấn"
              role="Nhân viên thu gom"
              vehicle="Xe tải nhỏ (500kg)"
              status="Trống 100%"
            />
            <StaffCard
              name="Lê Văn Hùng"
              role="Tài xế xe ép rác"
              vehicle="Xe ép rác (5 tấn)"
              status="Trống 80%"
            />
          </>
        )}

        {tab === "busy" && (
          <StaffCard
            name="Nguyễn Thị Mai"
            role="Nhân viên thu gom"
            vehicle="—"
            status="Đang bận"
          />
        )}
      </div>
    </div>
  )
}

export default StaffTabs

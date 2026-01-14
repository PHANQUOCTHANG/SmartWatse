import { useState } from "react"
import SummaryCard from "../components/SummaryCard"
import TaskCard from "../components/TaskCard"
import StaffTabs from "../components/StaffTabs"
import TaskFilterBar from "../components/TaskFilterBar"
import TaskPagination from "../components/TaskPagination"

const ITEMS_PER_PAGE = 3

const TaskAssignmentPage = () => {
  const [page, setPage] = useState(1)

  // ===== Mock task data (sau này thay bằng API) =====
  const tasks = [
    {
      priority: "high" as const,
      code: "TSK-2024-892",
      title: "Rác quá tải tại Thùng #B12",
      address: "123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1",
      time: "25 phút trước",
      tags: ["Dung lượng: 98%", "Loại: Rác hữu cơ"],
    },
    {
      priority: "medium" as const,
      code: "TSK-2024-890",
      title: "Phản ánh: Rác đổ bừa bãi",
      address: "Ngõ 88 Lê Văn Lương, Quận 3",
      time: "1 giờ trước",
      tags: ["Nguồn: Công dân báo cáo", "Hình ảnh đính kèm"],
    },
    {
      priority: "low" as const,
      code: "TSK-2024-885",
      title: "Thu gom rác tái chế Khu A",
      address: "Khu dân cư Him Lam, Quận 7",
      time: "2 giờ trước",
      tags: ["Loại: Tái chế"],
    },
    {
      priority: "high" as const,
      code: "TSK-2024-883",
      title: "Rác tồn đọng khu chợ",
      address: "Chợ Tân Bình",
      time: "3 giờ trước",
      tags: ["Ưu tiên cao"],
    },
  ]

  // ===== Pagination logic =====
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)

  const paginatedTasks = tasks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Phân công nhiệm vụ
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý và điều phối hoạt động thu gom rác theo thời gian thực
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-lg bg-white text-sm hover:bg-gray-50">
            🗺️ Xem bản đồ
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
            + Tạo nhiệm vụ thủ công
          </button>
        </div>
      </div>

      {/* ===== Summary ===== */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="NHIỆM VỤ CHỜ"
          value="14"
          subtitle="+2 mới · 4 ưu tiên cao"
          percent={70}
          color="red"
          icon={<span className="text-xl">❗</span>}
        />
        <SummaryCard
          title="NHÂN VIÊN SẴN SÀNG"
          value="8 / 24"
          subtitle="Đủ nhân lực cho khu vực 1"
          percent={33}
          color="green"
          icon={<span className="text-xl">👤</span>}
        />
        <SummaryCard
          title="XE ĐANG HOẠT ĐỘNG"
          value="16"
          subtitle="3 xe đang bảo trì"
          percent={80}
          color="blue"
          icon={<span className="text-xl">🚚</span>}
        />
      </div>

      {/* ===== Main content ===== */}
      <div className="grid grid-cols-12 gap-6">
        {/* ===== Filter (task side only) ===== */}
        <div className="col-span-8">
          <TaskFilterBar />
        </div>

        {/* ===== Staff header ===== */}
        <div className="col-span-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Nhân lực sẵn sàng
          </h3>
          <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            🔄 Làm mới
          </button>
        </div>

        {/* ===== Task list + pagination ===== */}
        <div className="col-span-8 flex flex-col">
          <div className="space-y-4">
            {paginatedTasks.map((task) => (
              <TaskCard
                key={task.code}
                priority={task.priority}
                code={task.code}
                title={task.title}
                address={task.address}
                time={task.time}
                tags={task.tags}
              />
            ))}
          </div>

          <TaskPagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>

        {/* ===== Staff panel ===== */}
        <div className="col-span-4">
          <StaffTabs />
        </div>
      </div>
    </div>
  )
}

export default TaskAssignmentPage

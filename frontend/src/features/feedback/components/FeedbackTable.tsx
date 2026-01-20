import { useState } from "react"
import { Eye, Pencil } from "lucide-react"
import FeedbackStatusBadge from "./FeedbackStatusBadge"
import Pagination from "./Pagination"
import { mockFeedbacks } from "../data/mockFeedbacks"

const PAGE_SIZE = 5

const FeedbackTable = () => {
  const [page, setPage] = useState(1)

  const total = mockFeedbacks.length
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const startIndex = (page - 1) * PAGE_SIZE
  const currentData = mockFeedbacks.slice(
    startIndex,
    startIndex + PAGE_SIZE
  )

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-[#F3FAF6] text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-5 py-3 text-left">Mã ID</th>
            <th className="px-5 py-3 text-left">Người gửi</th>
            <th className="px-5 py-3 text-left">Vấn đề</th>
            <th className="px-5 py-3 text-left">Khu vực</th>
            <th className="px-5 py-3 text-left">Trạng thái</th>
            <th className="px-5 py-3 text-left">Phụ trách</th>
            <th className="px-5 py-3 text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item) => (
            <tr
              key={item.id}
              className="border-t border-gray-100 hover:bg-gray-50"
            >
              {/* ID */}
              <td className="px-5 py-4 font-medium">
                #{item.id}
              </td>

              {/* Sender */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                    {item.sender.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.sender}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.time}
                    </div>
                  </div>
                </div>
              </td>

              {/* Issue */}
              <td className="px-5 py-4">
                {item.issue}
              </td>

              {/* Area */}
              <td className="px-5 py-4 text-green-600">
                {item.area}
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <FeedbackStatusBadge status={item.status} />
              </td>

              {/* Assignee */}
              <td className="px-5 py-4 text-gray-400 italic">
                {item.assignee ?? "-- Chưa gán --"}
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex justify-center gap-3">
                  <button
                    className="text-green-500 hover:text-green-600"
                    title="Xem chi tiết"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    title="Chỉnh sửa"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer / Pagination */}
      <div className="px-5 py-4 flex justify-between items-center text-sm text-gray-500">
        <span>
          Hiển thị {startIndex + 1}–
          {Math.min(startIndex + PAGE_SIZE, total)} trong số {total} phản hồi
        </span>

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  )
}

export default FeedbackTable

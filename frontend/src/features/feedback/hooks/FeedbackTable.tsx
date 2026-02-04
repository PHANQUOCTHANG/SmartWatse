import React from "react";
import { AlertCircle, Eye } from "lucide-react";
import { IFeedback } from "../types";
import FeedbackStatusBadge from "../components/FeedbackStatusBadge";
import Pagination from "../components/Pagination";
import { formatDate, truncateText } from "../utils/validation";

interface FeedbackTableProps {
  data: IFeedback[];
  isLoading?: boolean;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onView?: (id: string) => void;
  onEdit?: (feedback: IFeedback) => void;
  onDelete?: (id: string) => void;
}

export const FeedbackTable: React.FC<FeedbackTableProps> = ({
  data,
  isLoading = false,
  page = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 font-medium">Không có phản ánh nào</p>
        <p className="text-gray-500 text-sm">
          Hãy thêm phản ánh mới hoặc thay đổi bộ lọc
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
              Thứ tự
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
              Tên người phản ánh
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
              Khu vực
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
              Mã thùng
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
              Nội dung
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
              Ngày tạo
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
              Hành động
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((feedback, index) => (
            <tr
              key={feedback._id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {/* Order */}
              <td className="px-6 py-4 text-gray-600">
                {(page - 1) * pageSize + index + 1}
              </td>

              {/* Citizen Name */}
              <td className="px-6 py-4">
                <span className="text-gray-600">
                  {feedback.citizenId?.fullName || "-"}
                </span>
              </td>

              {/* Area */}
              <td className="px-6 py-4">
                <span className="text-gray-600">
                  {feedback.areaId?.name || "-"}
                </span>
              </td>

              {/* Bin ID */}
              <td className="px-6 py-4">
                <span className="text-gray-600">
                  {feedback.binId?.code || "-"}
                </span>
              </td>

              {/* Description */}
              <td className="px-6 py-4">
                <div className="max-w-xs">
                  <p className="text-gray-900 font-medium">
                    {truncateText(feedback.description, 50)}
                  </p>
                  {feedback.imageUrl && (
                    <span className="text-xs text-blue-600 inline-flex gap-1 mt-1">
                      📎 Có hình ảnh
                    </span>
                  )}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <FeedbackStatusBadge status={feedback.status} />
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 text-gray-600">
                {formatDate(feedback.createdAt)}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => onView?.(feedback.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition"
                    title="Xem chi tiết"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
        <span>
          Hiển thị {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, totalItems)} trong số {totalItems} phản ánh
        </span>

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default FeedbackTable;

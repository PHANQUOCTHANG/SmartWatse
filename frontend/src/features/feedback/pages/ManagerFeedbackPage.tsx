import { Download, Plus } from "lucide-react"
import FeedbackFilters from "../components/FeedbackFilters"
import FeedbackSummary from "../components/FeedbackSummary"
import FeedbackTable from "../components/FeedbackTable"

const ManagerFeedbackPage = () => {
  return (
    <div className="bg-[#F7FBF9] min-h-screen">

      {/* Content wrapper */}
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">
              Phản hồi từ người dân
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Theo dõi, phân loại và xử lý các báo cáo vi phạm, sự cố rác thải.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="
                flex items-center gap-2
                px-4 py-2
                bg-white
                border border-gray-200
                rounded-lg
                text-sm
                hover:bg-gray-50
              "
            >
              <Download size={16} />
              Xuất báo cáo
            </button>

            <button
              className="
                flex items-center gap-2
                px-4 py-2
                bg-green-500
                text-white
                rounded-lg
                text-sm
                hover:bg-green-600
              "
            >
              <Plus size={16} />
              Tạo phản ánh mới
            </button>
          </div>
        </div>

        {/* Summary */}
        <FeedbackSummary />

        {/* Filters */}
        <FeedbackFilters />

        {/* Table */}
        <FeedbackTable />
      </div>
    </div>
  )
}

export default ManagerFeedbackPage

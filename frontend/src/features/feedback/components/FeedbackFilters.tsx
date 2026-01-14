import { Search, SlidersHorizontal } from "lucide-react"

const FeedbackFilters = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
      <div className="flex flex-wrap items-end gap-4">

        {/* Search */}
        <div className="flex-1 min-w-[260px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="
                w-full pl-10 pr-3 py-2.5
                border border-gray-200
                rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500
              "
              placeholder="Tìm kiếm theo mã số, người dân, vấn đề..."
            />
          </div>
        </div>

        {/* Status */}
        <div className="min-w-[160px]">
          <label className="block text-sm text-gray-500 mb-1">
            Trạng thái
          </label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5">
            <option>Tất cả</option>
            <option>Chờ xử lý</option>
            <option>Đang xử lý</option>
            <option>Hoàn thành</option>
          </select>
        </div>

        {/* Area */}
        <div className="min-w-[160px]">
          <label className="block text-sm text-gray-500 mb-1">
            Khu vực
          </label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5">
            <option>Tất cả</option>
            <option>Quận 1</option>
            <option>Quận 3</option>
          </select>
        </div>

        {/* Filter button */}
        <button
          className="
            h-[42px] w-[42px]
            flex items-center justify-center
            border border-gray-200
            rounded-lg
            hover:bg-gray-50
          "
          title="Bộ lọc nâng cao"
        >
          <SlidersHorizontal size={18} />
        </button>

      </div>
    </div>
  )
}

export default FeedbackFilters

const TaskFilterBar = () => {
  return (
    <div className="flex items-center justify-between mb-1">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900">
        Danh sách nhiệm vụ chờ xử lý
      </h2>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {/* Area filter */}
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white text-sm text-gray-700 hover:bg-gray-50">
          Tất cả khu vực
          <span className="text-gray-400">▾</span>
        </button>

        {/* Advanced filter icon */}
        <button
          className="w-10 h-10 border rounded-lg bg-white flex items-center justify-center hover:bg-gray-50"
          title="Bộ lọc nâng cao"
        >
          <span className="text-gray-600 text-lg">≡</span>
        </button>
      </div>
    </div>
  )
}

export default TaskFilterBar

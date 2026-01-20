type Props = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const TaskPagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-end gap-4 mt-4 text-sm text-gray-600">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 rounded border bg-white hover:bg-gray-50
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Trước
      </button>

      <span className="select-none">
        Trang <b className="text-gray-900">{page}</b> / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 rounded border bg-white hover:bg-gray-50
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Sau →
      </button>
    </div>
  )
}

export default TaskPagination

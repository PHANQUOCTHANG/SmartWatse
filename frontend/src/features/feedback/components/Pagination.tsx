type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const Pagination = ({
  page,
  totalPages,
  onChange,
}: PaginationProps) => {
  const pages = []

  if (page > 2) pages.push(1)
  if (page > 3) pages.push("...")

  for (let p = page - 1; p <= page + 1; p++) {
    if (p > 0 && p <= totalPages) pages.push(p)
  }

  if (page < totalPages - 2) pages.push("...")
  if (page < totalPages - 1) pages.push(totalPages)

  return (
    <div className="flex items-center gap-1">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border disabled:opacity-40"
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={i}
            className="px-2 text-gray-400 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-sm ${
              p === page
                ? "bg-green-500 text-white"
                : "border hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg border disabled:opacity-40"
      >
        ›
      </button>
    </div>
  )
}

export default Pagination

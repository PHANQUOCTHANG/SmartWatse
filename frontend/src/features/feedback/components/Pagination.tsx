import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange?: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={!canGoPrev}
        onClick={() => canGoPrev && onChange?.(page - 1)}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-lg transition"
        title="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange?.(p as number)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
              p === page
                ? "bg-blue-600 text-white"
                : "border border-gray-200 hover:bg-gray-100 text-gray-700"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        disabled={!canGoNext}
        onClick={() => canGoNext && onChange?.(page + 1)}
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-lg transition"
        title="Trang sau"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;

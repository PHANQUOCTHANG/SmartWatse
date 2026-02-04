type Props = {
  id?: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  code: string;
  title: string;
  address: string;
  time: string;
  tags: string[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const statusMap = {
  PENDING: {
    border: "border-red-500",
    badge: "bg-red-100 text-red-600",
    icon: "⌛",
    label: "CHỜ XỬ LÝ",
  },
  IN_PROGRESS: {
    border: "border-blue-500",
    badge: "bg-blue-100 text-blue-600",
    icon: "⚙️",
    label: "ĐANG THỰC HIỆN",
  },
  DONE: {
    border: "border-green-500",
    badge: "bg-green-100 text-green-600",
    icon: "✅",
    label: "HOÀN THÀNH",
  },
};

const TaskCard = ({
  id,
  status,
  code,
  title,
  address,
  time,
  tags,
  onEdit,
  onDelete,
}: Props) => {
  const s = statusMap[status];

  return (
    <div
      className={`relative bg-white rounded-xl border ${s.border} border-l-4 p-4 flex justify-between gap-4`}
    >
      {/* Left */}
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.badge}`}
        >
          {s.icon}
        </div>

        {/* Content */}
        <div>
          {/* Badge + code + time */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${s.badge}`}
            >
              {s.label}
            </span>
            {/* <span className="text-xs text-gray-400">
              #{code}
            </span> */}
            <span className="text-xs text-gray-400 flex items-center gap-1">
              🕒 {time}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900">{title}</h3>

          <p className="text-sm text-gray-500 mt-0.5">📍 {address}</p>

          {/* Tags */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex flex-col items-end justify-center gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(id || "")}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
          >
            ✏️ Sửa
          </button>
          <button
            onClick={() => onDelete?.(id || "")}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg flex items-center gap-1"
          >
            🗑️ Xóa
          </button>
        </div>

        {/* drag handle */}
        <div className="text-gray-300 cursor-grab text-lg">⋮⋮</div>
      </div>
    </div>
  );
};

export default TaskCard;

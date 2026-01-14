type Props = {
  priority: "high" | "medium" | "low"
  code: string
  title: string
  address: string
  time: string
  tags: string[]
}

const priorityMap = {
  high: {
    border: "border-red-500",
    badge: "bg-red-100 text-red-600",
    icon: "❌",
    label: "ƯU TIÊN CAO",
  },
  medium: {
    border: "border-yellow-400",
    badge: "bg-yellow-100 text-yellow-700",
    icon: "⚠️",
    label: "TRUNG BÌNH",
  },
  low: {
    border: "border-green-500",
    badge: "bg-green-100 text-green-600",
    icon: "♻️",
    label: "ĐỊNH KỲ",
  },
}

const TaskCard = ({
  priority,
  code,
  title,
  address,
  time,
  tags,
}: Props) => {
  const p = priorityMap[priority]

  return (
    <div
      className={`relative bg-white rounded-xl border ${p.border} border-l-4 p-4 flex justify-between gap-4`}
    >
      {/* Left */}
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${p.badge}`}
        >
          {p.icon}
        </div>

        {/* Content */}
        <div>
          {/* Badge + code + time */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${p.badge}`}
            >
              {p.label}
            </span>
            <span className="text-xs text-gray-400">
              #{code}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              🕒 {time}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>

          <p className="text-sm text-gray-500 mt-0.5">
            📍 {address}
          </p>

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
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1">
          Phân công →
        </button>

        {/* drag handle */}
        <div className="text-gray-300 cursor-grab text-lg">
          ⋮⋮
        </div>
      </div>
    </div>
  )
}

export default TaskCard

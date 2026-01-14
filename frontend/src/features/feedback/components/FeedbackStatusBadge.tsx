const statusStyleMap = {
  pending: {
    wrapper: "bg-red-50 text-red-600",
    dot: "bg-red-500",
    label: "Chờ xử lý",
  },
  processing: {
    wrapper: "bg-yellow-50 text-yellow-600",
    dot: "bg-yellow-500",
    label: "Đang xử lý",
  },
  done: {
    wrapper: "bg-green-50 text-green-600",
    dot: "bg-green-500",
    label: "Hoàn thành",
  },
}

const FeedbackStatusBadge = ({
  status,
}: {
  status: "pending" | "processing" | "done"
}) => {
  const style = statusStyleMap[status]

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-3 py-1
        rounded-full
        text-xs font-medium
        ${style.wrapper}
      `}
    >
      <span
        className={`w-2 h-2 rounded-full ${style.dot}`}
      />
      {style.label}
    </span>
  )
}

export default FeedbackStatusBadge

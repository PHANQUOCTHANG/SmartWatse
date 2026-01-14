type Props = {
  title: string
  value: string
  subtitle: string
  percent: number // % cho progress bar
  color: "red" | "green" | "blue"
  icon?: React.ReactNode
}

const colorMap = {
  red: {
    text: "text-red-600",
    bg: "bg-red-100",
    bar: "bg-red-500",
  },
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
    bar: "bg-green-500",
  },
  blue: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    bar: "bg-blue-500",
  },
}

const SummaryCard = ({
  title,
  value,
  subtitle,
  percent,
  color,
  icon,
}: Props) => {
  const styles = colorMap[color]

  return (
    <div className="bg-white p-5 rounded-xl border relative overflow-hidden">
      {/* Icon mờ góc phải */}
      {icon && (
        <div
          className={`absolute top-4 right-4 p-3 rounded-lg ${styles.bg} opacity-70`}
        >
          {icon}
        </div>
      )}

      {/* Nội dung */}
      <p className="text-sm text-gray-500">{title}</p>

      <div className="flex items-end gap-2 mt-1">
        <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
      </div>

      <p className={`text-sm mt-1 ${styles.text}`}>{subtitle}</p>

      {/* Progress bar */}
      <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${styles.bar} rounded-full transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default SummaryCard

type Props = {
  name: string
  role: string
  vehicle: string
  status: "Trống 100%" | "Trống 80%" | "Sắp đầy" | "Đang bận"
}

const statusColorMap = {
  "Trống 100%": "text-green-600",
  "Trống 80%": "text-green-500",
  "Sắp đầy": "text-orange-500",
  "Đang bận": "text-gray-400",
}

const StaffCard = ({ name, role, vehicle, status }: Props) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border bg-white hover:bg-gray-50 transition">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            {name.charAt(0)}
          </div>
          {/* online dot */}
          {status !== "Đang bận" && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-medium text-sm text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>

          {/* Vehicle pill */}
          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600">
            🚚 {vehicle}
          </div>
        </div>
      </div>

      {/* Status */}
      <span
        className={`text-xs font-medium ${statusColorMap[status]}`}
      >
        {status}
      </span>
    </div>
  )
}

export default StaffCard

import { AlertTriangle, Loader2, CheckCircle } from "lucide-react"

type CardProps = {
  title: string
  value: number
  icon: React.ReactNode
  bgColor: string
}

const Card = ({ title, value, icon, bgColor }: CardProps) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h2 className="text-3xl font-semibold text-gray-900">
        {value}
      </h2>
    </div>

    <div
      className={`
        w-12 h-12
        rounded-full
        flex items-center justify-center
        ${bgColor}
      `}
    >
      {icon}
    </div>
  </div>
)

const FeedbackSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card
        title="Chờ xử lý"
        value={12}
        bgColor="bg-red-100 text-red-500"
        icon={<AlertTriangle size={22} />}
      />

      <Card
        title="Đang xử lý"
        value={5}
        bgColor="bg-yellow-100 text-yellow-500"
        icon={<Loader2 size={22} />}
      />

      <Card
        title="Đã hoàn thành"
        value={45}
        bgColor="bg-green-100 text-green-500"
        icon={<CheckCircle size={22} />}
      />
    </div>
  )
}

export default FeedbackSummary

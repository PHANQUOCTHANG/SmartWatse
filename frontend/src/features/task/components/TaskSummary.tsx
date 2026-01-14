import clsx from "clsx";

interface TaskSummaryProps {
  stats?: {
    total: number;
    completed: number;
    urgent: number;
  };
}

export default function TaskSummary({ stats }: TaskSummaryProps) {
  // Nếu stats bị undefined, dùng giá trị mặc định để không bị lỗi "reading total"
  const data = stats || {
    total: 12,
    completed: 4,
    urgent: 1
  };

  const summaries = [
    { 
      label: "Tổng nhiệm vụ", 
      value: data.total, 
      icon: "assignment", 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Đã hoàn thành", 
      value: data.completed, 
      icon: "check_circle", 
      color: "text-green-600", 
      bg: "bg-green-50" 
    },
    { 
      label: "Cần xử lý gấp", 
      value: data.urgent, 
      icon: "warning", 
      color: "text-red-600", 
      bg: "bg-red-50", 
      border: "border-r-4 border-red-500" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {summaries.map((item, index) => (
        <div 
          key={index} 
          className={clsx(
            "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between",
            item.border
          )}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
               <span className={clsx("material-symbols-outlined", item.color)}>
                 {item.icon}
               </span>
               <span className="text-sm">{item.label}</span>
            </div>
            <div className="text-3xl font-black text-gray-900">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
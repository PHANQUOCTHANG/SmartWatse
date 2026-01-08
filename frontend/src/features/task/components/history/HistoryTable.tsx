import { TaskHistoryItem } from "../../types/task-history.type";
import clsx from "clsx";

export default function HistoryTable({ items }: { items: TaskHistoryItem[] }) {
  return (
    <div className="bg-white border border-[#dbe6df] rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="bg-[#f0f4f2] text-[#111813] border-b border-[#dbe6df]">
            <tr>
              <th className="px-6 py-4 font-semibold">Mã Nhiệm Vụ</th>
              <th className="px-6 py-4 font-semibold">Thời Gian</th>
              <th className="px-6 py-4 font-semibold">Khu Vực</th>
              <th className="px-6 py-4 font-semibold">Tiến Độ Thu Gom</th>
              <th className="px-6 py-4 font-semibold">Tổng Khối Lượng</th>
              <th className="px-6 py-4 font-semibold">Trạng Thái</th>
              <th className="px-6 py-4 font-semibold text-right">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dbe6df]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-mono font-medium text-[#111813]">{item.id}</td>
                <td className="px-6 py-4 text-[#61896f]">
                  <div className="flex flex-col">
                    <span className="text-[#111813] font-medium">{item.date}</span>
                    <span className="text-xs">{item.timeRange}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#111813] font-medium">{item.area}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={clsx(
                          "h-2 rounded-full",
                          item.status === 'Hoàn thành' ? "bg-primary" : 
                          item.status === 'Cảnh báo đầy' ? "bg-yellow-400" : "bg-red-500"
                        )} 
                        style={{ width: `${(item.progress.current / item.progress.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className={clsx(
                      "text-xs font-bold",
                      item.status === 'Hoàn thành' ? "text-primary" : 
                      item.status === 'Cảnh báo đầy' ? "text-yellow-600" : "text-red-600"
                    )}>
                      {item.progress.current}/{item.progress.total}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#111813] font-bold">{item.weight}</td>
                <td className="px-6 py-4">
                  <span className={clsx(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
                    item.status === 'Hoàn thành' && "bg-primary/20 text-green-700",
                    item.status === 'Cảnh báo đầy' && "bg-yellow-100 text-yellow-700",
                    item.status === 'Sự cố xe' && "bg-red-100 text-red-700"
                  )}>
                    <span className={clsx(
                      "size-1.5 rounded-full",
                      item.status === 'Hoàn thành' && "bg-green-700",
                      item.status === 'Cảnh báo đầy' && "bg-yellow-500",
                      item.status === 'Sự cố xe' && "bg-red-500"
                    )}></span>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#61896f] hover:text-primary p-2 rounded-full hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

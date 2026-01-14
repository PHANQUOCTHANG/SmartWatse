import { TaskHistoryStats } from "../../types/task-history.type";

export default function HistoryStats({ stats }: { stats: TaskHistoryStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Nhiệm vụ tháng này */}
      <div className="flex flex-col gap-1 rounded-xl p-6 border border-[#dbe6df] bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[#61896f] text-sm font-medium">Nhiệm vụ tháng này</p>
          <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-[20px]">assignment_turned_in</span>
        </div>
        <p className="text-[#111813] tracking-tight text-3xl font-bold mt-2">{stats.monthlyTasks}</p>
        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          +{stats.taskDiff} so với tháng trước
        </p>
      </div>

      {/* Tổng rác thu gom */}
      <div className="flex flex-col gap-1 rounded-xl p-6 border border-[#dbe6df] bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[#61896f] text-sm font-medium">Tổng rác thu gom</p>
          <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-[20px]">delete</span>
        </div>
        <p className="text-[#111813] tracking-tight text-3xl font-bold mt-2">{stats.totalWeight}</p>
        <p className="text-xs text-[#61896f] mt-1">Trung bình {stats.avgWeightPerDay}/ngày</p>
      </div>

      {/* Thời gian TB/Tuyến */}
      <div className="flex flex-col gap-1 rounded-xl p-6 border border-[#dbe6df] bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[#61896f] text-sm font-medium">Thời gian TB/Tuyến</p>
          <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-[20px]">timer</span>
        </div>
        <p className="text-[#111813] tracking-tight text-3xl font-bold mt-2">{stats.avgTimePerRoute}</p>
        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
          <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
          Nhanh hơn {stats.timeDiff}
        </p>
      </div>
    </div>
  );
}
import { TaskBin } from "../../types/task-detail.type";

type Props = {
  totalBins: number;
  completedBins: number;
};

export default function TaskDetailHeader({ totalBins, completedBins }: Props) {
  const progress = Math.round((completedBins / totalBins) * 100);

  return (
    <div className="p-6 pb-2 shrink-0 bg-white dark:bg-[#111418]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Quận 1 - Khu vực 4</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dự kiến: 2 giờ • <span className="text-primary font-semibold">Đang thực hiện</span>
          </p>
        </div>
        <button className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between text-sm font-bold">
          <span>Tiến độ thu gom</span>
          <span className="text-primary">{completedBins}/{totalBins} Thùng</span>
        </div>
        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
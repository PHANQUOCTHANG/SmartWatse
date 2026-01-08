import TaskBinCard from "./TaskBinCard";
import TaskActionPanel from "./TaskActionPanel";
import { TaskBin } from "@/features/task/types/task-detail.type";

type Props = {
  bins: TaskBin[];
  activeBinId?: string;
  onSelectBin: (bin: TaskBin) => void;
};

export default function TaskBinList({
  bins,
  activeBinId,
  onSelectBin,
}: Props) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {bins.map((bin) => {
        const active = bin.id === activeBinId;

        return (
          <TaskBinCard
            key={bin.id}
            bin={bin}
            active={active}
            onToggle={() => onSelectBin(bin)}
          >
            {active && <TaskActionPanel bin={bin} />}
          </TaskBinCard>
        );
      })}
    </div>
  );
}

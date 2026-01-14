import TaskCard from "./TaskCard";
import { Task } from "../types/task.type";

type Props = {
  tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center text-gray-500">
        Không có nhiệm vụ phù hợp
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

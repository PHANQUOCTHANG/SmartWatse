type Props = {
  progress: {
    collected: number;
    total: number;
  };
};

export default function TaskProgress({ progress }: Props) {
  const percent = Math.round(
    (progress.collected / progress.total) * 100
  );

  return (
    <div className="px-6 pb-4">
      <div className="flex justify-between text-sm font-medium mb-2">
        <span>Tiến độ thu gom</span>
        <span className="text-primary">
          {progress.collected}/{progress.total} Thùng
        </span>
      </div>

      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function DrawerProgress() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">Mức độ đầy</p>
        <span className="text-sm font-semibold text-red-600">95%</span>
      </div>

      <div className="h-2 w-full rounded bg-slate-200">
        <div className="h-2 w-[95%] rounded bg-red-500" />
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Cập nhật: 5 phút trước
      </p>
    </div>
  );
}

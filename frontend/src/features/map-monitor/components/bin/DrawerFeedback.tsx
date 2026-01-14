export default function DrawerFeedback() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Phản ánh từ dân</h4>
        <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-600">
          Mới
        </span>
      </div>

      <div className="rounded-lg border bg-red-50 p-3 text-sm">
        <div className="flex justify-between mb-1">
          <p className="font-medium text-red-700">Ticket #559</p>
          <span className="text-xs text-slate-400">10:30 AM</span>
        </div>
        <p className="text-slate-600">
          “Mùi hôi thối nồng nặc bốc ra từ thùng rác làm ảnh hưởng người đi đường.”
        </p>

        <button className="mt-3 text-sm font-medium text-red-600 hover:underline">
          Xử lý ngay
        </button>
      </div>
    </div>
  );
}

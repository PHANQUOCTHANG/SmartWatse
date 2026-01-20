export default function DrawerHeader() {
  return (
    <div className="flex items-start justify-between border-b px-5 py-4">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">#VN-1024</p>
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
            QUÁ TẢI
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          123 Đường Nguyễn Huệ, Quận 1
        </p>
      </div>

      <button className="text-slate-400 hover:text-slate-600">✕</button>
    </div>
  );
}

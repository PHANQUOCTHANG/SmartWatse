export default function DrawerActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className="flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium hover:bg-slate-50">
        🚚 Điều phối xe
      </button>
      <button className="flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium hover:bg-slate-50">
        📹 Xem camera
      </button>
    </div>
  );
}

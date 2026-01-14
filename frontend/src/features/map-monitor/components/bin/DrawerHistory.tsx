export default function DrawerHistory() {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">Lịch sử gần đây</h4>

      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2 text-red-600">
          🔴 Hôm nay, 08:00 – Cảnh báo mức đầy &gt; 90%
        </li>
        <li className="flex items-center gap-2 text-green-600">
          🟢 Hôm qua, 14:30 – Đã thu gom (Đội B)
        </li>
      </ul>
    </div>
  );
}

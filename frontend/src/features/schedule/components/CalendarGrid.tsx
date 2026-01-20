import clsx from "clsx";

export default function CalendarGrid() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => (
          <div key={d} className="py-2.5 text-center text-[11px] font-bold text-gray-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 bg-gray-100 gap-[1px]">
        {days.map(day => (
          <div key={day} className="bg-white min-h-[110px] p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
            <span className={clsx("text-sm font-bold", day === 24 ? "text-primary" : "text-gray-900")}>{day}</span>
            {day === 24 && <span className="ml-2 text-[8px] bg-primary text-white px-1 py-0.5 rounded font-bold">Hôm nay</span>}
            <div className="mt-2 space-y-1">
              {day % 2 === 0 && <div className="h-1.5 rounded-full bg-green-500 w-full" />}
              {day % 3 === 0 && <div className="h-1.5 rounded-full bg-blue-500 w-2/3" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
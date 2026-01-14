const filters = [
  { label: "Tất cả", color: "bg-slate-100 text-slate-700" },
  { label: "Trống", color: "bg-green-100 text-green-700" },
  { label: "Sắp đầy", color: "bg-yellow-100 text-yellow-700" },
  { label: "Quá tải (5)", color: "bg-red-100 text-red-700" },
];

export default function MapFilterBar() {
  return (
    <div className="absolute left-6 top-4 z-10 flex gap-2 rounded-xl bg-white p-2 shadow">
      {filters.map((f) => (
        <button
          key={f.label}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium ${f.color}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

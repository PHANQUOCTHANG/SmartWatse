export default function UpcomingBanner() {
  return (
    <div className="mx-6 my-6 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
      <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
        Sắp tới
      </span>

      <h2 className="text-3xl font-bold mt-3">
        17:00 – 18:30
      </h2>

      <p className="mt-1 flex items-center gap-2">
        <span className="material-symbols-outlined">
          recycling
        </span>
        Thu gom rác hữu cơ
      </p>

      <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-xl">
        🚛 Xe đang đến (~15 phút nữa)
      </div>
    </div>
  );
}

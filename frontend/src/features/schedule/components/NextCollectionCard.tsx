export default function NextCollectionCard() {
  return (
    <div className="bg-gradient-to-r from-primary to-[#4ba1f5] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="relative z-10 flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase backdrop-blur-sm">Sắp tới</span>
            <span className="text-white/80 text-sm">Hôm nay, 24/10/2023</span>
          </div>
          <h3 className="text-4xl font-black">17:00 - 18:30</h3>
          <p className="text-lg font-medium flex items-center gap-2">
            <span className="material-symbols-outlined">compost</span> Thu gom Rác Hữu Cơ
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center min-w-[150px]">
          <p className="text-[10px] text-white/70 font-bold uppercase mb-1">Trạng thái xe</p>
          <p className="text-2xl font-black">Đang đến</p>
          <p className="text-xs text-white/80 mt-1">~15 phút nữa</p>
        </div>
      </div>
    </div>
  );
}
import clsx from "clsx";

interface TaskFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TaskFilter({ 
  searchQuery, 
  onSearchChange, 
  activeTab, 
  onTabChange 
}: TaskFilterProps) {
  const tabs = ["Tất cả", "Chưa hoàn thành", "Ưu tiên cao", "Đã xong"];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
      {/* Ô tìm kiếm */}
      <div className="flex-1 w-full relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
          search
        </span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm khu vực hoặc mã nhiệm vụ..." 
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all"
        />
      </div>

      {/* Các Tab bộ lọc */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto w-full md:w-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={clsx(
              "px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
              activeTab === tab 
                ? "bg-black text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-100/50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
import clsx from "clsx";

export default function CitizenHomePage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* LEFT SIDE - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* STATS CARDS - 3 COLUMNS */}

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                icon="done_all"
                label="Chu kỳ hoàn thành"
                value="18/24"
                color="text-green-600"
              />
              <StatCard
                icon="schedule"
                label="Sắp tới tuần này"
                value="5"
                color="text-blue-600"
              />
              <StatCard
                icon="warning"
                label="Lịch cập nhật"
                value="3"
                color="text-orange-600"
              />
            </div>

            {/* QUICK STATS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                <span className="material-symbols-outlined text-primary text-2xl">
                  trending_up
                </span>
                Thống kê hôm nay
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStat
                  label="Rác tái chế"
                  value="2"
                  unit="lần"
                  icon="recycling"
                />
                <QuickStat
                  label="Rác hữu cơ"
                  value="1"
                  unit="lần"
                  icon="compost"
                />
                <QuickStat
                  label="Điểm thưởng"
                  value="150"
                  unit="pts"
                  icon="stars"
                />
                <QuickStat
                  label="Xếp hạng"
                  value="Top 15%"
                  unit="khu vực"
                  icon="leaderboard"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                Công cụ nhanh
              </h3>
              <div className="space-y-3">
                <QuickActionButton
                  icon="calendar_month"
                  label="Xem lịch đầy đủ"
                  href="/citizen/schedule"
                />
                <QuickActionButton
                  icon="report_problem"
                  label="Báo cáo vấn đề"
                  href="/citizen/report"
                />
                <QuickActionButton
                  icon="question_answer"
                  label="Hỏi đáp"
                  href="/citizen/help"
                />
                <QuickActionButton
                  icon="download"
                  label="Tải lịch về máy"
                  href="#"
                  variant="secondary"
                />
              </div>
            </div>

            {/* RECENT NOTIFICATIONS */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    notifications
                  </span>
                  Thông báo mới
                </h3>
                <a
                  href="/citizen/notifications"
                  className="text-primary text-xs font-bold hover:underline"
                >
                  Xem tất cả
                </a>
              </div>
              <div className="space-y-3">
                <NotificationItem
                  type="success"
                  title="Thu gom hoàn thành"
                  desc="Lúc 17:45 hôm qua"
                  time="1 giờ trước"
                />
                <NotificationItem
                  type="info"
                  title="Lịch cập nhật"
                  desc="Tháng 11 đã có sẵn"
                  time="5 giờ trước"
                />
                <NotificationItem
                  type="warning"
                  title="Nhắc nhở lịch thu"
                  desc="Rác tái chế - 26/10 08:00"
                  time="Hôm qua"
                />
              </div>
            </div>

            {/* ACCOUNT STATUS */}
            <div className="bg-gradient-to-br from-blue-50 to-primary/5 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    verified_user
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Tài khoản
                  </p>
                  <p className="font-bold text-gray-900">Đã xác thực</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Tài khoản của bạn đã được xác thực. Bạn có thể sử dụng đầy đủ
                các tính năng.
              </p>
              <button className="w-full py-2 px-4 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 transition">
                Quản lý hồ sơ
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - SCHEDULE PREVIEW */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                calendar_month
              </span>
              Lịch tuần tới
            </h3>
            <a
              href="/citizen/schedule"
              className="text-primary text-sm font-bold hover:underline"
            >
              Xem tháng
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              "25/10\nT4",
              "26/10\nT5",
              "27/10\nT6",
              "28/10\nT7",
              "29/10\nCN",
              "30/10\nT2",
              "31/10\nT3",
            ].map((day, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-3 text-center hover:border-primary hover:bg-primary/5 transition cursor-pointer group"
              >
                <p className="text-xs font-bold text-gray-600 whitespace-pre-line group-hover:text-primary">
                  {day}
                </p>
                <div className="mt-2 space-y-1">
                  {idx % 2 === 0 && (
                    <div className="h-1 rounded-full bg-green-500 mx-auto w-3/4" />
                  )}
                  {idx % 3 === 0 && (
                    <div className="h-1 rounded-full bg-blue-500 mx-auto w-2/4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={clsx(
            "material-symbols-outlined text-3xl mb-2 p-2 rounded-xl bg-opacity-10",
            color.includes("green") && "bg-green-100",
            color.includes("blue") && "bg-blue-100",
            color.includes("orange") && "bg-orange-100",
            color
          )}
        >
          {icon}
        </div>
      </div>
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-3xl font-black text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function QuickStat({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  icon: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 text-center hover:shadow-md hover:border-primary/30 transition-all duration-200 group">
      <span className="material-symbols-outlined text-2xl text-primary mx-auto block mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide mt-1">
        {unit}
      </p>
      <p className="text-xs text-gray-600 font-medium mt-2">{label}</p>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
  href,
  variant = "primary",
}: {
  icon: string;
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <a
      href={href}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 group",
        variant === "primary"
          ? "bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-md border border-primary/20"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent hover:border-gray-300"
      )}
    >
      <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span>{label}</span>
    </a>
  );
}

function NotificationItem({
  type,
  title,
  desc,
  time,
}: {
  type: "success" | "info" | "warning";
  title: string;
  desc: string;
  time: string;
}) {
  const bgColor = {
    success: "bg-green-50",
    info: "bg-blue-50",
    warning: "bg-orange-50",
  };

  const borderColor = {
    success: "border-l-green-500",
    info: "border-l-blue-500",
    warning: "border-l-orange-500",
  };

  const iconColor = {
    success: "text-green-600",
    info: "text-blue-600",
    warning: "text-orange-600",
  };

  const icons = {
    success: "check_circle",
    info: "info",
    warning: "warning",
  };

  return (
    <div
      className={clsx(
        "border-l-4 rounded-lg p-3 flex gap-3",
        bgColor[type],
        borderColor[type]
      )}
    >
      <span
        className={clsx(
          "material-symbols-outlined text-lg mt-0.5 shrink-0",
          iconColor[type]
        )}
      >
        {icons[type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 line-clamp-1">{title}</p>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{desc}</p>
        <p className="text-[10px] text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

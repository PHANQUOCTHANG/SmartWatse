type Tab = "ALL" | "REMINDER" | "STATUS" | "EXCEPTION" | "ALERT" | "FEEDBACK";

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export default function NotificationTabs({ active, onChange }: Props) {
  const tabs: Tab[] = [
    "ALL",
    "REMINDER",
    "STATUS",
    "EXCEPTION",
    "ALERT",
    "FEEDBACK",
  ];

  return (
    <div className="flex gap-4 border-b px-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-3 text-sm font-medium transition ${
            active === tab
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab === "ALL" ? "Tất cả" : tab}
        </button>
      ))}
    </div>
  );
}

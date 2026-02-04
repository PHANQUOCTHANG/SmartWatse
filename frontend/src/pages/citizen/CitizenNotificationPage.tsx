import { useState, useMemo } from "react";
import UpcomingBanner from "@/features/notification/components/UpcomingBanner";
import NotificationTabs from "@/features/notification/components/NotificationTabs";
import NotificationList from "@/features/notification/components/NotificationList";
import { useCitizenNotifications } from "@/features/notification/hooks/useCitizenNotifications";

type Tab =
  | "ALL"
  | "REMINDER"
  | "STATUS"
  | "EXCEPTION"
  | "ALERT"
  | "FEEDBACK";

export default function CitizenNotificationPage() {
  const { notifications } = useCitizenNotifications();
  const [tab, setTab] = useState<Tab>("ALL");

  const filtered = useMemo(() => {
    if (tab === "ALL") return notifications;
    return notifications.filter((n) => n.type === tab);
  }, [tab, notifications]);

  return (
    <div className="bg-gray-50 min-h-full">
      <UpcomingBanner />
      <NotificationTabs active={tab} onChange={setTab} />
      <NotificationList notifications={filtered} />
    </div>
  );
}

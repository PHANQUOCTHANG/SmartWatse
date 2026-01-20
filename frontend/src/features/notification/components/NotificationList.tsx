import NotificationCard from "./NotificationCard";
import { CitizenNotification } from "../types/notification.type";

export default function NotificationList({
  notifications,
}: {
  notifications: CitizenNotification[];
}) {
  return (
    <div className="space-y-3 px-6 py-4">
      {notifications.map((n) => (
        <NotificationCard key={n.id} notification={n} />
      ))}
    </div>
  );
}

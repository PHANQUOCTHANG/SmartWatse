import clsx from "clsx";
import { CitizenNotification } from "../types/notification.type";

const ICON_MAP = {
  REMINDER: "notifications",
  STATUS: "local_shipping",
  EXCEPTION: "schedule",
  ALERT: "warning",
  FEEDBACK: "mark_email_read",
};

const COLOR_MAP = {
  REMINDER: "text-blue-600 bg-blue-50",
  STATUS: "text-green-600 bg-green-50",
  EXCEPTION: "text-orange-600 bg-orange-50",
  ALERT: "text-red-600 bg-red-50",
  FEEDBACK: "text-purple-600 bg-purple-50",
};

export default function NotificationCard({
  notification,
}: {
  notification: CitizenNotification;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-xl border bg-white hover:bg-gray-50 transition">
      <div
        className={clsx(
          "size-10 rounded-full flex items-center justify-center",
          COLOR_MAP[notification.type]
        )}
      >
        <span className="material-symbols-outlined">
          {ICON_MAP[notification.type]}
        </span>
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-sm">
          {notification.title}
        </h4>
        <p className="text-sm text-gray-600">
          {notification.message}
        </p>
        <span className="text-xs text-gray-400">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

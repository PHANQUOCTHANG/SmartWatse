export type NotificationType =
  | "REMINDER"
  | "STATUS"
  | "EXCEPTION"
  | "ALERT"
  | "FEEDBACK";

export interface CitizenNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO string
  read?: boolean;
}

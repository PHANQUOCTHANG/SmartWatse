import React from "react";
import { FeedbackStatus } from "../types";
import { getStatusBadgeColor, getStatusBadgeLabel } from "../utils/validation";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface FeedbackStatusBadgeProps {
  status: FeedbackStatus;
  className?: string;
}

const statusIcons: Record<FeedbackStatus, React.ReactNode> = {
  [FeedbackStatus.NEW]: <AlertCircle className="w-4 h-4" />,
  [FeedbackStatus.PROCESSING]: <Clock className="w-4 h-4" />,
  [FeedbackStatus.RESOLVED]: <CheckCircle className="w-4 h-4" />,
};

export const FeedbackStatusBadge: React.FC<FeedbackStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)} ${className}`}
    >
      {statusIcons[status]}
      {getStatusBadgeLabel(status)}
    </span>
  );
};

export default FeedbackStatusBadge;

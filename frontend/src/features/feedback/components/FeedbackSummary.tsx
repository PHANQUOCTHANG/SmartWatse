import React from "react";
import { AlertCircle, Clock, CheckCircle, BarChart3 } from "lucide-react";
import { FeedbackStats } from "../types";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between hover:shadow-md transition">
    <div>
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>

    <div
      className={`w-14 h-14 rounded-lg flex items-center justify-center ${bgColor} ${textColor}`}
    >
      {icon}
    </div>
  </div>
);

export const FeedbackSummary: React.FC<any> = ({
  feedbacks = [],
  isLoading = false,
}) => {
  const stats: FeedbackStats = {
    total: feedbacks.length || 0,
    new: feedbacks.filter((feedback) => feedback.status === "NEW").length || 0,
    processing:
      feedbacks.filter((feedback) => feedback.status === "PROCESSING").length ||
      0,
    resolved:
      feedbacks.filter((feedback) => feedback.status === "RESOLVED").length ||
      0,
    completionRate: 0,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Tổng phản ánh"
        value={stats.total}
        icon={<BarChart3 size={24} />}
        bgColor="bg-blue-100"
        textColor="text-blue-600"
      />

      <StatCard
        title="Mới"
        value={stats.new}
        icon={<AlertCircle size={24} />}
        bgColor="bg-red-100"
        textColor="text-red-600"
      />

      <StatCard
        title="Đang xử lý"
        value={stats.processing}
        icon={<Clock size={24} />}
        bgColor="bg-yellow-100"
        textColor="text-yellow-600"
      />

      <StatCard
        title="Đã giải quyết"
        value={stats.resolved}
        icon={<CheckCircle size={24} />}
        bgColor="bg-green-100"
        textColor="text-green-600"
      />
    </div>
  );
};

export default FeedbackSummary;

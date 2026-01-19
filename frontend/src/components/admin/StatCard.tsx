import React from "react";

interface Props {
  title: string;
  value: string;
  delta?: string;
  color?: string; // background utility class
  accent?: string; // accent text class
  icon?: React.ReactNode;
}

const StatCard: React.FC<Props> = ({
  title,
  value,
  delta,
  color = "bg-white",
  accent = "text-gray-900",
  icon,
}) => {
  return (
    <div
      className={`rounded-lg shadow p-4 ${color} hover:shadow-md transition-shadow`}
      role="region"
      aria-label={title}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-md bg-white/30 text-gray-700">
              {icon}
            </div>
          )}
          <div>
            <div className={`text-sm font-medium ${accent}`}>{title}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
          </div>
        </div>

        {delta && <div className="text-sm text-gray-500">{delta}</div>}
      </div>
    </div>
  );
};

export default StatCard;

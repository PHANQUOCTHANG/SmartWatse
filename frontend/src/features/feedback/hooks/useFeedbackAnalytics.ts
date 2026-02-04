import { useMemo } from "react";
import { IFeedback, FeedbackStatus } from "../types";

export const useFeedbackAnalytics = (feedbacks: IFeedback[]) => {
  return useMemo(() => {
    const stats = {
      total: feedbacks.length,
      new: feedbacks.filter((f) => f.status === FeedbackStatus.NEW).length,
      processing: feedbacks.filter(
        (f) => f.status === FeedbackStatus.PROCESSING,
      ).length,
      resolved: feedbacks.filter((f) => f.status === FeedbackStatus.RESOLVED)
        .length,
    };

    const completionRate =
      stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

    return {
      ...stats,
      completionRate,
      percentages: {
        new: stats.total > 0 ? Math.round((stats.new / stats.total) * 100) : 0,
        processing:
          stats.total > 0
            ? Math.round((stats.processing / stats.total) * 100)
            : 0,
        resolved:
          stats.total > 0
            ? Math.round((stats.resolved / stats.total) * 100)
            : 0,
      },
    };
  }, [feedbacks]);
};

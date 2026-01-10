export type FeedbackStatus = "pending" | "processing" | "done"

export interface Feedback {
  id: string
  sender: string
  time: string
  issue: string
  area: string
  status: FeedbackStatus
  assignee?: string
}

export const mockFeedbacks: Feedback[] = Array.from({ length: 62 }).map(
  (_, index) => {
    const statuses: FeedbackStatus[] = ["pending", "processing", "done"]

    return {
      id: `RP-${8200 + index}`,
      sender: `Người dân ${index + 1}`,
      time: "08:30 - Hôm nay",
      issue: "Thùng rác bị đổ vỡ",
      area: "Ngã tư Hàng Xanh, BT",
      status: statuses[index % 3],
      assignee: index % 4 === 0 ? "Nguyễn Văn A" : undefined,
    }
  }
)

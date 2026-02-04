/**
 * Utility functions để xử lý recurring schedules
 */

export type RecurrenceFrequency = "hàng_ngày" | "hàng_tuần" | "hàng_tháng";

export interface RecurringRule {
  frequency: RecurrenceFrequency;
  startDate: string; // YYYY-MM-DD
  dayOfWeek?: number; // 0-6 (Chủ Nhật - Thứ Bảy) cho WEEKLY
  dayOfMonth?: number; // 1-31 cho MONTHLY
}

/**
 * Kiểm tra xem một ngày có phải là ngày lặp lại hay không
 * @param currentDate - Ngày cần kiểm tra (YYYY-MM-DD)
 * @param rule - Quy tắc lặp
 * @returns true nếu currentDate phù hợp với rule
 */
export function matchesRecurringRule(
  currentDate: string,
  rule: RecurringRule,
): boolean {
  const current = new Date(currentDate);
  const startDate = new Date(rule.startDate);

  // Ngày bắt đầu phải <= ngày hiện tại
  if (startDate > current) return false;

  switch (rule.frequency) {
    case "hàng_ngày":
      return true; // Mỗi ngày

    case "hàng_tuần": {
      // Lặp theo thứ trong tuần của ngày bắt đầu
      const targetDayOfWeek = rule.dayOfWeek ?? startDate.getDay();
      return current.getDay() === targetDayOfWeek;
    }

    case "hàng_tháng": {
      // Lặp theo ngày trong tháng của ngày bắt đầu
      const targetDayOfMonth = rule.dayOfMonth ?? startDate.getDate();
      return current.getDate() === targetDayOfMonth;
    }

    default:
      return false;
  }
}

/**
 * Lấy danh sách các ngày trong khoảng thời gian phù hợp với quy tắc lặp
 * @param startDateStr - Ngày bắt đầu khoảng (YYYY-MM-DD)
 * @param endDateStr - Ngày kết thúc khoảng (YYYY-MM-DD)
 * @param rule - Quy tắc lặp
 * @returns Mảng các ngày phù hợp
 */
export function getMatchingDatesInRange(
  startDateStr: string,
  endDateStr: string,
  rule: RecurringRule,
): string[] {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const ruleStartDate = new Date(rule.startDate);
  const matchingDates: string[] = [];

  // Đảm bảo startDate <= endDate
  const iterateStart = startDate <= ruleStartDate ? ruleStartDate : startDate;

  for (
    let current = new Date(iterateStart);
    current <= endDate;
    current.setDate(current.getDate() + 1)
  ) {
    const dateStr = current.toISOString().substring(0, 10);
    if (matchesRecurringRule(dateStr, rule)) {
      matchingDates.push(dateStr);
    }
  }

  return matchingDates;
}

/**
 * Tạo RecurringRule từ ngày bắt đầu và frequency
 */
export function createRecurringRule(
  startDate: string,
  frequency: RecurrenceFrequency,
): RecurringRule {
  const date = new Date(startDate);
  return {
    frequency,
    startDate,
    dayOfWeek: date.getDay(),
    dayOfMonth: date.getDate(),
  };
}

/**
 * Hiển thị tên frequency thân thiện
 */
export function getFrequencyLabel(frequency: RecurrenceFrequency): string {
  const labels: Record<RecurrenceFrequency, string> = {
    hàng_ngày: "Hàng ngày",
    hàng_tuần: "Hàng tuần",
    hàng_tháng: "Hàng tháng",
  };
  return labels[frequency];
}

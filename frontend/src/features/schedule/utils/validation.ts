// Validation schema cho schedule
export interface CreateScheduleInput {
  name: string;
  district: string;
  date: string;
  startTime: string;
  endTime: string;
  frequency: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Validate tên lịch trình
const validateName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "Vui lòng nhập tên lịch trình";
  }
  if (name.length < 3) {
    return "Tên lịch trình phải ít nhất 3 ký tự";
  }
  if (name.length > 100) {
    return "Tên lịch trình không được vượt quá 100 ký tự";
  }
  return null;
};

// Validate khu vực
const validateDistrict = (district: string): string | null => {
  if (!district || district.trim().length === 0) {
    return "Vui lòng chọn khu vực";
  }
  return null;
};

// Validate ngày
const validateDate = (date: string): string | null => {
  if (!date) {
    return "Vui lòng chọn ngày thực hiện";
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return "Ngày thực hiện không thể là ngày trong quá khứ";
  }
  return null;
};

// Validate giờ bắt đầu
const validateStartTime = (startTime: string): string | null => {
  if (!startTime) {
    return "Vui lòng chọn giờ bắt đầu";
  }
  const [hours, minutes] = startTime.split(":").map(Number);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return "Giờ bắt đầu không hợp lệ";
  }
  return null;
};

// Validate giờ kết thúc
const validateEndTime = (endTime: string, startTime: string): string | null => {
  if (!endTime) {
    return "Vui lòng chọn giờ kết thúc";
  }

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  if (endTotalMinutes <= startTotalMinutes) {
    return "Giờ kết thúc phải sau giờ bắt đầu";
  }

  const duration = endTotalMinutes - startTotalMinutes;
  if (duration < 60) {
    return "Thời gian thực hiện phải ít nhất 1 giờ";
  }
  if (duration > 12 * 60) {
    return "Thời gian thực hiện không được vượt quá 12 giờ";
  }

  return null;
};

// Validate tần suất
const validateFrequency = (frequency: string): string | null => {
  const validFrequencies = ["hàng_ngày", "hàng_tuần", "hàng_tháng"];
  if (!frequency || !validFrequencies.includes(frequency)) {
    return "Vui lòng chọn tần suất lặp lại";
  }
  return null;
};

// Main validation function
export const validateScheduleForm = (
  data: CreateScheduleInput,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate name
  const nameError = validateName(data.name);
  if (nameError) {
    errors.push({ field: "name", message: nameError });
  }

  // Validate district
  const districtError = validateDistrict(data.district);
  if (districtError) {
    errors.push({ field: "district", message: districtError });
  }

  // Validate date
  const dateError = validateDate(data.date);
  if (dateError) {
    errors.push({ field: "date", message: dateError });
  }

  // Validate start time
  const startTimeError = validateStartTime(data.startTime);
  if (startTimeError) {
    errors.push({ field: "startTime", message: startTimeError });
  }

  // Validate end time (depends on start time)
  const endTimeError = validateEndTime(data.endTime, data.startTime);
  if (endTimeError) {
    errors.push({ field: "endTime", message: endTimeError });
  }

  // Validate frequency
  const frequencyError = validateFrequency(data.frequency);
  if (frequencyError) {
    errors.push({ field: "frequency", message: frequencyError });
  }

  return errors;
};

// Hàm kiểm tra có lỗi hay không
export const hasErrors = (errors: ValidationError[]): boolean => {
  return errors.length > 0;
};

// Hàm lấy lỗi của field cụ thể
export const getFieldError = (
  errors: ValidationError[],
  field: string,
): string | null => {
  const error = errors.find((e) => e.field === field);
  return error ? error.message : null;
};

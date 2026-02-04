export const handleExportReport = () => {
  const reportData = [
    ["Chỉ số", "Giá trị"],
    ["Tổng số thùng rác", "1,240"],
    ["Cảnh báo quá tải", "15"],
    ["Phản ánh chờ xử lý", "8"],
    ["Xe đang hoạt động", "12/15"],
  ];

  const csvContent = reportData.map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "bao-cao-he-thong.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

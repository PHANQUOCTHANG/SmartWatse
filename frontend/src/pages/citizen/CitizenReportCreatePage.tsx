import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ISSUE_TYPES = [
  "Rác tràn thùng",
  "Mùi hôi thối",
  "Thùng hỏng/mất nắp",
  "Rác cồng kềnh",
];

export default function CitizenReportCreatePage() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log and navigate back to list. Replace with API call later.
    console.log({ selectedType, address, description, images });
    navigate("/citizen/report");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1100px] mx-auto flex gap-8">
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="text-xl font-bold mb-4">Gửi phản ánh mới</h2>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Loại vấn đề *
            </label>
            <div className="flex gap-2 flex-wrap">
              {ISSUE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    selectedType === t
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Vị trí sự cố *
            </label>
            <div className="mb-2 h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              Bản đồ (placeholder)
            </div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Đường..., Thành phố"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Hình ảnh minh chứng *
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-white"
            />

            <div className="mt-3 flex gap-3 flex-wrap">
              {images.map((f, idx) => (
                <div
                  key={idx}
                  className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center text-xs text-gray-500"
                >
                  {f.name}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Mô tả rõ hơn về sự cố, thời điểm, và các thông tin liên quan"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl"
            >
              Gửi phản ánh
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
            >
              Hủy
            </button>
          </div>
        </form>

        <aside className="w-[320px]">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="font-bold mb-3">Lịch sử phản ánh</h4>
            <p className="text-sm text-gray-500">
              Xem lại các phản ánh gần đây của bạn.
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                <div>
                  <div className="text-sm font-bold">Thùng hỏng nắp</div>
                  <div className="text-xs text-gray-400">15/05/2023</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                <div>
                  <div className="text-sm font-bold">Mùi hôi thối</div>
                  <div className="text-xs text-gray-400">02/11/2023</div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

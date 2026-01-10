import React from "react";

export default function StaffProfilePage() {
  return (
    <div className="p-4 sm:p-6" style={{ minHeight: "calc(100vh - 100px)" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <section className="lg:col-span-1 bg-gradient-to-b from-white to-indigo-50 rounded-lg border border-gray-100 p-6 shadow-md flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-white overflow-hidden ring-4 ring-indigo-100 shadow-lg -mt-8">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=staff-profile"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-3">
            <div className="text-xl font-extrabold">Nguyễn Văn A</div>
            <div className="text-sm text-gray-600">Nhân viên thu gom</div>
          </div>

          <div className="mt-4 w-full">
            <button className="w-full px-4 py-2 bg-primary text-white rounded-md shadow-sm">
              Chỉnh sửa hồ sơ
            </button>
          </div>

          <div className="mt-6 w-full grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500">Tổng nhiệm vụ</div>
              <div className="font-bold text-lg">124</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500">Đang xử lý</div>
              <div className="font-bold text-lg text-amber-700">3</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500">Đã hoàn thành</div>
              <div className="font-bold text-lg text-green-600">118</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500">Mã nhân viên</div>
              <div className="font-bold text-lg">SW-1234</div>
            </div>
          </div>
        </section>

        <section
          className="lg:col-span-2 bg-white rounded-lg border border-gray-100 p-6 shadow-md overflow-auto"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Hồ sơ & Liên hệ</h2>
              <p className="text-sm text-gray-500">
                Thông tin cá nhân và cài đặt thông báo.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-white border rounded">Hủy</button>
              <button className="px-3 py-2 bg-primary text-white rounded">
                Lưu thay đổi
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <div className="mt-2 p-3 bg-gray-50 rounded">nv@example.com</div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Số điện thoại</label>
              <div className="mt-2 p-3 bg-gray-50 rounded">0912 345 678</div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500">Địa chỉ</label>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                Hà Nội, Việt Nam
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Ngày vào làm</label>
              <div className="mt-2 p-3 bg-gray-50 rounded">01/01/2023</div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Ca làm</label>
              <div className="mt-2 p-3 bg-gray-50 rounded">Sáng</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Cài đặt & Thông báo</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <div className="text-sm font-medium">
                    Nhận thông báo nhiệm vụ
                  </div>
                  <div className="text-xs text-gray-500">
                    Nhận thông báo push khi có nhiệm vụ mới
                  </div>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <div className="text-sm font-medium">Chia sẻ vị trí</div>
                  <div className="text-xs text-gray-500">
                    Cho phép ứng dụng thu thập vị trí khi làm nhiệm vụ
                  </div>
                </div>
                <input type="checkbox" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

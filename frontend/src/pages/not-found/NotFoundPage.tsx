import React from 'react';
import { Home, Map, Globe, Mail, Share2 } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <div className="text-white text-xl font-bold">≋</div>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Smart Waste Management
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-blue-50 rounded-full flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg px-12 py-8">
                    <div className="text-8xl font-bold text-blue-600">404</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Rất tiếc, trang bạn tìm kiếm không tồn tại
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Có vẻ như đường dẫn đã bị hỏng hoặc trang đã bị di chuyển. 
            Hãy để chúng tôi đưa bạn trở lại lộ trình quản lý rác thải đúng cách.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              <Home size={20} />
              Quay lại trang chủ
            </button>
            <button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <Map size={20} />
              Xem bản đồ đô thị
            </button>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <div className="flex items-start justify-between">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Bạn cần hỗ trợ thêm?
                </h3>
                <p className="text-sm text-gray-600">
                  Nếu bạn tin rằng đây là lỗi hệ thống, vui lòng báo cáo cho chúng tôi.
                </p>
              </div>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 whitespace-nowrap ml-4">
                Báo cáo sự cố
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Chính sách bảo mật</a>
              <a href="#" className="hover:text-gray-900">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-gray-900">Trung tâm hỗ trợ</a>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <Globe size={20} className="text-gray-600" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <Mail size={20} className="text-gray-600" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            © 2024 Smart Urban Waste Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;
Chào bạn, đây là bản tài liệu (Documentation) được thiết kế theo phong cách "Clean Architecture" mà chúng ta đã xây dựng. Tài liệu này giải thích chi tiết cách vận hành của từng tầng và quy chuẩn viết code để team của bạn có thể dễ dàng theo dõi.

📁 TÀI LIỆU CẤU TRÚC DỰ ÁN (CLEAN ARCHITECTURE)
Dự án tuân thủ nguyên lý SOLID, tách biệt hoàn toàn giữa Logic nghiệp vụ (Business Logic) và Logic truy vấn dữ liệu (Data Access).

🏛 Sơ đồ luồng dữ liệu (Data Flow)
Client ➔ Routes ➔ Validation Middleware ➔ Controller (Functional) ➔ Service (OOP) ➔ Repository (OOP) ➔ Database (Mongoose)

📂 1. src/interface/ (Trái tim của hệ thống)
Chức năng: Định nghĩa các kiểu dữ liệu gốc (Core Types) và Enum. Đây là "hợp đồng" mà tất cả các tầng khác phải tuân theo.

Cách code: Chỉ chứa interface thuần và enum, không chứa logic xử lý.

TypeScript

// Định nghĩa các trạng thái và cấu trúc thực thể
export enum UserRole { ADMIN = 'ADMIN', ... }
export interface IUser { ... }
📂 2. src/models/ (Cấu trúc Database)
Chức năng: Định nghĩa Schema cho Mongoose. Đây là nơi duy nhất tương tác trực tiếp với Driver của Database.

Cách code: Map từ interface sang mongoose.Schema. Sử dụng Document để hỗ trợ TypeScript.

📂 3. src/dtos/ (Dữ liệu vào/ra)
Chức năng: Tách biệt dữ liệu nhận từ Client (Request) và dữ liệu trả về (Response).

Cách code:

Request (Class): Sử dụng class-validator để kiểm tra tính hợp lệ (Validate) của dữ liệu ngay tại cửa ngõ.

Response (Interface): Định nghĩa những gì Client được phép nhìn thấy (ví dụ: ẩn password).

📂 4. src/repositories/ (Tầng truy vấn dữ liệu)
Chức năng: Chứa các hàm CRUD (Thêm, xóa, sửa, tìm kiếm) cơ bản.

Cách code: Sử dụng OOP. Chỉ tập trung vào việc lấy/ghi dữ liệu, không xử lý logic nghiệp vụ (ví dụ: không check pass, không check role ở đây).

📂 5. src/services/ (Tầng xử lý nghiệp vụ)
Chức năng: Nơi "thông minh" nhất của ứng dụng. Xử lý logic, tính toán, phân quyền và kiểm tra lỗi.

Cách code: * Sử dụng OOP.

Nhận Repository qua Constructor (Dependency Injection).

Ném lỗi thông qua AppError.

📂 6. src/controllers/ (Điều hướng)
Chức năng: Nhận Request từ Route, gọi Service tương ứng và trả về Response.

Cách code:

Sử dụng Functional (Hàm thuần túy).

Bọc trong asyncHandler để không phải viết try-catch.

Comment rõ: // METHOD | URL | CHỨC NĂNG.

📂 7. src/config/container.ts (Nơi lắp ráp)
Chức năng: Khởi tạo các instance của Repository và Service. Đây là nơi thực hiện Dependency Injection.

Tại sao: Để các phần khác (như Controller) chỉ việc import và sử dụng, không cần tự khởi tạo lại class.

📂 8. src/routes/ (Định nghĩa URL)
Chức năng: Khai báo các endpoint API.

Cách code: Sử dụng router.route() để code ngắn gọn. Comment tương tự như Controller.

🛠 QUY CHUẨN CODE (CLEAN CODE CHECKLIST)
Comment thống nhất: Sử dụng // để giải thích chức năng hàm ở Interface (Service/Repo) và Route/Controller.

Xử lý lỗi: Không sử dụng try-catch thủ công ở Controller. Luôn dùng throw new AppError() trong Service.

Validate: Mọi API nhận dữ liệu từ Body phải có Class DTO và Middleware đi kèm.

Tách biệt: * Controller không được gọi trực tiếp UserModel.

Route không được chứa logic xử lý dữ liệu.

Service không được biết về res.status() hay req.body.
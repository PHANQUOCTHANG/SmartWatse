export const swaggerPaths = {
  "/api/auth/register": {
    post: {
      summary: "Đăng ký tài khoản mới",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                fullName: { type: "string", example: "Nguyễn Văn A" },
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                phone: { type: "string", example: "0123456789" },
                password: { type: "string", example: "password123" },
                role: {
                  type: "string",
                  enum: ["admin", "user"],
                  default: "user",
                },
              },
              required: ["fullName", "email", "password"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Đăng ký thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                      user: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/login": {
    post: {
      summary: "Đăng nhập",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                password: { type: "string", example: "password123" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Đăng nhập thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                      user: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/refresh": {
    post: {
      summary: "Làm mới access token",
      tags: ["Authentication"],
      responses: {
        200: {
          description: "Làm mới token thành công",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "success" },
                  data: {
                    type: "object",
                    properties: {
                      accessToken: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/logout": {
    post: {
      summary: "Đăng xuất",
      tags: ["Authentication"],
      security: [{ bearerAuth: [] }],
      responses: {
        204: {
          description: "Đăng xuất thành công",
        },
      },
    },
  },
  "/api/auth/send-otp": {
    post: {
      summary: "Gửi mã OTP đến email",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
              },
              required: ["email"],
            },
          },
        },
      },
      responses: {
        204: {
          description: "Gửi OTP thành công",
        },
      },
    },
  },
  "/api/auth/verify-otp": {
    post: {
      summary: "Xác thực mã OTP",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                otp: { type: "string", example: "123456" },
              },
              required: ["email", "otp"],
            },
          },
        },
      },
      responses: {
        204: {
          description: "Xác thực OTP thành công",
        },
      },
    },
  },
  "/api/auth/reset-password": {
    post: {
      summary: "Đặt lại mật khẩu",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                otp: { type: "string", example: "123456" },
                newPassword: { type: "string", example: "newPassword123" },
              },
              required: ["email", "otp", "newPassword"],
            },
          },
        },
      },
      responses: {
        204: {
          description: "Đặt lại mật khẩu thành công",
        },
      },
    },
  },
  "/api/users": {
    get: {
      summary: "Lấy danh sách người dùng",
      tags: ["Users"],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
        },
        {
          in: "query",
          name: "search",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Danh sách người dùng",
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
      },
    },
    post: {
      summary: "Tạo người dùng mới",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo người dùng thành công",
        },
      },
    },
  },
  "/api/users/{id}": {
    get: {
      summary: "Chi tiết người dùng theo ID",
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Thông tin người dùng",
        },
      },
    },
    patch: {
      summary: "Cập nhật người dùng",
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật thành công",
        },
      },
    },
    delete: {
      summary: "Xóa người dùng",
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        204: {
          description: "Xóa thành công",
        },
      },
    },
  },
  "/api/bins": {
    get: {
      summary: "Lấy danh sách thùng rác",
      tags: ["Bins"],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
        },
        {
          in: "query",
          name: "search",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Danh sách thùng rác",
        },
      },
    },
    post: {
      summary: "Tạo thùng rác mới",
      tags: ["Bins"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
        },
      },
    },
  },
  "/api/bins/{id}": {
    get: {
      summary: "Chi tiết thùng rác",
      tags: ["Bins"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Thông tin thùng rác",
        },
      },
    },
    patch: {
      summary: "Cập nhật thùng rác",
      tags: ["Bins"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật thành công",
        },
      },
    },
    delete: {
      summary: "Xóa thùng rác",
      tags: ["Bins"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        204: {
          description: "Xóa thành công",
        },
      },
    },
  },
  "/api/areas": {
    get: {
      summary: "Lấy danh sách khu vực",
      tags: ["Areas"],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
        },
      ],
      responses: {
        200: {
          description: "Danh sách khu vực",
        },
      },
    },
    post: {
      summary: "Tạo khu vực mới",
      tags: ["Areas"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
        },
      },
    },
  },
  "/api/areas/{id}": {
    get: {
      summary: "Chi tiết khu vực",
      tags: ["Areas"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Thông tin khu vực",
        },
      },
    },
    patch: {
      summary: "Cập nhật khu vực",
      tags: ["Areas"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật thành công",
        },
      },
    },
    delete: {
      summary: "Xóa khu vực",
      tags: ["Areas"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        204: {
          description: "Xóa thành công",
        },
      },
    },
  },
  "/api/vehicles": {
    get: {
      summary: "Lấy danh sách phương tiện",
      tags: ["Vehicles"],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
        },
        {
          in: "query",
          name: "search",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Danh sách phương tiện",
        },
      },
    },
    post: {
      summary: "Tạo phương tiện mới",
      tags: ["Vehicles"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
        },
      },
    },
  },
  "/api/vehicles/{id}": {
    get: {
      summary: "Chi tiết phương tiện",
      tags: ["Vehicles"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Thông tin phương tiện",
        },
      },
    },
    patch: {
      summary: "Cập nhật phương tiện",
      tags: ["Vehicles"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật thành công",
        },
      },
    },
    delete: {
      summary: "Xóa phương tiện",
      tags: ["Vehicles"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        204: {
          description: "Xóa thành công",
        },
      },
    },
  },
  "/api/collection-points": {
    get: {
      summary: "Lấy danh sách điểm tập kết",
      tags: ["Collection Points"],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
        },
        {
          in: "query",
          name: "search",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Danh sách điểm tập kết",
        },
      },
    },
    post: {
      summary: "Tạo điểm tập kết mới",
      tags: ["Collection Points"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
        },
      },
    },
  },
  "/api/collection-points/{id}": {
    get: {
      summary: "Chi tiết điểm tập kết",
      tags: ["Collection Points"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Thông tin điểm tập kết",
        },
      },
    },
    patch: {
      summary: "Cập nhật điểm tập kết",
      tags: ["Collection Points"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật thành công",
        },
      },
    },
    delete: {
      summary: "Xóa điểm tập kết",
      tags: ["Collection Points"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        204: {
          description: "Xóa thành công",
        },
      },
    },
  },
  "/api/collection-schedules": {
    get: {
      summary: "Lấy danh sách lịch trình thu gom",
      tags: ["Collection Schedules"],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
        },
      ],
      responses: {
        200: {
          description: "Danh sách lịch trình",
        },
      },
    },
    post: {
      summary: "Tạo lịch trình thu gom mới",
      tags: ["Collection Schedules"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
        },
      },
    },
  },
  "/api/collection-schedules/{id}": {
    get: {
      summary: "Chi tiết lịch trình",
      tags: ["Collection Schedules"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Thông tin lịch trình",
        },
      },
    },
    patch: {
      summary: "Cập nhật lịch trình",
      tags: ["Collection Schedules"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật thành công",
        },
      },
    },
    delete: {
      summary: "Xóa lịch trình",
      tags: ["Collection Schedules"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        204: {
          description: "Xóa thành công",
        },
      },
    },
  },
  "/api/citizen-reports": {
    get: {
      summary: "Lấy danh sách báo cáo công dân",
      tags: ["Citizen Reports"],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
        },
        {
          in: "query",
          name: "search",
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Danh sách báo cáo",
        },
      },
    },
    post: {
      summary: "Tạo báo cáo mới",
      tags: ["Citizen Reports"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
        },
      },
    },
  },
  "/api/citizen-reports/{id}": {
    get: {
      summary: "Chi tiết báo cáo",
      tags: ["Citizen Reports"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Thông tin báo cáo",
        },
      },
    },
    patch: {
      summary: "Cập nhật báo cáo",
      tags: ["Citizen Reports"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        200: {
          description: "Cập nhật thành công",
        },
      },
    },
    delete: {
      summary: "Xóa báo cáo",
      tags: ["Citizen Reports"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        204: {
          description: "Xóa thành công",
        },
      },
    },
  },
};

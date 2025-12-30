# 📘 FRONTEND PROJECT – TECHNICAL README (PRODUCTION STANDARD)

> Tài liệu này dùng để **onboard developer mới**, thống nhất **kiến trúc – quy tắc code – cách làm việc** cho dự án Frontend React + TypeScript.

---

## 1. 🎯 Mục tiêu kiến trúc

- Dễ mở rộng (scalable)
- Dễ bảo trì (maintainable)
- Dễ onboard dev mới
- Tách biệt rõ **UI – Business – State – Routing**
- Áp dụng **feature-based architecture** (chuẩn production)

---

## 2. 🧱 Tech Stack

- React 18 + TypeScript
- Vite
- Redux Toolkit / Zustand (Global state)
- React Router
- Axios / Fetch wrapper
- TailwindCSS / CSS Module
- ESLint + Prettier

---

## 3. 🌳 Cấu trúc thư mục tổng thể

```
root
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── store/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── index.css
├── .env
├── eslint.config.js
└── components.json
```

---

## 4. 📂 Giải thích chi tiết từng thư mục & file

---

### 4.1 `public/`

- Chứa static assets **không qua bundler**
- Ví dụ: favicon, robots.txt, ảnh SEO

⛔ Không import JS/TS từ đây

---

### 4.2 `src/app/` – App Core Layer

#### `main.tsx`

- Entry point
- Mount React App
- Không viết business logic

#### `providers.tsx`

- Gom toàn bộ Provider toàn cục:

  - Redux / Query
  - Theme
  - Auth context

> 👉 Dev mới chỉ cần xem file này để hiểu app đang dùng công nghệ gì

---

### 4.3 `src/app/routes/`

| File                 | Chức năng                |
| -------------------- | ------------------------ |
| `route.tsx`          | Khai báo toàn bộ routing |
| `ProtectedRoute.tsx` | Bảo vệ route cần login   |
| `GuestRoute.tsx`     | Chỉ cho user chưa login  |

🔐 Logic auth frontend **KHÔNG viết trong page**

---

### 4.4 `components/` – Shared UI Components

- Button, Modal, Input, Table,…
- Không gọi API
- Không chứa business logic

✔ Có thể tái sử dụng toàn hệ thống

---

### 4.5 `pages/` – Route Entry Layer

- Mỗi Page = 1 route
- Nhiệm vụ:

  - Gọi API
  - Kết nối feature
  - Áp layout

⛔ Không viết UI nhỏ lẻ ở đây

---

### 4.6 `layouts/` – UI Skeleton

- MainLayout
- AuthLayout
- AdminLayout

👉 Page chỉ wrap layout, không logic phức tạp

---

### 4.7 ⭐ `features/` – Business Domain Layer (QUAN TRỌNG NHẤT)

Ví dụ:

```
features/auth/
├── api.ts
├── slice.ts
├── hooks.ts
├── components/
└── types.ts
```

- Mỗi feature **độc lập**
- Chứa:

  - API
  - State
  - Logic nghiệp vụ

✔ Có thể tách thành module riêng

---

### 4.8 `store/`

- Khai báo global store
- Combine reducer
- Middleware

⛔ Không xử lý logic nghiệp vụ tại đây

---

### 4.9 `hooks/`

- Custom hooks dùng chung
- Không phụ thuộc UI

Ví dụ:

- useAuth
- useDebounce

---

### 4.10 `lib/`

- Wrapper cho thư viện ngoài
- Ví dụ:

  - axios.ts
  - socket.ts

👉 Tránh import trực tiếp library ở nhiều nơi

---

### 4.11 `config/`

- Hằng số
- Enum
- Endpoint map

---

### 4.12 `utils/`

- Hàm thuần
- Không side-effect

---

### 4.13 `types/`

- TypeScript global types
- Tránh duplicate type

---

### 4.14 `styles/` & `index.css`

- Global styles
- Theme
- Tailwind config

---

## 5. 📐 Quy tắc đặt tên (Naming Convention)

### File & Folder

| Loại      | Quy tắc        |
| --------- | -------------- |
| Component | PascalCase.tsx |
| Hook      | useXxx.ts      |
| Page      | XxxPage.tsx    |
| Feature   | kebab-case     |
| Utils     | camelCase.ts   |

---

## 6. ✍️ Quy tắc code (Coding Rules)

- Không dùng `any`
- Luôn define type cho API response
- Component < 300 dòng
- Một file = một responsibility

---

## 7. 🔁 Quy trình làm việc chuẩn

1. Tạo branch:

```bash
git checkout -b feat/auth-login
```

2. Code đúng layer
3. Format + lint
4. Commit message:

```text
feat(auth): implement login flow
fix(ui): fix button alignment
```

---

## 8. 🚫 Những lỗi thường gặp (ANTI-PATTERN)

❌ Gọi API trong component dùng chung
❌ Logic auth trong page
❌ Import chéo feature
❌ Hardcode role / permission

---

## 9. ✅ Best Practices

- Feature ownership rõ ràng
- Reuse component tối đa
- Ưu tiên composition hơn inheritance
- Mọi thứ phải có type

---

## 10. 📌 Kết luận

Kiến trúc này phù hợp:

- Team từ 2 → 20 dev
- Dự án dài hạn
- Scale lớn

> 📢 Dev mới bắt buộc đọc README này trước khi code

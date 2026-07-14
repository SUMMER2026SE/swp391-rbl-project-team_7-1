# TODO — CASE STUDY: Freelancer Job Matching System (FJMS)
## Hướng dẫn thực hành từng tuần — ReactJS (FER202)

**Stack:** React 19 + Vite + TailwindCSS / React-Bootstrap + Axios + JSON-Server / Express Backend + SQL Server  
**Nhóm:** 3 thành viên — phân công theo vai trò mỗi tuần  
**Repo tham khảo:** `Case-Study/SourceCode/WeekXX-*/`  
**Template báo cáo:** `Case-Study/Template/WeekXX/WeekXX_BaoCaoNhom.docx`

> **Quy ước:**  
> - `[A]` = Thành viên A phụ trách chính (Trưởng nhóm)  
> - `[B]` = Thành viên B phụ trách chính  
> - `[C]` = Thành viên C phụ trách chính  
> - `[ALL]` = Cả nhóm cùng làm  
> - `[REVIEW]` = Một thành viên khác review lại trước khi merge

---

## TUẦN 1 — KHỞI TẠO PROJECT & THIẾT KẾ GIAO DIỆN

### 🎯 Mục tiêu
Thiết lập nền tảng kỹ thuật và tư duy thiết kế trước khi code. Nhóm thống nhất: project là gì, ai làm gì, giao diện trông như thế nào.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | Tạo GitHub repo, cấu hình Vite project, tổ chức thư mục, viết `README.md`, vẽ Component Tree, tổng hợp prompt log |
| **B** | Thiết kế màn hình Trang chủ + Danh sách dự án (Project List) bằng **Google Stitch / Figma**, thiết kế DB Schema (FJMS.sql / db.json) |
| **C** | Thiết kế màn hình Chi tiết dự án (Project Details) + Giỏ hàng/Ví/Dự án đã lưu (Cart/Saved Projects) bằng **Figma Make** |

### ✅ Checklist công việc

**Môi trường & Cài đặt**
- [ ] Cài Node.js 18+ — kiểm tra: `node -v` phải ra `v18.x.x` trở lên
- [ ] Cài VS Code + extensions: ES7+ React Snippets, Prettier, ESLint, GitLens
- [ ] Cài React DevTools extension cho Chrome

**Khởi tạo project [A]**
- [ ] Chạy: `npm create vite@latest fjms-frontend -- --template react` (hoặc khởi tạo trong cấu trúc thư mục của nhóm)
- [ ] Vào thư mục và chạy: `npm install`
- [ ] Cài thêm: `npm install react-bootstrap bootstrap react-router-dom axios lucide-react`
- [ ] Tạo cấu trúc thư mục chuẩn: `src/components`, `src/pages`, `src/context`, `src/hooks`, `src/services`, `src/assets`
- [ ] Kiểm tra: `npm run dev` → mở `http://localhost:5173` thấy trang Vite mặc định

**Thiết kế mockup với AI Design Tools [B, C]**

> Workflow 5 bước: **Requirements → Prompt → Generate → Đánh giá đầu ra → Handoff sang code.**  
> Nguyên tắc: AI tạo bản nháp nhanh, con người quyết định — mọi output phải được đối chiếu với requirements trước khi dùng.

*Bước 1 — Chuẩn bị requirements trước khi prompt [B + C]*
- [ ] Liệt kê 4 màn hình cần thiết kế và components của từng màn hình (lấy từ Component Tree nháp của A):
  - **Trang chủ**: Header (logo, nav, user profile, cart/saved icon) + Hero Banner + CategoryList (5 danh mục ngành nghề) + ProjectGrid (8 dự án mới nhất) + Footer
  - **Danh sách dự án**: SearchBar + Filter danh mục/ngân sách + ProjectGrid + Pagination
  - **Chi tiết dự án**: Tiêu đề dự án, mô tả chi tiết, ngân sách (budget), kỹ năng yêu cầu, thông tin nhà tuyển dụng, nút "Gửi báo giá/Proposal"
  - **Giỏ hàng/Dự án đã lưu**: Bảng danh sách dự án quan tâm (ảnh/logo, tên dự án, ngân sách, hành động xóa) + nút Quản lý ứng tuyển
- [ ] Đối chiếu với cấu trúc `db.json` / DB Schema của B: mỗi field hiển thị trên UI phải tồn tại trong data (vd: mockup có ngân sách thì project phải có `budget`)
- [ ] Thống nhất style chung của nhóm: màu chủ đạo (Emerald green cho FJMS), font, tone (chuyên nghiệp, hiện đại) — ghi vào `docs/mockup/style-guide.md`

*Bước 2 — Tạo mockup với Google Stitch/Figma [B]*
- [ ] Viết prompt mô tả Trang chủ & Danh sách dự án dựa trên style guide của nhóm.
- [ ] Lưu prompts đã dùng vào `docs/mockup/prompts.md` làm minh chứng làm việc với AI.

*Bước 3 — Tạo prototype tương tác với Figma Make [C]*
- [ ] Prompt mô tả màn Chi tiết dự án + Giỏ hàng/Dự án đã lưu.
- [ ] Click thử prototype: luồng *Danh sách → Chi tiết → Lưu dự án → Xem danh sách đã lưu* hoạt động tốt.

*Bước 4 — Đánh giá kết quả đầu ra [B + C + REVIEW: A]*
- [ ] Đánh giá giao diện theo checklist độ tương thích dữ liệu, tính nhất quán style, và tính responsive.

*Bước 5 — Đầu ra & hướng xử lý tiếp theo (handoff sang code) [B + C + A]*
- [ ] Export ảnh PNG 4 màn hình + link project Stitch/Figma → lưu `docs/mockup/`
- [ ] Ghi vào `docs/mockup/handoff.md` bảng map: *Vùng trên mockup → Component sẽ code → Tuần thực hiện*

**Dữ liệu [B]**
- [ ] Tạo `db.json` tại root project cho json-server (hoặc thiết lập script database)
- [ ] `projects`: ít nhất 8 dự án với các trường: id, title, description, budget, category, categoryId, status, duration, requiredSkills, featured
- [ ] `categories`: 5 danh mục công việc (Web Dev, Mobile Dev, UI/UX Design, Graphic Design, Content Writing)

**Component Tree & Tài liệu [A]**
- [ ] Vẽ sơ đồ Component Tree (dùng draw.io hoặc Figma)
- [ ] Viết `README.md` hướng dẫn cài đặt và chạy ứng dụng

**GitHub [A + ALL]**
- [ ] Thiết lập repo, mời các thành viên làm Collaborator, thống nhất quy trình Git Flow.

### 📦 ĐẦU RA BẮT BUỘC — Tuần 1

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | Mockup 4 màn hình | Đủ 4 màn hình chính của FJMS, đạt checklist | `docs/mockup/` |
| 2 | Prompt log | Toàn bộ prompts dùng để thiết kế | `docs/mockup/prompts.md` |
| 3 | Handoff document | Bảng map vùng mockup → component | `docs/mockup/handoff.md` |
| 4 | Project khởi chạy | `npm run dev` chạy mượt mà không lỗi | Root folder |
| 5 | `db.json` đầy đủ | ≥8 dự án, ≥5 danh mục, json-server chạy được | `db.json` (root) |
| 6 | `README.md` | Có mô tả, hướng dẫn cài đặt, chạy của nhóm | `README.md` (root) |
| 7 | Component Tree | Sơ đồ component phân cấp rõ ràng | `docs/component-tree.png` |
| 8 | Repo GitHub | Code đã push, đủ 3 thành viên tham gia | Link GitHub |

```
✏️ Commit: feat: week01 - init FJMS project, structure, db.json, README
```

---

## TUẦN 2 — FUNCTIONAL COMPONENTS & JSX

### 🎯 Mục tiêu
Hiểu JSX là gì, viết functional component, dùng `map()` để render danh sách, áp dụng conditional rendering.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | Header.jsx + Footer.jsx |
| **B** | Banner.jsx + ProjectCard.jsx (hardcode 1 dự án) |
| **C** | ProjectGrid.jsx (map() render list) + CategoryList.jsx (conditional rendering) + tích hợp App.jsx |

### ✅ Checklist công việc

**Nghiên cứu trước [ALL]**
- [ ] Đọc tài liệu về JSX compilation, phân biệt class/className, for/htmlFor, event handling.

**Header.jsx [A]**
- [ ] Navbar với logo "💼 FJMS Marketplace"
- [ ] Navigation links: Trang chủ | Tìm việc | Dự án đã lưu | Dashboard
- [ ] Icon dự án đã lưu với số lượng (hardcode "0" — tuần 4 sẽ nâng cấp)
- [ ] Style bằng inline CSS (chưa dùng Bootstrap/Tailwind)

**Banner.jsx & ProjectCard.jsx [B]**
- [ ] Banner: Hero section giới thiệu FJMS với tiêu đề, mô tả và nút hành động.
- [ ] ProjectCard: Hiển thị tiêu đề dự án, mô tả ngắn, ngân sách, danh mục. Dữ liệu tạm thời hardcode trực tiếp.

**ProjectGrid.jsx & CategoryList.jsx & App.jsx [C]**
- [ ] Khai báo mảng `PROJECTS_DATA` gồm 4 dự án mẫu, map ra danh sách card.
- [ ] CategoryList: Render 5 danh mục ngành nghề, dùng `&&` hoặc ternary operator để xử lý dữ liệu trống.
- [ ] Tích hợp cả 5 components vào App.jsx, kiểm tra không có lỗi console.

### 📦 ĐẦU RA BẮT BUỘC — Tuần 2

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | 6 Functional Components | Header, Banner, ProjectCard, ProjectGrid, CategoryList, Footer | `src/components/` |
| 2 | Giao diện tĩnh hoạt động | Giao diện hiển thị đầy đủ thông tin tĩnh | Demo trực tiếp |
| 3 | Không lỗi console | DevTools console không xuất hiện cảnh báo đỏ | Screenshot DevTools |
| 4 | Slide giải thích JSX | Giải thích cơ chế compile JSX → JS | `docs/week02-jsx.pdf` |

```
✏️ Commit: feat: week02 - static components (Header, Banner, ProjectCard, ProjectGrid, CategoryList)
```

---

## TUẦN 3 — PROPS & COMPONENT COMMUNICATION

### 🎯 Mục tiêu
Truyền dữ liệu từ cha xuống con qua Props. Hiểu one-way data flow. Tái sử dụng component và dùng `props.children` cho layout.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | Refactor ProjectCard.jsx — nhận project object qua props |
| **B** | Refactor ProjectGrid.jsx & CategoryList.jsx — nhận mảng dữ liệu qua props |
| **C** | Viết SectionWrapper.jsx (children) + Cập nhật App.jsx truyền dữ liệu & vẽ Data Flow Diagram |

### ✅ Checklist công việc

**ProjectCard.jsx [A]**
- [ ] Nhận `{ project, onSaveProject }` qua props, xóa dữ liệu hardcode.
- [ ] Hiển thị thông tin động từ object `project` (tiêu đề, ngân sách định dạng VND/USD).
- [ ] Nút "Lưu dự án": `onClick={() => onSaveProject(project)}`.

**ProjectGrid.jsx & CategoryList.jsx [B]**
- [ ] Nhận props `projects` và `onSaveProject`, map qua list, thêm `key={project.id}`.
- [ ] CategoryList nhận mảng `categories` và hiển thị danh sách tương ứng.

**SectionWrapper.jsx & App.jsx & Data Flow [C]**
- [ ] Tạo `SectionWrapper` nhận `title`, `subtitle`, và `children` (`props.children`).
- [ ] Dùng `SectionWrapper` bọc các phần lớn ở App.jsx.
- [ ] Khai báo dữ liệu mẫu tại App.jsx và truyền xuống.
- [ ] Vẽ sơ đồ luồng dữ liệu (Data Flow Diagram) lưu vào `docs/week03-dataflow.png`.

### 📦 ĐẦU RA BẮT BUỘC — Tuần 3

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | ProjectCard động | Nhận dữ liệu qua props, hoạt động với các object khác nhau | `src/components/ProjectCard.jsx` |
| 2 | SectionWrapper layout | Tái sử dụng ở tối thiểu 3 nơi trong ứng dụng | `src/components/SectionWrapper.jsx` |
| 3 | Khớp dữ liệu truyền nhận | Xác nhận dữ liệu truyền từ App → Grid → Card qua DevTools | Demo DevTools |
| 4 | Data Flow Diagram | Sơ đồ luồng dữ liệu rõ ràng | `docs/week03-dataflow.png` |

```
✏️ Commit: feat: week03 - props refactor (ProjectCard, ProjectGrid, CategoryList), SectionWrapper children
```

---

## TUẦN 4 — XỬ LÝ SỰ KIỆN & useState

### 🎯 Mục tiêu
Sử dụng `useState` để quản lý state nội bộ. Hiểu controlled component, immutable update state và kỹ thuật Lifting State Up.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | SearchBar.jsx — controlled component + Cập nhật Header.jsx nhận savedCount |
| **B** | Quản lý state giỏ hàng/dự án đã lưu (savedProjects state) + handleSaveProject trong App.jsx |
| **C** | Quản lý filter danh mục (activeCategory state) + derived state filteredProjects + tích hợp vào App.jsx |

### ✅ Checklist công việc

**SearchBar.jsx & Header.jsx [A]**
- [ ] Tạo state `keyword`. Bind input `value={keyword}` và update qua `onChange`.
- [ ] Validation khi submit: độ dài từ khóa < 2 ký tự thì hiển thị thông báo lỗi màu đỏ.
- [ ] Nút Clear (×) để xóa từ khóa nhanh.
- [ ] Cập nhật Header.jsx nhận `savedCount` hiển thị badge số lượng dự án đã lưu.

**State dự án đã lưu [B]**
- [ ] Khai báo `const [savedProjects, setSavedProjects] = useState([])` tại App.jsx.
- [ ] Hàm `handleSaveProject(project)`: Kiểm tra nếu chưa lưu thì thêm vào, nếu lưu rồi thì báo lỗi hoặc xóa (áp dụng immutable update: `[...prev, project]`).
- [ ] Viết báo cáo giải thích chi tiết cơ chế immutable update trong React state.

**Filter danh mục & Tích hợp [C]**
- [ ] Khai báo state `activeCategory` tại App.jsx.
- [ ] Tính toán derived state `filteredProjects` dựa trên từ khóa tìm kiếm và danh mục đang chọn.
- [ ] Tích hợp các state và handler lên App.jsx và phân phối qua props xuống các component con.

### 📦 ĐẦU RA BẮT BUỘC — Tuần 4

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | SearchBar hoàn thiện | Controlled input, validation hợp lệ, có nút clear | `src/components/SearchBar.jsx` |
| 2 | State lưu dự án hoạt động | Lưu dự án không bị duplicate, update state immutable | `src/App.jsx` |
| 3 | Bộ lọc danh mục | Lọc chính xác các dự án theo danh mục được chọn | `src/App.jsx` |
| 4 | Kỹ thuật Lifting State Up | Hoạt động đồng bộ giữa Header, SearchBar, Grid và App | React DevTools props |
| 5 | Báo cáo Immutable | Bài viết giải thích chi tiết về việc tránh mutate state | Báo cáo tuần 4 |

```
✏️ Commit: feat: week04 - useState savedProjects, controlled SearchBar, category filter
```

---

## TUẦN 5 — REACT BOOTSTRAP / TAILWIND & GIAO DIỆN RESPONSIVE

### 🎯 Mục tiêu
Áp dụng hệ thống Grid (Container/Row/Col) và CSS Classes để xây dựng giao diện responsive đẹp mắt, không vỡ layout trên các kích thước màn hình.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | Header → Navbar + Nav + Badge responsive |
| **B** | HomePage Banner (Jumbotron style) + CategoryList (Row/Col hoặc Tailwind Grid) |
| **C** | ProjectCard (Card/Tailwind classes) + ProjectGrid (Row/Col responsive) + saved projects layout |

### ✅ Checklist công việc

**Responsive Header [A]**
- [ ] Sử dụng các component responsive (Hamburger menu tự động ẩn hiện trên mobile).
- [ ] Hiển thị badge số lượng dự án đã lưu nổi bật trên icon.

**Responsive Banner & CategoryList [B]**
- [ ] Thiết kế Banner thích ứng tốt trên cả mobile, tablet và desktop.
- [ ] Render danh mục ngành nghề dưới dạng grid tự động điều chỉnh số cột (ví dụ: xs=2, md=5).

**Responsive ProjectCard & Grid & Test [C]**
- [ ] Thiết kế Card dự án đồng bộ chiều cao, có shadow và bo góc hiện đại.
- [ ] Grid dự án responsive: hiển thị 1-2 cột trên mobile, 3 cột trên tablet, 4 cột trên desktop.
- [ ] Kiểm thử responsive trên các breakpoint chuẩn: 375px, 768px, 1280px. Lưu screenshot làm báo cáo.

### 📦 ĐẦU RA BẮT BUỘC — Tuần 5

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | Responsive UI | Giao diện được cấu trúc chuẩn hóa, không dùng inline CSS tùy tiện | `src/components/` |
| 2 | Kiểm thử 3 breakpoints | Chụp ảnh minh họa layout ổn định tại 375px, 768px, 1280px | `docs/week05-responsive/` |
| 3 | Mobile Navigation | Menu điều hướng dạng hamburger hoạt động mượt mà | Demo/Screenshot |
| 4 | Báo cáo Responsive | Liệt kê các class/component đã dùng để responsive | Báo cáo tuần 5 |

```
✏️ Commit: feat: week05 - Responsive UI (Navbar, Cards, Row/Col Grid system)
```

---

## TUẦN 6 — ROUTING VỚI REACT ROUTER DOM

### 🎯 Mục tiêu
Xây dựng Single Page Application (SPA) điều hướng không reload. Cấu hình routes, dynamic routes với URL params và Protected Routes.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | Cấu hình BrowserRouter, các Router Link + ProtectedRoute.jsx + NotFoundPage.jsx |
| **B** | ProjectDetailPage.jsx — hiển thị chi tiết dự án dùng `useParams()` + Route Map diagram |
| **C** | SavedProjectsPage.jsx (hoặc CartPage.jsx) — màn hình quản lý dự án đã lưu/đã ứng tuyển |

### ✅ Checklist công việc

**Cấu hình Router & Route bảo vệ [A]**
- [ ] Cài đặt và bọc app bằng `<BrowserRouter>`.
- [ ] Khai báo các route chính: `/` (Home), `/projects` (List), `/projects/:id` (Details), `/saved` (Saved), `/admin` (Protected), `*` (NotFound).
- [ ] Viết `ProtectedRoute` kiểm tra quyền (ví dụ giả lập auth: `isLoggedIn`).

**ProjectDetailPage [B]**
- [ ] Lấy `id` từ URL qua `useParams()`, tìm thông tin dự án tương ứng để hiển thị.
- [ ] Implement breadcrumb điều hướng và nút "Quay lại" (`useNavigate(-1)`).
- [ ] Vẽ sơ đồ Route Map lưu vào `docs/week06-routemap.png`.

**SavedProjectsPage [C]**
- [ ] Nhận danh sách dự án đã lưu và hiển thị dạng bảng hoặc list.
- [ ] Có nút để hủy lưu/xóa khỏi danh sách, tính toán số lượng dự án.

### 📦 ĐẦU RA BẮT BUỘC — Tuần 6

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | Hệ thống định tuyến | Click chuyển trang tức thời không reload trình duyệt | `src/App.jsx` |
| 2 | Trang chi tiết động | `/projects/1` hiển thị đúng thông tin của dự án ID=1 | `src/pages/ProjectDetailPage.jsx` |
| 3 | Protected Route | Chặn truy cập trang admin/dashboard nếu chưa đăng nhập | `src/components/ProtectedRoute.jsx` |
| 4 | Route Map | Sơ đồ cấu trúc router đầy đủ | `docs/week06-routemap.png` |

```
✏️ Commit: feat: week06 - react-router-dom configuration, ProjectDetail, ProtectedRoute
```

---

## TUẦN 7 — BUILT-IN HOOKS NÂNG CAO

### 🎯 Mục tiêu
Quản lý side effects với `useEffect`. Chia sẻ state toàn cục không props drilling bằng `useContext`. Tham chiếu DOM trực tiếp bằng `useRef`.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | ProjectContext.jsx (hoặc CartContext) — context, provider, custom hook `useProject()` + cập nhật tab title |
| **B** | ThemeContext.jsx — switch dark/light mode lưu vào localStorage |
| **C** | Cập nhật ProjectListPage: useEffect fetch mockup + useRef focus input + refactor components dùng context |

### ✅ Checklist công việc

**Project/Cart Context [A]**
- [ ] Tạo `ProjectContext`, provider chứa state `savedProjects`, các hàm `saveProject`, `unsaveProject`.
- [ ] Tạo custom hook `useProject()` để components dễ dàng gọi dữ liệu.
- [ ] Viết `useEffect` để cập nhật `document.title` dựa trên số lượng dự án đã lưu (ví dụ: `(3) FJMS Marketplace`). Có cleanup function.

**ThemeContext [B]**
- [ ] Xây dựng context đổi giao diện Sáng/Tối.
- [ ] Sử dụng `useEffect` đồng bộ theme đã chọn vào `localStorage`.

**useEffect Fetch Mock & useRef & Refactor [C]**
- [ ] Viết `useEffect` trong `ProjectListPage` mô phỏng fetch API với `setTimeout` 800ms, có clean up timer.
- [ ] Dùng `useRef` tự động focus vào ô tìm kiếm sau khi dữ liệu load xong.
- [ ] Refactor Header, ProjectCard để lấy trực tiếp dữ liệu từ Context, loại bỏ props drilling.

### 📦 ĐẦU RA BẮT BUỘC — Tuần 7

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | Context API hoạt động | Header và Cards kết nối Context trực tiếp, không qua props trung gian | `src/context/ProjectContext.jsx` |
| 2 | Theme switcher | Chuyển đổi giao diện sáng/tối lưu trạng thái qua reload | `src/context/ThemeContext.jsx` |
| 3 | Side Effect cleanup | Đảm bảo useEffect có cleanup timer/event | `src/pages/ProjectListPage.jsx` |
| 4 | Auto focus | useRef focus thành công vào thanh tìm kiếm sau khi tải | `src/pages/ProjectListPage.jsx` |
| 5 | Báo cáo so sánh Hooks | So sánh chi tiết use cases của useEffect, useContext, useRef | Báo cáo tuần 7 |

```
✏️ Commit: feat: week07 - ProjectContext, ThemeContext, useEffect mockup fetch, useRef focus
```

---

## TUẦN 8 — AXIOS & JSON-SERVER (CRUD)

### 🎯 Mục tiêu
Kết nối frontend với mock API RESTful bằng Axios và json-server (hoặc backend Express sẵn có). Tổ chức service layer, xử lý các trạng thái bất đồng bộ.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | Cấu hình json-server (hoặc kết nối Express backend), viết projectService.js |
| **B** | Cập nhật ProjectListPage — gọi service API + xử lý 3 trạng thái (loading/error/success) + API Endpoints Table |
| **C** | Viết ProjectManagePage (Admin/Employer CRUD) — bảng danh sách, modal thêm/sửa, dialog confirm xóa |

### ✅ Checklist công việc

**Setup Service [A]**
- [ ] Tạo `src/services/projectService.js` sử dụng `axios.create` cấu hình Base URL và timeout.
- [ ] Viết đầy đủ 5 phương thức CRUD: `getProjects`, `getProjectById`, `createProject`, `updateProject`, `deleteProject`.

**Tích hợp Fetching & UI States [B]**
- [ ] Gọi API trong `ProjectListPage` bằng async/await bên trong `useEffect`.
- [ ] Quản lý 3 trạng thái: `loading` (hiển thị Spinner), `error` (hiển thị alert có nút retry), và `success` (hiển thị dữ liệu).
- [ ] Lập bảng danh sách các API endpoints (Method, URL, Body, Response).

**Admin CRUD Management [C]**
- [ ] Thiết kế trang quản lý dự án dạng bảng Bootstrap/Tailwind.
- [ ] Tạo Modal chứa Form thêm mới và chỉnh sửa dự án. Validate dữ liệu trước khi gửi.
- [ ] Thực hiện chức năng xóa dự án với confirm dialog và alert thông báo thành công.

### 📦 ĐẦU RA BẮT BUỘC — Tuần 8

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | Axios Service Layer | File service chứa đủ 5 hàm CRUD cho API | `src/services/projectService.js` |
| 2 | Async UI States | Xử lý mượt mà trạng thái loading spinner và error alert | `src/pages/ProjectListPage.jsx` |
| 3 | Dashboard CRUD hoàn chỉnh | Thao tác thêm/sửa/xóa cập nhật trực tiếp dữ liệu API | `src/pages/admin/ProjectManagePage.jsx` |
| 4 | API Endpoints Table | Bảng đặc tả API đầy đủ thông tin | `docs/week08-api.md` |

```
✏️ Commit: feat: week08 - axios service layer integration, CRUD management page
```

---

## TUẦN 9 — CUSTOM HOOKS & REFACTOR CODE

### 🎯 Mục tiêu
Trích xuất logic trạng thái tái sử dụng thành Custom Hooks. Phân tách giao diện và logic (Separation of Concerns). Ứng dụng Debounce tối ưu hóa tìm kiếm.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | Viết `useFetch.js` + Refactor ProjectListPage sử dụng `useFetch` & `useDebounce` |
| **B** | Viết `useDebounce.js` và tối ưu hóa ô tìm kiếm |
| **C** | Viết `useLocalStorage.js` + Cài đặt Wishlist/SavedProjects bằng hook mới + Check Rules of Hooks |

### ✅ Checklist công việc

**useFetch.js [A]**
- [ ] Viết custom hook `useFetch(url, params)` trả về `{ data, loading, error, refetch }`.
- [ ] Dùng `useCallback` tránh tạo lại hàm gây lặp vô hạn.

**useDebounce.js & Optimize Search [B]**
- [ ] Viết hook `useDebounce(value, delay)`.
- [ ] Áp dụng vào thanh tìm kiếm dự án. Đảm bảo người dùng ngừng gõ 500ms mới kích hoạt API request.

**useLocalStorage.js & Wishlist [C]**
- [ ] Viết hook `useLocalStorage(key, initialValue)` lưu giữ trạng thái đồng bộ với local storage.
- [ ] Dùng hook này quản lý danh sách dự án yêu thích (Wishlist).
- [ ] Kiểm tra toàn bộ code trong dự án đảm bảo tuân thủ nghiêm ngặt Rules of Hooks (không gọi hook trong vòng lặp, điều kiện).

### 📦 ĐẦU RA BẮT BUỘC — Tuần 9

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | useFetch Custom Hook | Tách logic fetch thành công, tái sử dụng tốt | `src/hooks/useFetch.js` |
| 2 | useDebounce Custom Hook | Giảm số lượng request gọi API khi gõ tìm kiếm | `src/hooks/useDebounce.js` |
| 3 | useLocalStorage Hook | Đồng bộ hóa dữ liệu danh sách yêu thích xuống LocalStorage | `src/hooks/useLocalStorage.js` |
| 4 | Code Refactoring | So sánh số dòng code trước/sau khi tối ưu bằng custom hooks | `src/pages/ProjectListPage.jsx` |
| 5 | Cấu trúc thư mục gọn gàng | Sắp xếp module ngăn nắp: hooks, context, services, pages | Ảnh chụp cấu trúc file |

```
✏️ Commit: feat: week09 - custom hooks (useFetch, useDebounce, useLocalStorage), search debouncing
```

---

## TUẦN 10 — NÂNG CAO (REDUX RTK, LAZY LOADING, TAILWIND CSS) & DEPLOY

### 🎯 Mục tiêu
Quản lý state tập trung với Redux Toolkit. Tối ưu hiệu năng bằng Lazy Loading và Code Splitting. Migrate styling sang Tailwind CSS và deploy ứng dụng lên Vercel.

### 📋 Phân công nhiệm vụ

| Thành viên | Nhiệm vụ |
|-----------|----------|
| **A (Trưởng nhóm)** | Cấu hình Redux Toolkit Store + projectSlice (hoặc cartSlice) + Build & Deploy Vercel + Slide & Video thuyết trình |
| **B** | Migrate components sang Redux + Viết so sánh Context vs Redux + Setup Tailwind CSS & Migrate ProjectCard sang Tailwind |
| **C** | Tối ưu hiệu năng: React.lazy + Suspense, lazy loading images, prefetch, bundle analysis |

### ✅ Checklist công việc

**Redux Toolkit (Branch: `feature/redux`) [A + B]**
- [ ] Cài đặt `@reduxjs/toolkit` và `react-redux`.
- [ ] Tạo `src/store/projectSlice.js` chứa state và các reducers ứng tuyển/lưu dự án.
- [ ] Tích hợp Redux Store vào `main.jsx` bằng `<Provider>`.
- [ ] Migrate component Header, ProjectCard, SavedProjectsPage sang dùng `useSelector` và `useDispatch`.
- [ ] Chụp màn hình hoạt động của Redux DevTools (Time-travel debugging).

**Tailwind CSS Migration (Branch: `feature/tailwind`) [B]**
- [ ] Cấu hình Tailwind CSS trong Vite.
- [ ] Tái cấu trúc ProjectCard và Banner bằng các utility classes của Tailwind (thay thế hoàn toàn Bootstrap tại các file này).

**Lazy Loading & Tối ưu hiệu năng (Branch: `feature/perf`) [C]**
- [ ] Áp dụng `React.lazy` và `Suspense` chia nhỏ bundle code theo Route (Route-based code splitting).
- [ ] Thêm `loading="lazy"` cho ảnh logo/banner của dự án.
- [ ] Viết prefetch chunk file khi hover vào các link menu điều hướng.
- [ ] Chạy Bundle Analyzer kiểm tra kích thước bundle và tối ưu hóa.

**Build & Deploy Vercel (Branch: `main`) [A + ALL]**
- [ ] Cấu hình `vercel.json` phục vụ rewrite URL tránh lỗi 404 khi F5.
- [ ] Deploy lên Vercel, kiểm tra chạy thử trên thiết bị di động thật.
- [ ] Tạo slide (8-10 trang) và quay video demo sản phẩm (3-5 phút).

### 📦 ĐẦU RA BẮT BUỘC — Tuần 10

| # | Đầu ra | Tiêu chí hoàn thành | File/Vị trí |
|---|--------|---------------------|-------------|
| 1 | Redux Toolkit Store | Quản lý lưu/ứng tuyển dự án qua Redux mượt mà | branch `feature/redux` |
| 2 | Tailwind CSS UI | Component được làm đẹp bằng Tailwind, responsive tốt | branch `feature/tailwind` |
| 3 | Lazy Loading & Prefetch | Tải trang tối ưu, chia nhỏ bundle code theo route | branch `feature/perf` |
| 4 | Bản build & Deploy thành công | App chạy trực tuyến không lỗi, reload không bị 404 | URL Vercel |
| 5 | Slide & Video demo | Thuyết trình và demo đầy đủ các tính năng đã phát triển | `docs/` |

```
✏️ Commit: chore: week10 - redux toolkit integrated, tailwind css styling, performance optimized, vercel deploy
```

---

## 📊 BẢNG THEO DÕI TIẾN ĐỘ NHÓM

| Tuần | Chủ đề | File/Component chính cần có | Trạng thái |
|------|--------|------------------------------|------------|
| 1 | Setup & Design | `db.json`, `README.md`, mockup 4 màn hình | ☐ |
| 2 | Components & JSX | `Header`, `Banner`, `ProjectCard`, `ProjectGrid`, `CategoryList`, `Footer` | ☐ |
| 3 | Props | `ProjectCard` (props), `SectionWrapper` (children), `ProjectGrid` (props) | ☐ |
| 4 | Events & State | `SearchBar` (controlled), `App` (saved projects state, filter) | ☐ |
| 5 | Bootstrap / Responsive | Tất cả components responsive 3 breakpoints | ☐ |
| 6 | Routing | `App` (BrowserRouter), `ProjectDetailPage` (useParams), `ProtectedRoute` | ☐ |
| 7 | Hooks | `ProjectContext`, `ThemeContext`, `ProjectListPage` (useEffect+useRef) | ☐ |
| 8 | Axios CRUD | `projectService.js`, `ProjectManagePage`, loading/error states | ☐ |
| 9 | Custom Hooks | `useFetch`, `useDebounce`, `useLocalStorage`, refactor ProjectListPage | ☐ |
| 10 | Nâng cao & Deploy | `projectSlice` (Redux), lazy+Suspense, Tailwind CSS, live URL, slide+video demo | ☐ |

---

## 🔧 LỆNH THƯỜNG DÙNG

```bash
# Chạy development
npm run dev                                    # Vite dev server (port 5173)
npm run server                                 # json-server mock API (port 3001)

# Kiểm tra trước khi commit
npm run lint                                   # ESLint
npm run build                                  # Build production → dist/
npm run preview                                # Test bản build local

# Cài đặt thư viện nâng cao (Tuần 10)
npm install @reduxjs/toolkit react-redux       # Redux Toolkit
npm install tailwindcss @tailwindcss/vite      # Tailwind CSS (v4)
```

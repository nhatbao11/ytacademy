# HƯỚNG DẪN DỰ ÁN & QUY TẮC PHÁT TRIỂN: YT ACADEMY (ytacademy.com.vn)

> **LƯU Ý QUAN TRỌNG CHO TẤT CẢ AGENT / DEVELOPER**:
> Tệp này ghi nhận toàn bộ quyết định kiến trúc, tiêu chuẩn kỹ thuật, thiết kế thương hiệu và quy tắc phát triển của dự án **YT Academy**.
> Khi tiếp nhận hoặc tiếp tục dự án, **LUÔN ĐỌC VÀ TUÂN THỦ** các quy định tại tệp này, không thay đổi kiến trúc hoặc hỏi lại các quyết định đã thống nhất.

---

## 1. TỔNG QUAN DỰ ÁN & THƯƠNG HIỆU

* **Tên thương hiệu**: YT Academy
* **Tên miền**: `ytacademy.com.vn`
* **Lĩnh vực**: Nền tảng EdTech chuyên sâu **Đào tạo Chứng chỉ Kế toán Công chứng Anh quốc ACCA Quốc tế** (100% tập trung vào ACCA).
* **Giảng viên chuyên môn**: **Mr. Trần Minh Nhật** (Ảnh đại diện tại `public/instructor-tran-minh-nhat.webp`).
* **Trang web tham chiếu nghiệp vụ**: BISC Online (`https://bisconline.edu.vn/`).
* **Định hướng trải nghiệm**:
  1. Trang chủ tinh gọn, bán các môn ACCA theo từng cấp độ (Applied Knowledge, Applied Skills, Strategic Professional).
  2. Trang Giới thiệu & Chi tiết khóa học chuẩn mực 100% theo Slide 2 tham khảo: Breadcrumb, Top Banner tối, Sidebar mua học phí sticky, khối "Bạn sẽ học được gì", "Giới thiệu", "Nội dung khóa học" (accordion từng chapter), "Thông tin giảng viên Mr. Trần Minh Nhật", "Học viên đánh giá" và "Khóa học liên quan".

### Nhận diện Thương hiệu & Màu sắc (Brand Identity):
* **Logo**: Chữ **"yt"** màu Xanh Navy đậm (`#0B2545`), chữ **"academy"** màu Vàng Kim (`#F59E0B` / `#FBBF24`), có 2 ngôi sao lấp lánh (Sparkles) vàng phía trên chữ 'y'.
* **Bảng màu chủ đạo**:
  * `primary-navy`: `#0B2545` (Chuyên nghiệp, tin cậy, màu chữ yt)
  * `primary-navy-dark`: `#07172C`
  * `brand-gold`: `#F59E0B` (Năng động, nổi bật, màu chữ academy & CTA)
  * `brand-gold-hover`: `#D97706`
  * `brand-gold-light`: `#FEF3C7`
  * `bg-light`: `#F8FAFC`
  * `text-main`: `#0F172A`
  * `text-muted`: `#64748B`

### Slogan & Giá trị Cốt lõi (Core Values & Slogan):
* **Slogan chính thức**: **`YT ACADEMY – Learn Today - Grow Tomorrow!`**
* **Triết lý đào tạo**: *"Học đúng cách – Vững vàng kiến thức – Tự tin chinh phục ACCA!"*
* **4 Giá trị cốt lõi**:
  1. `01. HỌC ĐÚNG TÀI LIỆU`: Kiến thức được hệ thống hóa theo từng môn, bám sát nội dung ACCA và tập trung vào những phần thực sự cần nắm vững.
  2. `02. ĐI ĐÚNG LỘ TRÌNH`: Xác định điểm xuất phát, lựa chọn môn học phù hợp và xây dựng kế hoạch học tập theo từng giai đoạn.
  3. `03. ĐỒNG HÀNH XUYÊN SUỐT`: Theo dõi tiến độ, giải đáp thắc mắc 24/7 và hỗ trợ học viên trong suốt hành trình.
  4. `04. TƯ DUY & PHƯƠNG PHÁP HỌC`: Hiểu bản chất, phát triển tư duy phân tích, kỹ năng giải quyết vấn đề và ứng dụng thực tế.
* **Mô hình triển khai đào tạo**: Lớp 1-to-1, Nhóm nhỏ và Khóa Video Record chất lượng cao cùng Giảng viên Mr. Trần Minh Nhật.

---

## 2. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (TECH STACK)

### Phân tách Frontend & Backend:
Dự án tách biệt hoàn toàn theo cấu trúc Decoupled:
```text
Ytacademy/
├── frontend/             # Ứng dụng giao diện người dùng
├── backend/              # Dịch vụ backend API (sẽ mở rộng sau)
├── AGENTS.md             # Quy tắc ghi nhớ cho AI Agent
└── PROJECT_GUIDELINES.md # Tài liệu kiến trúc & hướng dẫn chi tiết
```

### Công nghệ Frontend:
1. **Core**: React 18/19 + TypeScript + Vite.
2. **Styling**: **Tailwind CSS** (kết hợp các biến cấu hình màu thương hiệu của YT Academy).
3. **Đa ngôn ngữ (i18n)**: `react-i18next` + `i18next` (2 ngôn ngữ bắt buộc: **Tiếng Việt (`vi`)** làm mặc định và **Tiếng Anh (`en`)**). Mọi văn bản hiển thị trên giao diện PHẢI thông qua hàm `t(...)` của i18n.
4. **Icons**: `lucide-react` (đồng nhất, nét vẽ hiện đại).
5. **Quản lý trạng thái (State Management)**: `zustand` (quản lý Giỏ hàng, Modal State, Bộ lọc, Ngôn ngữ, Đăng nhập).
6. **Tầng Dữ liệu (Data/Service Layer)**: Tách riêng trong `src/services/` (dùng Mock Data có cấu trúc DTO chuẩn của BE, khi kết nối BE chỉ cần thay đổi endpoint).

---

## 3. CẤU TRÚC THƯ MỤC FRONTEND (FEATURE-BASED PATTERN)

```text
frontend/src/
├── assets/                  # Ảnh tĩnh, logo YT Academy, banner
├── components/              # Các UI component dùng chung
│   ├── common/              # Button, Input, Modal, Badge, StarRating, Select...
│   └── layout/              # Header, Footer, Navbar, MobileNav, CartDrawer...
├── features/                # Các mô-đun chức năng theo nghiệp vụ (Feature-based)
│   ├── courses/             # Nghiệp vụ khóa học
│   │   ├── components/      # CourseCard, CourseGrid, CourseFilter, CourseDetailModal...
│   │   ├── types.ts         # Course, Category, Review, Instructor
│   │   ├── courseService.ts # Service lấy danh sách / chi tiết khóa học
│   │   └── useCourses.ts    # Custom hook xử lý dữ liệu & filter
│   ├── cart/                # Nghiệp vụ giỏ hàng
│   │   ├── components/      # CartDrawer, CartItemRow, CheckoutSummary
│   │   └── cartStore.ts     # Zustand store cho giỏ hàng
│   ├── activation/          # Nghiệp vụ kích hoạt mã khóa học
│   │   └── ActivationModal.tsx
│   └── auth/                # Nghiệp vụ đăng nhập / đăng ký
│       └── AuthModal.tsx
├── hooks/                   # Custom hooks chung (useDebounce, useMediaQuery...)
├── i18n/                    # Cấu hình đa ngôn ngữ
│   ├── i18n.ts              # Setup i18next
│   └── locales/
│       ├── vi.json          # Bản dịch tiếng Việt
│       └── en.json          # Bản dịch tiếng Anh
├── services/                # Axios instance & base service
├── store/                   # Global stores (UI state, language, auth)
├── types/                   # Shared TypeScript definitions
├── utils/                   # Format tiền tệ VND/USD, format date, slug
├── App.tsx
├── index.css                # Tailwind directives & global font
└── main.tsx
```

---

## 4. QUY TẮC VIẾT CODE & PHÁT TRIỂN (CODING CONVENTIONS)

1. **Type Safety**: Bắt buộc viết kiểu TypeScript rõ ràng, không dùng `any`. Mọi dữ liệu Khóa học, Giảng viên, Giỏ hàng phải có interface trong `types.ts`.
2. **Đa ngôn ngữ (i18n)**:
   * Không viết hardcoded chuỗi text hiển thị trên UI.
   * Thêm key tương ứng vào cả `vi.json` và `en.json`.
3. **Tách biệt Logic & UI**:
   * Component giao diện không gọi trực tiếp API thô hoặc viết logic tính toán giỏ hàng phức tạp.
   * Gọi thông qua hook (`useCourses`) hoặc store (`useCartStore`).
4. **Responsive First**:
   * Mọi màn hình phải hiển thị hoàn hảo từ Mobile (360px - 480px), Tablet (768px - 1024px) đến Desktop màn lớn.
   * Menu mobile, giỏ hàng drawer trượt êm mượt, không bị vỡ layout hay tràn ngang (horizontal overflow).
5. **Tiền tệ & Định dạng**:
   * Luôn hiển thị giá dạng chuẩn VND (ví dụ: `2.290.000 đ`) với tiếng Việt, hoặc quy đổi / hiển thị theo ngôn ngữ.
   * Có huy hiệu giảm giá phần trăm (`-42%`), giá gốc gạch ngang và giá bán nổi bật.
6. **Định dạng Hình ảnh & Logo (Image & Logo Standards)**:
   * **Logo**: Bắt buộc dùng định dạng Vector **SVG** (`logo.svg`, `logo-white.svg` cho nền tối) kết hợp thẻ `<picture>` hỗ trợ **WebP** và **PNG** trong suốt. Tuyệt đối không dùng ảnh JPEG nền trắng thô ráp.
   * **Favicon**: Dùng `favicon.svg` (vector) đảm bảo sắc nét tuyệt đối trên mọi độ phân giải trình duyệt.
   * **Ảnh khóa học & Giảng viên**: Dùng định dạng hiện đại **WebP / AVIF**, luôn gắn `loading="lazy"` và `decoding="async"` để tối ưu tốc độ tải trang (Core Web Vitals).
7. **Triết lý Thiết kế & Trình bày Sản phẩm (Design & Catalog Conventions)**:
   * **Góc vuông 100% (Zero Border-Radius / Sharp Corners)**: Toàn bộ giao diện (Nút bấm, thẻ Card, ô Input, Modal, Drawer, Badge, Banner, Video Player...) dùng hình học góc vuông sắc nét (`rounded-none` / `border-radius: 0px !important`). Tuyệt đối KHÔNG bo tròn góc.
   * **Header Tinh gọn & 100% ACCA**: Header tối giản, không bao viền xám rườm rà quanh từng icon; chỉ gồm: Logo YT Academy -> Menu "Khóa học ACCA" (3 cấp độ) -> Ô tìm kiếm môn học -> Nút "Khóa học của tôi" -> Nút "Kích hoạt" -> Giỏ hàng -> Đăng nhập -> Ngôn ngữ (VI | EN).
   * **Bố cục Lưới Khóa học (2 hàng 8 cái + Xem thêm)**: Mặc định hiển thị đúng 2 hàng (8 môn học, 4 cột trên Desktop). Nếu có nhiều hơn 8 môn, hiển thị nút "Xem thêm ... môn học khác" để mở rộng.
   * **Nền Khu vực Khóa học có Điểm nhấn**: Nền phần danh mục khóa học dùng canvas có chiều sâu (màu xám slate `#EEF2F6` kết hợp họa tiết chấm kiến trúc `radial-gradient` và banner tiêu đề Navy `#0B2545` + viền Gold `#F59E0B`), giúp các thẻ khóa học trắng tinh khôi nổi bật rực rỡ, không bị cảm giác trắng trơn trống trải.
   * **Trung thực Dữ liệu (Không Fake số liệu)**: Đánh giá sao (Rating) và số lượng học viên khởi điểm là 0 (`0.0 (0 đánh giá)`, `0 Học viên`). Tuyệt đối không tự ý thêm các con số giả mạo.
   * **Ảnh Bìa Mẫu Khóa học Chuẩn mực (Sample Vector Covers)**: Toàn bộ khóa học sử dụng bộ ảnh bìa mẫu vector SVG đồng nhất (`/courses/course-*.svg`) thiết kế chuyên nghiệp theo nhận diện YT Academy (Navy `#0B2545`, Gold `#F59E0B`, mã môn học ACCA to rõ nét, cấp độ chứng chỉ, tên giảng viên Mr. Trần Minh Nhật); tuyệt đối KHÔNG cắt ảnh màn hình YouTube bị méo, nhòe hay dính viền đen. Sau này khi trung tâm có bộ ảnh đồ họa banner chính thức sẽ thay thế sau.
     Trên mỗi thẻ khóa học có huy hiệu số lượng video (ví dụ `15 video`) và chi tiết từng chương (Curriculum) có số bài học khớp chính xác với thực tế.
   * **Ảnh Nền Hero Banner (HeroSection)**: Dùng ảnh không gian làm việc tài chính điều hành cao cấp (`/hero-bg.webp`) với biểu đồ tài chính, sổ tay kế toán và tầm nhìn thành phố; tuyệt đối KHÔNG có số năm (như 2024), ngày tháng hay chữ code lập trình.
   * **Khối 4 Giá trị Cốt lõi (CoreValuesSection)**: Sử dụng ảnh nền không gian học viện cao cấp (`/core-values-bg.webp`) với lớp phủ sáng thanh lịch tôn vinh chi tiết kiến trúc, thẻ trắng tinh khôi viền vuông sắc nét, số thứ tự vàng kim `01-04`, hộp cam kết than chì viền vàng; tuyệt đối KHÔNG dùng nền xanh hay thẻ xanh bao trùm.
   * **Nguyên tắc Tinh gọn & Trực diện (Chuẩn mực BISC Online)**: Loại bỏ triệt để các đoạn văn miêu tả dài dòng, slogan lặp lại hay các hàng tag rườm rà. Banner chỉ gồm: Nhận diện thương hiệu -> Tiêu đề ngắn -> Ô tìm kiếm -> Nút ĐĂNG KÝ HỌC NGAY. Tiêu đề danh mục rút gọn thành `Khóa Học ACCA Online`. Khối giá trị cốt lõi đúc kết súc tích trong 1 câu ngắn, không viết văn bản dài gây rối mắt người học.
   * **Responsive hoàn hảo**: Bố cục mượt mà từ màn hình nhỏ (Mobile 360px+) đến màn hình lớn, không giật lag, không tràn ngang.
   * **Xác thực Người Thật & Captcha (Human Verification & Captcha in AuthModal)**:
     - Form Đăng nhập / Đăng ký trang bị module bảo mật kép:
       1. Checkbox "Bạn có phải là con người không? / Tôi là con người (I am human)": hiệu ứng kiểm tra xoay vòng spinner và chuyển sang tích xanh thành công.
       2. Hộp đồ họa Captcha bảo mật: mã ngẫu nhiên có đường kẻ ngang và chấm nhiễu, nút đổi mã (`RotateCw`) cùng ô nhập 4 ký tự xác thực.
       3. Kiểm tra tính hợp lệ chặt chẽ trước khi gửi biểu mẫu, hiển thị thông báo lỗi rõ ràng nếu chưa xác thực người thật hoặc nhập sai mã Captcha.
   * **Bản địa hóa 100% Đa ngôn ngữ (Full Bilingual i18n)**:
     - 100% các thành phần (Header, Hero, Bộ lọc, Lưới khóa học, Trang chi tiết môn học Slide 2, Phòng học trực tuyến Slide 3-4-5, Khóa học của tôi, Kích hoạt mã, Giỏ hàng, Modal Đăng nhập/Đăng ký, Tiện ích Liên hệ nổi Zalo/Hotline, Footer) sử dụng i18n (`vi.json` và `en.json`), chuyển đổi tức thì không còn sót văn bản hardcoded.

---

## 5. TÍNH NĂNG NGHIỆP VỤ CỐT LÕI (BẢN ĐỒ NGHIỆP VỤ)

1. **Header**:
   * Logo chuẩn YT Academy (Navy + Gold + Stars).
   * Mega-menu / Dropdown danh mục (ACCA, ICAEW, CFA, Big4, Kỹ năng...).
   * Ô tìm kiếm khóa học với debounced search.
   * Nút **"Kích hoạt khóa học"** (Mở popup nhập mã).
   * Nút **Chuyển đổi ngôn ngữ VI 🇻🇳 / EN 🇬🇧**.
   * Nút **Giỏ hàng** kèm badge số lượng và hiển thị tổng tiền nhanh.
   * Nút **Đăng nhập / Đăng ký**.
2. **Hero Section**:
   * Banner định vị "Học Viện Đào Tạo Chứng Chỉ & Kỹ Năng Nghề Nghiệp Quốc Tế".
   * Thống kê nổi bật (15.000+ Học viên, 98% Tỷ lệ đỗ, 50+ Giảng viên chuyên gia).
   * Tìm kiếm tức thì và các danh mục tag hot.
3. **Danh mục & Lưới khóa học**:
   * Tab chuyển đổi nhanh danh mục.
   * Thẻ khóa học trực quan: Thumbnail, nhãn giảm giá, tên khóa, giảng viên, sao đánh giá & số lượng học viên, giá gốc & giá khuyến mãi, nút "Thêm vào giỏ" & "Mua ngay".
4. **Giỏ hàng trượt (Cart Drawer)**:
   * Trượt từ phải sang khi thêm khóa học hoặc bấm vào icon giỏ hàng.
   * Tăng/giảm/xóa item, áp dụng mã ưu đãi voucher, hiển thị tạm tính.
5. **Modal Kích hoạt mã**:
   * Nhập mã kích hoạt nhận từ trung tâm / email, tra cứu và kích hoạt nhanh.
6. **Giảng viên & Cam kết chất lượng**:
   * Đội ngũ giảng viên chứng chỉ FCCA, CFA, chuyên gia Big4.
7. **Footer chuẩn**:
   * Thông tin công ty YT Academy, địa chỉ, hotline, email `ytacademy.com.vn`, chính sách bảo mật, thanh toán và khiếu nại.
8. **Tiện ích Liên hệ Nổi (Floating Contact Widget)**:
   * Vị trí góc phải dưới (`fixed bottom-6 right-5 z-40`).
   * Gồm 2 nút hành động: **Zalo** (màu xanh `#0068FF`) và **Hotline điện thoại** (màu đỏ `red-600`), 100% góc vuông (`rounded-none`).
   * Có hiệu ứng rung lắc chuông thu hút (`animate-ring-wiggle`) kèm sóng radar tỏa ra (`animate-radar-ripple`).
   * Đi kèm bóng thoại tư vấn (Speech Bubble) tự động chuyển động xoay vòng 4 thông điệp tư vấn lộ trình 1-1, giải đáp môn học, ưu đãi và tài liệu ôn thi.

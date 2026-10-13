# TÀI LIỆU DỰ ÁN & HỆ THỐNG THIẾT KẾ: YT ACADEMY

**Domain chính thức**: [ytacademy.com.vn](https://ytacademy.com.vn)  
**Mục tiêu**: Nền tảng bán khóa học đào tạo nghề nghiệp và chứng chỉ quốc tế (ACCA, ICAEW, CFA, Chinh phục Big4, Tài chính thực chiến).  
**Trang web tham chiếu**: [BISC Online](https://bisconline.edu.vn/) (Kế thừa luồng nghiệp vụ thực tiễn, cải tiến UX/UI vượt bậc).

---

## 1. THIẾT KẾ THƯƠNG HIỆU (BRAND IDENTITY)

### 1.1. Logo YT Academy
- Chữ **yt**: Màu Xanh Navy đậm (`#0B2545`) tượng trưng cho sự uy tín, học thuật, đỉnh cao tri thức.
- Chữ **academy**: Màu Vàng Kim Hổ Phách (`#F59E0B` - `#FBBF24`) tượng trưng cho sự thịnh vượng, tương lai sáng lạn, thành công nghề nghiệp.
- **Biểu tượng 2 ngôi sao**: Phía trên chữ **y** của academy màu vàng kim thể hiện chất lượng xuất sắc và học viên tỏa sáng.

### 1.2. Hệ thống màu sắc (Color Tokens)
```css
/* Navy Theme */
--color-navy-950: #07172C;
--color-navy-900: #0B2545; /* Brand Main Navy */
--color-navy-800: #133966;
--color-navy-700: #1E4E8C;

/* Amber Gold Theme */
--color-gold-600: #D97706;
--color-gold-500: #F59E0B; /* Brand Main Gold */
--color-gold-400: #FBBF24;
--color-gold-100: #FEF3C7;
--color-gold-50:  #FFFBEB;

### 1.3. Quy chuẩn định dạng Hình ảnh & Logo
- **Logo chính**: Vector **SVG** (`logo.svg`) cho độ sắc nét vô hạn trên mọi màn hình Retina/4K, nền trong suốt hoàn toàn.
- **Logo nền tối**: Vector **SVG** (`logo-white.svg`) chữ "yt" màu trắng nổi bật trên nền Navy Footer/Hero.
- **Logo fallback**: **WebP** (`logo.webp`) và **PNG** (`logo.png`) đã crop viền sát nội dung và tách nền trong suốt 100%.
- **Favicon**: Vector **SVG** (`favicon.svg`) có biểu tượng tia sáng Sparkles vàng.
- **Ảnh khóa học & Banner**: Định dạng nén tối ưu **WebP / AVIF**, kích thước chuẩn tỉ lệ 16:9, tích hợp `loading="lazy"` và `decoding="async"`.

---

## 2. CÔNG NGHỆ & THƯ VIỆN

- **Frontend**: React 18/19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Đa ngôn ngữ (i18n)**: i18next, react-i18next (Hỗ trợ Tiếng Việt `vi` và Tiếng Anh `en`)
- **Icon Set**: Lucide React
- **Quản lý Trạng thái**: Zustand
- **Backend Directory**: `/backend` (Tách biệt hoàn toàn để phát triển sau này)

---

## 3. QUY TRÌNH & NGUYÊN TẮC PHÁT TRIỂN

1. **Không hardcode chuỗi text**: Bắt buộc sử dụng i18n key trong `src/i18n/locales/vi.json` và `src/i18n/locales/en.json`.
2. **Feature-based Pattern**: Mỗi tính năng lớn (Courses, Cart, Activation, Auth) nằm riêng biệt trong `src/features/<feature_name>`.
3. **Data Mocking chuẩn DTO**: Tách các service gọi API trong `features/<feature>/courseService.ts` để sau này thay đổi endpoint backend chỉ trong 1 dòng.
4. **Mobile First & Hiệu năng cao**: Tối ưu mọi tương tác trên di động, lazy load ảnh, mượt mà ở 60fps.

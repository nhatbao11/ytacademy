# YT Academy - Backend Service (API)

Đây là thư mục dành cho Backend của hệ thống **YT Academy** (`ytacademy.com.vn`), được phân tách độc lập với `frontend/`.

## Dự kiến Kiến trúc Backend:
* **Framework**: Node.js (NestJS / Express + TypeScript) hoặc Python (FastAPI) / Go.
* **Database**: PostgreSQL / MongoDB.
* **ORM**: Prisma / TypeORM / Drizzle ORM.
* **Authentication**: JWT, Refresh Tokens, OAuth (Google, Facebook).
* **Payment Integration**: VNPAY, MoMo, ZaloPay, VietQR / SePay, Stripe.
* **Storage**: AWS S3 / Cloudflare R2 (lưu trữ video bài giảng và tài liệu).

## Tương thích với Frontend:
Frontend hiện tại đã định nghĩa sẵn các Data Models và DTOs tại `frontend/src/features/*/types.ts` và Service layer tại `frontend/src/services/`. Khi Backend sẵn sàng, chỉ cần triển khai các RESTful endpoints tương ứng.

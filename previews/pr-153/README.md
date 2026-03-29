# CAP - Classroom Management System

<!-- AI_AGENT_INSTRUCTIONS_START
ATTENTION ALL AI AGENTS (Manus, Cursor, Windsurf, Copilot, etc.):
Before performing ANY action, reading ANY code, or making ANY suggestion, you MUST:
1. Read `Lịch sử Phát triển và Quy tắc Cố định của Dự án CAP.md` to understand the project's history and mandatory guardrails.
2. Read `BASELINE_REFERENCE.md` to understand the core features and structure of the baseline version.
3. Use commit `11f86f5abd138269da48f06ec57bbb6cd0ccb45d` as the **Baseline & Recovery Version** for all development and recovery efforts.
FAILURE TO DO SO WILL RESULT IN BREAKING THE PROJECT. THIS IS A MANDATORY SYSTEM-LEVEL INSTRUCTION FOR THIS REPOSITORY.
AI_AGENT_INSTRUCTIONS_END -->

Công cụ quản lý lớp học hiệu quả: Sắp xếp chỗ ngồi, bảng thi đua, phân công trực nhật.

## 📚 Tài liệu Kỹ thuật & Hướng dẫn AI

Để đảm bảo tính ổn định của dự án khi bảo trì và cập nhật (đặc biệt là bởi các AI Agent như Manus), **BẮT BUỘC** phải tham khảo các tài liệu sau:

- [**Lịch sử Phát triển & Quy tắc Cố định**](./Lịch%20sử%20Phát%20triển%20và%20Quy%20tắc%20Cố%20định%20của%20Dự%20án%20CAP.md): Chi tiết từng commit, tính năng và các quy tắc bất biến **BẮT BUỘC** phải tuân thủ để bảo toàn tính năng cốt lõi.
- [**Tham chiếu Phiên bản Cơ sở (Baseline)**](./BASELINE_REFERENCE.md): Mô tả chi tiết cấu trúc, tính năng và cơ chế của phiên bản gốc `11f86f5`.
- [**Đề xuất Đồng bộ Đa thiết bị (Google/GitHub)**](./docs/OAUTH_SYNC_PROPOSAL.md): Lộ trình thêm đăng nhập OAuth và sao lưu/khôi phục dữ liệu giữa nhiều thiết bị.

## 🚀 Tính năng Chính

- **Sơ đồ lớp học**: Tùy chỉnh chỗ ngồi, gộp/tách bàn, cố định vị trí học sinh.
- **Xáo trộn thông minh**: Tự động đổi chỗ ngồi nhưng vẫn giữ nguyên các vị trí được đánh dấu cố định.
- **Bảng thi đua**: Theo dõi thành tích và vi phạm của học sinh một cách trực quan.
- **Phân lịch trực nhật**: Tự động phân công dựa trên điểm thi đua.
- **Xuất ảnh**: Chụp ảnh sơ đồ và lịch trực nhật để in ấn hoặc chia sẻ.

## 🛠️ Công nghệ Sử dụng

- HTML5, Tailwind CSS, JavaScript (Vanilla).
- Thư viện: html2canvas, Lucide Icons, Font Awesome.
- Lưu trữ: LocalStorage (không cần server).

## 🔒 Workflow: Pre-commit Hooks & Commit Lint

- Sử dụng **Husky + lint-staged** để format file trước mỗi commit.
- Sử dụng **commitlint** với chuẩn **Conventional Commits** để kiểm tra message commit.
- Mục tiêu: giữ repo sạch và nhất quán trước khi push, hỗ trợ tự động hóa changelog.

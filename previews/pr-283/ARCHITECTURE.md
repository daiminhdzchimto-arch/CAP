# Kiến trúc Dự án CAP (Classroom Management System)

Tài liệu này mô tả cấu trúc kỹ thuật và các thành phần cốt lõi của dự án CAP để đảm bảo tính ổn định khi bảo trì và cập nhật.

## 1. Tổng quan Công nghệ
Dự án là một ứng dụng web một trang (SPA) chạy hoàn toàn ở phía client (Client-side only).
- **Frontend Framework**: HTML5, Tailwind CSS (via CDN).
- **Icons**: Font Awesome 6.4.0, Lucide Icons.
- **Libraries**: 
  - `html2canvas`: Chụp ảnh màn hình sơ đồ và lịch trực nhật.
  - `lz-string`: Nén dữ liệu (có nhúng nhưng chưa sử dụng rộng rãi).
- **Storage**: `localStorage` (Key: `classApp_v28`).

## 2. Cấu trúc File
| File | Vai trò |
|------|---------|
| `index.html` | Chứa toàn bộ UI, CSS và Logic JavaScript của ứng dụng. |
| `favicon.ico` | Biểu tượng ứng dụng. |
| `robots.txt` | Cấu hình cho Search Engine. |
| `sitemap.xml` | Sơ đồ trang web. |
| `Lịch sử Phát triển và Quy tắc Cố định của Dự án CAP.md` | Lịch sử commit chi tiết và các quy tắc bắt buộc cho AI Agent. |
| `BASELINE_REFERENCE.md` | Tham chiếu chi tiết về phiên bản cơ sở `11f86f5abd138269da48f06ec57bbb6cd0ccb45d`. |

## 3. Luồng Dữ liệu & Trạng thái (State Management)
Dữ liệu được quản lý thông qua các biến toàn cục và đồng bộ với `localStorage`.

### Các biến trạng thái chính:
- `leftSideData` / `rightSideData`: Mảng chứa cấu trúc chỗ ngồi (tên, độ rộng, trạng thái cố định).
- `fixedMembers`: Danh sách ID các học sinh được đánh dấu "cố định" (không bị xáo trộn).
- `dutySelection`: Lưu trữ các hàng/dãy được chọn để phân công trực nhật.
- `genderMap`: Lưu trữ thông tin giới tính của học sinh.

### Quy trình lưu trữ:
1. Người dùng thay đổi dữ liệu (nhập tên, đổi chỗ, v.v.).
2. Hàm `saveData()` được gọi để lưu object vào `localStorage`.
3. Khi tải trang, `loadData()` sẽ khôi phục trạng thái từ `localStorage`.

## 4. Các Module Chức năng Chính
1. **Sơ đồ lớp học (Seating Map)**:
   - Cho phép nhập tên, gộp/tách bàn, cố định vị trí (Ctrl+Click).
   - Chức năng Shuffle (Xáo trộn) có tính đến các vị trí `isFixed`.
2. **Bảng thi đua (Competition Table)**:
   - Đồng bộ tên từ sơ đồ lớp.
   - Nhập vi phạm/thành tích qua Modal với các gợi ý sẵn có.
   - Tự động tính điểm dựa trên `HEAVY_FAULT_PATTERNS`.
3. **Lịch trực nhật (Duty Schedule)**:
   - Tự động phân công dựa trên điểm thi đua (người điểm cao/vi phạm nhiều làm nhiều hơn).
   - Cho phép tùy chỉnh khu vực và ban cán sự.

## 5. Các điểm cần lưu ý khi sửa đổi
- **Tránh sửa đổi trực tiếp cấu trúc DOM**: Ứng dụng dựa vào việc render lại (hàm `renderAll`, `renderSide`) dựa trên dữ liệu mảng.
- **Tính nhất quán của ID**: Mỗi chỗ ngồi có một `id` ngẫu nhiên được tạo lúc init, cần giữ nguyên ID này khi di chuyển dữ liệu để tránh mất trạng thái `fixed`.
- **Local Storage Key**: Luôn sử dụng key `classApp_v28` để đảm bảo tính tương thích ngược.
- **Phiên bản Cơ sở (Baseline)**: Mọi thay đổi cấu trúc lớn phải được so sánh với commit `11f86f5abd138269da48f06ec57bbb6cd0ccb45d`. Đây là phiên bản chứa toàn bộ tính năng và cơ chế cơ sở cần bảo tồn. AI Agent có thể sử dụng phiên bản này để khôi phục nếu các thay đổi mới làm hỏng hệ thống.

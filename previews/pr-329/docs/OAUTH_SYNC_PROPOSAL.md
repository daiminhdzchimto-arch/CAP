# Đề xuất tính năng: Đăng nhập Google/GitHub để đồng bộ CAP đa thiết bị

## Bối cảnh

Hiện CAP lưu dữ liệu trong `localStorage` và file export `.cap`, phù hợp khi dùng trên 1 thiết bị nhưng chưa thuận tiện khi giáo viên đổi máy hoặc dùng song song điện thoại + laptop.

## Mục tiêu

- Cho phép người dùng đăng nhập bằng **Google** hoặc **GitHub**.
- Đồng bộ dữ liệu lớp học giữa nhiều thiết bị theo tài khoản.
- Vẫn giữ cơ chế hiện tại (`localStorage` + `.cap`) để tương thích ngược.

## Phạm vi đề xuất (MVP)

1. **Đăng nhập OAuth**
   - Nút `Đăng nhập Google`
   - Nút `Đăng nhập GitHub`
2. **Cloud backup thủ công**
   - `Sao lưu lên Cloud`
   - `Khôi phục từ Cloud`
3. **Không phá vỡ dữ liệu cũ**
   - Nếu chưa đăng nhập: ứng dụng vẫn hoạt động local như hiện tại.

## Kiến trúc gợi ý

- **Frontend (CAP hiện tại):** giữ nguyên logic render từ `leftSideData`/`rightSideData`.
- **Auth + DB (khuyến nghị):** Firebase Authentication + Firestore (nhanh triển khai) hoặc Supabase/Auth.js.
- **Schema dữ liệu cloud:**

```json
{
  "uid": "user-id",
  "version": "classApp_v28",
  "updatedAt": "ISO_TIMESTAMP",
  "payload": {
    "leftSideData": [],
    "rightSideData": [],
    "competitionData": [],
    "dutyData": [],
    "fixedMembers": [],
    "meta": {
      "className": "...",
      "schoolYear": "..."
    }
  }
}
```

## Luồng đồng bộ đề xuất

1. Mở app → đọc local như hiện tại.
2. Nếu người dùng đăng nhập:
   - So sánh `updatedAt` local và cloud.
   - Hiển thị lựa chọn: `Dùng bản mới hơn` / `Giữ bản hiện tại`.
3. Khi người dùng bấm `Sao lưu lên Cloud`, ghi toàn bộ state hiện tại lên cloud.
4. Khi bấm `Khôi phục`, tải từ cloud về local rồi gọi `renderAll()`.

## Quy tắc an toàn dữ liệu

- Luôn giữ local làm bản dự phòng.
- Mọi thao tác ghi cloud cần có thông báo thành công/thất bại rõ ràng.
- Áp dụng versioning (`classApp_v28` hoặc mới hơn) để tránh lỗi schema.
- Thêm nút `Xuất .cap` như phương án dự phòng offline.

## UX đề xuất

- Góc phải header thêm badge trạng thái: `Chưa đăng nhập` / `Đã đăng nhập`.
- Khu vực dữ liệu thêm cụm nút:
  - `Đăng nhập Google`
  - `Đăng nhập GitHub`
  - `Sao lưu Cloud`
  - `Khôi phục Cloud`
  - `Đăng xuất`

## Lộ trình triển khai

### Giai đoạn 1

- UI đăng nhập + tích hợp OAuth.
- Lưu/tải thủ công từ cloud.

### Giai đoạn 2

- Tự động đồng bộ khi có thay đổi (debounce 2–5 giây).
- Lịch sử phiên bản gần nhất (3 snapshots).

### Giai đoạn 3

- Chia sẻ lớp học theo liên kết chỉ đọc.
- Đồng bộ cộng tác theo quyền (owner/editor/viewer).

## Tiêu chí hoàn thành

- Đăng nhập được bằng Google/GitHub.
- Dữ liệu tạo ở thiết bị A khôi phục được ở thiết bị B cùng tài khoản.
- Không mất tương thích với luồng local hiện tại.

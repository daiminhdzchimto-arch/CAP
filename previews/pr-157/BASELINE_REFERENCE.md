# BASELINE REFERENCE: Commit 11f86f5abd138269da48f06ec57bbb6cd0ccb45d

**Phiên bản này được chỉ định là "Phiên bản Gốc Chuẩn" (Gold Standard/Baseline) của dự án CAP.**

Phiên bản `11f86f5abd138269da48f06ec57bbb6cd0ccb45d` là điểm tham chiếu cốt lõi cho mọi phát triển và khôi phục trong tương lai của dự án CAP. Nó chứa toàn bộ các tính năng, cấu trúc và cơ chế cơ sở đã được xác nhận là ổn định và đáng tin cậy. Mọi thay đổi trong tương lai phải được xây dựng dựa trên phiên bản này, và mọi nỗ lực khôi phục sẽ quay về commit này làm điểm tham chiếu.

## 🔑 Các Đặc điểm Chính của Phiên bản Baseline (11f86f5)

### 1. Giao diện Sơ đồ Lớp Học (UI)

*   **Bố cục**: Tiêu đề lớp học (ví dụ: "TUẦN 25", "Năm học") nằm phía trên bảng đen, được thiết kế đậm và rõ nét.
*   **Bảng Giảng**: Thiết kế bảng giảng màu tối, bo góc, là trung tâm của khu vực sơ đồ.
*   **Góc Phòng**: Nhãn "CỬA RA VÀO" và "BÀN GIÁO VIÊN" được đặt ở hai góc phía trên, tinh tế và rõ ràng.
*   **Ô Bàn Học**: Các ô bàn học có màu xanh nhạt, bo góc tròn, viền đậm, hỗ trợ cơ chế gộp bàn (merge) và tách bàn (split).
*   **Nền**: Nền sơ đồ có hiệu ứng ô lưới chấm (`radial-gradient`) giúp căn chỉnh trực quan.

### 2. Tính năng Cốt lõi

*   **Quản lý Sơ đồ Chỗ ngồi**: 
    *   Cho phép nhập tên học sinh vào từng ô bàn học.
    *   Hỗ trợ gộp (merge) và tách (split) các ô bàn.
    *   **Xáo trộn (Shuffle)**: Tính năng xáo trộn chỗ ngồi toàn bộ hoặc theo từng dãy.
    *   **Cố định chỗ ngồi (Fixed Members)**: Khả năng "neo" học sinh vào một vị trí cố định (sử dụng `Ctrl + click`).
    *   **Nhấn giữ (Long Press) để đổi chỗ**: Nhấn giữ một ô để chọn nguồn, sau đó nhấn ô khác để đổi tên học sinh.
    *   **Cuốn chiếu (Rotate/Shift)**: Các nút mũi tên để dịch chuyển toàn bộ chỗ ngồi của lớp lên hoặc xuống.

*   **Bảng Thi Đua & Trực Nhật**: 
    *   **Đồng bộ tên**: Tự động lấy danh sách học sinh từ sơ đồ lớp sang bảng thi đua.
    *   **Nhập liệu lỗi/thành tích**: Modal nhập liệu nhanh với các tag cho điểm số, môn học, lỗi nặng/nhẹ.
    *   **Tính điểm**: Tự động tính điểm lỗi dựa trên các từ khóa.
    *   **Phân lịch Trực nhật**: Tự động phân công trực nhật dựa trên điểm thi đua (ưu tiên học sinh có nhiều lỗi).

*   **Lưu trữ & Xuất file**: 
    *   **Lưu trữ cục bộ**: Sử dụng `localStorage` để lưu trữ trạng thái ứng dụng, đảm bảo dữ liệu không bị mất khi tải lại trang.
    *   **Tải ảnh**: Chức năng tải ảnh sơ đồ lớp và lịch trực nhật dưới dạng PNG chất lượng cao, với ID ngẫu nhiên trong tên file (`so-do-lop-RANDOM_ID.png`).

## 🛠️ Hướng dẫn cho AI Agent và Người Phát triển

Khi làm việc với repository CAP, hãy luôn ghi nhớ rằng commit `11f86f5abd138269da48f06ec57bbb6cd0ccb45d` là phiên bản gốc chuẩn. Mọi tính năng mới hoặc sửa lỗi phải được tích hợp một cách cẩn thận để không làm phá vỡ cấu trúc và các tính năng cốt lõi đã có trong phiên bản này. Trong trường hợp cần khôi phục, hãy sử dụng commit này làm điểm khởi đầu.

# Lịch sử Phát triển và Quy tắc Cố định của Dự án CAP

Tài liệu này ghi lại chi tiết quá trình thay đổi, các tính năng, cấu trúc giao diện và cơ chế hoạt động từ commit `128c31487d5b4817acff518f3d4685186bb5e5b2` đến hiện tại. Đồng thời, nó thiết lập các **quy tắc và quy ước bất biến** mà mọi AI Agent (bao gồm cả Manus) phải tuân thủ khi chỉnh sửa repository này.

## 📌 Quy tắc và Quy ước Cố định (AI Guardrails)

Bất kỳ AI Agent nào khi truy cập vào repository này **BẮT BUỘC** phải tuân thủ các quy tắc sau để không làm mất tính năng hoặc phá vỡ cấu trúc. Việc duy trì tính nhất quán giữa dữ liệu và giao diện là yếu tố then chốt của dự án này.

| Quy tắc | Chi tiết kỹ thuật | Mục đích |
| :--- | :--- | :--- |
| **Bảo toàn ID phần tử** | Các ID như `classroom-area`, `left-side`, `right-side`, `competition-tbody`, `duty-tbody`, `input-modal`, `duty-modal`, `shuffle-modal` là cốt lõi cho logic JS. | Đảm bảo các hàm JavaScript tìm thấy đúng phần tử DOM để render và xử lý sự kiện. |
| **Cơ chế Lưu trữ** | Luôn sử dụng `localStorage` với key `classApp_v28`. Mọi thay đổi dữ liệu phải gọi `saveData()`. | Duy trì trạng thái ứng dụng giữa các phiên làm việc của người dùng mà không cần database. |
| **Quy tắc Xáo trộn** | Chức năng Shuffle phải luôn tôn trọng trạng thái `isFixed` trong mảng dữ liệu. Không được xáo trộn các ô có ID nằm trong `fixedMembers`. | Bảo vệ vị trí của những học sinh đặc biệt hoặc ban cán sự lớp đã được cố định từ trước. |
| **Tính nhất quán UI** | Giao diện phải bám sát cấu trúc: Bảng giáo viên ở trên cùng, Cửa ra vào ở vị trí xác định, Sơ đồ chia thành 2 dãy (Trái/Phải). | Giữ nguyên trải nghiệm người dùng và tính thẩm mỹ khi xuất ảnh sơ đồ. |
| **Luồng Dữ liệu** | Ứng dụng hoạt động theo cơ chế **Data-Driven Rendering**. Không sửa trực tiếp DOM, hãy sửa mảng dữ liệu (`leftSideData`, `rightSideData`) rồi gọi `renderAll()`. | Tránh xung đột giữa trạng thái dữ liệu (State) và hiển thị (View). |
| **Phiên bản Baseline** | Commit `11f86f5abd138269da48f06ec57bbb6cd0ccb45d` là phiên bản gốc chuẩn. | Mọi AI Agent phải tham chiếu và xây dựng dựa trên phiên bản này. Khôi phục về trạng thái này khi có yêu cầu. |

## 📜 Chi tiết Lịch sử Commit

Dưới đây là phân tích chi tiết từng bước phát triển của dự án, liệt kê các tính năng và cơ chế hoạt động được thêm vào qua từng giai đoạn.

### Giai đoạn Khởi tạo và Nâng cấp Cơ bản
Trong commit `5f14a1c8dc97906c3071f85cbb4c674d7f069cee`, cấu trúc cơ bản của ứng dụng quản lý lớp học đã được hình thành. Giao diện được thiết kế với Header chứa Tiêu đề và Năm học có khả năng chỉnh sửa trực tiếp thông qua thuộc tính `contenteditable`. Hệ thống Modal cũng được xây dựng đồng bộ để phục vụ việc nhập liệu chi tiết cho từng học sinh. Cơ chế hoạt động chính ở giai đoạn này là sử dụng các Badge điểm số (`points-badge`) để hiển thị trực quan các vi phạm hoặc thành tích của học sinh ngay trên sơ đồ.

Đến phiên bản v24.1 (commit `5ce7a8b4802c5b59d94eda17f432086bcb3c1437`), ứng dụng đã bổ sung các nút chức năng quan trọng như "Hiện Ngày Nghỉ" và "Tải Lịch Trực". Bảng trực nhật được nâng cấp với các cột chi tiết hơn như Quét lớp, Đổ rác, Giặt khăn và Trực khu vực. Đặc biệt, việc tích hợp thư viện `html2canvas` đã cho phép người dùng xuất ảnh lịch trực nhật chất lượng cao để in ấn.

### Hệ thống Chia sẻ và Xáo trộn Thông minh
Khả năng cộng tác được nâng cao trong commit `944fac1e195353d45b0afe7d35cbeb9e2bfc5926` với tính năng Export/Import. Người dùng có thể xuất toàn bộ cấu trúc lớp học ra file định dạng `.cap` hoặc sử dụng mã chia sẻ (Share Code) để đồng bộ nhanh chóng giữa các thiết bị. Đây là cơ chế quan trọng giúp giáo viên lưu trữ nhiều phương án sơ đồ khác nhau.

Tính năng "Cố định vị trí" và "Xáo trộn" được giới thiệu trong commit `0959f93d0215f7c139c080fb2c200c6e9fb2c001`. Một mảng `fixedMembers` được sử dụng để lưu trữ ID của các ô chỗ ngồi mà người dùng muốn giữ nguyên. Khi kích hoạt hàm `shuffleSeating`, thuật toán sẽ bỏ qua các vị trí này, đảm bảo tính linh hoạt nhưng vẫn giữ được trật tự cần thiết cho lớp học.

### Các Tính năng Nâng cao và Tối ưu UI
Dự án đạt bước tiến lớn về mặt kỹ thuật trong commit `67163f3b433add9df5931c1f6aabf139176a4fce` với hệ thống Gió (Wind) và Quản lý Xung đột (Conflict). Một `Conflict Graph` được thiết lập để theo dõi các cặp học sinh không nên ngồi cạnh nhau, hiển thị cảnh báo bằng dấu chấm đỏ (`conflict-dot`) nếu có vi phạm. Mini-map cũng được thêm vào để cung cấp cái nhìn tổng quan về sơ đồ và các điểm nóng xung đột.

Trong các commit tiếp theo như `c7a569a5a4e96b98c60caf3eefd18a20fda4b983` và `99263d38bd8bab7ed1bc69aee59b162bb52c1282`, giao diện đã được tinh chỉnh để tối ưu không gian, như việc di chuyển thông tin lớp học ra sau bảng đen và thay thế hành lang bằng bàn giáo viên. Các tính năng bị mất cũng được khôi phục, bao gồm hàm `syncNamesFromSeating()` để tự động đồng bộ danh sách học sinh và logic phân công trực nhật dựa trên điểm thi đua tuần trước.

### 🛡️ Phiên bản Dự phòng và Cơ sở (Baseline & Recovery Version): Commit `11f86f5abd138269da48f06ec57bbb6cd0ccb45d`

**Phiên bản này được chính thức chỉ định là "Phiên bản Dự phòng kiêm Phiên bản Cơ sở" (Baseline & Recovery Version) của dự án CAP.** Nó chứa toàn bộ các tính năng, cấu trúc giao diện và cơ chế hoạt động nền tảng đã được xác nhận là ổn định và đáng tin cậy. Đây là điểm tham chiếu cốt lõi cho mọi hoạt động phát triển và khôi phục trong tương lai.

*   **Mục đích**: Dùng để khôi phục trạng thái ổn định nếu các phiên bản sau gặp lỗi nghiêm trọng hoặc mất tính năng. Đảm bảo tính toàn vẹn và khả năng hoạt động của ứng dụng.
*   **Quy ước**: Mọi AI Agent khi phát triển tính năng mới **BẮT BUỘC** phải tham chiếu đến cấu trúc và logic của phiên bản này để đảm bảo không làm mất đi các cơ chế cốt lõi. Nếu có sự sai lệch không mong muốn, AI Agent phải tự động khôi phục dựa trên logic của phiên bản cơ sở này. Các thay đổi trong tương lai phải được xây dựng dựa trên nền tảng vững chắc này.

---

**Lưu ý**: Tài liệu này là một phần của hệ thống bảo vệ mã nguồn. Mọi chỉnh sửa không tuân thủ các quy tắc trên sẽ bị coi là lỗi nghiêm trọng và có thể làm hỏng tính toàn vẹn của ứng dụng.




# Quy tắc Nền tảng và Bảo mật Tính năng (Core Rules & Feature Security) đã được phê duyệt

Dựa trên phân tích từ tệp `QuảnLýLớpHọc.txt` (tài liệu gốc từ AI tiền nhiệm) và so sánh với repository hiện tại, danh sách các tính năng, cấu trúc và cơ chế **CỐ ĐỊNH** dưới đây đã được người dùng phê duyệt. Đây là nền tảng mà mọi AI Agent phải tuân thủ tuyệt đối để không làm mất đi linh hồn và công năng của ứng dụng.

## 📊 Bảng Tổng hợp Tính năng & Quy tắc Nền tảng

| Thành phần | Mô tả chi tiết & Hình ảnh minh họa (Mô tả) | Quy tắc Cố định (Bất biến) |
| :--- | :--- | :--- |
| **Cấu trúc Lưới (Seating Grid)** | Gồm 2 dãy bàn chính (Trái/Phải). Dãy 1 cạnh cửa, Dãy 2 cạnh bàn giáo viên. Mặc định 6 hàng, 4 cột mỗi hàng. | **KHÔNG** được thay đổi số dãy bàn mặc định. Phải giữ nguyên cơ chế `merge` (gộp) và `split` (tách) ô. |
| **Cơ chế Xáo trộn (Shuffle)** | Nút "Xếp Chỗ" kích hoạt thuật toán xáo trộn ngẫu nhiên nhưng có điều kiện. | **BẮT BUỘC** tôn trọng trạng thái `isFixed`. Các ô trong danh sách `fixedMembers` không bao giờ được đổi vị trí. |
| **Quản lý Xung đột (Conflict)** | Hiển thị dấu chấm đỏ (`conflict-dot`) và đường nối trong Mini-map cho các cặp học sinh "hay nói chuyện". | **CẤM** xóa bỏ `Conflict Graph`. Cơ chế cảnh báo xung đột phải luôn hoạt động khi render sơ đồ. |
| **Bảng Thi đua (Competition)** | Bảng liệt kê STT, Họ tên, Thành tích, Vi phạm. Tự động tính điểm lỗi dựa trên từ khóa. | **KHÔNG** thay đổi mảng `HEAVY_FAULT_PATTERNS` và `LIGHT_FAULT_PATTERNS`. Logic tính điểm phải giữ nguyên để phân trực nhật đúng. |
| **Phân trực nhật (Duty)** | Tự động phân công dựa trên điểm lỗi (người lỗi nặng làm việc nặng). Chia thành Trực Lớp (Xanh) và Trực Khu Vực (Cam). | **KHÔNG** được làm mất logic "Penalty-based Assignment". Phải giữ nguyên 2 chế độ chọn dãy trên Mini-map của Modal. |
| **Lưu trữ (Storage)** | Sử dụng `localStorage` để lưu toàn bộ trạng thái ứng dụng. | Key lưu trữ **BẮT BUỘC** là `classApp_v28` (hoặc phiên bản mới nhất đã thống nhất). Phải gọi `saveData()` sau mỗi thao tác input. |
| **Xuất ảnh (Export)** | Sử dụng `html2canvas` để chụp vùng sơ đồ hoặc lịch trực nhật. | Phải giữ nguyên logic ẩn các nút điều khiển (`onclone`) trước khi chụp để ảnh xuất ra được sạch sẽ và chuyên nghiệp. |

## 🛠️ Cơ chế Hoạt động Đặc biệt cần Bảo vệ

### 1. Cơ chế Hoán đổi (Long Press Swap)
*   **Mô tả**: Nhấn giữ một ô trong 500ms để chọn nguồn, sau đó nhấn ô khác để đổi tên.
*   **Quy tắc**: Không được thay thế bằng kéo thả (Drag & Drop) trừ khi có yêu cầu rõ ràng, vì Long Press ổn định hơn trên thiết bị di động.

### 2. Mở rộng Viết tắt (Expand Text)
*   **Mô tả**: Tự động chuyển `kp` -> `không phép`, `vs` -> `vệ sinh` khi ô mất focus.
*   **Quy tắc**: Mảng Regex trong hàm `expandText` là tài sản tri thức của ứng dụng, không được xóa bỏ các từ viết tắt đã định nghĩa.

### 3. Hiệu ứng Gió & Thời tiết (Wind System)
*   **Mô tả**: Các hạt bụi/lá bay và đường nối dao động theo cường độ gió (giả lập hoặc thực tế).
*   **Quy tắc**: Đây là tính năng thẩm mỹ đặc trưng. AI Agent không được gỡ bỏ `ParticleEngine` dù nó làm code phức tạp hơn.

---

## ⚠️ Lời nhắc cho AI Agent (Mandatory Prompt)

> "Tôi là một AI Agent đang hỗ trợ phát triển dự án CAP. Tôi cam kết giữ nguyên các ID phần tử, cấu trúc dữ liệu mảng (`leftSideData`, `rightSideData`), và các logic nghiệp vụ (Shuffle, Duty, Conflict) đã được liệt kê trong `HISTORY.md`. Tôi sẽ chỉ xây dựng thêm tính năng mới dựa trên nền tảng này và không bao giờ xóa bỏ các cơ chế cốt lõi nếu không có lệnh trực tiếp từ người dùng."

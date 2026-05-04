# CAP Feature Gap Audit (2026-04-03)

## Phạm vi quét

- File ứng dụng chính: `index.html`.
- File kiến trúc bổ sung: `cap-classroom-architectural.html`.
- Đối chiếu theo 3 đợt thay đổi mà bạn cung cấp (Lần 1, Lần 2, Lần 3).

## Kết luận nhanh

Dựa trên mã hiện tại, dự án **đã có nhiều tính năng cốt lõi** (tab Sơ đồ/Thi đua, lưu localStorage, modal chia sẻ, import/export, chọn ngày nghỉ, loại trừ thành viên, badge điểm lỗi, chụp ảnh) nhưng **đang thiếu một số nhóm tính năng quan trọng** so với danh sách yêu cầu lịch sử bạn đưa ra.

## Các tính năng xác nhận là đang có

1. **Nút Chia sẻ + modal chia sẻ + import/export file/code** đã tồn tại trong header và script (`openShareModal`, `copyShareCode`, `importFromCode`, `exportToFile`, `importFromFile`).
2. **Ngày nghỉ trực nhật** và nút bật/tắt hiển thị ngày nghỉ đã có (`toggleDayOffMode`, `dayOffs`, `excludedMembers`, `saveDutySettings`).
3. **Tự động lấy danh sách tên từ sơ đồ khi textarea trống** đã có trong `generateTable()`.
4. **Mở rộng viết tắt + tính điểm lỗi** có tồn tại (`expandText`, `calculateFaultPoints`).

## Các tính năng thiếu / chưa đạt theo danh sách yêu cầu

### A) Thiếu hoàn toàn (không thấy hàm/luồng chức năng)

1. **Menu “Mẫu” 6 kịch bản + hàm `loadScenario`**: không tìm thấy hàm `loadScenario` trong cả 2 file HTML.
2. **Hệ thống “Nợ trực nhật” đầy đủ**: chỉ thấy hằng `DUTY_DEBT_KEY`, nhưng không có các hàm quản lý nợ như `addDutyDebtManagementUI`, `showDutyDebtModal`, `updateDutyDebtFromViolations`, `reduceDutyDebt`, `addManualDebt`.
3. **API tách biệt để áp dữ liệu import `applyImportedData(data)`**: không có hàm riêng như mô tả (logic đang gộp trực tiếp trong `importFromCode`/`importFromFile`).
4. **Các hàm thuật toán trực nhật theo thiết kế v24.1**: không thấy `calculatePenaltyLogic` và `calculateZeroFaultSchedule`.

### B) Mới ở mức một phần / khác thiết kế mô tả

1. **Danh sách cán bộ lớp động (add/xóa nhiều dòng)**:
   - Có biến `officerList`, có khu input cán bộ trong modal.
   - Nhưng không có hàm theo spec `addOfficerRow`, `getOfficers`, `distributeMonitors`; do đó chưa chứng minh được cơ chế luân phiên cán bộ theo ngày như tài liệu yêu cầu.
2. **Thuật toán phân trực nhật nâng cao**:
   - Có `calculateAdvancedDutySchedule()` nhưng hiện là phiên bản rút gọn: dùng `heavyQ/lightQ` cơ bản + fallback quay vòng theo danh sách eligible.
   - Chưa thấy các tầng ưu tiên đầy đủ theo spec (debtQ → heavyQ → lightQ → dãy), chưa thấy tách hàm zero/hybrid/penalty chuyên biệt.
3. **Hiển thị excluded member ở mini-map/gender list bằng class `member-excluded`**:
   - CSS `.member-excluded` có định nghĩa, nhưng không thấy nơi áp class này vào DOM (không có usage ngoài phần CSS).
4. **Hàm cập nhật ô thi đua theo spec `updateCompetitionCell`**:
   - Hiện đang dùng `updatePoints` trên blur; khác tên và khác contract mô tả trong tài liệu đợt thay đổi.

## Bằng chứng quét hàm trọng yếu

Kết quả kiểm tra tự động cho các hàm bắt buộc trong mô tả đợt thay đổi (trên cả `index.html` và `cap-classroom-architectural.html`):

- Không tìm thấy: `loadScenario`, `addDutyDebtManagementUI`, `showDutyDebtModal`, `updateDutyDebtFromViolations`, `reduceDutyDebt`, `addManualDebt`, `addOfficerRow`, `getOfficers`, `distributeMonitors`, `calculatePenaltyLogic`, `calculateZeroFaultSchedule`, `applyImportedData`.

## Đề xuất thứ tự bổ sung (ưu tiên)

1. **Khôi phục nhóm “Mẫu dữ liệu” + `loadScenario`** để tiện test nhanh.
2. **Khôi phục trọn bộ “Nợ trực nhật”** (UI + storage + auto update từ vi phạm + giảm nợ sau phân công).
3. **Nâng cấp thuật toán phân trực** theo đúng kiến trúc v24.1 (zero/hybrid/penalty và monitor distribution).
4. **Chuẩn hóa import pipeline với `applyImportedData`** để giảm trùng lặp logic.
5. **Bổ sung hiển thị trực quan excluded member (`member-excluded`)** ở gender list/mini-map đúng spec.

# Regression analysis: current web version vs `c3d465665e7e31b0d9bd8e2567adecd144e33d88`

## Scope

- Baseline commit: `c3d465665e7e31b0d9bd8e2567adecd144e33d88`.
- Current branch HEAD: `4f6edc8`.
- Mục tiêu: xác định các thay đổi có rủi ro cao khiến web "không còn hoạt động như trước".

## Những gì đã thay đổi đáng kể

### 1) Khối logic trong `index.html` đã tăng rất lớn

- So với baseline, `index.html` tăng mạnh (hơn 1.2k dòng thay đổi).
- Điều này làm tăng xác suất regression do:
  - nhiều logic runtime nằm inline trong 1 file duy nhất;
  - khó kiểm soát dependency giữa các tính năng (weather, autosave, overlay, update check);
  - khó test hồi quy từng khu vực.

### 2) Bổ sung cơ chế auto-refresh theo version endpoint

- Bản hiện tại thêm endpoint `version.json` và logic tự kiểm tra phiên bản để reload trang.
- Luồng mới:
  - định kỳ fetch `version.json`;
  - nếu commit khác thì `window.location.reload()`.
- Rủi ro:
  - có thể tạo reload loop nếu metadata không ổn định giữa các request;
  - có thể gây cảm giác "web không chạy ổn định" (đang dùng bị reload).

### 3) Service Worker được chỉnh sửa mạnh (install/cache strategy)

- Bản cũ dùng `cache.addAll(CORE_ASSETS)` trong `install`.
- Bản mới đổi sang `Promise.allSettled + fetch(no-store) + cache.put` từng asset.
- Bản mới cũng thêm `version.json` vào lõi cache và thay đổi `CACHE_VERSION`.
- Rủi ro:
  - nếu pre-cache fail từng phần, trạng thái offline/first-load có thể không nhất quán;
  - behavior khác biệt theo môi trường host/CDN, khó tái hiện đồng nhất.

### 4) Manifest đổi `start_url`

- Từ `./index.html` sang `./`.
- Với một số cách deploy/PWA launch, thay đổi này có thể tạo khác biệt điều hướng ban đầu so với bản cũ.

### 5) Tách thêm `scripts/weather.js` nhưng vẫn giữ weather logic lớn trong `index.html`

- Hiện tại tồn tại song song:
  - weather logic inline trong `index.html`;
  - thêm file `scripts/weather.js` được nạp cuối trang.
- Rủi ro:
  - hai hệ thống weather cùng chạy có thể tranh chấp UI/state;
  - khó xác định nguồn lỗi khi widget/overlay hoạt động bất thường.

## Timeline commit có khả năng liên quan trực tiếp

1. `d4dc046` / `6509e4a`: bắt đầu tích hợp weather và provider abstraction.
2. `a1ddb48`, `a8ac09c`, `3f4df47`, `e96e27f`, `0a9a3e8`: chuỗi fix liên tục cho weather/widget/UI layering (dấu hiệu có xung đột lặp lại).
3. `cfabc83`: thêm `version.json` + refresh cache PWA.
4. `0c0a64b`: sửa mạnh service worker asset loading.

## Kết luận điều tra (khả năng cao)

- Regression không đến từ 1 thay đổi nhỏ đơn lẻ, mà từ **tổ hợp** các thay đổi runtime lớn trên cùng một trang:
  1. tăng độ phức tạp logic inline;
  2. bổ sung auto-update + reload;
  3. đổi chiến lược cache của service worker;
  4. chồng chéo weather logic inline và file ngoài.

Trong các nhóm trên, **2 điểm đáng ưu tiên kiểm chứng đầu tiên** là:

- service worker + caching path (`0c0a64b`, `cfabc83`),
- luồng auto-refresh theo `version.json`.

## Đề xuất xác minh nhanh để khoanh vùng

1. Hard-disable service worker (DevTools > Application > Unregister) và test lại:
   - nếu web ổn -> lỗi nằm ở SW/cache/update path.
2. Tạm disable `checkForAppUpdate()` (hoặc tăng interval lớn) để loại trừ reload loop.
3. Tạm bỏ `scripts/weather.js` hoặc tắt init tự động trong file đó để kiểm tra xung đột 2 lớp weather.
4. Chạy matrix test theo 2 mode:
   - lần mở đầu (cold start, cache rỗng),
   - sau khi đã có SW cache (warm start).

## Ghi chú môi trường kiểm thử

- Đã thử chuẩn bị Playwright để tái hiện lỗi runtime, nhưng môi trường thiếu thư viện hệ thống (`libatk-1.0.so.0`) nên không chạy được trình duyệt headless tại đây.

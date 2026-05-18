# Kế hoạch Nâng cấp Tính năng Thời tiết cho CAP

## 1. Mục tiêu
- Thêm các loại thời tiết đa dạng: Nắng, Mưa, Tuyết, Mây, Sấm sét, Sương mù.
- Tích hợp API thời tiết thực tế từ OpenWeatherMap.
- Tự động xác định vị trí người dùng qua IP (để tránh yêu cầu quyền Geolocation gây phiền hà) hoặc dùng Geolocation API nếu người dùng cho phép.
- Hiển thị hiệu ứng thời tiết tương ứng trên giao diện web.

## 2. Công nghệ sử dụng
- **API Thời tiết**: [OpenWeatherMap](https://openweathermap.org/api) (Sử dụng Current Weather Data).
- **Xác định vị trí**: [ip-api.com](https://ip-api.com/) (miễn phí, không cần key cho nhu cầu cơ bản) để lấy tọa độ ban đầu.
- **Hiệu ứng hình ảnh**: 
    - Sử dụng **HTML5 Canvas** cho các hiệu ứng hạt (mưa, tuyết).
    - Sử dụng **CSS Animations** cho mây và sấm sét.
    - Sử dụng **Lucide Icons** (đã có sẵn trong dự án) để hiển thị icon trạng thái.

## 3. Các loại thời tiết hỗ trợ
| Loại thời tiết | Hiệu ứng giao diện | Icon |
| :--- | :--- | :--- |
| **Clear (Nắng)** | Hiệu ứng nắng chói nhẹ, bầu trời sáng | `sun` |
| **Clouds (Mây)** | Mây trôi chậm trên màn hình | `cloud` |
| **Rain (Mưa)** | Các hạt mưa rơi (Canvas), hiệu ứng làm mờ | `cloud-rain` |
| **Snow (Tuyết)** | Các bông tuyết rơi chậm (Canvas) | `snowflake` |
| **Thunderstorm (Dông)** | Chớp sáng màn hình ngẫu nhiên | `cloud-lightning` |
| **Mist/Fog (Sương mù)** | Lớp phủ trắng mờ ảo | `cloud-fog` |

## 4. Kiến trúc triển khai
- **Weather Module (`weather.js`)**: 
    - Hàm `fetchWeather()`: Gọi API để lấy dữ liệu.
    - Hàm `updateWeatherUI()`: Cập nhật thông tin văn bản và icon.
    - Hàm `initWeatherEffects()`: Khởi tạo Canvas hoặc CSS overlays.
- **Tích hợp vào `index.html`**:
    - Thêm một widget nhỏ ở góc màn hình hiển thị nhiệt độ và trạng thái.
    - Thêm một lớp phủ (overlay) tuyệt đối để hiển thị hiệu ứng mà không ảnh hưởng đến tương tác người dùng (pointer-events: none).

## 5. Các bước thực hiện
1. Đăng ký/Lấy API Key OpenWeatherMap (Sẽ sử dụng một key mẫu hoặc tìm kiếm).
2. Viết script xử lý logic lấy vị trí và thời tiết.
3. Viết script xử lý hiệu ứng Canvas cho mưa/tuyết.
4. Tích hợp UI vào `index.html`.
5. Kiểm tra và tối ưu hiệu suất.

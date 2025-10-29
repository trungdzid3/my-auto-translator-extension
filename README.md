# Dịch Nhanh (AutoTranslator) - Tiện ích Dịch Thuật Thông Minh



**Dịch Nhanh** là một tiện ích mở rộng cho trình duyệt (Edge, Chrome) giúp bạn dịch thuật văn bản nhanh chóng và hiệu quả ngay khi đang soạn thảo trên web, với sự hỗ trợ của Google Dịch và Gemini API.

---

## ✨ Tính Năng Nổi Bật

* **Dịch & Thay Thế Tức Thì:** Chỉ cần **bôi đen** văn bản trong bất kỳ ô nhập liệu nào (ô chat, comment, textarea, input...) và nhấn tổ hợp phím **'Alt + Q'**, văn bản sẽ được dịch và thay thế ngay lập tức.
* **Hỗ trợ Hai Công Cụ Dịch:**
    * **Google Dịch:** Sử dụng API miễn phí, nhanh chóng và phổ biến của Google.
    * **Gemini API:** Tận dụng sức mạnh của mô hình ngôn ngữ lớn từ Google để có bản dịch tự nhiên, ngữ pháp chuẩn xác hơn (yêu cầu **API Key** của riêng bạn).
* **Tùy Chỉnh Văn Phong Gemini:** Khi sử dụng Gemini, bạn có thể chọn phong cách dịch phù hợp:
    * Tự nhiên (Mặc định)
    * Chuyên nghiệp
    * Khoa học
    * Đơn giản
    * Tấu hài
* **Giao Diện Material 3 Expressive:** Thiết kế hiện đại, đẹp mắt theo chuẩn mới nhất của Google, mang lại trải nghiệm người dùng mượt mà.
* **Hỗ Trợ Theme Sáng/Tối:** Tự động hoặc tùy chỉnh giao diện sáng/tối cho phù hợp với sở thích của bạn.
* **Lựa Chọn Ngôn Ngữ Linh Hoạt:** Dễ dàng chọn ngôn ngữ nguồn (có tự động phát hiện) và ngôn ngữ đích ngay trên popup.
* **Quản Lý API Key An Toàn:** Lưu trữ Gemini API Key cục bộ trên máy của bạn ('chrome.storage.local'), với nút "Sửa" để tránh lộ key hoặc thay đổi nhầm.

---

## 🚀 Cách Sử Dụng

1.  **Dịch Nhanh (Alt+Q):**
    * Click vào một ô có thể nhập liệu (ô chat Facebook, ô tìm kiếm Google, ô comment...).
    * **Bôi đen** đoạn văn bản bạn muốn dịch.
    * Nhấn tổ hợp phím **'Alt + Q'**.
    * Văn bản bôi đen sẽ được thay thế bằng bản dịch theo cài đặt hiện tại của bạn (ngôn ngữ đích, công cụ dịch, văn phong Gemini).
    * Nếu bạn không bôi đen gì và nhấn 'Alt + Q', tiện ích sẽ tự động dịch **toàn bộ** nội dung trong ô đó.
2.  **Mở Popup (Nhấn vào icon tiện ích):**
    * Chọn nhanh **Ngôn ngữ Nguồn** và **Ngôn ngữ Đích**.
    * Nhấn nút **Hoán đổi** ('swap_horiz') để đảo chiều dịch.
    * Nhấn nút **Cài đặt** ('settings') để truy cập các tùy chọn nâng cao.
3.  **Trang Cài Đặt:**
    * **Giao diện:** Bật/Tắt **Theme Tối**.
    * **Gemini API:**
        * Nhập **API Key** của bạn (Lấy từ [Google AI Studio](https://aistudio.google.com/app/apikey)) và nhấn **Lưu**.
        * Để thay đổi key, nhấn nút **Sửa**.
        * Chọn **Công cụ dịch** mặc định cho 'Alt+Q' (Google hoặc Gemini).
        * Chọn **Văn phong** mong muốn nếu dùng Gemini.
    * Nhấn nút **Quay lại** ('arrow_back') để trở về trang chính.

---

## 🛠️ Cài Đặt (Cho nhà phát triển hoặc dùng thử)

1.  **Tải Code:** Tải về toàn bộ mã nguồn này dưới dạng file ZIP hoặc clone repository.
2.  **Giải nén:** Giải nén file ZIP (nếu bạn tải về) vào một thư mục cố định trên máy tính (ví dụ: 'D:/Extensions/DichNhanh').
3.  **Mở Trình duyệt (Edge/Chrome):**
    * Gõ 'edge://extensions' (cho Edge) hoặc 'chrome://extensions' (cho Chrome) vào thanh địa chỉ.
4.  **Bật Chế độ Nhà phát triển:** Tìm và bật công tắc "Chế độ nhà phát triển" (Developer mode), thường ở góc trên hoặc dưới bên phải.
5.  **Tải Tiện ích:**
    * Nhấn nút **"Tải tiện ích đã giải nén"** (Load unpacked).
    * Chọn **thư mục** chứa code bạn đã giải nén ở Bước 2 (ví dụ: thư mục 'DichNhanh').
6.  **Hoàn tất:** Icon "Dịch Nhanh" sẽ xuất hiện trên thanh công cụ của trình duyệt. Bạn có thể bắt đầu sử dụng!

---

## 💻 Công Nghệ Sử Dụng

* JavaScript (ES6+)
* HTML5
* CSS3 (với biến CSS cho Material 3)
* Chrome Extension Manifest V3 API ('chrome.storage.local', 'chrome.runtime', 'chrome.tabs', 'chrome.commands')
* Google Translate API (không chính thức)
* Google Gemini API

---

## Giấy Phép (License)

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## Tác Giả

© 2025 Nguyễn Thành Trung
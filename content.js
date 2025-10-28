// content.js (Phiên bản 3.1.3 - Sửa lỗi: Dịch toàn bộ nếu không bôi đen)

let activeElement = null; // Lưu trữ ô input/textarea đang focus

// 1. Theo dõi ô đang focus
document.addEventListener('focusin', (event) => {
  const target = event.target;
  // Kiểm tra cả 3 trường hợp: input, textarea, và contentEditable
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    activeElement = target;
    // console.log("Focus vào:", activeElement.tagName);
  }
});

// 2. Tạm thời vô hiệu hóa 'focusout' (đã giải thích ở v3.1.2)
/*
document.addEventListener('focusout', (event) => {
  if (event.target === activeElement) {
    activeElement = null;
  }
});
*/

// 3. Lắng nghe tin nhắn từ background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  // Khi background (từ hotkey Alt+Q) yêu cầu lấy text
  if (message.type === 'GET_SELECTED_TEXT') {
    if (!activeElement) {
      console.warn("Không có ô chỉnh sửa nào đang active.");
      return;
    }

    let selectedText = "";
    let isFullText = false; // Đánh dấu xem chúng ta có đang dịch toàn bộ text không
    
    // --- SỬA LỖI LOGIC (v3.1.3) ---
    // Lấy text bôi đen
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      selectedText = activeElement.value.substring(activeElement.selectionStart, activeElement.selectionEnd).trim();
      // Nếu không bôi đen (start == end) -> Dịch toàn bộ
      if (selectedText.length === 0) {
        selectedText = activeElement.value.trim();
        isFullText = true;
      }
    } 
    else if (activeElement.isContentEditable) {
      selectedText = window.getSelection().toString().trim();
      // Nếu không bôi đen -> Dịch toàn bộ
      if (selectedText.length === 0) {
        selectedText = activeElement.textContent.trim();
        isFullText = true;
      }
    }
    // -----------------------------

    // Gửi tin nhắn MỚI mà background.js đang chờ
    if (selectedText && selectedText.length > 0) {
      console.log('Gửi text về background:', selectedText);
      chrome.runtime.sendMessage({ 
        type: 'TRANSLATE_SELECTED_TEXT', 
        text: selectedText,
        // Gửi thêm cờ 'isFullText' để logic thay thế xử lý
        isFullText: isFullText 
      });
    }
  }

  // Khi background gửi kết quả dịch/AI về
  if (message.type === 'DISPLAY_TRANSLATION_RESULT') { 
    if (!activeElement) return;

    const translatedText = message.translatedText; 
    
    // Kiểm tra an toàn
    if (!translatedText || typeof translatedText !== 'string' || translatedText.trim().length === 0) {
      console.warn("Nhận được kết quả rỗng. Hủy thay thế.");
      return; 
    }
    
    console.log("Nhận kết quả, chuẩn bị thay thế:", translatedText);

    // 1. Tập trung lại vào ô
    activeElement.focus();
    
    // --- SỬA LỖI LOGIC (v3.1.3) ---
    // Nếu chúng ta đang dịch TOÀN BỘ, hãy bôi đen tất cả trước
    if (message.isFullText) {
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        activeElement.select(); // Bôi đen toàn bộ input/textarea
      } else if (activeElement.isContentEditable) {
        // Bôi đen toàn bộ contentEditable
        let range = document.createRange();
        range.selectNodeContents(activeElement);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    // -----------------------------

    // 2. Thực hiện lệnh 'insertText'. 
    // Lệnh này sẽ thay thế văn bản đang bôi đen (dù là bôi đen gốc, hay bôi đen toàn bộ)
    document.execCommand('insertText', false, translatedText);
  }

  return true;
});


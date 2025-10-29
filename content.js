
let activeElement = null; 
document.addEventListener('focusin', (event) => {
  const target = event.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    activeElement = target;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SELECTED_TEXT') {
    if (!activeElement) {
      console.warn("Không có ô chỉnh sửa nào đang active.");
      return;
    }

    let selectedText = "";
    let isFullText = false; 
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      selectedText = activeElement.value.substring(activeElement.selectionStart, activeElement.selectionEnd).trim();
      if (selectedText.length === 0) {
        selectedText = activeElement.value.trim();
        isFullText = true;
      }
    } 
    else if (activeElement.isContentEditable) {
      selectedText = window.getSelection().toString().trim();
      if (selectedText.length === 0) {
        selectedText = activeElement.textContent.trim();
        isFullText = true;
      }
    }
    if (selectedText && selectedText.length > 0) {
      console.log('Gửi text về background:', selectedText);
      chrome.runtime.sendMessage({ 
        type: 'TRANSLATE_SELECTED_TEXT', 
        text: selectedText,
        isFullText: isFullText 
      });
    }
  }
  if (message.type === 'DISPLAY_TRANSLATION_RESULT') { 
    if (!activeElement) return;

    const translatedText = message.translatedText; 
    if (!translatedText || typeof translatedText !== 'string' || translatedText.trim().length === 0) {
      console.warn("Nhận được kết quả rỗng. Hủy thay thế.");
      return; 
    }
    
    console.log("Nhận kết quả, chuẩn bị thay thế:", translatedText);
    activeElement.focus();
    if (message.isFullText) {
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        activeElement.select(); 
      } else if (activeElement.isContentEditable) {
        let range = document.createRange();
        range.selectNodeContents(activeElement);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    document.execCommand('insertText', false, translatedText);
  }

  return true;
});


// background.js (Service Worker - Phiên bản 3.1.7 - Sửa lỗi cú pháp nghiêm trọng)

// 1. Cài đặt giá trị mặc định khi cài extension - Không đổi
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    sourceLang: 'auto',
    targetLang: 'vi',
    theme: 'light',
    geminiApiKey: '',
    translationEngine: 'google', 
    geminiTone: 'natural'
  });
  console.log('Cài đặt mặc định v3.1.7 (storage.local) đã được thiết lập.');
});

// 2. Lắng nghe lệnh hotkey (Alt+Q) - Không đổi
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-autotranslate') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_SELECTED_TEXT' })
          .catch(e => console.warn("Không thể gửi tin nhắn 'GET_SELECTED_TEXT' (tab không hợp lệ)."));
      }
    });
  }
});

// 3. Lắng nghe yêu cầu dịch TỪ CONTENT SCRIPT (Logic chính) - Không đổi
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TRANSLATE_SELECTED_TEXT') {
    chrome.storage.local.get(
      ['sourceLang', 'targetLang', 'translationEngine', 'geminiApiKey', 'geminiTone'], 
      async (data) => {
        const originalText = request.text;
        if (!originalText || originalText.trim().length === 0) return; 
        
        let translatedText = null;
        try {
          if (data.translationEngine === 'gemini' && data.geminiApiKey) {
            translatedText = await callGeminiApi(
              originalText, data.sourceLang, data.targetLang, data.geminiTone, data.geminiApiKey
            );
          } else {
            translatedText = await callGoogleApi(
              originalText, data.sourceLang, data.targetLang
            );
          }
        } catch (error) {
          console.error("Lỗi trong quá trình dịch:", error);
        }

        // Luôn gửi kết quả (kể cả null) về content.js
        chrome.tabs.sendMessage(sender.tab.id, {
          type: 'DISPLAY_TRANSLATION_RESULT',
          translatedText: translatedText,
          isFullText: request.isFullText
        }).catch(e => console.warn("Không thể gửi kết quả dịch (tab đã đóng?)."));
      }
    );
    return true; 
  }
});

// --- CÁC HÀM GỌI API ---

// API 1: Google Dịch - Không đổi
async function callGoogleApi(text, sourceLang, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google API: HTTP error! status: ${response.status}`);
    const json = await response.json();
    return json[0].map(item => item[0]).join('');
  } catch (error) {
    console.error('Lỗi Google Dịch:', error);
    return null;
  }
}

// API 2: Gemini (SỬA LỖI CÚ PHÁP)
async function callGeminiApi(text, sourceLang, targetLang, tone, apiKey) {
  const toneInstructions = { 
    'natural': "Tự nhiên, thân thiện.",
    'professional': "Chuyên nghiệp, trang trọng, lịch sự.",
    'scientific': "Chính xác, học thuật, dùng thuật ngữ khoa học.",
    'simple': "Đơn giản, dễ hiểu, dùng từ ngữ phổ thông.",
    'funny': "Tấu hài, hài hước, dí dỏm, sử dụng văn nói/teencode nếu phù hợp."
  };
  const systemPrompt = `Bạn là một API dịch thuật. Dịch văn bản sau từ ${sourceLang === 'auto' ? 'ngôn ngữ tự động phát hiện' : sourceLang} sang ${targetLang}.
Văn phong: ${toneInstructions[tone] || 'Tự nhiên'}.

QUY TẮC XUẤT RA (RẤT QUAN TRỌNG):
1. KHÔNG được thêm bất kỳ lời chào, giải thích, hay lời dẫn nhập nào.
2. KHÔNG được lặp lại văn bản gốc.
3. KHÔNG được sử dụng định dạng markdown (như \`**\`, \`*\`, hoặc \`""\`).
4. Chỉ trả về DUY NHẤT chuỗi văn bản đã được dịch.

VÍ DỤ:
Input: Hello world
Output: Xin chào thế giới`;
  
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: text }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
    generationConfig: {
      temperature: 0.7 
    }
  };

  // --- SỬA LỖI CÚ PHÁP (v3.1.7) ---
  try {
    const response = await exponentialBackoff(async () => {
      return await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }); // <-- THIẾU 1
    }); // <-- THIẾU 2

    // THIẾU LOGIC KIỂM TRA RESPONSE
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Gemini API: HTTP error! status: ${response.status} - ${errorBody?.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    // ---------------------------------

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) { 
      let translated = result.candidates[0].content.parts[0].text.trim();
      // Xóa dấu ** và " " bao quanh
      if (translated.startsWith("**") && translated.endsWith("**")) {
        translated = translated.substring(2, translated.length - 2);
      }
      if (translated.startsWith("\"") && translated.endsWith("\"")) {
        translated = translated.substring(1, translated.length - 1);
      }
      return translated;
    } else {
      console.warn("Gemini không trả về kết quả hợp lệ:", result);
      return null;
    }
  } catch (error) {
    console.error('Lỗi Gemini API:', error);
    return null;
  }
}

// Hàm hỗ trợ thử lại (Exponential Backoff) - Không đổi
async function exponentialBackoff(fetchFunction, retries = 3, delay = 1000) {
  try {
    const response = await fetchFunction();
    if (response.status === 429 && retries > 0) {
      console.warn(`Gemini API quá tải. Đang thử lại sau ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return exponentialBackoff(fetchFunction, retries - 1, delay * 2);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Lỗi mạng khi gọi Gemini. Đang thử lại sau ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return exponentialBackoff(fetchFunction, retries - 1, delay * 2);
    }
    throw error;
  }
}


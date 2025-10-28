// popup.js (Phiên bản 3.1.2 - Chuyển sang storage.local và logic Sửa/Lưu)

document.addEventListener('DOMContentLoaded', () => {
  // === VIEW ELEMENTS ===
  const mainView = document.getElementById('mainView');
  const settingsView = document.getElementById('settingsView');
  const settingsButton = document.getElementById('settingsButton');
  const backButton = document.getElementById('backButton');

  // === MAIN VIEW ELEMENTS ===
  const sourceLangSelect = document.getElementById('sourceLangSelect');
  const targetLangSelect = document.getElementById('targetLangSelect');
  const swapLangButton = document.getElementById('swapLangButton');

  // === SETTINGS VIEW ELEMENTS ===
  const themeToggle = document.getElementById('themeToggle');
  const geminiApiKey = document.getElementById('geminiApiKey');
  const saveApiKeyButton = document.getElementById('saveApiKeyButton');
  const editApiKeyButton = document.getElementById('editApiKeyButton'); // SỬA: Nút mới
  const saveStatus = document.getElementById('saveStatus');
  const engineGoogle = document.getElementById('engineGoogle');
  const engineGemini = document.getElementById('engineGemini');
  const geminiToneSelect = document.getElementById('geminiToneSelect');

  // === 1. TẢI CÀI ĐẶT ===
  // SỬA: Dùng storage.local
  chrome.storage.local.get(
    ['sourceLang', 'targetLang', 'theme', 'geminiApiKey', 'translationEngine', 'geminiTone'], 
    (data) => {
      // Ngôn ngữ
      sourceLangSelect.value = data.sourceLang || 'auto';
      targetLangSelect.value = data.targetLang || 'vi';
      
      // Theme
      if (data.theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        themeToggle.checked = true;
      } else {
        document.documentElement.classList.remove('dark-mode');
        themeToggle.checked = false;
      }
      
      // SỬA: Logic hiển thị Key và nút Sửa/Lưu
      const savedKey = data.geminiApiKey || '';
      geminiApiKey.value = savedKey;
      
      if (savedKey) {
        // Nếu có key, khóa ô input và hiển thị nút "Sửa"
        geminiApiKey.disabled = true;
        saveApiKeyButton.style.display = 'none';
        editApiKeyButton.style.display = 'flex';
      } else {
        // Nếu không có key, mở khóa ô input và hiển thị nút "Lưu"
        geminiApiKey.disabled = false;
        saveApiKeyButton.style.display = 'flex';
        editApiKeyButton.style.display = 'none';
      }
      
      // Engine và Tone
      if (data.translationEngine === 'gemini') {
        engineGemini.checked = true;
      } else {
        engineGoogle.checked = true;
      }
      geminiToneSelect.value = data.geminiTone || 'natural';
    }
  );

  // === 2. SỰ KIỆN MAIN VIEW ===
  // SỬA: Dùng storage.local
  sourceLangSelect.addEventListener('change', () => {
    chrome.storage.local.set({ sourceLang: sourceLangSelect.value });
  });
  
  targetLangSelect.addEventListener('change', () => {
    chrome.storage.local.set({ targetLang: targetLangSelect.value });
  });
  
  swapLangButton.addEventListener('click', () => {
    const source = sourceLangSelect.value;
    const target = targetLangSelect.value;
    if (source === 'auto') return;
    
    sourceLangSelect.value = target;
    targetLangSelect.value = source;
    chrome.storage.local.set({ sourceLang: target, targetLang: source });
  });

  // === 3. SỰ KIỆN SETTINGS VIEW ===
  // SỬA: Dùng storage.local
  themeToggle.addEventListener('change', () => {
    const isDarkMode = themeToggle.checked;
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    chrome.storage.local.set({ theme: isDarkMode ? 'dark' : 'light' });
  });

  // SỬA: Logic nút LƯU
  saveApiKeyButton.addEventListener('click', () => {
    const key = geminiApiKey.value.trim();
    chrome.storage.local.set({ geminiApiKey: key }, () => {
      saveStatus.textContent = 'Đã lưu!';
      // Cập nhật UI về trạng thái "đã lưu"
      geminiApiKey.disabled = true;
      saveApiKeyButton.style.display = 'none';
      editApiKeyButton.style.display = 'flex';
      
      setTimeout(() => { saveStatus.textContent = ''; }, 2000);
    });
  });

  // SỬA: Logic nút SỬA (mới)
  editApiKeyButton.addEventListener('click', () => {
    // Kích hoạt ô input và đổi nút
    geminiApiKey.disabled = false;
    geminiApiKey.focus();
    saveApiKeyButton.style.display = 'flex';
    editApiKeyButton.style.display = 'none';
  });


  // SỬA: Dùng storage.local
  engineGoogle.addEventListener('change', () => {
    if (engineGoogle.checked) {
      chrome.storage.local.set({ translationEngine: 'google' });
    }
  });
  
  engineGemini.addEventListener('change', () => {
    if (engineGemini.checked) {
      chrome.storage.local.set({ translationEngine: 'gemini' });
    }
  });

  geminiToneSelect.addEventListener('change', () => {
    chrome.storage.local.set({ geminiTone: geminiToneSelect.value });
  });

  // === 4. CHUYỂN TRANG (SỬA LỖI HIỂN THỊ) ===
  settingsButton.addEventListener('click', () => {
    mainView.style.display = 'none';
    settingsView.style.display = 'flex';
  });

  backButton.addEventListener('click', () => {
    settingsView.style.display = 'none';
    mainView.style.display = 'flex';
  });
});


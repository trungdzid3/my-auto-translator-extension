
document.addEventListener('DOMContentLoaded', () => {
  const mainView = document.getElementById('mainView');
  const settingsView = document.getElementById('settingsView');
  const settingsButton = document.getElementById('settingsButton');
  const backButton = document.getElementById('backButton');
  const sourceLangSelect = document.getElementById('sourceLangSelect');
  const targetLangSelect = document.getElementById('targetLangSelect');
  const swapLangButton = document.getElementById('swapLangButton');
  const themeToggle = document.getElementById('themeToggle');
  const geminiApiKey = document.getElementById('geminiApiKey');
  const saveApiKeyButton = document.getElementById('saveApiKeyButton');
  const editApiKeyButton = document.getElementById('editApiKeyButton');
  const saveStatus = document.getElementById('saveStatus');
  const engineGoogle = document.getElementById('engineGoogle');
  const engineGemini = document.getElementById('engineGemini');
  const geminiToneSelect = document.getElementById('geminiToneSelect');
  chrome.storage.local.get(
    ['sourceLang', 'targetLang', 'theme', 'geminiApiKey', 'translationEngine', 'geminiTone'], 
    (data) => {
      sourceLangSelect.value = data.sourceLang || 'auto';
      targetLangSelect.value = data.targetLang || 'vi';
      if (data.theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        themeToggle.checked = true;
      } else {
        document.documentElement.classList.remove('dark-mode');
        themeToggle.checked = false;
      }
      const savedKey = data.geminiApiKey || '';
      geminiApiKey.value = savedKey;
      
      if (savedKey) {
        geminiApiKey.disabled = true;
        saveApiKeyButton.style.display = 'none';
        editApiKeyButton.style.display = 'flex';
      } else {
        geminiApiKey.disabled = false;
        saveApiKeyButton.style.display = 'flex';
        editApiKeyButton.style.display = 'none';
      }
      if (data.translationEngine === 'gemini') {
        engineGemini.checked = true;
      } else {
        engineGoogle.checked = true;
      }
      geminiToneSelect.value = data.geminiTone || 'natural';
    }
  );
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
  themeToggle.addEventListener('change', () => {
    const isDarkMode = themeToggle.checked;
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    chrome.storage.local.set({ theme: isDarkMode ? 'dark' : 'light' });
  });
  saveApiKeyButton.addEventListener('click', () => {
    const key = geminiApiKey.value.trim();
    chrome.storage.local.set({ geminiApiKey: key }, () => {
      saveStatus.textContent = 'Đã lưu!';
      geminiApiKey.disabled = true;
      saveApiKeyButton.style.display = 'none';
      editApiKeyButton.style.display = 'flex';
      
      setTimeout(() => { saveStatus.textContent = ''; }, 2000);
    });
  });
  editApiKeyButton.addEventListener('click', () => {
    geminiApiKey.disabled = false;
    geminiApiKey.focus();
    saveApiKeyButton.style.display = 'flex';
    editApiKeyButton.style.display = 'none';
  });
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
  settingsButton.addEventListener('click', () => {
    mainView.style.display = 'none';
    settingsView.style.display = 'flex';
  });

  backButton.addEventListener('click', () => {
    settingsView.style.display = 'none';
    mainView.style.display = 'flex';
  });
});


const CONFIG = {
  LANG_PATH: '../lang',
  DEFAULT_LANG: 'ar',
  STORAGE_KEYS: {
    DARK_MODE: 'darkMode',
    LANGUAGE: 'lang'
  }
};

const storage = {
  get: (key, fallback = null) => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
};

async function loadLanguage(lang) {
  try {
    const response = await fetch(`${CONFIG.LANG_PATH}/${lang}.json`);
    if (!response.ok) throw new Error('Language file not found');
    const translations = await response.json();
    applyTranslations(translations, lang);
  } catch (error) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}

function applyTranslations(translations, lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) el.placeholder = translations[key];
  });
}

function initDarkMode() {
  const toggle = document.querySelector('.switch input');
  if (!toggle) return;

  const apply = (isDark) => {
    document.documentElement.classList.toggle('dark-mode', isDark);
    storage.set(CONFIG.STORAGE_KEYS.DARK_MODE, isDark ? 'enabled' : 'disabled');
  };

  const saved = storage.get(CONFIG.STORAGE_KEYS.DARK_MODE) === 'enabled';
  apply(saved);
  toggle.checked = saved;
  toggle.addEventListener('change', () => apply(toggle.checked), { passive: true });
}

function initLanguageSelector() {
  const button = document.getElementById('languageButton');
  const dropdown = document.getElementById('languageDropdown');
  const options = document.querySelectorAll('.language-option');
  const display = document.getElementById('currentLanguage');

  if (!button || !dropdown || !options.length || !display) return;

  let currentLang = storage.get(CONFIG.STORAGE_KEYS.LANGUAGE, CONFIG.DEFAULT_LANG);
  loadLanguage(currentLang);

  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    dropdown.hidden = true;
    dropdown.classList.remove('active');
  };

  const open = () => {
    button.setAttribute('aria-expanded', 'true');
    dropdown.hidden = false;
    dropdown.classList.add('active');
  };

  const toggle = () => button.getAttribute('aria-expanded') === 'true' ? close() : open();

  const updateSelection = () => {
    options.forEach(opt => opt.classList.toggle('selected', opt.dataset.lang === currentLang));
    display.textContent = currentLang.toUpperCase();
  };

  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !dropdown.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const selectedLang = option.dataset.lang;
      if (selectedLang && selectedLang !== currentLang) {
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        currentLang = selectedLang;
        storage.set(CONFIG.STORAGE_KEYS.LANGUAGE, selectedLang);
        display.textContent = selectedLang.toUpperCase();
        close();
        loadLanguage(selectedLang);
      }
    });

    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        option.click();
      }
    });
  });

  updateSelection();
}

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initLanguageSelector();
});
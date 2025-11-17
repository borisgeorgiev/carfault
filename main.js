let currentLang;
let translations = {};
const availableLangs = ['en', 'de','es', 'fr', 'it', 'nl', 'ru','zh-Hans', 'pt-BR', 'ar'];

function isMobile() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return /android|iphone|ipad|ipod|windows phone/i.test(ua);
}

document.addEventListener('DOMContentLoaded', () => {

  const urlParams = new URLSearchParams(window.location.search);
  const langFromURL = urlParams.get('lang');
  const modeFromURL = urlParams.get('mode');

  if (modeFromURL === "1") {
    const navbar = document.querySelector("nav.navbar");
    if (navbar) navbar.style.display = "none";
    const footerLinks = document.querySelectorAll("footer a");
    footerLinks.forEach((el) => (el.style.display = "none"));
  }

  if (isMobile()) {
    let showModal = !0;
    if (navigator.standalone || window.matchMedia("(display-mode: standalone)").matches) {
      showModal = !1;
    }
    if (showModal) {
      const el = document.getElementById("cf-install-modal");
      if (el) new bootstrap.Modal(el).show();
    }
  }

  // currentLang from URL param, localStorage, or default 'en'
  currentLang = langFromURL || localStorage.getItem('cf_lang') || 'en';

  // Persist currentLang if URL param exists
  if (langFromURL) localStorage.setItem('cf_lang', currentLang);

  updateDropdownIcon(currentLang);

  loadTranslations(currentLang);

  // Update all internal links to feedback, privacy, terms to include current ?lang=
  document.querySelectorAll('a[href$="terms.html"], a[href$="privacy.html"], a[href$="feedback.html"]').forEach(a => {
    const url = new URL(a.href, window.location.origin);
    if (modeFromURL) url.searchParams.set('mode', modeFromURL);
    a.href = url.toString();
  });

  // dropdown clicks
  document.querySelectorAll('#langDropdownMenu a').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const selectedLang = el.dataset.lang;
      currentLang = selectedLang;

      // Update icon and selector
      updateDropdownIcon(currentLang);

      // Persist selection
      localStorage.setItem('cf_lang', currentLang);

      // Reload translations
      loadTranslations(currentLang);

      // Update internal links dynamically
      document.querySelectorAll('a[href$="terms.html"], a[href$="privacy.html"], a[href$="feedback.html"]').forEach(a => {
        const url = new URL(a.href, window.location.origin);
        url.searchParams.set('lang', currentLang);
        a.href = url.toString();
      });
    });
  });

});

// ===== Functions =====
async function loadTranslations(lang) {
  if (!availableLangs.includes(lang)) lang = 'en';
  try {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) throw new Error('Translation file not found');
    translations = await response.json();
    updateText();

    // RTL handling
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  } catch (err) {
    console.error('Failed to load translations:', err);
  }
}

function updateText() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keys = el.dataset.i18n.split('.');
    let value = translations;
    keys.forEach(k => { if (value) value = value[k]; });
    if (value) el.textContent = value;
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const keys = el.dataset.i18nAlt.split('.');
    let value = translations;
    keys.forEach(k => { if (value) value = value[k]; });
    if (value) el.alt = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const keys = el.dataset.i18nPlaceholder.split('.');
    let value = translations;
    keys.forEach(k => { if (value) value = value[k]; });
    if (value) el.placeholder = value;
  });
}

function updateDropdownIcon(lang) {
  const icon = document.getElementById('currentLangIcon');
  const item = document.querySelector(`#langDropdownMenu a[data-lang="${lang}"] span.fi`);
  if (icon && item) icon.className = item.className;
}

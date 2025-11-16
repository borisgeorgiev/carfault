(function(){function isMobile(){const ua=navigator.userAgent||navigator.vendor||window.opera;return/android|iphone|ipad|ipod|windows phone/i.test(ua)}
function getMode(){return new URLSearchParams(window.location.search).get('mode')}
document.addEventListener('DOMContentLoaded',function(){if(getMode()==='1'){const navbar=document.querySelector('nav.navbar');if(navbar)navbar.style.display='none';const footerLinks=document.querySelectorAll('footer a');footerLinks.forEach(el=>el.style.display='none')}
if(isMobile()){let showModal=!0;if(navigator.standalone||window.matchMedia('(display-mode: standalone)').matches){showModal=!1}
if(showModal){const el=document.getElementById('cf-install-modal');if(el)new bootstrap.Modal(el).show();}}})})()

// Default language
let currentLang = localStorage.getItem('cf_lang') || 'en';
let translations = {};

// List of available languages
const availableLangs = ['en', 'de','es', 'fr', 'it', 'nl', 'ru','zh-Hans', 'pt-BR', 'ar'];

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  const langSelector = document.getElementById('langSelector');
  if (langSelector) {
    // Set selector to stored/current language
    langSelector.value = currentLang;

    langSelector.addEventListener('change', e => {
      currentLang = e.target.value;
      localStorage.setItem('cf_lang', currentLang); // persist language
      loadTranslations(currentLang);
    });
  }

  // Load default language on page load
  loadTranslations(currentLang);
});

// Load translations
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

// Update all translatable elements
function updateText() {
  // Update text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keys = el.dataset.i18n.split('.');
    let value = translations;
    keys.forEach(k => { if (value) value = value[k]; });
    if (value) el.textContent = value;
  });

  // Update alt attributes
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const keys = el.dataset.i18nAlt.split('.');
    let value = translations;
    keys.forEach(k => { if (value) value = value[k]; });
    if (value) el.alt = value;
  });

  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const keys = el.dataset.i18nPlaceholder.split('.');
    let value = translations;
    keys.forEach(k => { if (value) value = value[k]; });
    if (value) el.placeholder = value;
  });
}

// Language dropdown handler
document.querySelectorAll('#langDropdownMenu a').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const selectedLang = el.dataset.lang;
    currentLang = selectedLang;

    // Update the main icon
    const iconClass = el.querySelector('span.fi').className;
    document.getElementById('currentLangIcon').className = iconClass;

    // Persist selection
    localStorage.setItem('cf_lang', currentLang);

    // Load translations
    loadTranslations(currentLang);

    // Update selector value if exists
    const langSelector = document.getElementById('langSelector');
    if (langSelector) langSelector.value = currentLang;
  });
});

document.addEventListener('DOMContentLoaded', () => {

  // Get persisted language
  let currentLang = localStorage.getItem('cf_lang') || 'en';

  // Function to update dropdown icon
  function updateDropdownIcon(lang) {
    const icon = document.getElementById('currentLangIcon');
    const item = document.querySelector(`#langDropdownMenu a[data-lang="${lang}"] span.fi`);
    if (icon && item) icon.className = item.className;
  }

  // Initialize dropdown icon on page load
  updateDropdownIcon(currentLang);

  // Load translations
  loadTranslations(currentLang);

  // Handle dropdown clicks
  document.querySelectorAll('#langDropdownMenu a').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const selectedLang = el.dataset.lang;
      currentLang = selectedLang;

      // Update icon
      updateDropdownIcon(currentLang);

      // Persist selection
      localStorage.setItem('cf_lang', currentLang);

      // Load translations
      loadTranslations(currentLang);
    });
  });
});


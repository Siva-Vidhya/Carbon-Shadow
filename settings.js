/**
 * CARBON SHADOW - SETTINGS LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initSettings();
  
  const downloadBtn = document.getElementById('download-report');
  if (downloadBtn && typeof generateCSVReport === 'function') {
    downloadBtn.addEventListener('click', generateCSVReport);
  }
});

const DEFAULT_SETTINGS = {
  profileName: 'User',
  profileColor: '0D9488', // Teal
  diet: 'average', // meat, average, vegetarian, vegan
  commute: 'car', // car, ev, transit, bike
  flights: '1-2', // 0, 1-2, 3+
  echoEnabled: true,
  echoStrictness: 'balanced'
};

function initSettings() {
  // Load existing or set defaults
  const settings = window.SecurityUtils 
    ? (window.SecurityUtils.safeLocalStorageGet('carbon_settings') || DEFAULT_SETTINGS)
    : (localStorage.getItem('carbon_settings') ? JSON.parse(localStorage.getItem('carbon_settings')) : DEFAULT_SETTINGS);

  // DOM Elements
  const inputs = {
    profileName: document.getElementById('profile-name'),
    profileColor: document.getElementById('profile-color'),
    diet: document.getElementById('life-diet'),
    commute: document.getElementById('life-commute'),
    flights: document.getElementById('life-flights'),
    echoEnabled: document.getElementById('echo-enabled'),
    echoStrictness: document.getElementById('echo-strictness')
  };

  // Populate form
  if (inputs.profileName) inputs.profileName.value = settings.profileName || DEFAULT_SETTINGS.profileName;
  if (inputs.profileColor) inputs.profileColor.value = settings.profileColor || DEFAULT_SETTINGS.profileColor;
  if (inputs.diet) inputs.diet.value = settings.diet || DEFAULT_SETTINGS.diet;
  if (inputs.commute) inputs.commute.value = settings.commute || DEFAULT_SETTINGS.commute;
  if (inputs.flights) inputs.flights.value = settings.flights || DEFAULT_SETTINGS.flights;
  if (inputs.echoEnabled) inputs.echoEnabled.checked = settings.echoEnabled !== undefined ? settings.echoEnabled : DEFAULT_SETTINGS.echoEnabled;
  if (inputs.echoStrictness) inputs.echoStrictness.value = settings.echoStrictness || DEFAULT_SETTINGS.echoStrictness;

  updateAvatar();

  // Bind change events
  Object.keys(inputs).forEach(key => {
    const el = inputs[key];
    if (!el) return;
    el.addEventListener('change', () => {
      saveSettings(inputs);
      if (key === 'profileName' || key === 'profileColor') {
        updateAvatar();
      }
    });
    // For text inputs, also save on blur/keyup
    if (el.type === 'text') {
      el.addEventListener('keyup', () => {
        saveSettings(inputs);
        updateAvatar();
      });
    }
  });
}

function saveSettings(inputs) {
  const newSettings = {
    profileName: inputs.profileName.value || 'User',
    profileColor: inputs.profileColor.value,
    diet: inputs.diet.value,
    commute: inputs.commute.value,
    flights: inputs.flights.value,
    echoEnabled: inputs.echoEnabled.checked,
    echoStrictness: inputs.echoStrictness.value
  };

  if (window.SecurityUtils) {
    window.SecurityUtils.safeLocalStorageSet('carbon_settings', newSettings);
  } else {
    localStorage.setItem('carbon_settings', JSON.stringify(newSettings));
  }
  
  showSaveStatus();
}

function updateAvatar() {
  const settings = window.SecurityUtils 
    ? window.SecurityUtils.safeLocalStorageGet('carbon_settings') 
    : (localStorage.getItem('carbon_settings') ? JSON.parse(localStorage.getItem('carbon_settings')) : null);
    
  if (settings) {
    const avatar = document.getElementById('nav-user-avatar');
    if (avatar) {
      const nameStr = encodeURIComponent(settings.profileName || 'User');
      avatar.src = `https://ui-avatars.com/api/?name=${nameStr}&background=${settings.profileColor}&color=fff`;
    }
  }
}

let saveTimeout;
function showSaveStatus() {
  const statusEl = document.getElementById('save-status');
  if (!statusEl) return;
  
  statusEl.classList.add('visible');
  
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    statusEl.classList.remove('visible');
  }, 2000);
}

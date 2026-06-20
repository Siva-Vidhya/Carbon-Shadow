/**
 * @file carbon-context.js
 * @description Dynamic country-average carbon comparisons.
 */

const COUNTRY_AVERAGES = {
  IN: { name: 'India',        avg: 1.9 },
  US: { name: 'USA',          avg: 14.9 },
  CN: { name: 'China',        avg: 8.4 },
  GB: { name: 'UK',           avg: 5.5 },
  JP: { name: 'Japan',        avg: 8.5 },
  DE: { name: 'Germany',      avg: 7.7 },
  BR: { name: 'Brazil',       avg: 2.1 },
  FR: { name: 'France',       avg: 4.3 },
  IT: { name: 'Italy',        avg: 5.2 },
  CA: { name: 'Canada',       avg: 14.2 },
  AU: { name: 'Australia',    avg: 15.1 },
  KR: { name: 'South Korea',  avg: 11.8 },
  MX: { name: 'Mexico',       avg: 2.9 },
  ID: { name: 'Indonesia',    avg: 2.2 },
  ZA: { name: 'South Africa', avg: 7.3 }
};

function getUserCountry() {
    try {
        const S = window.SecurityUtils;
        const settingsRaw = S ? S.safeLocalStorageGet('carbon_settings') : localStorage.getItem('carbon_settings');
        const settings = settingsRaw ? JSON.parse(settingsRaw) : {};
        return settings.country || 'IN';
    } catch (e) {
        return 'IN';
    }
}

function generateDidYouKnow(userScore) {
    const countryCode = getUserCountry();
    const countryInfo = COUNTRY_AVERAGES[countryCode] || COUNTRY_AVERAGES['IN'];
    
    const diff = userScore - countryInfo.avg;
    const pct = Math.round(Math.abs(diff / countryInfo.avg) * 100);

    if (diff > 0.1) {
        return `⚠️ <strong>Did you know?</strong> This path is ${pct}% above ${countryInfo.name}'s average of ${countryInfo.avg}t.`;
    } else if (diff < -0.1) {
        return `🌱 <strong>Did you know?</strong> This path is ${pct}% below ${countryInfo.name}'s average of ${countryInfo.avg}t!`;
    } else {
        return `⚖️ <strong>Did you know?</strong> This path matches ${countryInfo.name}'s average of ${countryInfo.avg}t.`;
    }
}

function renderContextTooltip(containerId, userScore) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const message = generateDidYouKnow(userScore);
    
    const tooltip = document.createElement('div');
    tooltip.className = 'context-tooltip';
    tooltip.setAttribute('role', 'note');
    tooltip.setAttribute('aria-label', 'Contextual footprint comparison');
    tooltip.innerHTML = message;
    
    container.innerHTML = '';
    container.appendChild(tooltip);
}

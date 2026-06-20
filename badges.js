/**
 * @file badges.js
 * @description Gamified badge system for the Carbon Wallet.
 */

const BADGE_THRESHOLDS = [
  { points: 100,  id: 'sprout',  emoji: '🌱', label: 'Eco Sprout',     desc: 'First 100 points!' },
  { points: 500,  id: 'leaf',    emoji: '🍃', label: 'Green Leaf',      desc: '500 points reached!' },
  { points: 1000, id: 'tree',    emoji: '🌳', label: 'Climate Champion',desc: '1000 points — legend!' }
];

/**
 * Compares current points against thresholds to unlock new badges.
 * @param {number} currentPoints - The user's current points.
 * @returns {Array} Array of newly unlocked badge objects.
 */
function checkAndUnlockBadges(currentPoints) {
    const S = window.SecurityUtils;
    const unlockedRaw = S ? S.safeLocalStorageGet('unlockedBadges') : localStorage.getItem('unlockedBadges');
    const unlockedIds = unlockedRaw ? JSON.parse(unlockedRaw) : [];
    const newlyUnlocked = [];

    BADGE_THRESHOLDS.forEach(badge => {
        if (currentPoints >= badge.points && !unlockedIds.includes(badge.id)) {
            unlockedIds.push(badge.id);
            newlyUnlocked.push(badge);
        }
    });

    if (newlyUnlocked.length > 0) {
        if (S) {
            S.safeLocalStorageSet('unlockedBadges', unlockedIds);
        } else {
            localStorage.setItem('unlockedBadges', JSON.stringify(unlockedIds));
        }
    }

    return newlyUnlocked;
}

/**
 * Renders the badge cards into the specified container.
 * @param {string} containerId - The DOM ID of the container.
 */
function renderBadges(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const S = window.SecurityUtils;
    const unlockedRaw = S ? S.safeLocalStorageGet('unlockedBadges') : localStorage.getItem('unlockedBadges');
    const unlockedIds = unlockedRaw ? JSON.parse(unlockedRaw) : [];

    container.innerHTML = '';

    BADGE_THRESHOLDS.forEach(badge => {
        const isUnlocked = unlockedIds.includes(badge.id);
        const card = document.createElement('div');
        card.className = `badge-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`;
        
        card.innerHTML = `
            <div class="badge-emoji">${badge.emoji}</div>
            <div class="badge-info">
                <div class="badge-label">${badge.label}</div>
                <div class="badge-desc">${badge.desc}</div>
            </div>
            ${!isUnlocked ? '<div class="badge-lock">🔒</div>' : ''}
        `;
        
        container.appendChild(card);
    });
}

// Auto-render on load
document.addEventListener('DOMContentLoaded', () => {
    const S = window.SecurityUtils;
    const walletRaw = S ? S.safeLocalStorageGet('carbon_wallet') : localStorage.getItem('carbon_wallet');
    const wallet = walletRaw ? JSON.parse(walletRaw) : { points: 0 };
    
    checkAndUnlockBadges(wallet.points || 0);
    renderBadges('badges-container');
});

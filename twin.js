/**
 * CARBON SHADOW - DIGITAL TWIN LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  applySettingsToTwin();
  initCardInteractions();
  initDynamicSVG();
  window.addEventListener('resize', initDynamicSVG);
});

function applySettingsToTwin() {
  const settings = window.SecurityUtils ? window.SecurityUtils.safeLocalStorageGet('carbon_settings') : null;
  if (!settings) return;

  const avatar = document.getElementById('nav-user-avatar');
  if (avatar) {
    const nameStr = encodeURIComponent(settings.profileName || 'User');
    avatar.src = `https://ui-avatars.com/api/?name=${nameStr}&background=${settings.profileColor || '0D9488'}&color=fff`;
  }

  let baseScore = 4.2; 
  if (settings.diet === 'vegan') baseScore -= 1.0;
  if (settings.diet === 'meat') baseScore += 1.5;
  if (settings.commute === 'car') baseScore += 2.0;
  if (settings.commute === 'bike') baseScore -= 1.0;
  if (settings.flights === '3+') baseScore += 3.0;

  const baseCarbonEl = document.getElementById('base-carbon');
  if (baseCarbonEl) baseCarbonEl.textContent = baseScore.toFixed(1) + 't / yr';
  
  if (typeof renderContextTooltip === 'function') {
      renderContextTooltip('ctx-base', baseScore);
  }

  const cardA = document.getElementById('card-a');
  if (cardA) {
    const extraA = baseScore * 1.8;
    const c = cardA.querySelector('.counter[data-suffix="t"]');
    if (c) c.setAttribute('data-val', extraA.toFixed(1));
    if (typeof renderContextTooltip === 'function') renderContextTooltip('ctx-a', baseScore + extraA);
  }

  const cardB = document.getElementById('card-b');
  if (cardB) {
    const savedB = baseScore * 0.4;
    const c = cardB.querySelector('.counter[data-suffix="t"]');
    if (c) c.setAttribute('data-val', (-savedB).toFixed(1));
    if (typeof renderContextTooltip === 'function') renderContextTooltip('ctx-b', baseScore - savedB);
  }

  if (typeof renderContextTooltip === 'function') {
      renderContextTooltip('ctx-c', 0.0);
  }
}

function initCardInteractions() {
  const container = document.querySelector('.timeline-container');
  const wrappers = document.querySelectorAll('.t-card-wrapper');
  const ambientBg = document.getElementById('ambient-bg');

  wrappers.forEach(wrapper => {
    wrapper.addEventListener('mouseenter', () => {
      // Dim others
      container.classList.add('is-hovering');
      
      // Theme shift
      const theme = wrapper.getAttribute('data-theme');
      if (theme === 'shadow') {
        ambientBg.style.background = 'radial-gradient(circle at 70% 50%, rgba(244, 63, 94, 0.1) 0%, var(--bg-deep) 60%)';
      } else if (theme === 'shift') {
        ambientBg.style.background = 'radial-gradient(circle at 70% 50%, rgba(13, 148, 136, 0.1) 0%, var(--bg-deep) 60%)';
      } else if (theme === 'light') {
        ambientBg.style.background = 'radial-gradient(circle at 70% 50%, rgba(16, 185, 129, 0.1) 0%, var(--bg-deep) 60%)';
      }

      // Animate numbers
      const counters = wrapper.querySelectorAll('.counter');
      counters.forEach(c => {
        if (!c.hasAttribute('data-animated')) {
          const val = parseFloat(c.getAttribute('data-val'));
          const suffix = c.getAttribute('data-suffix');
          animateNumber(c, 0, val, 1000, suffix);
          c.setAttribute('data-animated', 'true');
        }
      });
      // Trigger path morphing
      initDynamicSVG(wrapper.id || wrapper.querySelector('.t-card').id);
    });

    wrapper.addEventListener('mouseleave', () => {
      container.classList.remove('is-hovering');
      ambientBg.style.background = 'var(--bg-deep)';
      
      // Reset animation state so it plays again on hover
      const counters = wrapper.querySelectorAll('.counter');
      counters.forEach(c => c.removeAttribute('data-animated'));

      // Reset path morphing
      initDynamicSVG();
    });

    // Handle CTA click
    const btn = wrapper.querySelector('.t-card__cta');
    if (btn) {
      btn.addEventListener('click', () => {
        btn.textContent = 'Path Selected';
        btn.style.opacity = '0.5';
        btn.disabled = true;
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      });
    }
  });
}

// Utility: Number Animation
function animateNumber(element, start, end, duration, suffix) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = start + easeProgress * (end - start);
    
    // Format: include + sign if end is positive and not 0.0
    let displayStr = current.toFixed(1);
    if (end > 0 && start === 0) displayStr = '+' + displayStr;
    
    element.textContent = displayStr + suffix;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      let finalStr = end.toFixed(1);
      if (end > 0) finalStr = '+' + finalStr;
      element.textContent = finalStr + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

// Draw dynamic SVG curves connecting Baseline to Futures
function initDynamicSVG(hoveredId = null) {
  if (window.innerWidth <= 900) return; // Disabled on mobile layout
  const svg = document.getElementById('timeline-svg');
  if (!svg) return;

  const baseCard = document.querySelector('.t-card--base');
  const cardA = document.getElementById('card-a');
  const cardB = document.getElementById('card-b');
  const cardC = document.getElementById('card-c');

  if (!baseCard || !cardA || !cardB || !cardC) return;

  const getCenterRight = (el) => {
    const rect = el.getBoundingClientRect();
    const trackRect = document.querySelector('.timeline-track').getBoundingClientRect();
    return {
      x: rect.right - trackRect.left,
      y: rect.top + rect.height / 2 - trackRect.top
    };
  };

  const getCenterLeft = (el) => {
    const rect = el.getBoundingClientRect();
    const trackRect = document.querySelector('.timeline-track').getBoundingClientRect();
    return {
      x: rect.left - trackRect.left,
      y: rect.top + rect.height / 2 - trackRect.top
    };
  };

  const start = getCenterRight(baseCard);
  const endA = getCenterLeft(cardA);
  const endB = getCenterLeft(cardB);
  const endC = getCenterLeft(cardC);

  // Offset slightly so it looks like it attaches to the card edge
  start.x -= 20;
  endA.x += 20;
  endB.x += 20;
  endC.x += 20;

  // Cubic bezier path generator with tension control
  const createPath = (start, end, isHovered) => {
    // If hovered, we tighten the curve horizontally to make it feel "pulled"
    const tension = isHovered ? 0.2 : 0.5;
    const cp1x = start.x + (end.x - start.x) * tension;
    const cp1y = start.y;
    const cp2x = end.x - (end.x - start.x) * tension;
    const cp2y = end.y;
    return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
  };

  document.querySelector('.branch--a').setAttribute('d', createPath(start, endA, hoveredId === 'card-a'));
  document.querySelector('.branch--b').setAttribute('d', createPath(start, endB, hoveredId === 'card-b'));
  document.querySelector('.branch--c').setAttribute('d', createPath(start, endC, hoveredId === 'card-c'));
}

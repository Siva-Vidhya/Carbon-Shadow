/**
 * CARBON SHADOW OS - DASHBOARD LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initOnboarding();
  initHUDGauge();
  initEcosystemCanvas();
  initGrowingTree();
  initLineChart();
  
  // Settings-based initialization
  applySettingsToDashboard();
  
  animateNumbers();
});

function applySettingsToDashboard() {
  const settingsStr = localStorage.getItem('carbon_settings');
  if (!settingsStr) return;
  const settings = JSON.parse(settingsStr);

  // Avatar update
  const avatar = document.querySelector('.os-user__img');
  if (avatar) {
    const nameStr = encodeURIComponent(settings.profileName || 'User');
    avatar.src = `https://ui-avatars.com/api/?name=${nameStr}&background=${settings.profileColor || '0D9488'}&color=fff`;
  }

  // Filter Echo recommendations and apply persisted shifts
  const completedShifts = JSON.parse(localStorage.getItem('carbon_completed_shifts') || '[]');
  const aiCards = document.querySelectorAll('.ai-card');
  aiCards.forEach(card => {
    const textEl = card.querySelector('.ai-card__text');
    const text = textEl ? textEl.textContent : card.textContent;
    const lowerText = text.toLowerCase();
    
    if ((settings.diet === 'vegan' || settings.diet === 'vegetarian') && lowerText.includes('beef')) {
      card.style.display = 'none';
    }
    if (settings.flights === '0' && lowerText.includes('flight')) {
      card.style.display = 'none';
    }

    // Persisted Shifts styling
    if (completedShifts.includes(text)) {
      if (textEl) {
        textEl.style.textDecoration = 'line-through';
        textEl.style.opacity = '0.6';
      }
      const iconEl = card.querySelector('.ai-card__icon');
      if (iconEl) {
        iconEl.textContent = '✅';
        iconEl.style.boxShadow = '0 0 15px var(--accent-emerald)';
        iconEl.style.background = 'rgba(16, 185, 129, 0.2)';
        iconEl.style.borderRadius = 'var(--radius-sm)';
      }
      const btn = card.querySelector('button');
      if (btn) {
        btn.textContent = 'Shift Applied';
        btn.style.opacity = '0.5';
        btn.disabled = true;
      }
    }
  });

  // Echo disabled setting
  if (settings.echoEnabled === false) {
    const aiSection = document.querySelector('.os-ai');
    if (aiSection) aiSection.style.display = 'none';
  }
}

/* =========================================
   0. ONBOARDING MODAL
   ========================================= */
function initOnboarding() {
  const modal = document.getElementById('onboarding-modal');
  const textEl = document.getElementById('onboarding-text');
  if (!modal || !textEl) return;

  // If we already onboarded this session, skip
  if (localStorage.getItem('carbon_onboarded')) {
    modal.classList.add('hidden');
    return;
  }

  const skipBtn = document.getElementById('onboarding-skip');
  let interval;

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearInterval(interval);
      modal.classList.add('hidden');
      localStorage.setItem('carbon_onboarded', 'true');
    });
  }

  const steps = [
    "Initializing Carbon Shadow...",
    "Mapping Lifestyle Data...",
    "Building Digital Twin...",
    "Future Simulation Ready..."
  ];

  let step = 0;
  interval = setInterval(() => {
    step++;
    if (step < steps.length) {
      textEl.style.opacity = 0;
      setTimeout(() => {
        textEl.textContent = steps[step];
        textEl.style.opacity = 1;
      }, 200);
    } else {
      clearInterval(interval);
      modal.classList.add('hidden');
      localStorage.setItem('carbon_onboarded', 'true');
    }
  }, 800);
}

/* =========================================
   1. HUD GAUGE ANIMATION
   ========================================= */
function initHUDGauge() {
  const fillPath = document.querySelector('.hud-gauge__fill');
  const glowPath = document.querySelector('.hud-gauge__glow');
  const scoreText = document.getElementById('live-score');
  
  if (!fillPath || !scoreText) return;

  // Target values
  const settingsStr = localStorage.getItem('carbon_settings');
  const settings = settingsStr ? JSON.parse(settingsStr) : {
    diet: 'average', commute: 'car', flights: '1-2'
  };

  let targetScore = 0;
  const savedScore = localStorage.getItem('carbon_score');
  if (savedScore !== null) {
    targetScore = parseFloat(savedScore);
  } else {
    // Diet
    if (settings.diet === 'vegan') targetScore += 2.5;
    else if (settings.diet === 'vegetarian') targetScore += 3.5;
    else if (settings.diet === 'average') targetScore += 5.5;
    else targetScore += 7.5; // meat

    // Commute
    if (settings.commute === 'bike') targetScore += 0;
    else if (settings.commute === 'ev') targetScore += 2.0;
    else if (settings.commute === 'transit') targetScore += 3.0;
    else targetScore += 7.0; // car

    // Flights
    if (settings.flights === '0') targetScore += 0;
    else if (settings.flights === '1-2') targetScore += 3.0;
    else targetScore += 8.0; // 3+
  }

  const maxScore = 50; // The max value for the gauge arc
  
  // The path length is approximately 251 (from stroke-dasharray)
  const pathLength = 251;
  const pct = Math.min(targetScore / maxScore, 1);
  const offset = pathLength - (pathLength * pct);

  // Small delay for dramatic effect
  setTimeout(() => {
    fillPath.style.strokeDashoffset = offset;
    if (glowPath) glowPath.style.strokeDashoffset = offset;
    
    // Animate the number
    animateValue(scoreText, 0, targetScore, 2000, 1);
  }, 500);
}

/* =========================================
   1.5 ECOSYSTEM CANVAS & GROWING TREE
   ========================================= */
function initEcosystemCanvas() {
  const canvas = document.getElementById('hud-ecosystem');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Set resolution
  const size = 300;
  canvas.width = size;
  canvas.height = size;
  
  const particles = [];
  const particleCount = 40;
  
  // Create abstract "spores" / dust
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      radius: 90 + Math.random() * 20, // Orbit around the gauge arc
      speed: (Math.random() * 0.005) + 0.002,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random()
    });
  }
  
  function draw() {
    ctx.clearRect(0, 0, size, size);
    
    // Center point
    const cx = size / 2;
    const cy = size / 2 + 10;
    
    particles.forEach(p => {
      p.angle += p.speed;
      
      const x = cx + Math.cos(p.angle) * p.radius;
      const y = cy + Math.sin(p.angle) * p.radius;
      
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha * 0.6})`;
      ctx.fill();
    });
    
    requestAnimationFrame(draw);
  }
  draw();
}

function initGrowingTree() {
  const branches = document.querySelectorAll('.tree-branch');
  if (branches.length === 0) return;
  
  setTimeout(() => {
    branches.forEach((b, i) => {
      // Stagger tree branch growth
      setTimeout(() => {
        b.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.2, 0.8, 0.2, 1)';
        b.style.strokeDashoffset = '0';
      }, i * 200);
    });
  }, 500);
}

/* =========================================
   2. SVG LINE CHART (WEEKLY TREND)
   ========================================= */
let chartData = [80, 60, 45, 90, 50, 30, 40]; // Y-values (lower is better, but visually we map it)

function initLineChart() {
  const chartLine = document.querySelector('.chart-line');
  const chartArea = document.querySelector('.chart-area');
  
  if (!chartLine || !chartArea) return;

  renderChartPaths(chartLine, chartArea);
}

function renderChartPaths(chartLine, chartArea) {
  const width = 400;
  const height = 100;
  const paddingX = 10;
  
  const stepX = (width - paddingX * 2) / (chartData.length - 1);
  
  let dLine = `M ${paddingX} ${chartData[0]}`;
  let dArea = `M ${paddingX} ${height} L ${paddingX} ${chartData[0]}`;

  // Build the path using cubic bezier curves for smooth "organic" feel
  for (let i = 0; i < chartData.length - 1; i++) {
    const x1 = paddingX + i * stepX;
    const y1 = chartData[i];
    const x2 = paddingX + (i + 1) * stepX;
    const y2 = chartData[i + 1];
    
    // Control points for smoothness
    const cp1x = x1 + stepX / 2;
    const cp1y = y1;
    const cp2x = x1 + stepX / 2;
    const cp2y = y2;
    
    dLine += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
    dArea += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }

  // Close the area path
  dArea += ` L ${width - paddingX} ${height} Z`;

  // Apply paths
  chartLine.setAttribute('d', dLine);
  chartArea.setAttribute('d', dArea);
}

function updateFutureProjections() {
  chartData = chartData.map(val => Math.max(10, val + 15)); // visually move the line down (higher Y value in SVG pushes path downwards, closer to x-axis)
  const chartLine = document.querySelector('.chart-line');
  const chartArea = document.querySelector('.chart-area');
  if (chartLine && chartArea) {
    chartLine.style.transition = 'all 1s ease';
    chartArea.style.transition = 'all 1s ease';
    renderChartPaths(chartLine, chartArea);
  }
}

/* =========================================
   3. UTILITY: NUMBER ANIMATION
   ========================================= */
function animateNumbers() {
  const walletVal = document.getElementById('wallet-val');
  if (walletVal) {
    const savedWallet = localStorage.getItem('carbon_wallet');
    const targetWallet = savedWallet !== null ? parseFloat(savedWallet) : 340;
    animateValue(walletVal, 0, targetWallet, 1500, 0);
  }
}

function animateValue(obj, start, end, duration, decimals) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = start + easeProgress * (end - start);
    
    obj.textContent = current.toFixed(decimals);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end.toFixed(decimals);
    }
  };
  window.requestAnimationFrame(step);
}

/* =========================================
   4. APPLY SHIFT ANIMATION
   ========================================= */
function applyShift(btn) {
  // Disable button to prevent spam
  if (btn.disabled) return;
  btn.disabled = true;
  btn.textContent = 'Shift Applied';
  btn.style.opacity = '0.5';

  // Card modifications
  const card = btn.closest('.ai-card') || btn.closest('.echo-suggestion');
  if (card) {
    const textEl = card.querySelector('.ai-card__text') || card.querySelector('.echo-suggestion__text');
    if (textEl) {
      textEl.style.textDecoration = 'line-through';
      textEl.style.opacity = '0.6';
      
      // Persist state
      let completedShifts = JSON.parse(localStorage.getItem('carbon_completed_shifts') || '[]');
      completedShifts.push(textEl.textContent);
      localStorage.setItem('carbon_completed_shifts', JSON.stringify(completedShifts));
    }
    const iconEl = card.querySelector('.ai-card__icon') || card.querySelector('.echo-suggestion__icon');
    if (iconEl) {
      iconEl.textContent = '✅';
      iconEl.style.boxShadow = '0 0 15px var(--accent-emerald)';
      iconEl.style.background = 'rgba(16, 185, 129, 0.2)';
      iconEl.style.borderRadius = 'var(--radius-sm)';
    }
  }

  // Update future projections
  updateFutureProjections();

  // Avatar glow
  const avatar = document.querySelector('.os-user__img');
  if (avatar) {
    avatar.style.transition = 'box-shadow 0.5s ease';
    avatar.style.boxShadow = '0 0 20px var(--accent-emerald)';
    setTimeout(() => {
      avatar.style.boxShadow = 'none';
    }, 2000);
  }

  // Find score element
  const scoreText = document.getElementById('live-score');
  const walletVal = document.getElementById('wallet-val');
  
  if (scoreText) {
    let currentScore = parseFloat(scoreText.textContent) || 14.2;
    let newScore = Math.max(0, currentScore - 1.2);
    localStorage.setItem('carbon_score', newScore.toFixed(1));
    
    // Add a quick pulse effect
    scoreText.style.transition = 'transform 0.3s, color 0.3s';
    scoreText.style.transform = 'scale(1.2)';
    scoreText.style.color = 'var(--accent-emerald)';
    scoreText.style.textShadow = '0 0 30px var(--accent-emerald)';
    
    setTimeout(() => {
      scoreText.style.transform = 'scale(1)';
      scoreText.style.color = '';
      scoreText.style.textShadow = '';
    }, 600);

    animateValue(scoreText, currentScore, newScore, 1000, 1);
    
    // Update gauge path
    const fillPath = document.querySelector('.hud-gauge__fill');
    const glowPath = document.querySelector('.hud-gauge__glow');
    if (fillPath) {
      const maxScore = 50;
      const pathLength = 251;
      const pct = Math.min(newScore / maxScore, 1);
      const offset = pathLength - (pathLength * pct);
      fillPath.style.strokeDashoffset = offset;
      if (glowPath) glowPath.style.strokeDashoffset = offset;
    }
  }
  
  if (walletVal) {
    let currentWallet = parseFloat(walletVal.textContent) || 340;
    let newWallet = currentWallet + 25; // Example saving increased
    localStorage.setItem('carbon_wallet', newWallet.toString());
    animateValue(walletVal, currentWallet, newWallet, 1000, 0);
  }
}

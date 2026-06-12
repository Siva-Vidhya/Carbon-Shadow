/**
 * UMBRA DESIGN SYSTEM - CARBON SHADOW
 * Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroCanvas();
  initScrollReveals();
  initFootprintAnimation();
  initTypingAnimation();
  initCameraDemo();
  initCounters();
});

/* =========================================
   NAVIGATION & SCROLL
   ========================================= */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    // Nav background toggle
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* =========================================
   SCROLL REVEALS (Intersection Observer)
   ========================================= */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

/* =========================================
   HERO CANVAS (Particle Forest)
   ========================================= */
function initHeroCanvas() {
  const canvas = document.getElementById('forest-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.5 + 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      // Emerald / Teal mix
      this.color = Math.random() > 0.5 ? `rgba(16, 185, 129, ${this.alpha})` : `rgba(13, 148, 136, ${this.alpha})`;
    }
    update() {
      this.y -= this.speedY;
      if (this.y < 0) {
        this.y = height;
        this.x = Math.random() * width;
      }
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', init);
  init();
  animate();
}

/* =========================================
   FOOTPRINT ANIMATION
   ========================================= */
function initFootprintAnimation() {
  const footprint = document.getElementById('hero-footprint');
  if (!footprint) return;

  // Trigger SVG drawing animation slightly after load
  setTimeout(() => {
    footprint.classList.add('visible');
  }, 300);
}

/* =========================================
   TYPING ANIMATION
   ========================================= */
function initTypingAnimation() {
  const el = document.getElementById('typing-1');
  if (!el) return;

  const phrases = ["flight to Tokyo...", "beef burger...", "new iPhone...", "1hr Netflix streaming..."];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before new word
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1500);
}

/* =========================================
   CAMERA DEMO (INTERACTIVE)
   ========================================= */
function initCameraDemo() {
  const input = document.getElementById('camera-input');
  const btn = document.getElementById('camera-scan-btn');
  const chips = document.querySelectorAll('.chip');
  const resultArea = document.getElementById('camera-result');
  
  const rIcon = document.getElementById('cam-res-icon');
  const rQuery = document.getElementById('cam-res-query');
  const rNum = document.getElementById('cam-res-number');
  const rGlow = document.getElementById('cam-res-glow');
  const rCtx = document.getElementById('cam-res-context');
  const rBars = document.getElementById('cam-res-bars');
  const rAlts = document.getElementById('cam-res-alts');

  // Simulated Database
  const shadowDB = {
    'beef burger': {
      icon: '🍔',
      val: 6.61,
      color: '#F43F5E', // Rose (high)
      context: "That's equivalent to driving <strong>26 km</strong> in an average car.",
      bars: [
        { label: 'Land Use', pct: 85 },
        { label: 'Methane Emissions', pct: 90 },
        { label: 'Processing', pct: 20 }
      ],
      alts: [
        { name: 'Beyond/Plant Burger', save: '−89%', val: '0.7 kg' },
        { name: 'Chicken Burger', save: '−75%', val: '1.6 kg' }
      ]
    },
    'new iphone': {
      icon: '📱',
      val: 68.0,
      color: '#F43F5E',
      context: "That's equivalent to leaving a lightbulb on for <strong>4.5 years</strong>.",
      bars: [
        { label: 'Production / Mining', pct: 80 },
        { label: 'Transport', pct: 15 },
        { label: 'Usage', pct: 5 }
      ],
      alts: [
        { name: 'Refurbished iPhone', save: '−85%', val: '10.2 kg' },
        { name: 'Keep current phone 1 yr', save: '−100%', val: '0 kg' }
      ]
    },
    'flight to paris': {
      icon: '✈️',
      val: 320.0,
      color: '#F43F5E',
      context: "That consumes <strong>15%</strong> of your sustainable yearly carbon budget.",
      bars: [
        { label: 'Jet Fuel', pct: 95 },
        { label: 'Airport Ops', pct: 5 }
      ],
      alts: [
        { name: 'High-speed Train (from London)', save: '−91%', val: '29 kg' },
        { name: 'Video Conference', save: '−99%', val: '0.5 kg' }
      ]
    },
    'pair of jeans': {
      icon: '👖',
      val: 33.4,
      color: '#F59E0B', // Amber (medium)
      context: "Takes <strong>7,500 liters</strong> of water to grow the cotton.",
      bars: [
        { label: 'Raw Material (Cotton)', pct: 60 },
        { label: 'Dyeing / Wash', pct: 30 },
        { label: 'Transport', pct: 10 }
      ],
      alts: [
        { name: 'Thrifted Jeans', save: '−95%', val: '1.6 kg' },
        { name: 'Recycled Denim', save: '−40%', val: '20 kg' }
      ]
    },
    '1hr netflix': {
      icon: '📺',
      val: 0.05,
      color: '#10B981', // Emerald (low)
      context: "Very low impact. Servers are largely renewable.",
      bars: [
        { label: 'Data Center', pct: 40 },
        { label: 'Network', pct: 40 },
        { label: 'Device Power', pct: 20 }
      ],
      alts: [
        { name: 'Read a book', save: '−100%', val: '0 kg' }
      ]
    },
    'avocado from peru': {
      icon: '🥑',
      val: 0.85,
      color: '#F59E0B',
      context: "Low carbon, but very high <strong>water footprint</strong>.",
      bars: [
        { label: 'Transport', pct: 70 },
        { label: 'Farming', pct: 30 }
      ],
      alts: [
        { name: 'Local Seasonal Veg', save: '−80%', val: '0.15 kg' }
      ]
    }
  };

  function doScan(query) {
    const q = query.toLowerCase().trim();
    if (!q) return;

    // Simulate search delay
    btn.innerHTML = `<span class="spinner"></span>`;
    input.disabled = true;
    resultArea.classList.remove('active');

    setTimeout(() => {
      btn.innerHTML = `<span class="camera__scan-btn-text">Scan</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
      input.disabled = false;
      
      // Look up or mock
      let data = shadowDB[q];
      if (!data) {
        // Fallback for random stuff
        data = {
          icon: '✦',
          val: (Math.random() * 50).toFixed(1),
          color: '#0D9488',
          context: "Estimated based on similar product categories.",
          bars: [{label: 'Production', pct: 60}, {label: 'Transport', pct: 40}],
          alts: [{name: 'Reduce usage', save: '−50%', val: 'Half'}]
        };
      }

      // Populate UI
      rIcon.textContent = data.icon;
      rQuery.textContent = query.charAt(0).toUpperCase() + query.slice(1);
      rCtx.innerHTML = data.context;
      rGlow.style.background = `radial-gradient(circle, ${data.color}40 0%, transparent 70%)`;
      document.querySelector('.camera__result-unit').style.color = data.color;

      // Build Bars
      rBars.innerHTML = data.bars.map(b => `
        <div class="res-bar">
          <div class="res-bar__header"><span>${b.label}</span><span>${b.pct}%</span></div>
          <div class="res-bar__track"><div class="res-bar__fill" style="width: 0; background: ${data.color}"></div></div>
        </div>
      `).join('');

      // Build Alts
      rAlts.innerHTML = data.alts.map(a => `
        <div class="res-alt">
          <div class="res-alt__info">
            <span>✦</span> <span>${a.name}</span>
          </div>
          <div class="res-alt__right">
            <span class="res-alt__save">${a.save}</span>
            <span class="res-alt__val">${a.val}</span>
          </div>
        </div>
      `).join('');

      // Show
      resultArea.classList.add('active');

      // Animate Number & Bars
      animateNumber(rNum, 0, data.val, 1500);
      setTimeout(() => {
        const fills = document.querySelectorAll('.res-bar__fill');
        fills.forEach((f, i) => {
          f.style.width = data.bars[i].pct + '%';
        });
      }, 100);

    }, 800);
  }

  // Event Listeners
  btn.addEventListener('click', () => doScan(input.value));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doScan(input.value);
  });
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      input.value = q;
      doScan(q);
    });
  });
}

// Utility: Number Counter Animation
function animateNumber(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Easing Out
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const current = start + easeOutCubic * (end - start);
    
    // Format to 1 or 2 decimals if it's a small float, else integer
    element.textContent = (end % 1 !== 0) ? current.toFixed(1) : Math.floor(current).toLocaleString();
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = (end % 1 !== 0) ? end.toFixed(1) : end.toLocaleString();
    }
  };
  window.requestAnimationFrame(step);
}

/* =========================================
   COMMUNITY COUNTERS
   ========================================= */
function initCounters() {
  const stats = document.querySelectorAll('.community__stat-number');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        
        // Custom animate to append suffix
        animateNumberWithSuffix(el, 0, target, 2000, suffix);
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  stats.forEach(stat => observer.observe(stat));
}

function animateNumberWithSuffix(element, start, end, duration, suffix) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + easeOutCubic * (end - start));
    
    element.textContent = current.toLocaleString() + suffix;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end.toLocaleString() + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

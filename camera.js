/**
 * CARBON SHADOW - AR CAMERA LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initCamera();
  initARInteractions();
});

/* =========================================
   1. WEBCAM INITIALIZATION
   ========================================= */
async function initCamera() {
  const video = document.getElementById('ar-video');
  const statusText = document.getElementById('ar-status-text');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    video.srcObject = stream;
    statusText.textContent = "Optical Sensors Active";
  } catch (err) {
    console.warn("Camera access denied or unavailable. Using fallback vignette.", err);
    statusText.textContent = "Camera Unavailable - Simulation Mode";
  }
}

/* =========================================
   2. SPATIAL AR INTERACTIONS
   ========================================= */
function initARInteractions() {
  const body = document.body;
  const reticle = document.getElementById('ar-reticle');
  const cardContainer = document.getElementById('ar-card-container');
  const instructions = document.getElementById('ar-instructions');
  const closeBtn = document.getElementById('ar-close-btn');
  
  // UI Elements to update
  const uiIcon = document.getElementById('ar-icon');
  const uiTitle = document.getElementById('ar-title');
  const uiCategory = document.getElementById('ar-category');
  const uiCarbon = document.getElementById('ar-carbon');
  const uiCarbonBar = document.getElementById('ar-carbon-bar');
  const uiWater = document.getElementById('ar-water');
  const uiWaterBar = document.getElementById('ar-water-bar');
  const uiScore = document.getElementById('ar-score');
  const uiScoreRing = document.getElementById('ar-score-ring');
  const uiAlt1 = document.getElementById('ar-alt-1');
  const uiAlt1Save = document.getElementById('ar-alt-1-save');

  let isScanning = false;

  // Mock Database for random objects
  const mockObjects = [
    {
      icon: '🥩', title: 'Beef Product', cat: 'High Impact Food',
      carbon: 15.2, carbonPct: 90,
      water: 3200, waterPct: 85,
      score: 12,
      alt: 'Plant-based Alternative', altSave: '-85%'
    },
    {
      icon: '☕', title: 'Coffee Cup', cat: 'Single-Use Container',
      carbon: 0.4, carbonPct: 20,
      water: 140, waterPct: 30,
      score: 45,
      alt: 'Reusable Tumbler', altSave: '-90%'
    },
    {
      icon: '🚗', title: 'Combustion Vehicle', cat: 'Transport',
      carbon: 42.0, carbonPct: 95,
      water: 1500, waterPct: 50,
      score: 5,
      alt: 'Electric / Transit', altSave: '-70%'
    },
    {
      icon: '📱', title: 'Smartphone', cat: 'Electronics',
      carbon: 65.0, carbonPct: 70,
      water: 3000, waterPct: 80,
      score: 35,
      alt: 'Refurbished Device', altSave: '-80%'
    },
    {
      icon: '🧾', title: 'Grocery Receipt', cat: 'Consumer Goods',
      carbon: 18.5, carbonPct: 65,
      water: 450, waterPct: 40,
      score: 55,
      alt: 'Local Farmers Market', altSave: '-40%'
    }
  ];

  // Handle Tap on screen
  body.addEventListener('click', (e) => {
    // Ignore clicks on HUD buttons or the card itself
    if (e.target.closest('.ar-btn-back') || e.target.closest('.spatial-card') || isScanning) return;

    const x = e.clientX;
    const y = e.clientY;

    startScan(x, y);
  });

  closeBtn.addEventListener('click', () => {
    cardContainer.classList.add('hidden');
    instructions.style.opacity = '0.8';
  });

  function startScan(x, y) {
    isScanning = true;
    instructions.style.opacity = '0'; // Hide instructions
    cardContainer.classList.add('hidden'); // Hide existing card
    
    // Position and show reticle
    reticle.style.left = `${x}px`;
    reticle.style.top = `${y}px`;
    reticle.classList.remove('hidden');

    // Simulate scanning delay
    setTimeout(() => {
      reticle.classList.add('hidden');
      showSpatialCard(x, y);
      isScanning = false;
    }, 1500);
  }

  function showSpatialCard(x, y) {
    // Pick random object from mock DB
    const data = mockObjects[Math.floor(Math.random() * mockObjects.length)];

    // Populate Data
    uiIcon.textContent = data.icon;
    uiTitle.textContent = data.title;
    uiCategory.textContent = data.cat;
    
    // Reset animations
    uiCarbon.textContent = '0.0';
    uiCarbonBar.style.width = '0%';
    uiWater.textContent = '0';
    uiWaterBar.style.width = '0%';
    uiScore.textContent = '0';
    uiScoreRing.style.strokeDashoffset = '100'; // Full empty ring

    uiAlt1.textContent = data.alt;
    uiAlt1Save.textContent = data.altSave;

    // Position Card
    // We want the card to spawn near the tap, but not go off-screen
    const cardWidth = 320;
    const cardHeight = 400; // approximate
    let spawnX = x + 40;
    let spawnY = y - cardHeight / 2;

    // Screen bounds check
    if (spawnX + cardWidth > window.innerWidth) spawnX = x - cardWidth - 40;
    if (spawnY < 20) spawnY = 20;
    if (spawnY + cardHeight > window.innerHeight) spawnY = window.innerHeight - cardHeight - 20;

    cardContainer.style.left = `${spawnX}px`;
    cardContainer.style.top = `${spawnY}px`;

    // Anchor line styling (connects tapped x,y to card)
    const anchor = document.querySelector('.spatial-anchor-line');
    // Basic logic to flip anchor based on left/right positioning
    if (spawnX > x) {
      anchor.style.left = '-40px';
      anchor.style.transform = 'rotate(90deg)';
    } else {
      anchor.style.left = `${cardWidth}px`;
      anchor.style.transform = 'rotate(-90deg)';
    }
    anchor.style.top = '50%';

    cardContainer.classList.remove('hidden');

    // Slight parallax effect based on mouse movement
    document.addEventListener('mousemove', handleParallax);

    // Trigger Animations after a brief delay
    setTimeout(() => {
      animateValue(uiCarbon, 0, data.carbon, 1000, 1);
      uiCarbonBar.style.width = `${data.carbonPct}%`;
      
      animateValue(uiWater, 0, data.water, 1000, 0);
      uiWaterBar.style.width = `${data.waterPct}%`;

      animateValue(uiScore, 0, data.score, 1000, 0);
      const ringOffset = 100 - data.score;
      uiScoreRing.style.strokeDashoffset = ringOffset;
      
      // Color code the score ring
      uiScoreRing.style.stroke = data.score > 60 ? 'var(--accent-emerald)' : data.score > 30 ? 'var(--accent-teal)' : 'var(--accent-rose)';

    }, 100);
  }

  function handleParallax(e) {
    if (cardContainer.classList.contains('hidden')) {
      document.removeEventListener('mousemove', handleParallax);
      return;
    }
    const card = document.querySelector('.spatial-card');
    const x = (window.innerWidth / 2 - e.clientX) / 50;
    const y = (window.innerHeight / 2 - e.clientY) / 50;
    card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  }

  // Utility Number Animation
  function animateValue(obj, start, end, duration, decimals) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = start + (end - start) * (1 - Math.pow(1 - progress, 3));
      obj.textContent = current.toFixed(decimals);
      if (progress < 1) window.requestAnimationFrame(step);
      else obj.textContent = end.toFixed(decimals);
    };
    window.requestAnimationFrame(step);
  }
}

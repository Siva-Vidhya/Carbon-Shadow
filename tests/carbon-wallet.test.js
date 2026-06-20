// @vitest-environment jsdom
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const dashboardCode = fs.readFileSync(path.resolve(__dirname, '../dashboard.js'), 'utf-8');
const twinCode = fs.readFileSync(path.resolve(__dirname, '../twin.js'), 'utf-8');
const cameraCode = fs.readFileSync(path.resolve(__dirname, '../camera.js'), 'utf-8');
const securityCode = fs.readFileSync(path.resolve(__dirname, '../security-utils.js'), 'utf-8');

describe('Carbon Wallet & Core Project Logic', () => {
  beforeAll(() => {
    Object.defineProperty(window.navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn().mockResolvedValue({}) },
      configurable: true
    });

    // Evaluate scripts so functions are available in the global scope.
    // We intentionally DO NOT fire DOMContentLoaded here to avoid caching null DOM elements.
    window.eval(securityCode);
    window.eval(dashboardCode);
    window.eval(twinCode);
    window.eval(cameraCode);
  });

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  // ==========================================
  // 1 & 2: LocalStorage read/write/clear
  // ==========================================
  describe('1. LocalStorage Operations', () => {
    it('should write data to localStorage successfully', () => {
      localStorage.setItem('carbon_wallet', '350');
      expect(localStorage.getItem('carbon_wallet')).toBe('350');
    });

    it('should read data from localStorage correctly', () => {
      localStorage.setItem('carbon_score', '14.2');
      expect(localStorage.getItem('carbon_score')).toBe('14.2');
    });

    it('should clear localStorage completely', () => {
      localStorage.setItem('carbon_wallet', '350');
      localStorage.clear();
      expect(localStorage.getItem('carbon_wallet')).toBeNull();
      expect(localStorage.length).toBe(0);
    });
  });

  // ==========================================
  // 3 & 4: Carbon Savings & Wallet tracking
  // ==========================================
  describe('2. Carbon Savings & Wallet Tracking (Dashboard)', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <img class="os-user__img" />
        <div id="live-score">14.2</div>
        <div id="wallet-val">340</div>
        <div class="ai-card">
          <div class="ai-card__text">Switch to LED bulbs</div>
          <div class="ai-card__icon">💡</div>
          <button class="t-card__cta">Apply</button>
        </div>
      `;
    });

    it('should update live carbon score in localStorage immediately when a shift is applied', () => {
      const btn = document.querySelector('button');
      window.applyShift(btn);
      // The score text animation is async, but localStorage is updated immediately
      expect(localStorage.getItem('carbon_score')).toBe('13.0');
    });

    it('should add points to the wallet tracking value', () => {
      const btn = document.querySelector('button');
      window.applyShift(btn);
      expect(localStorage.getItem('carbon_wallet')).toBe('365');
    });

    it('should disable the shift button visually to prevent spam clicks', () => {
      const btn = document.querySelector('button');
      window.applyShift(btn);
      expect(btn.disabled).toBe(true);
      expect(btn.textContent).toBe('Shift Applied');
    });

    it('should persist applied shift to localStorage tracker array', () => {
      const btn = document.querySelector('button');
      window.applyShift(btn);
      const shifts = JSON.parse(localStorage.getItem('carbon_completed_shifts'));
      expect(shifts).toContain('Switch to LED bulbs');
    });
  });

  // ==========================================
  // 5. Digital Twin Scenarios
  // ==========================================
  describe('3. Digital Twin Scenario Path Calculations', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <img id="nav-user-avatar" />
        <div id="base-carbon"></div>
        <div id="card-a"><div class="counter" data-suffix="t"></div></div>
        <div id="card-b"><div class="counter" data-suffix="t"></div></div>
      `;
    });

    it('should calculate base score dynamically for eco-friendly lifestyle (vegan, bike, no flights)', () => {
      localStorage.setItem('carbon_settings', JSON.stringify({ diet: 'vegan', commute: 'bike', flights: '0' }));
      window.applySettingsToTwin();
      const baseEl = document.getElementById('base-carbon');
      expect(baseEl.textContent).toBe('2.2t / yr'); 
    });

    it('should calculate base score heavily for high emission lifestyle (meat, car, flights 3+)', () => {
      localStorage.setItem('carbon_settings', JSON.stringify({ diet: 'meat', commute: 'car', flights: '3+' }));
      window.applySettingsToTwin();
      const baseEl = document.getElementById('base-carbon');
      expect(baseEl.textContent).toBe('10.7t / yr');
    });

    it('should project Current Path shadow (Card A) correctly as 1.8x of base', () => {
      localStorage.setItem('carbon_settings', JSON.stringify({ diet: 'average', commute: 'transit', flights: '0' }));
      window.applySettingsToTwin();
      const c = document.querySelector('#card-a .counter');
      expect(c.getAttribute('data-val')).toBe('7.6');
    });

    it('should project Optimal Path savings (Card B) as -0.4x of base', () => {
      localStorage.setItem('carbon_settings', JSON.stringify({ diet: 'average', commute: 'transit', flights: '0' }));
      window.applySettingsToTwin();
      const c = document.querySelector('#card-b .counter');
      expect(c.getAttribute('data-val')).toBe('-1.7');
    });
  });

  // ==========================================
  // 6. Echo AI Formatting & Logic
  // ==========================================
  describe('4. Echo AI Response & Filtering Logic', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="os-ai">
          <div class="ai-card"><div class="ai-card__text">Eat less beef</div><button></button></div>
          <div class="ai-card"><div class="ai-card__text">Skip your flight</div><button></button></div>
          <div class="ai-card"><div class="ai-card__text">Use cold water</div><button></button></div>
        </div>
      `;
    });

    it('should automatically hide beef recommendations if user identifies as vegan', () => {
      localStorage.setItem('carbon_settings', JSON.stringify({ diet: 'vegan' }));
      window.applySettingsToDashboard();
      const cards = document.querySelectorAll('.ai-card');
      expect(cards[0].style.display).toBe('none');
    });

    it('should filter out flight recommendations if flights are set to 0', () => {
      localStorage.setItem('carbon_settings', JSON.stringify({ flights: '0' }));
      window.applySettingsToDashboard();
      const cards = document.querySelectorAll('.ai-card');
      expect(cards[1].style.display).toBe('none');
    });

    it('should mark previously completed shifts as applied across sessions', () => {
      localStorage.setItem('carbon_settings', JSON.stringify({}));
      localStorage.setItem('carbon_completed_shifts', JSON.stringify(['Use cold water']));
      window.applySettingsToDashboard();
      const cards = document.querySelectorAll('.ai-card');
      const btn = cards[2].querySelector('button');
      expect(btn.disabled).toBe(true);
      expect(btn.textContent).toBe('Shift Applied');
    });

    it('should completely hide the AI recommendation section if Echo is disabled in settings', () => {
      localStorage.setItem('carbon_settings', JSON.stringify({ echoEnabled: false }));
      window.applySettingsToDashboard();
      const section = document.querySelector('.os-ai');
      expect(section.style.display).toBe('none');
    });
  });

  // ==========================================
  // 7. Receipt Lens Carbon impact Estimation
  // ==========================================
  describe('5. Receipt Lens (Camera AR) impact estimation', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <video id="ar-video"></video>
        <div id="ar-status-text"></div>
        <div id="ar-card-container" class="hidden">
           <div class="spatial-card"></div>
           <div class="spatial-anchor-line"></div>
        </div>
        <div id="ar-reticle" class="hidden"></div>
        <div id="ar-instructions"></div>
        <button id="ar-close-btn"></button>
        
        <div id="ar-icon"></div>
        <div id="ar-title"></div>
        <div id="ar-category"></div>
        <div id="ar-carbon"></div>
        <div id="ar-carbon-bar"></div>
        <div id="ar-water"></div>
        <div id="ar-water-bar"></div>
        <div id="ar-score"></div>
        <svg><circle id="ar-score-ring"></circle></svg>
        <div id="ar-alt-1"></div>
        <div id="ar-alt-1-save"></div>
      `;
      // Initialize AR elements AFTER DOM is set
      if (typeof window.initCamera === 'function') window.initCamera();
      if (typeof window.initARInteractions === 'function') window.initARInteractions();
    });

    it('should simulate an AR scan tap revealing carbon footprint logic', () => {
      vi.useFakeTimers();
      
      const originalRandom = Math.random;
      Math.random = () => 0.1; // "Beef Product"

      document.body.click(); 
      expect(document.getElementById('ar-reticle').classList.contains('hidden')).toBe(false);

      vi.runAllTimers();

      expect(document.getElementById('ar-title').textContent).toBe('Beef Product');
      expect(document.getElementById('ar-card-container').classList.contains('hidden')).toBe(false);

      Math.random = originalRandom;
      vi.useRealTimers();
    });

    it('should hide AR spatial card on closing the viewer', () => {
      const container = document.getElementById('ar-card-container');
      const closeBtn = document.getElementById('ar-close-btn');
      container.classList.remove('hidden');
      closeBtn.click();
      expect(container.classList.contains('hidden')).toBe(true);
    });
  });

  // ==========================================
  // 8. Edge Cases
  // ==========================================
  describe('6. Edge Cases & Error Boundaries', () => {
    it('gracefully handles missing localStorage (null states) without crashing logic', () => {
      document.body.innerHTML = '<div id="base-carbon"></div>';
      expect(() => window.applySettingsToTwin()).not.toThrow();
      expect(document.getElementById('base-carbon').textContent).toBe('');
    });

    it('gracefully handles empty shift arrays logic in dashboard', () => {
      document.body.innerHTML = '<div class="ai-card"><div class="ai-card__text">Test</div></div>';
      localStorage.setItem('carbon_settings', JSON.stringify({ diet: 'average' }));
      expect(() => window.applySettingsToDashboard()).not.toThrow();
    });

    it('gracefully fails and handles error if JSON parse fails for settings', () => {
      localStorage.setItem('carbon_settings', '{{[ corrupted array/json');
      expect(() => window.applySettingsToDashboard()).not.toThrow();
    });

    it('handles clicking applyShift multiple times gracefully by disabling elements early', () => {
      document.body.innerHTML = `
        <div id="live-score">14.2</div>
        <div class="ai-card"><button class="t-card__cta" disabled>Shift Applied</button></div>
      `;
      const btn = document.querySelector('button');
      window.applyShift(btn); 
      const score = document.getElementById('live-score').textContent;
      expect(score).toBe('14.2'); 
    });
  });
});

// @vitest-environment jsdom
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const code = fs.readFileSync(path.resolve(__dirname, '../camera.js'), 'utf-8');

describe('Camera Logic', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <video id="ar-video"></video>
      <div id="ar-status-text"></div>
      <div id="ar-reticle" class="hidden"></div>
      <div id="ar-card-container" class="hidden">
        <div class="spatial-card"></div>
        <div class="spatial-anchor-line"></div>
      </div>
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
    Object.defineProperty(window.navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue({})
      },
      configurable: true
    });
    
    window.eval(code);
    window.eval("Math.random = function() { return window.document.__MOCK_RANDOM__ !== undefined ? window.document.__MOCK_RANDOM__ : 0.5; };");
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('Verify mock scan results and grocery receipt', () => {
    vi.useFakeTimers();

    // Test 1: Beef Product
    document.__MOCK_RANDOM__ = 0.1;
    document.body.click();
    vi.runAllTimers();
    expect(document.getElementById('ar-title').textContent).toBe('Beef Product');
    expect(document.getElementById('ar-alt-1').textContent).toBe('Plant-based Alternative');

    // Test 2: Grocery Receipt
    document.__MOCK_RANDOM__ = 0.9;
    document.body.click();
    vi.runAllTimers();
    expect(document.getElementById('ar-title').textContent).toBe('Grocery Receipt');
    expect(document.getElementById('ar-alt-1').textContent).toBe('Local Farmers Market');

    vi.useRealTimers();
  });
});

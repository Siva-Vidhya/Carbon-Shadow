// @vitest-environment jsdom
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const code = fs.readFileSync(path.resolve(__dirname, '../dashboard.js'), 'utf-8');

describe('Dashboard Logic', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <div id="live-score">14.2</div>
      <div id="wallet-val">340</div>
      <div class="ai-card">
        <div class="ai-card__text">Switch to Oat Milk</div>
        <div class="ai-card__icon"></div>
        <button id="shift-btn"></button>
      </div>
      <svg><path class="hud-gauge__fill"></path><path class="hud-gauge__glow"></path></svg>
      <img class="os-user__img" />
    `;
    // We execute the script inside a function wrapper to extract applyShift
    // without polluting or getting blocked by JS scope issues.
    window.eval(code + "; window.applyShift = applyShift;");
  });

  beforeEach(() => {
    localStorage.clear();
    document.getElementById('live-score').textContent = '14.2';
    document.getElementById('wallet-val').textContent = '340';
    document.getElementById('shift-btn').disabled = false;
  });

  it('Verify wallet values update correctly after applying a shift', () => {
    const btn = document.getElementById('shift-btn');
    window.applyShift(btn);
    const walletVal = localStorage.getItem('carbon_wallet');
    expect(walletVal).toBe('365');
  });

  it('Verify carbon score calculations behave as expected', () => {
    const btn = document.getElementById('shift-btn');
    window.applyShift(btn);
    const score = localStorage.getItem('carbon_score');
    expect(score).toBe('13.0');
  });
});

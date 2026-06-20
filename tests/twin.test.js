// @vitest-environment jsdom
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const code = fs.readFileSync(path.resolve(__dirname, '../twin.js'), 'utf-8');
const securityCode = fs.readFileSync(path.resolve(__dirname, '../security-utils.js'), 'utf-8');

describe('Digital Twin Logic', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <img id="nav-user-avatar" />
      <div id="base-carbon"></div>
      <div id="card-a"><div class="counter" data-suffix="t"></div></div>
      <div id="card-b"><div class="counter" data-suffix="t"></div></div>
      <div class="timeline-container"></div>
      <div id="ambient-bg"></div>
    `;
    const script = document.createElement('script');
    script.textContent = securityCode + '\n' + code;
    document.head.appendChild(script);
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('Verify future path selection returns valid states', () => {
    localStorage.setItem('carbon_settings', JSON.stringify({
      diet: 'vegan',
      commute: 'bike',
      flights: '0'
    }));
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const baseCarbonEl = document.getElementById('base-carbon');
    expect(baseCarbonEl.textContent).toBe('2.2t / yr');

    const cardA = document.getElementById('card-a');
    const counterA = cardA.querySelector('.counter');
    expect(counterA.getAttribute('data-val')).toBe('4.0');
  });

  it('Verify path identifiers remain consistent', () => {
    localStorage.setItem('carbon_settings', JSON.stringify({
      diet: 'meat',
      commute: 'car',
      flights: '3+'
    }));
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    const cardA = document.getElementById('card-a');
    const counterA = cardA.querySelector('.counter');
    expect(counterA.getAttribute('data-val')).toBe('19.3');
    
    const cardB = document.getElementById('card-b');
    const counterB = cardB.querySelector('.counter');
    expect(counterB.getAttribute('data-val')).toBe('-4.3');
  });
});

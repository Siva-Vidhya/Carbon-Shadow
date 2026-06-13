// @vitest-environment jsdom
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const code = fs.readFileSync(path.resolve(__dirname, '../echo.js'), 'utf-8');

describe('Echo Logic', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <button id="echo-trigger"></button>
      <div id="echo-panel"></div>
      <button id="echo-close"></button>
      <div id="echo-chat"></div>
      <input id="echo-input" />
      <button id="echo-send"></button>
    `;
    const script = document.createElement('script');
    script.textContent = code;
    document.head.appendChild(script);
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  beforeEach(() => {
    localStorage.clear();
    document.getElementById('echo-chat').innerHTML = '';
  });

  it('Verify Echo returns a non-empty recommendation', () => {
    vi.useFakeTimers();
    const input = document.getElementById('echo-input');
    const sendBtn = document.getElementById('echo-send');
    
    input.value = 'expensive';
    sendBtn.click();
    
    vi.runAllTimers();
    
    const chat = document.getElementById('echo-chat').innerHTML;
    expect(chat).toContain('echo-msg--ai');
    expect(chat).toContain('low-flow showerhead');
    vi.useRealTimers();
  });

  it('Verify recommendation output remains deterministic', () => {
    vi.useFakeTimers();
    const input = document.getElementById('echo-input');
    const sendBtn = document.getElementById('echo-send');
    
    input.value = 'flight';
    sendBtn.click();
    
    vi.runAllTimers();
    
    const chat = document.getElementById('echo-chat').innerHTML;
    expect(chat).toContain('thermostat');
    expect(chat).toContain('second-hand');
    vi.useRealTimers();
  });
});

// @vitest-environment jsdom
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const code = fs.readFileSync(path.resolve(__dirname, '../settings.js'), 'utf-8');

describe('Settings Logic', () => {
  beforeAll(() => {
    document.body.innerHTML = `
      <input id="profile-name" type="text" />
      <input id="profile-color" type="text" />
      <select id="life-diet"><option value="vegan"></option><option value="average"></option></select>
      <select id="life-commute"><option value="car"></option><option value="bike"></option></select>
      <select id="life-flights"><option value="0"></option><option value="1-2"></option></select>
      <input id="echo-enabled" type="checkbox" />
      <select id="echo-strictness"><option value="balanced"></option><option value="strict"></option></select>
      <img id="nav-user-avatar" />
      <div id="save-status"></div>
    `;
    const script = document.createElement('script');
    script.textContent = code;
    document.head.appendChild(script);
  });

  beforeEach(() => {
    localStorage.clear();
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('Verify settings persist correctly', () => {
    const nameInput = document.getElementById('profile-name');
    nameInput.value = 'Test User';
    nameInput.dispatchEvent(new Event('keyup'));

    const storedStr = localStorage.getItem('carbon_settings');
    expect(storedStr).toBeTruthy();
    const stored = JSON.parse(storedStr);
    expect(stored.profileName).toBe('Test User');
  });

  it('Verify stored values can be retrieved successfully', () => {
    const mockSettings = {
      profileName: 'Retrieved User',
      profileColor: '0D9488',
      diet: 'vegan',
      commute: 'bike',
      flights: '0',
      echoEnabled: true,
      echoStrictness: 'strict'
    };
    localStorage.setItem('carbon_settings', JSON.stringify(mockSettings));
    
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const nameInput = document.getElementById('profile-name');
    expect(nameInput.value).toBe('Retrieved User');
  });
});

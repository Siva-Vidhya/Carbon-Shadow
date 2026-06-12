/**
 * ECHO COMPANION LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initEcho();
});

function initEcho() {
  const trigger = document.getElementById('echo-trigger');
  const panel = document.getElementById('echo-panel');
  const closeBtn = document.getElementById('echo-close');
  const chatArea = document.getElementById('echo-chat');
  const input = document.getElementById('echo-input');
  const sendBtn = document.getElementById('echo-send');

  if (!trigger || !panel) return;

  // Toggle Panel
  trigger.addEventListener('click', () => {
    panel.classList.toggle('active');
    const badge = document.getElementById('echo-badge');
    if (badge) badge.classList.add('hidden'); // Hide badge
    if (panel.classList.contains('active')) {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('active');
  });

  // Handle Input
  let isWaiting = false;
  const handleSend = () => {
    if (isWaiting) return;
    const text = input.value.trim();
    if (!text) return;

    isWaiting = true;
    input.disabled = true;

    // 1. Add User Message
    addMessage(text, 'user');
    input.value = '';

    // 2. Show Typing Indicator
    const typingId = showTyping();

    // 3. Process Response
    setTimeout(() => {
      removeTyping(typingId);
      const response = generateResponse(text);
      addMessage(response.text, 'ai', response.suggestions);
      isWaiting = false;
      input.disabled = false;
      input.focus();
    }, 1500 + Math.random() * 1000); // 1.5 - 2.5s delay
  };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  function addMessage(text, sender, suggestions = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `echo-msg echo-msg--${sender}`;
    
    let html = `<div class="echo-bubble">${text}</div>`;
    
    if (suggestions && suggestions.length > 0) {
      suggestions.forEach(sug => {
        html += `
          <div class="echo-suggestion">
            <div style="display:flex; width:100%; align-items:center; gap: 12px;">
              <span class="echo-suggestion__icon">${sug.icon}</span>
              <span class="echo-suggestion__text">${sug.text}</span>
              <span class="echo-suggestion__save">${sug.save}</span>
            </div>
            <button class="echo-apply-btn" aria-label="Apply Shift">Apply Shift</button>
          </div>
        `;
      });
    }

    msgDiv.innerHTML = html;
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // Bind apply buttons
    const applyBtns = msgDiv.querySelectorAll('.echo-apply-btn');
    applyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof applyShift === 'function') {
          applyShift(btn);
          setTimeout(() => panel.classList.remove('active'), 1000);
        } else {
          btn.textContent = 'Applied ✓';
          btn.style.background = 'var(--accent-emerald)';
          btn.style.color = '#000';
          setTimeout(() => triggerDashboardSync(), 500);
        }
      });
    });
  }

  function triggerDashboardSync() {
    // Close Echo
    panel.classList.remove('active');
    
    // Flash dashboard
    const gaugePath = document.querySelector('.hud-gauge__fill');
    if (gaugePath) {
      const orig = gaugePath.style.stroke;
      gaugePath.style.stroke = 'var(--accent-emerald)';
      gaugePath.style.filter = 'drop-shadow(0 0 20px var(--accent-emerald))';
      setTimeout(() => {
        gaugePath.style.stroke = orig;
        gaugePath.style.filter = 'none';
      }, 1500);
    }

    // Decrement Carbon Debt
    const debtEl = document.querySelector('.debt-val');
    if (debtEl) {
      const current = parseFloat(debtEl.textContent.replace('+',''));
      debtEl.textContent = '+' + (current - 0.5).toFixed(1);
    }
  }

  function showTyping() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.className = 'echo-msg echo-msg--ai';
    typingDiv.id = id;
    typingDiv.innerHTML = `
      <div class="echo-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    chatArea.appendChild(typingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
    return id;
  }

  function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // Mock Negotiation Engine
  function generateResponse(text) {
    const lower = text.toLowerCase();
    const settingsStr = localStorage.getItem('carbon_settings');
    const settings = settingsStr ? JSON.parse(settingsStr) : {};
    
    // Meat scenario
    if ((lower.includes('meat') || lower.includes('beef') || lower.includes('steak')) && settings.diet !== 'vegan' && settings.diet !== 'vegetarian') {
      return {
        text: "That's totally okay. You don't have to give up meat entirely to make a big impact. We can balance the shadow elsewhere. How do you feel about trying one of these shifts instead?",
        suggestions: [
          { icon: '🥛', text: "Switch to <strong>Oat Milk</strong> for morning coffee", save: "-0.4t / yr" },
          { icon: '🚗', text: "Work from home <strong>1 extra day/week</strong>", save: "-1.2t / yr" }
        ]
      };
    }
    
    // Flight scenario
    if ((lower.includes('flight') || lower.includes('fly') || lower.includes('plane')) && settings.flights !== '0') {
      return {
        text: "I get it, travel is important for connection and growth. If you take that flight, we can easily offset the shadow by adjusting your home energy use. Look at these options:",
        suggestions: [
          { icon: '🌡️', text: "Lower thermostat by <strong>1 degree</strong>", save: "-0.8t" },
          { icon: '📦', text: "Buy <strong>second-hand</strong> clothes", save: "-0.5t" }
        ]
      };
    }

    // Cost scenario
    if (lower.includes('expensive') || lower.includes('cost') || lower.includes('money')) {
      return {
        text: "Sustainability shouldn't be a luxury. In fact, the most impactful choices usually save money. Let's start with high-ROI actions:",
        suggestions: [
          { icon: '🚿', text: "Install a <strong>low-flow showerhead</strong>", save: "Save $120/yr" },
          { icon: '🚲', text: "Bike to the grocery store on weekends", save: "Save $40/mo" }
        ]
      };
    }

    // Default friendly response
    return {
      text: "I hear you. My goal isn't perfection, just progression. Every small choice shifts the timeline slightly toward the light. Is there a specific area of your life you'd like to explore optimizing?",
      suggestions: []
    };
  }
}

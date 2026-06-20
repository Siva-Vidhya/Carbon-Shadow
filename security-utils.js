/* eslint-env browser, node */
/**
 * Carbon Shadow - Security Utilities
 */

// 1. Sanitize Input using textContent to prevent XSS
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  const div = document.createElement('div');
  // Assigning to textContent automatically escapes HTML characters
  div.textContent = input;
  return div.innerHTML;
}

// 2. Safe LocalStorage Get with try/catch and JSON validation
function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    // Attempt to parse if it looks like a JSON object or array
    if ((item.startsWith('{') && item.endsWith('}')) || (item.startsWith('[') && item.endsWith(']'))) {
      const parsed = JSON.parse(item);
      return parsed;
    }
    
    // Attempt to parse booleans or numbers if needed, else return string
    if (item === 'true') return true;
    if (item === 'false') return false;
    
    return item;
  } catch (error) {
    console.error(`[Security] Error reading or parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

// 3. Safe LocalStorage Set with try/catch
function safeLocalStorageSet(key, value) {
  try {
    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`[Security] Error setting localStorage key "${key}". Storage might be full or disabled:`, error);
    return false;
  }
}

// 4. Validate Carbon Data shape before use
function validateCarbonData(data) {
  if (!data || typeof data !== 'object') {
    console.warn('[Security] Invalid carbon data object');
    return false;
  }
  
  // Basic shape validation for the expected carbon objects to prevent prototype pollution or malformed UI
  const hasValidIcon = typeof data.icon === 'string';
  const hasValidVal = typeof data.val === 'number' || (typeof data.val === 'string' && !isNaN(parseFloat(data.val)));
  const hasValidColor = typeof data.color === 'string' && data.color.startsWith('#');
  const hasValidContext = typeof data.context === 'string';
  
  const hasValidBars = Array.isArray(data.bars) && data.bars.every(b => 
    typeof b.label === 'string' && typeof b.pct === 'number'
  );
  
  const hasValidAlts = Array.isArray(data.alts) && data.alts.every(a => 
    typeof a.name === 'string' && typeof a.save === 'string' && typeof a.val === 'string'
  );

  const isValid = hasValidIcon && hasValidVal && hasValidColor && hasValidContext && hasValidBars && hasValidAlts;
  if (!isValid) {
    console.warn('[Security] Carbon data failed shape validation', data);
  }
  
  return isValid;
}

// Export functions if using modules, otherwise they are attached to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sanitizeInput, safeLocalStorageGet, safeLocalStorageSet, validateCarbonData };
} else {
  window.SecurityUtils = { sanitizeInput, safeLocalStorageGet, safeLocalStorageSet, validateCarbonData };
}

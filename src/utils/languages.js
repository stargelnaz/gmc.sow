import languages from '../dataLanguages.json';

// Populate dropdown from imported JSON
export function populateLanguageSelect(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = '';
  (languages || []).forEach((lang) => {
    const opt = document.createElement('option');
    opt.value = lang;
    opt.textContent = lang;
    selectEl.appendChild(opt);
  });
}

// Build a display string for multiple selected languages
export function languagesLine(selected) {
  if (!selected || selected.length === 0) return 'None';
  return selected.join(', ');
}

// src/utils/sowHelpers.js

// ===== DATE HELPERS =====
export function formatDDMMMYYYY(dateObj) {
  if (!(dateObj instanceof Date)) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('en-GB', { month: 'short' });
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}
export function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + (Number(days) || 0));
  return formatDDMMMYYYY(d);
}
export function parseDDMMMYYYY(str) {
  if (!str) return null;
  const [dd, mon, yyyy] = str.split(' ');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const m = months.indexOf(mon);
  if (m < 0) return null;
  return new Date(Number(yyyy), m, Number(dd));
}
export function addMonths(dateObj, months) {
  const d = new Date(dateObj);
  d.setMonth(d.getMonth() + (Number(months) || 0));
  return d;
}

// ===== LANGUAGE HELPERS =====
export function languagesLine(arr) {
  if (!arr || !arr.length) return '';
  return arr.length > 4 ? 'Multiple Languages' : arr.join(', ');
}
export function projectName(title, arr) {
  const langs = languagesLine(arr);
  if (!title && !langs) return '';
  if (!title) return langs;
  if (!langs) return title;
  return `${title} — ${langs}`;
}

// ===== PRICE HELPERS =====
export function parsePriceToCents(raw) {
  if (typeof raw !== 'string') raw = String(raw ?? '');
  const cleaned = raw.replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (Number.isNaN(num)) return null;
  return Math.round(num * 100);
}
export function formatUSD(cents) {
  if (cents == null) return '$0.00';
  const n = cents / 100;
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

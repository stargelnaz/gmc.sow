// Format cents as USD string
export function formatUSD(cents) {
  if (isNaN(cents)) return '$0.00';
  return `$${(cents / 100).toFixed(2)}`;
}

// Parse USD string into cents
export function parseUSD(str) {
  if (!str) return 0;
  return Math.round(parseFloat(str.replace(/[^0-9.-]+/g, '')) * 100);
}

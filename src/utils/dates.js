// Format a Date object to "dd MMM yyyy"
export function formatDDMMMYYYY(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = dateObj.toLocaleString('en-US', { month: 'short' });
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}

// Parse "dd MMM yyyy" into a Date object
export function parseDDMMMYYYY(str) {
  if (!str) return null;
  const [day, mon, year] = str.split(' ');
  const monthIndex = new Date(`${mon} 1, 2000`).getMonth();
  return new Date(Number(year), monthIndex, Number(day));
}

// Return today's date plus X days as "dd MMM yyyy"
export function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDDMMMYYYY(d);
}

// Return a Date object plus X months
export function addMonths(dateObj, months) {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return null;
  const d = new Date(dateObj);
  d.setMonth(d.getMonth() + months);
  return d;
}

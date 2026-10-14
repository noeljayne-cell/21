/**
 * Escape Velocity In-Universe Calendar System
 * Base Date: November 1, 2279 (Day 0)
 * Each hyperspace system jump advances time by exactly 1 day.
 * Formatted as: "November 1, 2279"
 */

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Converts a day offset (0 = Nov 1, 2279) to "Month Day, Year" format.
 * Also handles backward compatibility if legacy stardate decimal is encountered.
 */
export function formatGameDate(dayCount: number = 0): string {
  let days = dayCount;
  // If legacy stardate like 3026.12 is encountered, normalize
  if (days >= 2000) {
    days = Math.max(0, Math.round((days - 3026.12) * 10));
  }
  const safeDays = Math.max(0, Math.floor(days));
  const date = new Date(2279, 10, 1 + safeDays);
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Returns formatted short date, e.g. "Nov 1, 2279"
 */
export function formatGameDateShort(dayCount: number = 0): string {
  let days = dayCount;
  if (days >= 2000) {
    days = Math.max(0, Math.round((days - 3026.12) * 10));
  }
  const safeDays = Math.max(0, Math.floor(days));
  const date = new Date(2279, 10, 1 + safeDays);
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${shortMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

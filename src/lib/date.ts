// src/lib/date.ts
// Column articles store `date` as a plain yyyy-mm-dd value; format it per-language for display.

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** '2024年10月7日' 形式 */
export function formatDateJP(date: Date): string {
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
}

/** 'October 7, 2024' 形式 */
export function formatDateEN(date: Date): string {
  return `${MONTHS_EN[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

/** '2024.10.07' 形式（トップページのコラム欄用） */
export function formatDateDot(date: Date): string {
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${date.getUTCFullYear()}.${mm}.${dd}`;
}

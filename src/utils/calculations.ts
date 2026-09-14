/**
 * Calculation helpers for ICOR Screening protocol
 */

export function parseDate(dateStr: string): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const clean = dateStr.trim();

  // Handle YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const [y, m, d] = clean.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }

  // Handle DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }

  // Fallback to Date parser
  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : d;
}

export function toInputDateFormat(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateAge(birthDateStr: string, referenceDateStr?: string): number | null {
  const birth = parseDate(birthDateStr);
  if (!birth) return null;

  const ref = referenceDateStr ? parseDate(referenceDateStr) || new Date() : new Date();

  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 0 ? age : null;
}

export function calculateDaysBetween(startDateStr: string, endDateStr: string): number | null {
  const start = parseDate(startDateStr);
  const end = parseDate(endDateStr);
  if (!start || !end) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffTime = end.getTime() - start.getTime();
  return Math.round(diffTime / msPerDay);
}

export function determineCBCTWindow(daysPost: number | null): string {
  if (daysPost === null || isNaN(daysPost)) return '';
  if (daysPost < 0) return 'Fuera de rango (Previa)';
  if (daysPost <= 14) return 'Principal (<=2 sem)';
  if (daysPost <= 42) return 'Secundaria (2-6 sem)';
  return 'Tardía (>6 sem)';
}

export function isAdultFromAge(age: number | null): 'SI' | 'NO' | '' {
  if (age === null || isNaN(age)) return '';
  return age >= 18 ? 'SI' : 'NO';
}

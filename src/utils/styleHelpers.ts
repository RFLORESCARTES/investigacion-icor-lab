/**
 * UI style helpers for visual progress indication
 * - Filled/manipulated fields: soft light grey (bg-slate-100/80)
 * - Empty/untouched fields: pure white (bg-white)
 * - Error fields: subtle soft rose (bg-rose-50/50)
 */

export function isFilled(val: any): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (typeof val === 'number') return !isNaN(val);
  if (typeof val === 'boolean') return true;
  return false;
}

export function getInputClass(val: any, hasError?: boolean): string {
  if (hasError) {
    return 'bg-rose-50/60 border-rose-300 text-slate-900 focus:ring-1 focus:ring-rose-400';
  }
  if (isFilled(val)) {
    return 'bg-slate-100/80 border-slate-300 text-slate-900 font-medium focus:ring-1 focus:ring-slate-400';
  }
  return 'bg-white border-slate-200 text-slate-700 focus:ring-1 focus:ring-slate-400 placeholder:text-slate-300';
}

export function getButtonClass(
  isSelected: boolean,
  variant: 'default' | 'danger' | 'success' | 'warning' = 'default'
): string {
  if (isSelected) {
    if (variant === 'danger') {
      return 'bg-rose-700 text-white border-rose-700 shadow-none font-semibold';
    }
    if (variant === 'success') {
      return 'bg-emerald-700 text-white border-emerald-700 shadow-none font-semibold';
    }
    if (variant === 'warning') {
      return 'bg-amber-600 text-white border-amber-600 shadow-none font-semibold';
    }
    return 'bg-slate-700 text-white border-slate-700 shadow-none font-semibold';
  }
  return 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50/80 font-normal';
}

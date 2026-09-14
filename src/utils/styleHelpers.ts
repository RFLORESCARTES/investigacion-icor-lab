/**
 * UI style helpers for ICOR Clinical Screening System
 * - Filled/manipulated fields: crisp slate tint with active focus
 * - Empty fields: clean pure white
 * - Error fields: soft coral-rose alert tint
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
    return 'bg-rose-50/70 border-rose-300 text-slate-900 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 placeholder:text-rose-300';
  }
  if (isFilled(val)) {
    return 'bg-slate-50/90 border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-[#00b2a9] focus:border-[#00b2a9]';
  }
  return 'bg-white border-slate-200 text-slate-700 focus:ring-2 focus:ring-[#00b2a9] focus:border-[#00b2a9] placeholder:text-slate-300';
}

export function getButtonClass(
  isSelected: boolean,
  variant: 'default' | 'danger' | 'success' | 'warning' = 'default'
): string {
  if (isSelected) {
    if (variant === 'danger') {
      return 'bg-[#f9423a] text-white border-[#f9423a] shadow-sm font-semibold';
    }
    if (variant === 'success') {
      return 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-semibold';
    }
    if (variant === 'warning') {
      return 'bg-amber-500 text-white border-amber-500 shadow-sm font-semibold';
    }
    // Default active is ICOR Signature Medical Teal
    return 'bg-[#00b2a9] text-white border-[#00b2a9] shadow-sm font-semibold';
  }
  return 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-normal';
}

import React from 'react';
import { Save, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ValidationSummaryProps {
  errors: Record<string, string>;
  isReviewed: boolean;
  onReviewedChange: (reviewed: boolean) => void;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: { type: 'success' | 'error'; text: string; sheetsSync?: any } | null;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  isReviewed,
  onReviewedChange,
  onSave,
  isSaving,
  saveMessage,
}) => {
  const errorCount = Object.keys(errors).length;
  const isSaveBlocked = errorCount > 0 || !isReviewed || isSaving;

  return (
    <div className="space-y-2">
      {/* Toast Feedback Message */}
      {saveMessage && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 transition-all ${
            saveMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <div className="flex-1 font-medium">{saveMessage.text}</div>
        </div>
      )}

      {/* Floating / Sticky bottom action bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Review Checkbox */}
        <label className="flex items-center space-x-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isReviewed}
            onChange={(e) => onReviewedChange(e.target.checked)}
            className="w-4 h-4 rounded text-slate-700 border-slate-300 focus:ring-slate-700 cursor-pointer"
          />
          <div className="text-xs">
            <span className="font-semibold text-slate-800">He revisado todos los datos</span>
            {errorCount > 0 && (
              <span className="text-rose-600 font-medium ml-1.5">
                ({errorCount} pendiente{errorCount > 1 ? 's' : ''})
              </span>
            )}
          </div>
        </label>

        {/* Save Button (Soft Slate-800) */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaveBlocked}
          className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 active:scale-95 cursor-pointer ${
            isSaveBlocked
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-slate-800 hover:bg-slate-700 text-white'
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Guardando...</span>
            </>
          ) : isSaveBlocked ? (
            <>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Guardar Ficha</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Ficha</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

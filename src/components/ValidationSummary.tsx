import React from 'react';
import { Save, Lock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

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
    <div className="space-y-2.5">
      {/* Toast Feedback Message */}
      {saveMessage && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 transition-all shadow-sm ${
            saveMessage.type === 'success'
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
              : 'bg-rose-50/90 border-rose-300 text-rose-900'
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
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3.5 shadow-lg shadow-slate-900/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Review Checkbox */}
        <label className="flex items-center space-x-3 cursor-pointer select-none px-2 py-1">
          <input
            type="checkbox"
            checked={isReviewed}
            onChange={(e) => onReviewedChange(e.target.checked)}
            className="w-4 h-4 rounded text-[#00b2a9] border-slate-300 focus:ring-[#00b2a9] cursor-pointer"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-800">He verificado la totalidad de los datos</span>
            {errorCount > 0 ? (
              <span className="text-[#ff725d] font-bold ml-1.5">
                ({errorCount} campo{errorCount > 1 ? 's' : ''} pendiente{errorCount > 1 ? 's' : ''})
              </span>
            ) : (
              <span className="text-emerald-600 font-medium ml-1.5 flex-inline items-center gap-1">
                (Validación Completa)
              </span>
            )}
          </div>
        </label>

        {/* Save Button (ICOR Signature Teal) */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaveBlocked}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer shadow-md ${
            isSaveBlocked
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
              : 'bg-[#00b2a9] hover:bg-[#009e96] text-white shadow-teal-500/25 hover:shadow-lg hover:shadow-teal-500/30'
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sincronizando con Servidor...</span>
            </>
          ) : isSaveBlocked ? (
            <>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Guardar Ficha Clínica</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Ficha Clínica</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

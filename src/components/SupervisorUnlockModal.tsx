import React, { useState } from 'react';
import { ShieldAlert, KeyRound, FileText, X, AlertCircle, CheckCircle2, UserCheck, Layers, Shield } from 'lucide-react';

export type UnlockScopeType = 'ALL' | 0 | 1 | 2 | 3;

export interface UnlockPayload {
  pin: string;
  reason: string;
  scope: UnlockScopeType;
  adminName: string;
}

interface SupervisorUnlockModalProps {
  isOpen: boolean;
  patientId: string;
  onClose: () => void;
  onUnlock: (payload: UnlockPayload) => Promise<boolean>;
}

const SCOPE_OPTIONS: Array<{ id: UnlockScopeType; label: string; desc: string }> = [
  { id: 'ALL', label: 'Toda la Ficha (Completo)', desc: 'Habilita edición en las 4 secciones simultáneamente' },
  { id: 0, label: '1. Demografía', desc: 'Centro, cirujano, revisor, fechas y sexo' },
  { id: 1, label: '2. Plan Qx', desc: 'Plan digital, tipo de cirugía y osteotomía' },
  { id: 2, label: '3. CBCT & Calidad', desc: 'CBCT post, fechas, factibilidad y evaluación de calidad' },
  { id: 3, label: '4. Criterios & Estado', desc: 'Criterios E01-E05, estado final y motivo de exclusión' },
];

export const SupervisorUnlockModal: React.FC<SupervisorUnlockModalProps> = ({
  isOpen,
  patientId,
  onClose,
  onUnlock,
}) => {
  const [pin, setPin] = useState('');
  const [scope, setScope] = useState<UnlockScopeType>('ALL');
  const [adminName, setAdminName] = useState('Administrador');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Ingrese la clave de administrador.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 5) {
      setError('Debe ingresar el motivo justificado de la intromisión (mínimo 5 caracteres).');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const success = await onUnlock({
        pin: pin.trim(),
        reason: reason.trim(),
        scope,
        adminName: adminName.trim() || 'Administrador',
      });

      if (success) {
        setPin('');
        setReason('');
        onClose();
      } else {
        setError('Clave de administrador incorrecta.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al validar autorización.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#0f172a] text-[#00b2a9] rounded-2xl shadow-sm">
              <ShieldAlert className="w-5 h-5 text-[#00b2a9]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Autorización de Administrador</h3>
              <p className="text-xs text-slate-500 font-mono">Ficha Auditada: <strong className="text-slate-800">{patientId}</strong></p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-950 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Registro Inmutable de Trazabilidad e Intromisión</span>
          </p>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            Cada intromisión queda registrada en la base central y en Google Sheets con <strong>marca temporal exacta, usuario y sección modificada</strong>.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 overflow-y-auto pr-1">
          {/* PIN Input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Clave de Administrador <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Ingrese clave de seguridad (ej: ICOR123)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#00b2a9] focus:border-transparent outline-none transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Admin Identification */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Identificación del Administrador
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nombre o cargo responsable..."
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#00b2a9] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Scope Selection (Por sección o completo) */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
              <Layers className="w-3.5 h-3.5 text-[#00b2a9]" />
              <span>Alcance del Permiso de Edición</span>
            </label>
            <div className="space-y-1.5">
              {SCOPE_OPTIONS.map((opt) => {
                const isSelected = scope === opt.id;
                return (
                  <button
                    key={String(opt.id)}
                    type="button"
                    onClick={() => setScope(opt.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00b2a9]" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{opt.label}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Motivo Justificado de la Intromisión <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={3}
                placeholder="Describa el motivo clínico o metodológico de la modificación..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-[#00b2a9] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold bg-[#00b2a9] hover:bg-[#009e96] text-white rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-teal-500/20"
            >
              {isSubmitting ? 'Validando y Registrando...' : 'Autorizar y Desbloquear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

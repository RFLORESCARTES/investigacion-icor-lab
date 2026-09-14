import React, { useState } from 'react';
import { ShieldAlert, KeyRound, FileText, X, AlertCircle } from 'lucide-react';

interface SupervisorUnlockModalProps {
  isOpen: boolean;
  patientId: string;
  onClose: () => void;
  onUnlock: (pin: string, reason: string) => Promise<boolean>;
}

export const SupervisorUnlockModal: React.FC<SupervisorUnlockModalProps> = ({
  isOpen,
  patientId,
  onClose,
  onUnlock,
}) => {
  const [pin, setPin] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Ingrese el PIN de supervisor.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 5) {
      setError('Debe justificar el motivo de la modificación (mínimo 5 caracteres).');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const success = await onUnlock(pin, reason);
      if (success) {
        setPin('');
        setReason('');
        onClose();
      } else {
        setError('PIN de supervisor incorrecto.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al validar PIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Desbloqueo Supervisado</h3>
              <p className="text-xs text-slate-500 font-mono">Ficha Paciente: {patientId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Esta ficha ya fue <strong>confirmada y auditada</strong>. Para realizar cambios justificados conforme al protocolo, se requiere autorización de supervisor.
        </p>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* PIN Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              PIN de Supervisor
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Ingrese PIN (ej: ICOR2026)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-700 outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Motivo de la Modificación <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <textarea
                rows={3}
                placeholder="Explique detalladamente qué se corrige y por qué (queda registrado en el log)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-slate-700 outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Verificando...' : 'Autorizar y Desbloquear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

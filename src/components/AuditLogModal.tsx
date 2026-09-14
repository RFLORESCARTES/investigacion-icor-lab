import React from 'react';
import { History, X, Clock, User, ShieldCheck } from 'lucide-react';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  id_paciente: string;
  revisor: string;
  motivo: string;
  cambios: Array<{
    campo: string;
    valor_anterior: any;
    valor_nuevo: any;
  }>;
}

interface AuditLogModalProps {
  isOpen: boolean;
  patientId: string;
  logs: AuditLogEntry[];
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  patientId,
  logs,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-lg">
              <History className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Historial de Auditoría (Audit Trail)</h3>
              <p className="text-xs text-slate-500 font-mono">Registro inmutable: {patientId}</p>
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

        {/* Log Entries Timeline */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {logs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <span>No se registran modificaciones posteriores para este paciente. Ficha en su estado original.</span>
            </div>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.timestamp).toLocaleString('es-CL')}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <User className="w-3 h-3" />
                    {entry.revisor || 'Supervisor'}
                  </span>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[11px]">Motivo justificado:</span>
                  <p className="text-slate-600 italic">{entry.motivo}</p>
                </div>

                {entry.cambios && entry.cambios.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Detalle de Cambios:</span>
                    <div className="space-y-1">
                      {entry.cambios.map((c, i) => (
                        <div key={i} className="text-[11px] font-mono bg-white px-2 py-1 rounded border border-slate-200 flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-800">{c.campo}:</span>
                          <span className="text-slate-500">
                            <span className="line-through text-rose-600">{String(c.valor_anterior || 'Vacío')}</span>
                            {' → '}
                            <span className="text-emerald-700 font-semibold">{String(c.valor_nuevo || 'Vacío')}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

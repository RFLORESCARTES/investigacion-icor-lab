import React from 'react';
import { History, X, Clock, User, ShieldCheck, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#0f172a] text-[#00b2a9] rounded-2xl shadow-sm">
              <History className="w-5 h-5 text-[#00b2a9]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Historial de Auditoría e Intromisiones</h3>
              <p className="text-xs text-slate-500 font-mono">Trazabilidad inmutable: <strong className="text-slate-800">{patientId}</strong></p>
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

        {/* Log Entries Timeline */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <ShieldCheck className="w-10 h-10 text-[#00b2a9] mx-auto opacity-80" />
              <div className="font-bold text-slate-800 text-sm">Ficha en estado original</div>
              <p className="text-slate-400 max-w-sm mx-auto">No se registran modificaciones o intromisiones posteriores para este paciente.</p>
            </div>
          ) : (
            logs.map((entry) => {
              const formattedDate = new Date(entry.timestamp).toLocaleString('es-CL', {
                dateStyle: 'short',
                timeStyle: 'medium',
              });

              return (
                <div
                  key={entry.id}
                  className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] pb-2 border-b border-slate-200/70">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-[#00b2a9]" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs">
                      <User className="w-3 h-3 text-[#00b2a9]" />
                      {entry.revisor || 'Administrador'}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                      Motivo / Justificación:
                    </span>
                    <p className="text-slate-700 italic text-xs leading-relaxed">{entry.motivo}</p>
                  </div>

                  {entry.cambios && entry.cambios.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Campos Modificados ({entry.cambios.length}):
                      </span>
                      <div className="space-y-1">
                        {entry.cambios.map((c, i) => (
                          <div
                            key={i}
                            className="text-[11px] font-mono bg-white px-3 py-2 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                          >
                            <span className="font-bold text-slate-800 shrink-0">{c.campo}</span>
                            <span className="text-slate-600 flex items-center gap-1.5 text-right truncate">
                              <span className="line-through text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                {String(c.valor_anterior || 'Vacío')}
                              </span>
                              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                {String(c.valor_nuevo || 'Vacío')}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl cursor-pointer transition-colors shadow-sm"
          >
            Cerrar Historial
          </button>
        </div>
      </div>
    </div>
  );
};

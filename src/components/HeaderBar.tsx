import React from 'react';
import { Plus, RefreshCw, CheckCircle2, Clock, Check, Database, XCircle, Search } from 'lucide-react';
import { PatientSummary, StatsResponse } from '../types/schema';

interface HeaderBarProps {
  currentId: string;
  patientList: PatientSummary[];
  stats: StatsResponse | null;
  onSelectPatient: (id: string) => void;
  onNewPatient: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isDraftSaved: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentId,
  patientList,
  stats,
  onSelectPatient,
  onNewPatient,
  onRefresh,
  isLoading,
  isDraftSaved,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl w-full mx-auto px-4 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Brand & Active Patient Badge */}
        <div className="flex items-center justify-between md:justify-start space-x-3">
          <div className="flex items-center space-x-2.5">
            {/* ICOR Hex/Clinical Logo Mark */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center text-[#00b2a9] font-black text-sm tracking-wider shadow-sm border border-slate-700/50">
              <span>IC</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-[#0f172a] tracking-tight uppercase">
                  ICOR <span className="text-[#00b2a9] font-bold">Research</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#e6f7f6] text-[#008f88] border border-[#77d0cb]/40">
                  {currentId || 'NUEVA FICHA'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide">
                Protocolo de Auditoría y Control de Calidad
              </div>
            </div>
          </div>

          {/* Autosave Pill on Mobile */}
          {isDraftSaved && (
            <div className="inline-flex md:hidden items-center gap-1 text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Check className="w-3 h-3" /> Auto-guardado
            </div>
          )}
        </div>

        {/* Stats & Quick Actions Console */}
        <div className="flex items-center space-x-2 justify-between md:justify-end overflow-x-auto">
          {/* Cloud Sync & KPI Badges */}
          {stats && (
            <div className="hidden lg:flex items-center space-x-2 text-[11px] mr-1">
              {/* Google Sheets Connection Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
                <span>Google Sheets Live</span>
              </div>

              {/* Stats KPIs */}
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50/80 px-2 py-1 rounded-lg border border-emerald-200/60 font-semibold text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {stats.elegibles} Elegibles
                </span>
                <span className="flex items-center gap-1 text-amber-700 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/60 font-semibold text-[10px]">
                  <Clock className="w-3 h-3 text-amber-600" /> {stats.pendientes} Pendientes
                </span>
                <span className="flex items-center gap-1 text-rose-700 bg-rose-50/80 px-2 py-1 rounded-lg border border-rose-200/60 font-semibold text-[10px]">
                  <XCircle className="w-3 h-3 text-rose-600" /> {stats.excluidos} Excluidos
                </span>
              </div>
            </div>
          )}

          {/* Patient Selector */}
          <div className="relative flex-1 md:flex-initial">
            <select
              value={currentId}
              onChange={(e) => onSelectPatient(e.target.value)}
              className="w-full md:w-auto text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 pr-8 text-slate-800 outline-none cursor-pointer transition-all shadow-xs focus:ring-2 focus:ring-[#00b2a9] focus:border-[#00b2a9]"
            >
              <option value="" disabled>Seleccionar paciente...</option>
              {patientList.map((p) => (
                <option key={p.id_paciente} value={p.id_paciente}>
                  {p.id_paciente} • {p.centro || 'Sin centro'} [{p.estado || 'PENDIENTE'}] {p.confirmado ? '✓' : ''}
                </option>
              ))}
            </select>
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Recargar datos del servidor"
            className="p-2 text-slate-600 hover:text-[#0f172a] bg-white hover:bg-slate-100 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#00b2a9]' : ''}`} />
          </button>

          {/* New Patient Action (ICOR Teal CTA) */}
          <button
            onClick={onNewPatient}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#00b2a9] hover:bg-[#008f88] text-white text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

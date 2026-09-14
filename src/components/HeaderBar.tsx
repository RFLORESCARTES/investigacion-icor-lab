import React from 'react';
import { Plus, RefreshCw, CheckCircle2, Clock, Check } from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo, ID & Autosave Indicator */}
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center text-white text-xs font-semibold tracking-tight">
            IC
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-800 tracking-tight">ICOR Screening</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                {currentId || 'Nuevo'}
              </span>
              {isDraftSaved && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-500 font-normal pl-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Auto-guardado
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Patient Selector & Actions */}
        <div className="flex items-center space-x-2">
          {/* Stats pills */}
          {stats && (
            <div className="hidden md:flex items-center space-x-2 text-[11px] text-slate-500 font-medium mr-2">
              <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {stats.elegibles} elegibles
              </span>
              <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                <Clock className="w-3 h-3 text-amber-600" /> {stats.pendientes} pendientes
              </span>
            </div>
          )}

          {/* Selector */}
          <div className="relative">
            <select
              value={currentId}
              onChange={(e) => onSelectPatient(e.target.value)}
              className="text-xs font-medium bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 text-slate-800 outline-none cursor-pointer transition-colors max-w-[140px] sm:max-w-[200px] truncate"
            >
              <option value="" disabled>Seleccionar...</option>
              {patientList.map((p) => (
                <option key={p.id_paciente} value={p.id_paciente}>
                  {p.id_paciente} • {p.estado || 'PENDIENTE'} {p.confirmado ? '✓' : ''}
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-slate-400">▼</span>
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Recargar datos"
            className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-slate-700' : ''}`} />
          </button>

          {/* New Button */}
          <button
            onClick={onNewPatient}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

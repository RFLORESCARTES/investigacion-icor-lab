import React from 'react';
import { PatientRecord, SI_NO_OPCIONES } from '../types/schema';
import { getInputClass, getButtonClass } from '../utils/styleHelpers';
import { ShieldX, CheckCircle2, XCircle, Clock3, AlertTriangle, FileText, ClipboardCheck } from 'lucide-react';

interface SectionExclusionsProps {
  data: PatientRecord;
  onChange: (field: keyof PatientRecord, value: any) => void;
  errors: Record<string, string>;
}

export const SectionExclusions: React.FC<SectionExclusionsProps> = ({
  data,
  onChange,
  errors,
}) => {
  const isExcluido = data.estado === 'EXCLUIDO';

  return (
    <div className="space-y-4">
      {/* Section Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <ShieldX className="w-4 h-4 text-[#ff725d]" />
          <span>Criterios de Exclusión Epidemiológica y Dictamen Final</span>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
          Protocolo Criterios E01-E05
        </span>
      </div>

      {/* Criterios E01 - E05 en 1-Tap Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* E01: Cirugía maxilofacial previa */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
            Cirugía Previa [E01] {errors.cirugia_previa_e01 && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('cirugia_previa_e01', opt)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.cirugia_previa_e01 === opt,
                  opt === 'Sí' ? 'danger' : 'default'
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* E02: Síndrome craneofacial */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
            Síndrome [E02] {errors.sindrome_craneofacial_e02 && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('sindrome_craneofacial_e02', opt)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.sindrome_craneofacial_e02 === opt,
                  opt === 'Sí' ? 'danger' : 'default'
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* E04: Dato irrecuperable */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
            Dato Irrecuperable [E04] {errors.dato_irrecuperable_e04 && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('dato_irrecuperable_e04', opt)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.dato_irrecuperable_e04 === opt,
                  opt === 'Sí' ? 'danger' : 'default'
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* E05: Adaptación intraoperatoria */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
            Adaptación Qx [E05] {errors.adaptacion_intraoperatoria_e05 && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('adaptacion_intraoperatoria_e05', opt)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.adaptacion_intraoperatoria_e05 === opt,
                  opt === 'Sí' ? 'danger' : 'default'
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estado Final (Elegible, Excluido, Pendiente) con pestañas elegibles de alto impacto clínico */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-800">
            <ClipboardCheck className="w-4 h-4 text-[#00b2a9]" />
            <span>Estado Final de la Ficha</span>
            {errors.estado && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          {data.estado && (
            <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
              data.estado === 'ELEGIBLE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              data.estado === 'EXCLUIDO' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
              'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              Seleccionado: {data.estado}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onChange('estado', 'ELEGIBLE')}
            className={`py-3 text-xs rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 font-bold shadow-xs ${getButtonClass(
              data.estado === 'ELEGIBLE',
              'success'
            )}`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>ELEGIBLE</span>
          </button>
          <button
            type="button"
            onClick={() => onChange('estado', 'EXCLUIDO')}
            className={`py-3 text-xs rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 font-bold shadow-xs ${getButtonClass(
              data.estado === 'EXCLUIDO',
              'danger'
            )}`}
          >
            <XCircle className="w-4 h-4 shrink-0" />
            <span>EXCLUIDO</span>
          </button>
          <button
            type="button"
            onClick={() => onChange('estado', 'PENDIENTE')}
            className={`py-3 text-xs rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 font-bold shadow-xs ${getButtonClass(
              data.estado === 'PENDIENTE',
              'warning'
            )}`}
          >
            <Clock3 className="w-4 h-4 shrink-0" />
            <span>PENDIENTE</span>
          </button>
        </div>
      </div>

      {/* Motivo Exclusión & Observaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-800">
            <AlertTriangle className="w-3.5 h-3.5 text-[#ff725d]" />
            <span>Motivo Exclusión</span>
            {isExcluido && <span className="text-rose-500 font-bold">• Obligatorio</span>}
            {!isExcluido && <span className="text-slate-400 font-normal normal-case">(Opcional)</span>}
          </label>
          <input
            type="text"
            placeholder={isExcluido ? 'Especifique el motivo de exclusión obligatorio...' : 'Opcional si es elegible o pendiente...'}
            value={data.motivo_codigo}
            onChange={(e) => onChange('motivo_codigo', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.motivo_codigo,
              Boolean(errors.motivo_codigo)
            )}`}
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-800">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Observaciones de Auditoría</span>
            <span className="text-slate-400 font-normal normal-case">(Opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Anotaciones clínicas complementarias..."
            value={data.observaciones}
            onChange={(e) => onChange('observaciones', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.observaciones
            )}`}
          />
        </div>
      </div>
    </div>
  );
};

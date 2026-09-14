import React from 'react';
import { PatientRecord, CENTROS_OPCIONES, REVISORES_OPCIONES, CIRUJANOS_OPCIONES, SEXO_OPCIONES } from '../types/schema';
import { toInputDateFormat } from '../utils/calculations';
import { getInputClass, getButtonClass } from '../utils/styleHelpers';
import { Building2, UserCheck, Stethoscope, Calendar, User, ShieldCheck } from 'lucide-react';

interface SectionDemographicsProps {
  data: PatientRecord;
  onChange: (field: keyof PatientRecord, value: any) => void;
  errors: Record<string, string>;
}

export const SectionDemographics: React.FC<SectionDemographicsProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-4">
      {/* Quick top audit status banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-[#00b2a9]" />
          <span>Datos Demográficos y Asignación Quirúrgica</span>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors">
          <input
            type="checkbox"
            checked={Boolean(data.confirmado)}
            onChange={(e) => onChange('confirmado', e.target.checked)}
            className="w-3.5 h-3.5 rounded text-[#00b2a9] border-slate-300 focus:ring-[#00b2a9] cursor-pointer"
          />
          <span className="text-xs text-slate-700 font-medium">Ficha Verificada</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Centro */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-[#00b2a9]" />
            <span>Centro Clínico</span>
            {errors.centro && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <select
            value={data.centro}
            onChange={(e) => onChange('centro', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.centro,
              Boolean(errors.centro)
            )}`}
          >
            <option value="">Seleccionar centro...</option>
            {CENTROS_OPCIONES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Revisor (ciego) */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-[#00b2a9]" />
            <span>Revisor (Ciego)</span>
            {errors.revisor_ciego && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <select
            value={data.revisor_ciego}
            onChange={(e) => onChange('revisor_ciego', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.revisor_ciego,
              Boolean(errors.revisor_ciego)
            )}`}
          >
            <option value="">Seleccionar revisor...</option>
            {REVISORES_OPCIONES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Cirujano */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <Stethoscope className="w-3.5 h-3.5 text-[#00b2a9]" />
            <span>Cirujano Principal</span>
            {errors.cirujano && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <select
            value={data.cirujano}
            onChange={(e) => onChange('cirujano', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.cirujano,
              Boolean(errors.cirujano)
            )}`}
          >
            <option value="">Seleccionar cirujano...</option>
            {CIRUJANOS_OPCIONES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Fecha Revisión */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Fecha Revisión</span>
            {errors.fecha_revision && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_revision)}
            onChange={(e) => onChange('fecha_revision', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.fecha_revision,
              Boolean(errors.fecha_revision)
            )}`}
          />
        </div>

        {/* Fecha Cirugía */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Fecha Cirugía (Qx)</span>
            {errors.fecha_cirugia && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_cirugia)}
            onChange={(e) => onChange('fecha_cirugia', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.fecha_cirugia,
              Boolean(errors.fecha_cirugia)
            )}`}
          />
        </div>

        {/* Fecha Nacimiento & Inline Age */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Fecha Nacimiento</span>
              {errors.fecha_nacimiento && <span className="text-rose-500 font-bold">• Requerido</span>}
            </label>
            {data.edad !== null && (
              <span className="text-[10px] font-mono font-bold bg-teal-50 text-[#008982] px-2 py-0.5 rounded-full border border-teal-200">
                {data.edad} años
              </span>
            )}
          </div>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_nacimiento)}
            onChange={(e) => onChange('fecha_nacimiento', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.fecha_nacimiento,
              Boolean(errors.fecha_nacimiento)
            )}`}
          />
        </div>

        {/* ≥ 18 años */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Mayor de 18 años (≥18) {errors.mayor_18 && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['SI', 'NO'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('mayor_18', opt)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.mayor_18 === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Sexo */}
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Sexo Biológico {errors.sexo && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SEXO_OPCIONES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange('sexo', s)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.sexo === s
                )}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

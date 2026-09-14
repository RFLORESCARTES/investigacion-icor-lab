import React from 'react';
import { PatientRecord, CENTROS_OPCIONES, REVISORES_OPCIONES, CIRUJANOS_OPCIONES, SEXO_OPCIONES } from '../types/schema';
import { toInputDateFormat } from '../utils/calculations';
import { getInputClass, getButtonClass } from '../utils/styleHelpers';

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
      {/* Quick top audit switch */}
      <div className="flex items-center justify-between py-1 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-700">Auditoría / Confirmación</span>
        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(data.confirmado)}
            onChange={(e) => onChange('confirmado', e.target.checked)}
            className="w-4 h-4 rounded text-slate-700 border-slate-300 focus:ring-slate-700"
          />
          <span className="text-xs text-slate-600 font-medium">Ficha Confirmada</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Centro */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Centro {errors.centro && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.centro}
            onChange={(e) => onChange('centro', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
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
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Revisor (ciego) {errors.revisor_ciego && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.revisor_ciego}
            onChange={(e) => onChange('revisor_ciego', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
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
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Cirujano {errors.cirujano && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.cirujano}
            onChange={(e) => onChange('cirujano', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
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
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Fecha Revisión {errors.fecha_revision && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_revision)}
            onChange={(e) => onChange('fecha_revision', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
              data.fecha_revision,
              Boolean(errors.fecha_revision)
            )}`}
          />
        </div>

        {/* Fecha Cirugía */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Fecha Cirugía (Qx) {errors.fecha_cirugia && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_cirugia)}
            onChange={(e) => onChange('fecha_cirugia', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
              data.fecha_cirugia,
              Boolean(errors.fecha_cirugia)
            )}`}
          />
        </div>

        {/* Fecha Nacimiento & Inline Age */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Fecha Nacimiento {errors.fecha_nacimiento && <span className="text-rose-500 font-bold">•</span>}
            </label>
            {data.edad !== null && (
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                {data.edad} años
              </span>
            )}
          </div>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_nacimiento)}
            onChange={(e) => onChange('fecha_nacimiento', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
              data.fecha_nacimiento,
              Boolean(errors.fecha_nacimiento)
            )}`}
          />
        </div>

        {/* ≥ 18 años */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            ≥ 18 años {errors.mayor_18 && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {['SI', 'NO'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('mayor_18', opt)}
                className={`py-1.5 text-xs rounded-lg border transition-all ${getButtonClass(
                  data.mayor_18 === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Sexo */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Sexo Biológico {errors.sexo && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {SEXO_OPCIONES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange('sexo', s)}
                className={`py-1.5 text-xs rounded-lg border transition-all ${getButtonClass(
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

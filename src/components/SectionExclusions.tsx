import React from 'react';
import { PatientRecord, SI_NO_OPCIONES } from '../types/schema';
import { getInputClass, getButtonClass } from '../utils/styleHelpers';

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
  return (
    <div className="space-y-4">
      {/* Criterios E01 - E05 en 1-Tap Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* E01: Cirugía maxilofacial previa */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 truncate">
            Cirugía previa [E01] {errors.cirugia_previa_e01 && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('cirugia_previa_e01', opt)}
                className={`py-1.5 text-xs rounded border transition-all ${getButtonClass(
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
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 truncate">
            Síndrome [E02] {errors.sindrome_craneofacial_e02 && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('sindrome_craneofacial_e02', opt)}
                className={`py-1.5 text-xs rounded border transition-all ${getButtonClass(
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
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 truncate">
            Dato irrecuperable [E04] {errors.dato_irrecuperable_e04 && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('dato_irrecuperable_e04', opt)}
                className={`py-1.5 text-xs rounded border transition-all ${getButtonClass(
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
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 truncate">
            Adaptación Qx [E05] {errors.adaptacion_intraoperatoria_e05 && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('adaptacion_intraoperatoria_e05', opt)}
                className={`py-1.5 text-xs rounded border transition-all ${getButtonClass(
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

      {/* Estado Final (Elegible, Excluido, Pendiente) con tonos suaves */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
          Estado Final {errors.estado && <span className="text-rose-500 font-bold">•</span>}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChange('estado', 'ELEGIBLE')}
            className={`py-2 text-xs rounded-lg border transition-all ${getButtonClass(
              data.estado === 'ELEGIBLE',
              'success'
            )}`}
          >
            ELEGIBLE
          </button>
          <button
            type="button"
            onClick={() => onChange('estado', 'EXCLUIDO')}
            className={`py-2 text-xs rounded-lg border transition-all ${getButtonClass(
              data.estado === 'EXCLUIDO',
              'danger'
            )}`}
          >
            EXCLUIDO
          </button>
          <button
            type="button"
            onClick={() => onChange('estado', 'PENDIENTE')}
            className={`py-2 text-xs rounded-lg border transition-all ${getButtonClass(
              data.estado === 'PENDIENTE',
              'warning'
            )}`}
          >
            PENDIENTE
          </button>
        </div>
      </div>

      {/* Motivo & Observaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Motivo / Código
          </label>
          <input
            type="text"
            placeholder="Opcional..."
            value={data.motivo_codigo}
            onChange={(e) => onChange('motivo_codigo', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none ${getInputClass(
              data.motivo_codigo
            )}`}
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Observaciones
          </label>
          <input
            type="text"
            placeholder="Anotaciones breves..."
            value={data.observaciones}
            onChange={(e) => onChange('observaciones', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none ${getInputClass(
              data.observaciones
            )}`}
          />
        </div>
      </div>
    </div>
  );
};

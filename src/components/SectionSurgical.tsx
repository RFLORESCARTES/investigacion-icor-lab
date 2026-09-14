import React from 'react';
import { PatientRecord, TIPO_CIRUGIA_OPCIONES, TIPO_OSTEOTOMIA_OPCIONES, SI_NO_OPCIONES } from '../types/schema';
import { getInputClass, getButtonClass } from '../utils/styleHelpers';

interface SectionSurgicalProps {
  data: PatientRecord;
  onChange: (field: keyof PatientRecord, value: any) => void;
  errors: Record<string, string>;
}

export const SectionSurgical: React.FC<SectionSurgicalProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Planificación digital completa */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Planificación digital {errors.planificacion_digital_completa && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('planificacion_digital_completa', opt)}
                className={`py-1.5 text-xs rounded-lg border transition-all ${getButtonClass(
                  data.planificacion_digital_completa === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Archivo de planificación virtual disponible */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Archivo 3D disponible {errors.archivo_planificacion_disponible && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('archivo_planificacion_disponible', opt)}
                className={`py-1.5 text-xs rounded-lg border transition-all ${getButtonClass(
                  data.archivo_planificacion_disponible === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Segmentación Le Fort I */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Segmentación Le Fort I {errors.segmentacion_lefort && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('segmentacion_lefort', opt)}
                className={`py-1.5 text-xs rounded-lg border transition-all ${getButtonClass(
                  data.segmentacion_lefort === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo cirugía */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Tipo Cirugía {errors.tipo_cirugia && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.tipo_cirugia}
            onChange={(e) => onChange('tipo_cirugia', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
              data.tipo_cirugia,
              Boolean(errors.tipo_cirugia)
            )}`}
          >
            <option value="">Seleccionar tipo...</option>
            {TIPO_CIRUGIA_OPCIONES.map((tc) => (
              <option key={tc} value={tc}>{tc}</option>
            ))}
          </select>
        </div>

        {/* Tipo osteotomía maxilar */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Tipo Osteotomía Maxilar {errors.tipo_osteotomia_maxilar && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.tipo_osteotomia_maxilar}
            onChange={(e) => onChange('tipo_osteotomia_maxilar', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
              data.tipo_osteotomia_maxilar,
              Boolean(errors.tipo_osteotomia_maxilar)
            )}`}
          >
            <option value="">Seleccionar osteotomía...</option>
            {TIPO_OSTEOTOMIA_OPCIONES.map((to) => (
              <option key={to} value={to}>{to}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { PatientRecord, TIPO_CIRUGIA_OPCIONES, TIPO_OSTEOTOMIA_OPCIONES, SI_NO_OPCIONES } from '../types/schema';
import { getInputClass, getButtonClass } from '../utils/styleHelpers';
import { Layers, Scissors, Cpu, Box, Sparkles } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Section Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Layers className="w-4 h-4 text-[#00b2a9]" />
          <span>Planificación Quirúrgica y Segmentación 3D</span>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
          Ortognática
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Planificación digital completa */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <Cpu className="w-3.5 h-3.5 text-[#00b2a9]" />
            <span>Planificación Digital</span>
            {errors.planificacion_digital_completa && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('planificacion_digital_completa', opt)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.planificacion_digital_completa === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Archivo de planificación virtual disponible */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <Box className="w-3.5 h-3.5 text-[#00b2a9]" />
            <span>Archivo 3D Disponible</span>
            {errors.archivo_planificacion_disponible && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('archivo_planificacion_disponible', opt)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.archivo_planificacion_disponible === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Segmentación Le Fort I */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <Scissors className="w-3.5 h-3.5 text-[#00b2a9]" />
            <span>Segmentación Le Fort I</span>
            {errors.segmentacion_lefort && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('segmentacion_lefort', opt)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.segmentacion_lefort === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo cirugía */}
        <div className="space-y-1">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#00b2a9]" />
            <span>Tipo Cirugía</span>
            {errors.tipo_cirugia && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <select
            value={data.tipo_cirugia}
            onChange={(e) => onChange('tipo_cirugia', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
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
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Tipo Osteotomía Maxilar {errors.tipo_osteotomia_maxilar && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <select
            value={data.tipo_osteotomia_maxilar}
            onChange={(e) => onChange('tipo_osteotomia_maxilar', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
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

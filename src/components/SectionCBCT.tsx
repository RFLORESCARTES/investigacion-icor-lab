import React from 'react';
import {
  PatientRecord,
  CALIDAD_CBCT_OPCIONES,
  UTILIDAD_RX_OPCIONES,
  DEFECTOS_CALIDAD_OPCIONES,
  SI_NO_OPCIONES
} from '../types/schema';
import { toInputDateFormat } from '../utils/calculations';
import { getInputClass, getButtonClass } from '../utils/styleHelpers';
import { Scan, Calendar, Sliders, Activity, AlertCircle, Compass, CheckCircle2 } from 'lucide-react';

interface SectionCBCTProps {
  data: PatientRecord;
  onChange: (field: keyof PatientRecord, value: any) => void;
  errors: Record<string, string>;
}

export const SectionCBCT: React.FC<SectionCBCTProps> = ({
  data,
  onChange,
  errors,
}) => {
  const isOtroDefecto = data.tipo_defecto_calidad === 'Otro';

  return (
    <div className="space-y-4">
      {/* Section Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Scan className="w-4 h-4 text-[#00b2a9]" />
          <span>Protocolo Imagenológico CBCT y Calidad Radiográfica</span>
        </div>
        <span className="text-[11px] font-mono font-bold text-[#00b2a9] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
          FOV Completo
        </span>
      </div>

      {/* 1. CBCT Postoperatorio (Sí / No) y Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-start">
        {/* CBCT Post Disponible */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
            <span>CBCT Postoperatorio</span>
            {errors.cbct_postoperatorio && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('cbct_postoperatorio', opt)}
                className={`py-2 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.cbct_postoperatorio === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Fecha CBCT Pre */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>CBCT Pre</span>
              {errors.fecha_cbct_pre && <span className="text-rose-500 font-bold">•</span>}
            </label>
            {data.dias_cbct_pre_qx !== null && (
              <span className="text-[10px] font-mono font-bold bg-teal-50 text-[#008982] px-1.5 py-0.2 rounded border border-teal-200">
                {data.dias_cbct_pre_qx}d pre-Qx
              </span>
            )}
          </div>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_cbct_pre)}
            onChange={(e) => onChange('fecha_cbct_pre', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.fecha_cbct_pre,
              Boolean(errors.fecha_cbct_pre)
            )}`}
          />
        </div>

        {/* Fecha CBCT Post */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>CBCT Post</span>
              {errors.fecha_cbct_post && <span className="text-rose-500 font-bold">•</span>}
            </label>
            {data.dias_qx_cbct_post !== null && (
              <span className="text-[10px] font-mono font-bold bg-teal-50 text-[#008982] px-1.5 py-0.2 rounded border border-teal-200">
                {data.dias_qx_cbct_post}d post-Qx
              </span>
            )}
          </div>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_cbct_post)}
            onChange={(e) => onChange('fecha_cbct_post', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.fecha_cbct_post,
              Boolean(errors.fecha_cbct_post)
            )}`}
          />
        </div>

        {/* Ventana CBCT Post (Cálculo Automático) */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Ventana Post (Auto) {errors.ventana_cbct_post && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className={`px-3 py-2 text-xs rounded-xl font-medium flex items-center min-h-[36px] transition-all ${
            data.ventana_cbct_post
              ? 'bg-teal-50/80 text-[#005f5a] border border-teal-200 font-bold'
              : 'bg-slate-50 text-slate-400 border border-slate-200 italic'
          }`}>
            {data.ventana_cbct_post ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00b2a9]" />
                {data.ventana_cbct_post}
              </span>
            ) : (
              'Cálculo automático...'
            )}
          </div>
        </div>
      </div>

      {/* 2. Factibilidad Técnica & Cefalometría */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
        {/* Mismo equipo CBCT */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
            <Sliders className="w-3 h-3 text-[#00b2a9]" />
            <span>Mismo Equipo</span>
            {errors.mismo_equipo_cbct && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('mismo_equipo_cbct', opt)}
                className={`py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.mismo_equipo_cbct === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Cefalometría exportable */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
            <Compass className="w-3 h-3 text-[#00b2a9]" />
            <span>Cefalometría 3D</span>
            {errors.archivo_cefalometrico_exportable && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('archivo_cefalometrico_exportable', opt)}
                className={`py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.archivo_cefalometrico_exportable === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Coordenadas 3D */}
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
            <Activity className="w-3 h-3 text-[#00b2a9]" />
            <span>Coordenadas 3D</span>
            {errors.coordenadas_3d_exportables && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('coordenadas_3d_exportables', opt)}
                className={`py-1.5 text-xs rounded-xl border transition-all cursor-pointer font-semibold ${getButtonClass(
                  data.coordenadas_3d_exportables === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Evaluación Cualitativa y Defectos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-3 border-t border-slate-100">
        {/* Calidad CBCT pre */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Calidad CBCT Pre {errors.calidad_cbct_pre && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <select
            value={data.calidad_cbct_pre}
            onChange={(e) => onChange('calidad_cbct_pre', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.calidad_cbct_pre,
              Boolean(errors.calidad_cbct_pre)
            )}`}
          >
            <option value="">Seleccionar calidad...</option>
            {CALIDAD_CBCT_OPCIONES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Calidad CBCT post */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Calidad CBCT Post {errors.calidad_cbct_post && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <select
            value={data.calidad_cbct_post}
            onChange={(e) => onChange('calidad_cbct_post', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.calidad_cbct_post,
              Boolean(errors.calidad_cbct_post)
            )}`}
          >
            <option value="">Seleccionar calidad...</option>
            {CALIDAD_CBCT_OPCIONES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Utilidad RX estudio */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Utilidad RX Futuro {errors.utilidad_rx_estudio && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <select
            value={data.utilidad_rx_estudio}
            onChange={(e) => onChange('utilidad_rx_estudio', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.utilidad_rx_estudio,
              Boolean(errors.utilidad_rx_estudio)
            )}`}
          >
            <option value="">Seleccionar utilidad...</option>
            {UTILIDAD_RX_OPCIONES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        {/* Tipo defecto calidad */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Tipo Defecto {errors.tipo_defecto_calidad && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <select
            value={data.tipo_defecto_calidad}
            onChange={(e) => onChange('tipo_defecto_calidad', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.tipo_defecto_calidad,
              Boolean(errors.tipo_defecto_calidad)
            )}`}
          >
            <option value="">Seleccionar defecto...</option>
            {DEFECTOS_CALIDAD_OPCIONES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comentario condicional para 'Otro' */}
      {isOtroDefecto && (
        <div className="pt-2 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
          <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Detalle del defecto de imagen ('Otro')</span>
            {errors.comentario_calidad && <span className="text-rose-500 font-bold">• Requerido</span>}
          </label>
          <input
            type="text"
            placeholder="Especifique el defecto radiográfico identificado..."
            value={data.comentario_calidad}
            onChange={(e) => onChange('comentario_calidad', e.target.value)}
            className={`w-full px-3 py-2 text-xs rounded-xl outline-none transition-all font-medium ${getInputClass(
              data.comentario_calidad,
              Boolean(errors.comentario_calidad)
            )}`}
          />
        </div>
      )}
    </div>
  );
};

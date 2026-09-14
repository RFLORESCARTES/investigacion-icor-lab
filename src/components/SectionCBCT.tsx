import React from 'react';
import {
  PatientRecord,
  CALIDAD_CBCT_OPCIONES,
  UTILIDAD_RX_OPCIONES,
  DEFECTOS_CALIDAD_OPCIONES,
  VENTANA_CBCT_OPCIONES,
  SI_NO_OPCIONES
} from '../types/schema';
import { toInputDateFormat } from '../utils/calculations';
import { getInputClass, getButtonClass } from '../utils/styleHelpers';

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
      {/* Fechas CBCT & Deltas calculados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Fecha CBCT pre */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              CBCT Preoperatorio {errors.fecha_cbct_pre && <span className="text-rose-500 font-bold">•</span>}
            </label>
            {data.dias_cbct_pre_qx !== null && (
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                {data.dias_cbct_pre_qx}d pre-Qx
              </span>
            )}
          </div>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_cbct_pre)}
            onChange={(e) => onChange('fecha_cbct_pre', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
              data.fecha_cbct_pre,
              Boolean(errors.fecha_cbct_pre)
            )}`}
          />
        </div>

        {/* Fecha CBCT post */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              CBCT Postoperatorio {errors.fecha_cbct_post && <span className="text-rose-500 font-bold">•</span>}
            </label>
            {data.dias_qx_cbct_post !== null && (
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                {data.dias_qx_cbct_post}d post-Qx
              </span>
            )}
          </div>
          <input
            type="date"
            value={toInputDateFormat(data.fecha_cbct_post)}
            onChange={(e) => onChange('fecha_cbct_post', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
              data.fecha_cbct_post,
              Boolean(errors.fecha_cbct_post)
            )}`}
          />
        </div>

        {/* Ventana CBCT post */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Ventana Post {errors.ventana_cbct_post && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.ventana_cbct_post}
            onChange={(e) => onChange('ventana_cbct_post', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
              data.ventana_cbct_post,
              Boolean(errors.ventana_cbct_post)
            )}`}
          >
            <option value="">Seleccionar ventana...</option>
            {VENTANA_CBCT_OPCIONES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 1-Tap Quick Toggles for 3D & Tech Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
        {/* CBCT Post disponible */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 truncate">
            CBCT Post {errors.cbct_postoperatorio && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('cbct_postoperatorio', opt)}
                className={`py-1 text-xs rounded border transition-all ${getButtonClass(
                  data.cbct_postoperatorio === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Mismo equipo CBCT */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 truncate">
            Mismo Equipo {errors.mismo_equipo_cbct && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('mismo_equipo_cbct', opt)}
                className={`py-1 text-xs rounded border transition-all ${getButtonClass(
                  data.mismo_equipo_cbct === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Cefalometría exportable */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 truncate">
            Cefalometría {errors.archivo_cefalometrico_exportable && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('archivo_cefalometrico_exportable', opt)}
                className={`py-1 text-xs rounded border transition-all ${getButtonClass(
                  data.archivo_cefalometrico_exportable === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Coordenadas 3D */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 truncate">
            Coord. 3D {errors.coordenadas_3d_exportables && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('coordenadas_3d_exportables', opt)}
                className={`py-1 text-xs rounded border transition-all ${getButtonClass(
                  data.coordenadas_3d_exportables === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Deltas calculables */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 truncate">
            Deltas Plan/Post {errors.deltas_calculables && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <div className="grid grid-cols-2 gap-1">
            {SI_NO_OPCIONES.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange('deltas_calculables', opt)}
                className={`py-1 text-xs rounded border transition-all ${getButtonClass(
                  data.deltas_calculables === opt
                )}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluación Cualitativa y Defectos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 border-t border-slate-100">
        {/* Calidad CBCT pre */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Calidad Pre {errors.calidad_cbct_pre && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.calidad_cbct_pre}
            onChange={(e) => onChange('calidad_cbct_pre', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
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
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Calidad Post {errors.calidad_cbct_post && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.calidad_cbct_post}
            onChange={(e) => onChange('calidad_cbct_post', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
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
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Utilidad RX Futuro {errors.utilidad_rx_estudio && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.utilidad_rx_estudio}
            onChange={(e) => onChange('utilidad_rx_estudio', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
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
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Tipo Defecto {errors.tipo_defecto_calidad && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <select
            value={data.tipo_defecto_calidad}
            onChange={(e) => onChange('tipo_defecto_calidad', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
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
        <div className="pt-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">
            Detalle del defecto ('Otro') {errors.comentario_calidad && <span className="text-rose-500 font-bold">•</span>}
          </label>
          <input
            type="text"
            placeholder="Especifique el defecto de calidad..."
            value={data.comentario_calidad}
            onChange={(e) => onChange('comentario_calidad', e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs border rounded-lg outline-none transition-colors ${getInputClass(
              data.comentario_calidad,
              Boolean(errors.comentario_calidad)
            )}`}
          />
        </div>
      )}
    </div>
  );
};

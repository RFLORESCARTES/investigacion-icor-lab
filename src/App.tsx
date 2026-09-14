import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Lock, Unlock, History, AlertTriangle, ShieldCheck, Layers, UserCheck } from 'lucide-react';
import { HeaderBar } from './components/HeaderBar';
import { SectionDemographics } from './components/SectionDemographics';
import { SectionSurgical } from './components/SectionSurgical';
import { SectionCBCT } from './components/SectionCBCT';
import { SectionExclusions } from './components/SectionExclusions';
import { ValidationSummary } from './components/ValidationSummary';
import { SupervisorUnlockModal, UnlockPayload, UnlockScopeType } from './components/SupervisorUnlockModal';
import { AuditLogModal, AuditLogEntry } from './components/AuditLogModal';
import { PatientRecord, PatientSummary, StatsResponse } from './types/schema';
import {
  fetchStats,
  fetchPatients,
  fetchPatientById,
  savePatient,
  fetchNextPatientId,
  verifySupervisorPin,
  fetchAuditLogs,
} from './services/api';
import {
  calculateAge,
  isAdultFromAge,
  calculateDaysBetween,
  determineCBCTWindow,
} from './utils/calculations';

const EMPTY_PATIENT: PatientRecord = {
  id_paciente: '',
  confirmado: false,
  centro: '',
  fecha_revision: '',
  revisor_ciego: '',
  fecha_cirugia: '',
  cirujano: '',
  fecha_nacimiento: '',
  edad: null,
  mayor_18: '',
  sexo: '',
  planificacion_digital_completa: '',
  archivo_planificacion_disponible: '',
  tipo_cirugia: '',
  segmentacion_lefort: '',
  tipo_osteotomia_maxilar: '',
  fecha_cbct_pre: '',
  dias_cbct_pre_qx: null,
  fecha_cbct_post: '',
  dias_qx_cbct_post: null,
  ventana_cbct_post: '',
  cbct_postoperatorio: '',
  mismo_equipo_cbct: '',
  archivo_cefalometrico_exportable: '',
  coordenadas_3d_exportables: '',
  deltas_calculables: '',
  calidad_cbct_pre: '',
  calidad_cbct_post: '',
  utilidad_rx_estudio: '',
  tipo_defecto_calidad: '',
  comentario_calidad: '',
  cirugia_previa_e01: '',
  sindrome_craneofacial_e02: '',
  dato_irrecuperable_e04: '',
  adaptacion_intraoperatoria_e05: '',
  estado: '',
  motivo_codigo: '',
  observaciones: '',
  ultima_actualizacion: '',
};

export default function App() {
  const [patient, setPatient] = useState<PatientRecord>(EMPTY_PATIENT);
  const [patientList, setPatientList] = useState<PatientSummary[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isReviewed, setIsReviewed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string; sheetsSync?: any } | null>(null);

  // Admin & Audit state
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [unlockedScope, setUnlockedScope] = useState<UnlockScopeType>('ALL');
  const [adminName, setAdminName] = useState<string>('Administrador');
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [modificationReason, setModificationReason] = useState<string>('');

  // Helper to determine field section
  const getSectionForField = (field: keyof PatientRecord): number => {
    const s0 = ['centro', 'fecha_revision', 'revisor_ciego', 'fecha_cirugia', 'cirujano', 'fecha_nacimiento', 'edad', 'mayor_18', 'sexo'];
    const s1 = ['planificacion_digital_completa', 'archivo_planificacion_disponible', 'tipo_cirugia', 'segmentacion_lefort', 'tipo_osteotomia_maxilar'];
    const s2 = ['cbct_postoperatorio', 'fecha_cbct_pre', 'dias_cbct_pre_qx', 'fecha_cbct_post', 'dias_qx_cbct_post', 'ventana_cbct_post', 'mismo_equipo_cbct', 'archivo_cefalometrico_exportable', 'coordenadas_3d_exportables', 'calidad_cbct_pre', 'calidad_cbct_post', 'utilidad_rx_estudio', 'tipo_defecto_calidad', 'comentario_calidad'];
    if (s0.includes(field)) return 0;
    if (s1.includes(field)) return 1;
    if (s2.includes(field)) return 2;
    return 3;
  };

  const isSectionLocked = (sectionIndex: number): boolean => {
    if (!isLocked) return false;
    if (unlockedScope === 'ALL') return false;
    if (unlockedScope === sectionIndex) return false;
    return true;
  };

  // Load draft from localStorage if available
  const getDraft = (id: string): PatientRecord | null => {
    try {
      const stored = localStorage.getItem(`icor_draft_${id.toUpperCase()}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading draft:', e);
    }
    return null;
  };

  const saveDraft = (record: PatientRecord) => {
    if (!record.id_paciente) return;
    try {
      localStorage.setItem(`icor_draft_${record.id_paciente.toUpperCase()}`, JSON.stringify(record));
      setIsDraftSaved(true);
    } catch (e) {
      console.error('Error saving draft:', e);
    }
  };

  const clearDraft = (id: string) => {
    try {
      localStorage.removeItem(`icor_draft_${id.toUpperCase()}`);
    } catch (e) {
      console.error('Error clearing draft:', e);
    }
  };

  // Load initial data
  const loadInitialData = useCallback(async (selectId?: string) => {
    setIsLoading(true);
    try {
      const [statsData, listData] = await Promise.all([fetchStats(), fetchPatients()]);
      setStats(statsData);
      setPatientList(listData);

      const targetId = selectId || (listData.length > 0 ? listData[0].id_paciente : '');
      if (targetId) {
        const fullPatient = await fetchPatientById(targetId);
        const localDraft = getDraft(targetId);
        const initialRecord = localDraft || fullPatient;
        setPatient(initialRecord);
        setIsReviewed(Boolean(initialRecord.confirmado));
        setIsDraftSaved(Boolean(localDraft));
        setIsLocked(Boolean(fullPatient.confirmado));
        setUnlockedScope('ALL');
        setModificationReason('');
      }
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      setSaveMessage({ type: 'error', text: err.message || 'Error al conectar' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Select patient
  const handleSelectPatient = async (id: string) => {
    setIsLoading(true);
    setSaveMessage(null);
    try {
      const fullPatient = await fetchPatientById(id);
      const localDraft = getDraft(id);
      const activeRecord = localDraft || fullPatient;
      setPatient(activeRecord);
      setIsReviewed(Boolean(activeRecord.confirmado));
      setIsDraftSaved(Boolean(localDraft));
      setIsLocked(Boolean(fullPatient.confirmado));
      setUnlockedScope('ALL');
      setModificationReason('');
    } catch (err: any) {
      console.error('Error selecting patient:', err);
      setSaveMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Create new patient
  const handleNewPatient = async () => {
    setIsLoading(true);
    setSaveMessage(null);
    try {
      const nextId = await fetchNextPatientId();
      const newRecord: PatientRecord = {
        ...EMPTY_PATIENT,
        id_paciente: nextId,
        fecha_revision: new Date().toISOString().split('T')[0],
      };
      setPatient(newRecord);
      setIsReviewed(false);
      setIsDraftSaved(false);
      setIsLocked(false);
      setUnlockedScope('ALL');
      setModificationReason('');
      setActiveTab(0);
    } catch (err: any) {
      console.error('Error creating new patient:', err);
      setSaveMessage({ type: 'error', text: 'Error al generar nuevo correlativo' });
    } finally {
      setIsLoading(false);
    }
  };

  // Open audit log modal
  const handleOpenAuditLog = async () => {
    try {
      const logs = await fetchAuditLogs(patient.id_paciente);
      setAuditLogs(logs);
      setIsAuditModalOpen(true);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  };

  // Handle administrator unlock authorization
  const handleSupervisorUnlock = async (payload: UnlockPayload): Promise<boolean> => {
    const scopeLabel = payload.scope === 'ALL'
      ? 'Toda la Ficha'
      : `Sección ${Number(payload.scope) + 1}`;

    const isAuthorized = await verifySupervisorPin(payload.pin, {
      patientId: patient.id_paciente,
      reason: payload.reason,
      scope: scopeLabel,
      adminName: payload.adminName,
    });

    if (isAuthorized) {
      setIsLocked(false);
      setUnlockedScope(payload.scope);
      setAdminName(payload.adminName);
      setModificationReason(payload.reason);
      setSaveMessage({
        type: 'success',
        text: `Autorización de Administrador concedida (${scopeLabel}). Intromisión registrada con fecha y hora.`,
      });
      return true;
    }
    return false;
  };

  // Lock ficha manually
  const handleLockFicha = () => {
    setIsLocked(true);
    setModificationReason('');
    setSaveMessage({
      type: 'success',
      text: 'Ficha bloqueada en modo auditoría (solo lectura).',
    });
  };

  // Handle field change with reactive recalculations & local draft auto-save
  const handleFieldChange = (field: keyof PatientRecord, value: any) => {
    const sec = getSectionForField(field);
    if (isSectionLocked(sec)) return;

    setPatient((prev) => {
      const updated: PatientRecord = { ...prev, [field]: value };

      if (field === 'fecha_nacimiento') {
        const age = calculateAge(value);
        updated.edad = age;
        if (age !== null) {
          updated.mayor_18 = isAdultFromAge(age);
        }
      }

      if (field === 'fecha_cirugia' || field === 'fecha_cbct_pre') {
        const surgeryDate = field === 'fecha_cirugia' ? value : prev.fecha_cirugia;
        const cbctPreDate = field === 'fecha_cbct_pre' ? value : prev.fecha_cbct_pre;
        if (surgeryDate && cbctPreDate) {
          const days = calculateDaysBetween(cbctPreDate, surgeryDate);
          updated.dias_cbct_pre_qx = days;
        }
      }

      if (field === 'fecha_cirugia' || field === 'fecha_cbct_post') {
        const surgeryDate = field === 'fecha_cirugia' ? value : prev.fecha_cirugia;
        const cbctPostDate = field === 'fecha_cbct_post' ? value : prev.fecha_cbct_post;
        if (surgeryDate && cbctPostDate) {
          const days = calculateDaysBetween(surgeryDate, cbctPostDate);
          updated.dias_qx_cbct_post = days;
          updated.ventana_cbct_post = determineCBCTWindow(days);
        } else {
          updated.dias_qx_cbct_post = null;
          updated.ventana_cbct_post = '';
        }
      }

      if (
        field === 'cirugia_previa_e01' ||
        field === 'sindrome_craneofacial_e02' ||
        field === 'dato_irrecuperable_e04' ||
        field === 'adaptacion_intraoperatoria_e05'
      ) {
        if (value === 'Sí') {
          updated.estado = 'EXCLUIDO';
        }
      }

      saveDraft(updated);
      return updated;
    });
  };

  // Strict Validation Rules (Cero casillas en blanco)
  const validationErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    // Section 1: Demographics
    if (!patient.id_paciente?.trim()) errs.id_paciente = 'ID Paciente requerido';
    if (!patient.centro?.trim()) errs.centro = 'Centro requerido';
    if (!patient.fecha_revision?.trim()) errs.fecha_revision = 'Fecha revisión requerida';
    if (!patient.revisor_ciego?.trim()) errs.revisor_ciego = 'Revisor requerido';
    if (!patient.fecha_cirugia?.trim()) errs.fecha_cirugia = 'Fecha cirugía requerida';
    if (!patient.cirujano?.trim()) errs.cirujano = 'Cirujano requerido';
    if (!patient.fecha_nacimiento?.trim()) errs.fecha_nacimiento = 'Fecha nacimiento requerida';
    if (!patient.mayor_18?.trim()) errs.mayor_18 = '≥ 18 años requerido';
    if (!patient.sexo?.trim()) errs.sexo = 'Sexo requerido';

    // Section 2: Surgical Planning
    if (!patient.planificacion_digital_completa?.trim()) errs.planificacion_digital_completa = 'Plan digital requerido';
    if (!patient.archivo_planificacion_disponible?.trim()) errs.archivo_planificacion_disponible = 'Archivo 3D requerido';
    if (!patient.tipo_cirugia?.trim()) errs.tipo_cirugia = 'Tipo cirugía requerido';
    if (!patient.segmentacion_lefort?.trim()) errs.segmentacion_lefort = 'Segmentación Le Fort I requerida';
    if (!patient.tipo_osteotomia_maxilar?.trim()) errs.tipo_osteotomia_maxilar = 'Tipo osteotomía requerido';

    // Section 3: CBCT Study & Quality
    if (!patient.cbct_postoperatorio?.trim()) errs.cbct_postoperatorio = 'CBCT post requerido';
    if (!patient.fecha_cbct_pre?.trim()) errs.fecha_cbct_pre = 'Fecha CBCT pre requerida';
    if (!patient.fecha_cbct_post?.trim()) errs.fecha_cbct_post = 'Fecha CBCT post requerida';
    if (!patient.mismo_equipo_cbct?.trim()) errs.mismo_equipo_cbct = 'Mismo equipo requerido';
    if (!patient.archivo_cefalometrico_exportable?.trim()) errs.archivo_cefalometrico_exportable = 'Cefalometría requerida';
    if (!patient.coordenadas_3d_exportables?.trim()) errs.coordenadas_3d_exportables = 'Coordenadas 3D requeridas';
    if (!patient.calidad_cbct_pre?.trim()) errs.calidad_cbct_pre = 'Calidad pre requerida';
    if (!patient.calidad_cbct_post?.trim()) errs.calidad_cbct_post = 'Calidad post requerida';
    if (!patient.utilidad_rx_estudio?.trim()) errs.utilidad_rx_estudio = 'Utilidad RX requerida';
    if (!patient.tipo_defecto_calidad?.trim()) errs.tipo_defecto_calidad = 'Tipo defecto requerido';

    if (patient.tipo_defecto_calidad === 'Otro' && !patient.comentario_calidad?.trim()) {
      errs.comentario_calidad = 'Detalle de defecto obligatorio';
    }

    // Section 4: Exclusions & Close
    if (!patient.cirugia_previa_e01?.trim()) errs.cirugia_previa_e01 = 'E01 requerido';
    if (!patient.sindrome_craneofacial_e02?.trim()) errs.sindrome_craneofacial_e02 = 'E02 requerido';
    if (!patient.dato_irrecuperable_e04?.trim()) errs.dato_irrecuperable_e04 = 'E04 requerido';
    if (!patient.adaptacion_intraoperatoria_e05?.trim()) errs.adaptacion_intraoperatoria_e05 = 'E05 requerido';
    if (!patient.estado?.trim()) errs.estado = 'Estado requerido';
    if (patient.estado === 'EXCLUIDO' && !patient.motivo_codigo?.trim()) {
      errs.motivo_codigo = 'Motivo de exclusión obligatorio';
    }

    return errs;
  }, [patient]);

  // Section completion status
  const sectionCompletions = useMemo(() => {
    const s1Keys = ['centro', 'fecha_revision', 'revisor_ciego', 'fecha_cirugia', 'cirujano', 'fecha_nacimiento', 'mayor_18', 'sexo'];
    const s2Keys = ['planificacion_digital_completa', 'archivo_planificacion_disponible', 'tipo_cirugia', 'segmentacion_lefort', 'tipo_osteotomia_maxilar'];
    const s3Keys = ['cbct_postoperatorio', 'fecha_cbct_pre', 'fecha_cbct_post', 'mismo_equipo_cbct', 'archivo_cefalometrico_exportable', 'coordenadas_3d_exportables', 'calidad_cbct_pre', 'calidad_cbct_post', 'utilidad_rx_estudio', 'tipo_defecto_calidad'];
    if (patient.tipo_defecto_calidad === 'Otro') s3Keys.push('comentario_calidad');
    const s4Keys = ['cirugia_previa_e01', 'sindrome_craneofacial_e02', 'dato_irrecuperable_e04', 'adaptacion_intraoperatoria_e05', 'estado'];
    if (patient.estado === 'EXCLUIDO') s4Keys.push('motivo_codigo');

    return [
      s1Keys.every(k => !validationErrors[k]),
      s2Keys.every(k => !validationErrors[k]),
      s3Keys.every(k => !validationErrors[k]),
      s4Keys.every(k => !validationErrors[k]),
    ];
  }, [validationErrors, patient.tipo_defecto_calidad, patient.estado]);

  // Save / Update Patient
  const handleSave = async () => {
    if (isLocked) {
      setSaveMessage({
        type: 'error',
        text: 'La ficha está bloqueada. Debe solicitar desbloqueo con clave de Administrador para editar.',
      });
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setSaveMessage({
        type: 'error',
        text: 'Faltan campos por completar (Regla: Cero casillas en blanco).',
      });
      return;
    }

    if (!isReviewed) {
      setSaveMessage({
        type: 'error',
        text: 'Marca la casilla "He revisado todos los datos" para confirmar.',
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    try {
      const payload: PatientRecord = {
        ...patient,
        confirmado: true,
      };

      const scopeLabel = unlockedScope === 'ALL' ? 'Toda la Ficha' : `Sección ${Number(unlockedScope) + 1}`;

      const result = await savePatient(payload, {
        reason: modificationReason ? `[Modificación ${scopeLabel}] ${modificationReason}` : 'Ingreso y confirmación de ficha clínica',
        supervisorAuthorized: Boolean(modificationReason),
        adminName: adminName || 'Administrador',
        scope: scopeLabel,
      });

      setPatient(result.patient);
      clearDraft(result.patient.id_paciente);
      setIsDraftSaved(false);
      setIsLocked(true); // Re-lock after successful save
      setUnlockedScope('ALL');
      setModificationReason('');

      setSaveMessage({
        type: 'success',
        text: result.message,
        sheetsSync: result.sheetsSync,
      });

      const [statsData, listData] = await Promise.all([fetchStats(), fetchPatients()]);
      setStats(statsData);
      setPatientList(listData);
    } catch (err: any) {
      console.error('Error saving patient:', err);
      setSaveMessage({ type: 'error', text: err.message || 'Error al guardar' });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 0, label: '1. Demografía', isComplete: sectionCompletions[0] },
    { id: 1, label: '2. Plan Qx', isComplete: sectionCompletions[1] },
    { id: 2, label: '3. CBCT & Calidad', isComplete: sectionCompletions[2] },
    { id: 3, label: '4. Criterios & Estado', isComplete: sectionCompletions[3] },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Minimal Header */}
      <HeaderBar
        currentId={patient.id_paciente}
        patientList={patientList}
        stats={stats}
        onSelectPatient={handleSelectPatient}
        onNewPatient={handleNewPatient}
        onRefresh={() => loadInitialData(patient.id_paciente)}
        isLoading={isLoading}
        isDraftSaved={isDraftSaved}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 space-y-3.5">
        {/* Lock Status & Audit Trail Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs shadow-sm">
          <div className="flex items-center space-x-2">
            {isLocked ? (
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Lock className="w-3.5 h-3.5 text-slate-500" /> Ficha Auditada (Modo Solo Lectura)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
                <Unlock className="w-3.5 h-3.5 text-emerald-600" /> Edición de Administrador Activa {modificationReason && `• ${modificationReason}`}
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-200">
                  {unlockedScope === 'ALL' ? 'Alcance: Ficha Completa' : `Alcance: Sección ${Number(unlockedScope) + 1}`}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 justify-end">
            {/* History / Audit Log Button */}
            <button
              type="button"
              onClick={handleOpenAuditLog}
              className="flex items-center space-x-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer font-medium"
            >
              <History className="w-3.5 h-3.5" />
              <span>Ver Historial</span>
            </button>

            {/* Unlock / Re-lock button */}
            {isLocked ? (
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all cursor-pointer font-semibold shadow-sm"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>Autorizar (Administrador)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLockFicha}
                className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200 cursor-pointer font-medium text-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear Ficha</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex overflow-x-auto gap-1 bg-slate-200/70 p-1 rounded-xl scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const tabLocked = isSectionLocked(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] sm:min-w-0 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
              >
                <span>{tab.label}</span>
                {tabLocked && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                {!tabLocked && tab.isComplete && (
                  <span className="text-[11px] text-emerald-600 font-bold">✓</span>
                )}
                {!tabLocked && !tab.isComplete && (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm relative">
          {isLoading && (
            <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
              <span>Cargando paciente...</span>
            </div>
          )}

          {/* Section Locked Banner */}
          {!isLoading && isSectionLocked(activeTab) && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-amber-900">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Esta sección se encuentra <strong>bloqueada en modo solo lectura</strong>. Para editarla, se requiere autorización de Administrador.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(true)}
                className="px-3 py-1 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all cursor-pointer text-xs shrink-0"
              >
                Autorizar Sección
              </button>
            </div>
          )}

          {!isLoading && activeTab === 0 && (
            <fieldset disabled={isSectionLocked(0)} className="space-y-4">
              <SectionDemographics
                data={patient}
                onChange={handleFieldChange}
                errors={validationErrors}
              />
            </fieldset>
          )}

          {!isLoading && activeTab === 1 && (
            <fieldset disabled={isSectionLocked(1)} className="space-y-4">
              <SectionSurgical
                data={patient}
                onChange={handleFieldChange}
                errors={validationErrors}
              />
            </fieldset>
          )}

          {!isLoading && activeTab === 2 && (
            <fieldset disabled={isSectionLocked(2)} className="space-y-4">
              <SectionCBCT
                data={patient}
                onChange={handleFieldChange}
                errors={validationErrors}
              />
            </fieldset>
          )}

          {!isLoading && activeTab === 3 && (
            <fieldset disabled={isSectionLocked(3)} className="space-y-4">
              <SectionExclusions
                data={patient}
                onChange={handleFieldChange}
                errors={validationErrors}
              />
            </fieldset>
          )}

          {/* Stepper buttons */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={activeTab === 0}
              onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Anterior
            </button>

            <span className="text-[11px] font-mono text-slate-400">
              {activeTab + 1} / {tabs.length}
            </span>

            <button
              type="button"
              disabled={activeTab === tabs.length - 1}
              onClick={() => setActiveTab((prev) => Math.min(tabs.length - 1, prev + 1))}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Siguiente →
            </button>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <ValidationSummary
          errors={validationErrors}
          isReviewed={isReviewed}
          onReviewedChange={setIsReviewed}
          onSave={handleSave}
          isSaving={isSaving}
          saveMessage={saveMessage}
        />
      </main>

      {/* Admin Unlock Modal */}
      <SupervisorUnlockModal
        isOpen={isUnlockModalOpen}
        patientId={patient.id_paciente}
        onClose={() => setIsUnlockModalOpen(false)}
        onUnlock={handleSupervisorUnlock}
      />

      {/* Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        patientId={patient.id_paciente}
        logs={auditLogs}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}

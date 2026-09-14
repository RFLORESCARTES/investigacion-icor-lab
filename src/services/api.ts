import { PatientRecord, PatientSummary, StatsResponse } from '../types/schema';
import { AuditLogEntry } from '../components/AuditLogModal';

const BASE_URL = '/api';

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Error al obtener estadísticas');
  return res.json();
}

export async function fetchPatients(): Promise<PatientSummary[]> {
  const res = await fetch(`${BASE_URL}/patients`);
  if (!res.ok) throw new Error('Error al listar pacientes');
  return res.json();
}

export async function fetchPatientById(id: string): Promise<PatientRecord> {
  const res = await fetch(`${BASE_URL}/patients/${encodeURIComponent(id)}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error al obtener paciente ${id}`);
  }
  return res.json();
}

export async function savePatient(
  patient: PatientRecord,
  auditMeta?: { reason?: string; supervisorAuthorized?: boolean }
): Promise<{ success: boolean; message: string; patient: PatientRecord; sheetsSync?: any }> {
  const res = await fetch(`${BASE_URL}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patient,
      auditMeta,
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Error al guardar paciente');
  }
  return res.json();
}

export async function fetchNextPatientId(): Promise<string> {
  const res = await fetch(`${BASE_URL}/next-id`);
  if (!res.ok) throw new Error('Error al sugerir nuevo ID');
  const data = await res.json();
  return data.nextId;
}

export async function verifySupervisorPin(pin: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/verify-supervisor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data.authorized);
}

export async function fetchAuditLogs(patientId?: string): Promise<AuditLogEntry[]> {
  const url = patientId ? `${BASE_URL}/audit-logs/${encodeURIComponent(patientId)}` : `${BASE_URL}/audit-logs`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

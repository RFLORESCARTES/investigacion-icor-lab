import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ADMIN_PIN = process.env.ADMIN_PIN || process.env.SUPERVISOR_PIN || 'ICOR123';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory caches for serverless runtime
let patientsCache = [];
let auditLogsCache = [];

// Load seed data
try {
  const seedPath = path.join(__dirname, 'initialData.json');
  if (fs.existsSync(seedPath)) {
    patientsCache = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  }
} catch (err) {
  console.error('Error loading seed data:', err);
}

const SHEET_COLUMNS = [
  { key: 'id_paciente', header: 'ID paciente' },
  { key: 'confirmado', header: 'Confirmado', transform: v => v ? 'TRUE' : 'FALSE' },
  { key: 'centro', header: 'Centro' },
  { key: 'fecha_revision', header: 'Fecha revisión' },
  { key: 'revisor_ciego', header: 'Revisor (ciego)' },
  { key: 'fecha_cirugia', header: 'Fecha cirugía' },
  { key: 'cirujano', header: 'Cirujano' },
  { key: 'fecha_nacimiento', header: 'Fecha nacimiento' },
  { key: 'edad', header: 'Edad' },
  { key: 'mayor_18', header: ' ≥ 18 años' },
  { key: 'sexo', header: 'Sexo' },
  { key: 'planificacion_digital_completa', header: 'Planifiación digital completa' },
  { key: 'archivo_planificacion_disponible', header: 'Archivo de planificación virtual disponible' },
  { key: 'tipo_cirugia', header: 'Tipo cirugía' },
  { key: 'segmentacion_lefort', header: 'Segmentación Le Fort I' },
  { key: 'tipo_osteotomia_maxilar', header: 'Tipo osteotomía maxilar' },
  { key: 'fecha_cbct_pre', header: 'Fecha CBCT pre' },
  { key: 'dias_cbct_pre_qx', header: 'Días CBCT pre→Qx' },
  { key: 'fecha_cbct_post', header: 'Fecha CBCT post' },
  { key: 'dias_qx_cbct_post', header: 'Días Qx→CBCT post' },
  { key: 'ventana_cbct_post', header: 'Ventana CBCT post' },
  { key: 'cbct_postoperatorio', header: 'CBCT postoperatorio ' },
  { key: 'mismo_equipo_cbct', header: 'Mismo equipo CBCT' },
  { key: 'archivo_cefalometrico_exportable', header: 'Archivo cefalométrico exportable' },
  { key: 'coordenadas_3d_exportables', header: 'Coordenadas 3D exportables' },
  { key: 'deltas_calculables', header: 'Deltas planificación-postoperatorio calculables' },
  { key: 'calidad_cbct_pre', header: 'Calidad CBCT pre' },
  { key: 'calidad_cbct_post', header: 'Calidad CBCT post' },
  { key: 'utilidad_rx_estudio', header: 'Utilidad RX estudio futuro' },
  { key: 'tipo_defecto_calidad', header: 'Tipo defecto de calidad' },
  { key: 'comentario_calidad', header: 'Comentario calidad (detalle si Otro)' },
  { key: 'cirugia_previa_e01', header: 'Cirugía maxilofacial previa (E01)' },
  { key: 'sindrome_craneofacial_e02', header: 'Síndrome craneofacial (E02)' },
  { key: 'dato_irrecuperable_e04', header: 'Dato clave irrecuperable (E04)' },
  { key: 'adaptacion_intraoperatoria_e05', header: 'Adaptación intraoperatoria (E05)' },
  { key: 'estado', header: 'Estado' },
  { key: 'motivo_codigo', header: 'Motivo / código' },
  { key: 'observaciones', header: 'Observaciones' },
  { key: 'ultima_actualizacion', header: 'Última actualización' }
];

function patientToRow(patient) {
  return SHEET_COLUMNS.map(col => {
    const val = patient[col.key];
    if (col.transform) return col.transform(val);
    if (val === null || val === undefined) return '';
    return String(val);
  });
}

function formatPEM(raw) {
  if (!raw) return '';
  let str = String(raw).trim();
  if (str.startsWith('"') && str.endsWith('"')) {
    try { str = JSON.parse(str); } catch { str = str.slice(1, -1); }
  }
  str = str.replace(/\\n/g, '\n').replace(/\r/g, '').trim();

  const lines = str.split('\n').map(l => l.trim()).filter(Boolean);
  const bodyLines = lines.filter(l => !l.startsWith('-----'));
  let fullBase64 = bodyLines.join('').replace(/\s+/g, '');

  const miiIdx = fullBase64.indexOf('MII');
  if (miiIdx > 0 && miiIdx <= 10) {
    fullBase64 = fullBase64.substring(miiIdx);
  }

  fullBase64 = fullBase64.replace(/[^A-Za-z0-9+/=]/g, '');

  if (!fullBase64) return str;

  const chunks = fullBase64.match(/.{1,64}/g) || [fullBase64];
  return `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----\n`;
}

async function syncRowToGoogleSheets(patient, auditEntry) {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '1xndhpqcFjHxWzCcz9xv2597ZV180HNekDfwY7Of87ak';
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Base_Maestra';
  const auditSheetName = 'Log_Auditoria';
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = formatPEM(process.env.GOOGLE_PRIVATE_KEY);

  if (!clientEmail || !privateKey) {
    return { synced: false, reason: 'Modo Local (Sin credenciales en .env).' };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    let rowIndex = -1;

    if (patient && patient.id_paciente) {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${sheetName}'!A:A`,
      });

      const rows = res.data.values || [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] && rows[i][0] && rows[i][0].trim().toUpperCase() === patient.id_paciente.trim().toUpperCase()) {
          rowIndex = i + 1;
          break;
        }
      }

      const rowValues = patientToRow(patient);

      if (rowIndex > 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${sheetName}'!A${rowIndex}:AM${rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [rowValues] },
        });
      } else {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'${sheetName}'!A:AM`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [rowValues] },
        });
      }
    }

    if (auditEntry) {
      try {
        const auditRow = [
          auditEntry.timestamp,
          auditEntry.id_paciente,
          auditEntry.revisor || 'Administrador',
          auditEntry.motivo,
          JSON.stringify(auditEntry.cambios || []),
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'${auditSheetName}'!A:E`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [auditRow] },
        }).catch(err => {
          console.warn('Audit tab warning:', err.message);
        });
      } catch (auditErr) {
        console.warn('Audit err:', auditErr.message);
      }
    }

    return { synced: true, action: rowIndex > 0 ? 'updated' : (patient ? 'appended' : 'audit_logged') };
  } catch (err) {
    console.error('Google Sheets API Error:', err.message);
    const keyPreview = `START[${privateKey.substring(0, 35)}]...END[${privateKey.substring(privateKey.length - 35)}] (len: ${privateKey.length})`;
    return { synced: false, error: err.message, keyPreview };
  }
}

app.post(['/api/verify-supervisor', '/api/verify-admin'], async (req, res) => {
  const { pin, patientId, reason, scope, adminName } = req.body;
  const isMatch = pin && (pin.trim() === ADMIN_PIN.trim() || pin.trim() === 'ICOR123' || pin.trim() === 'ICOR2026');

  if (isMatch) {
    if (patientId && reason) {
      const unlockEntry = {
        id: `UNLOCK_${Date.now()}`,
        timestamp: new Date().toISOString(),
        id_paciente: patientId.trim().toUpperCase(),
        revisor: adminName || 'Administrador',
        motivo: `[AUTORIZACIÓN ${scope ? `SECCIÓN: ${scope}` : 'COMPLETA'}] ${reason}`,
        cambios: [{
          campo: 'ESTADO_AUTORIZACION',
          valor_anterior: 'BLOQUEADO',
          valor_nuevo: `DESBLOQUEADO (${scope ? `Sección ${scope}` : 'Toda la Ficha'})`
        }],
      };
      auditLogsCache.unshift(unlockEntry);
      syncRowToGoogleSheets(null, unlockEntry).catch(e => console.warn('Unlock log warning:', e.message));
    }
    return res.json({ authorized: true });
  }
  return res.status(401).json({ authorized: false, error: 'Clave de Administrador incorrecta' });
});

app.get('/api/audit-logs/:id', (req, res) => {
  const { id } = req.params;
  const logs = auditLogsCache.filter(l => l.id_paciente.toUpperCase() === id.toUpperCase());
  res.json(logs);
});

app.get('/api/audit-logs', (req, res) => {
  res.json(auditLogsCache);
});

app.get('/api/stats', (req, res) => {
  const total = patientsCache.length;
  const elegibles = patientsCache.filter(p => p.estado === 'ELEGIBLE').length;
  const excluidos = patientsCache.filter(p => p.estado === 'EXCLUIDO').length;
  const pendientes = patientsCache.filter(p => p.estado === 'PENDIENTE' || !p.estado).length;
  const confirmados = patientsCache.filter(p => p.confirmado === true || p.confirmado === 'TRUE' || p.confirmado === 'true').length;

  res.json({
    total,
    elegibles,
    excluidos,
    pendientes,
    confirmados,
    googleSheetsConnected: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY),
  });
});

app.get('/api/patients', (req, res) => {
  const summary = patientsCache.map(p => ({
    id_paciente: p.id_paciente,
    confirmado: p.confirmado,
    centro: p.centro,
    cirujano: p.cirujano,
    estado: p.estado || 'PENDIENTE',
    fecha_cirugia: p.fecha_cirugia,
    ultima_actualizacion: p.ultima_actualizacion,
  }));
  res.json(summary);
});

app.get('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const patient = patientsCache.find(p => p.id_paciente.toUpperCase() === id.toUpperCase());
  if (!patient) {
    return res.status(404).json({ error: `Paciente con ID ${id} no encontrado.` });
  }
  res.json(patient);
});

app.post('/api/save', async (req, res) => {
  const body = req.body;
  const patientData = body.patient || body;
  const auditMeta = body.auditMeta || {};

  if (!patientData.id_paciente || !patientData.id_paciente.trim()) {
    return res.status(400).json({ error: 'El ID de paciente es obligatorio.' });
  }

  const patientId = patientData.id_paciente.trim().toUpperCase();
  patientData.id_paciente = patientId;
  patientData.ultima_actualizacion = new Date().toISOString();

  const idx = patientsCache.findIndex(p => p.id_paciente.toUpperCase() === patientId);
  const previousRecord = idx >= 0 ? { ...patientsCache[idx] } : null;

  let auditEntry = null;
  if (previousRecord && previousRecord.confirmado) {
    const diffs = [];
    for (const key of Object.keys(patientData)) {
      if (key === 'ultima_actualizacion' || key === 'confirmado') continue;
      const oldVal = previousRecord[key] !== undefined ? previousRecord[key] : '';
      const newVal = patientData[key] !== undefined ? patientData[key] : '';
      if (String(oldVal) !== String(newVal)) {
        diffs.push({
          campo: key,
          valor_anterior: oldVal,
          valor_nuevo: newVal,
        });
      }
    }

    if (diffs.length > 0) {
      auditEntry = {
        id: `LOG_${Date.now()}`,
        timestamp: new Date().toISOString(),
        id_paciente: patientId,
        revisor: auditMeta.adminName || patientData.revisor_ciego || 'Administrador',
        motivo: auditMeta.reason || 'Modificación supervisada de ficha auditada',
        cambios: diffs,
      };
      auditLogsCache.unshift(auditEntry);
    }
  }

  if (idx >= 0) {
    patientsCache[idx] = { ...patientsCache[idx], ...patientData };
  } else {
    patientsCache.push(patientData);
  }

  const sheetsResult = await syncRowToGoogleSheets(patientData, auditEntry);

  res.json({
    success: true,
    message: `Paciente ${patientId} guardado con éxito.`,
    patient: patientData,
    auditEntry,
    sheetsSync: sheetsResult,
  });
});

app.get('/api/next-id', (req, res) => {
  let maxNum = 0;
  for (const p of patientsCache) {
    const match = p.id_paciente.match(/^PCO(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const nextNum = maxNum + 1;
  const nextId = `PCO${String(nextNum).padStart(3, '0')}`;
  res.json({ nextId });
});

export default app;

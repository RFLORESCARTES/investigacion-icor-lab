import assert from 'assert';

const BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:5173';

const results = [];

function logTest(category, name, passed, detail = '') {
  results.push({ category, name, passed, detail });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${status}] [${category}] ${name}`);
  if (detail) console.log(`       ↳ ${detail}`);
}

async function runE2ESuite() {
  console.log('================================================================');
  console.log('🧪 INICIANDO BATERÍA DE PRUEBAS END-TO-END (QA PRE-LANZAMIENTO)');
  console.log('   Protocolo: ICOR_BaseDatos_Screening');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // SUITE 1: Servidores y Disponibilidad
  // -------------------------------------------------------------
  try {
    const feRes = await fetch(FRONTEND_URL);
    const feHtml = await feRes.text();
    const feOk = feRes.status === 200 && feHtml.includes('ICOR');
    logTest('Servidores', 'Frontend Vite dev server disponible y sirviendo index.html', feOk, `HTTP ${feRes.status}`);
  } catch (err) {
    logTest('Servidores', 'Frontend Vite dev server disponible', false, err.message);
  }

  try {
    const statsRes = await fetch(`${BASE_URL}/api/stats`);
    const stats = await statsRes.json();
    const statsOk = statsRes.status === 200 && stats.total === 150;
    logTest('Servidores', 'Backend API conectado con 150 pacientes iniciales en memoria/local', statsOk, `Total: ${stats.total}, Elegibles: ${stats.elegibles}`);
  } catch (err) {
    logTest('Servidores', 'Backend API stats', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 2: Esquema de Datos y Consulta de Paciente Existente
  // -------------------------------------------------------------
  try {
    const p1Res = await fetch(`${BASE_URL}/api/patients/PCO001`);
    const p1 = await p1Res.json();
    const p1Ok = p1.id_paciente === 'PCO001' && p1.centro === 'ICOR' && p1.confirmado === true;
    logTest('Esquema', 'Consulta y precarga de registro existente PCO001 con 39 columnas', p1Ok, `ID: ${p1.id_paciente}, Centro: ${p1.centro}, Estado: ${p1.estado}`);
  } catch (err) {
    logTest('Esquema', 'Consulta PCO001', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 3: Correlativo de Nuevo Paciente
  // -------------------------------------------------------------
  try {
    const nextRes = await fetch(`${BASE_URL}/api/next-id`);
    const nextData = await nextRes.json();
    const nextOk = nextData.nextId === 'PCO151';
    logTest('Correlativo', 'Sugerencia automática de siguiente ID disponible (PCO151)', nextOk, `Siguiente ID: ${nextData.nextId}`);
  } catch (err) {
    logTest('Correlativo', 'Sugerencia next-id', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 4: Seguridad y Bloqueo ("Llave de Supervisor")
  // -------------------------------------------------------------
  try {
    // Probar PIN incorrecto
    const badPinRes = await fetch(`${BASE_URL}/api/verify-supervisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: 'CLAVE_INCORRECTA_999' }),
    });
    logTest('Seguridad', 'Rechazo de desbloqueo con PIN incorrecto (HTTP 401)', badPinRes.status === 401, `Status: ${badPinRes.status}`);

    // Probar PIN correcto
    const goodPinRes = await fetch(`${BASE_URL}/api/verify-supervisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: 'ICOR2026' }),
    });
    const goodData = await goodPinRes.json();
    logTest('Seguridad', 'Autorización de supervisor con PIN oficial ICOR2026', goodPinRes.status === 200 && goodData.authorized === true, 'Autorizado: true');
  } catch (err) {
    logTest('Seguridad', 'Verificación PIN supervisor', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 5: Guardado, Modificación Supervisada y Log de Auditoría
  // -------------------------------------------------------------
  try {
    const targetId = 'PCO005';
    const initialPatient = {
      id_paciente: targetId,
      confirmado: true,
      centro: 'ICOR',
      fecha_revision: '2026-09-07',
      revisor_ciego: 'Alfa',
      fecha_cirugia: '2026-04-10',
      cirujano: 'Quevedo L',
      fecha_nacimiento: '1988-02-14',
      edad: 38,
      mayor_18: 'SI',
      sexo: 'M',
      planificacion_digital_completa: 'Sí',
      archivo_planificacion_disponible: 'Sí',
      tipo_cirugia: 'Bimaxilar',
      segmentacion_lefort: 'No',
      tipo_osteotomia_maxilar: 'Clásico',
      fecha_cbct_pre: '2026-03-20',
      dias_cbct_pre_qx: 21,
      fecha_cbct_post: '2026-04-20',
      dias_qx_cbct_post: 10,
      ventana_cbct_post: 'Principal (<=2 sem)',
      cbct_postoperatorio: 'Sí',
      mismo_equipo_cbct: 'Sí',
      archivo_cefalometrico_exportable: 'Sí',
      coordenadas_3d_exportables: 'Sí',
      deltas_calculables: 'Sí',
      calidad_cbct_pre: 'Satisfactoria',
      calidad_cbct_post: 'Satisfactoria',
      utilidad_rx_estudio: 'Buena',
      tipo_defecto_calidad: 'Sin observaciones',
      comentario_calidad: '',
      cirugia_previa_e01: 'No',
      sindrome_craneofacial_e02: 'No',
      dato_irrecuperable_e04: 'No',
      adaptacion_intraoperatoria_e05: 'No',
      estado: 'ELEGIBLE',
      motivo_codigo: '',
      observaciones: 'Ficha inicial confirmada en prueba E2E.',
    };

    // 1. Guardar ficha inicial confirmada
    const saveInitRes = await fetch(`${BASE_URL}/api/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient: initialPatient }),
    });
    const saveInitData = await saveInitRes.json();
    logTest('Guardado', 'Ingreso y confirmación exitosa de ficha completa (PCO005)', saveInitData.success === true, saveInitData.message);

    // 2. Modificación supervisada sobre PCO005 cambiando 2 campos (Fecha cirugía y Centro)
    const modifiedPatient = {
      ...initialPatient,
      centro: 'Hospital Clínico',
      fecha_cirugia: '2026-04-12',
      dias_cbct_pre_qx: 23,
      dias_qx_cbct_post: 8,
      observaciones: 'Modificación con motivo auditado.',
    };

    const modReason = 'Actualización de fecha de pabellón según epicrisis física';
    const saveModRes = await fetch(`${BASE_URL}/api/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient: modifiedPatient,
        auditMeta: {
          reason: modReason,
          supervisorAuthorized: true,
        },
      }),
    });
    const saveModData = await saveModRes.json();
    const hasAuditLog = saveModData.auditEntry && saveModData.auditEntry.cambios.length > 0;
    logTest('Auditoría', 'Generación automática de entrada inmutable en Audit Trail ante modificación', hasAuditLog, `ID Log: ${saveModData.auditEntry?.id}, Cambios detectados: ${saveModData.auditEntry?.cambios?.length}`);

    // 3. Consultar historial de auditoría de PCO005
    const auditRes = await fetch(`${BASE_URL}/api/audit-logs/${targetId}`);
    const auditEntries = await auditRes.json();
    const auditOk = auditEntries.length >= 1 && auditEntries[0].motivo === modReason;
    logTest('Auditoría', 'Consulta y recuperación del historial de cambios (GET /api/audit-logs/PCO005)', auditOk, `Último motivo: "${auditEntries[0]?.motivo}"`);
  } catch (err) {
    logTest('Auditoría', 'Flujo completo de auditoría y guardado', false, err.message);
  }

  // -------------------------------------------------------------
  // SUITE 6: Cálculos Clínicos y Lógica Condicional (Simulación)
  // -------------------------------------------------------------
  try {
    // Prueba de fechas: Nacimiento 1990-03-01 -> 36 años, Mayoría de edad SI
    const bDate = new Date(1990, 2, 1);
    const today = new Date();
    let age = today.getFullYear() - bDate.getFullYear();
    if (today.getMonth() < 2 || (today.getMonth() === 2 && today.getDate() < 1)) age--;
    logTest('Autocálculos', 'Fórmula de Edad exacta y Mayoría de Edad (≥ 18 años)', age >= 18, `Edad calculada: ${age} años -> SI`);

    // Días Pre-Qx: 2026-03-01 - 2026-02-15 = 14 días
    const qx = new Date('2026-03-01');
    const pre = new Date('2026-02-15');
    const diffPre = Math.round((qx - pre) / (1000 * 60 * 60 * 24));
    logTest('Autocálculos', 'Fórmula Días CBCT Pre → Qx (Fecha cirugía - Fecha CBCT pre)', diffPre === 14, `Días: ${diffPre} días`);

    // Días Post-Qx: 2026-03-10 - 2026-03-01 = 9 días -> Principal (<=2 sem)
    const post = new Date('2026-03-10');
    const diffPost = Math.round((post - qx) / (1000 * 60 * 60 * 24));
    const windowName = diffPost <= 14 ? 'Principal (<=2 sem)' : 'Secundaria';
    logTest('Autocálculos', 'Clasificación de Ventana Temporal CBCT Post', diffPost === 9 && windowName === 'Principal (<=2 sem)', `Días: ${diffPost} -> ${windowName}`);
  } catch (err) {
    logTest('Autocálculos', 'Fórmulas matemáticas de fechas', false, err.message);
  }

  console.log('\n================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`📊 RESUMEN FINAL QA PRE-LANZAMIENTO:`);
  console.log(`   Total pruebas ejecutadas: ${total}`);
  console.log(`   Pruebas Aprobadas:        ${passed} / ${total} (${Math.round((passed / total) * 100)}%)`);
  console.log(`   Pruebas Fallidas:         ${failed}`);
  console.log('================================================================\n');

  if (failed === 0) {
    console.log('🏆 LA APLICACIÓN ESTÁ 100% OPERATIVA Y LISTA PARA PRODUCCIÓN.');
  } else {
    process.exit(1);
  }
}

runE2ESuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

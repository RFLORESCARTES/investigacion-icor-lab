export interface PatientRecord {
  id_paciente: string;
  confirmado: boolean;
  centro: string;
  fecha_revision: string;
  revisor_ciego: string;
  fecha_cirugia: string;
  cirujano: string;
  fecha_nacimiento: string;
  edad: number | null;
  mayor_18: string;
  sexo: string;
  planificacion_digital_completa: string;
  archivo_planificacion_disponible: string;
  tipo_cirugia: string;
  segmentacion_lefort: string;
  tipo_osteotomia_maxilar: string;
  fecha_cbct_pre: string;
  dias_cbct_pre_qx: number | null;
  fecha_cbct_post: string;
  dias_qx_cbct_post: number | null;
  ventana_cbct_post: string;
  cbct_postoperatorio: string;
  mismo_equipo_cbct: string;
  archivo_cefalometrico_exportable: string;
  coordenadas_3d_exportables: string;
  deltas_calculables: string;
  calidad_cbct_pre: string;
  calidad_cbct_post: string;
  utilidad_rx_estudio: string;
  tipo_defecto_calidad: string;
  comentario_calidad: string;
  cirugia_previa_e01: string;
  sindrome_craneofacial_e02: string;
  dato_irrecuperable_e04: string;
  adaptacion_intraoperatoria_e05: string;
  estado: 'ELEGIBLE' | 'EXCLUIDO' | 'PENDIENTE' | '';
  motivo_codigo: string;
  observaciones: string;
  ultima_actualizacion: string;
}

export interface PatientSummary {
  id_paciente: string;
  confirmado: boolean;
  centro: string;
  cirujano: string;
  estado: string;
  fecha_cirugia: string;
  ultima_actualizacion: string;
}

export interface StatsResponse {
  total: number;
  elegibles: number;
  excluidos: number;
  pendientes: number;
  confirmados: number;
  googleSheetsConnected: boolean;
}

export const CENTROS_OPCIONES = ['ICOR', 'CLINICA UANDES'];
export const REVISORES_OPCIONES = ['Alfa', 'Beta', 'Gamma', 'Delta', 'Revisor 1', 'Revisor 2'];
export const CIRUJANOS_OPCIONES = ['L QUEVEDO', 'C QUEVEDO'];
export const SEXO_OPCIONES = ['Masculino', 'Femenino'];
export const SI_NO_OPCIONES = ['Sí', 'No'];
export const TIPO_CIRUGIA_OPCIONES = ['LE FORT 1', 'BIMAXILAR'];
export const TIPO_OSTEOTOMIA_OPCIONES = ['Clásico', 'Segmentada 2 piezas', 'Segmentada 3 piezas', 'Segmentada 4 piezas', 'No aplica', 'Otro'];
export const CALIDAD_CBCT_OPCIONES = ['OPTIMA', 'ACEPTABLE', 'DEFICIENTE'];
export const UTILIDAD_RX_OPCIONES = ['Buena', 'Aceptable', 'Deficiente', 'Sí', 'No'];
export const DEFECTOS_CALIDAD_OPCIONES = ['Sin observaciones', 'Movimiento', 'Artefacto metálico', 'FOV incompleto', 'Baja resolución', 'Otro'];
export const VENTANA_CBCT_OPCIONES = ['Principal (<=2 sem)', 'Secundaria (2-6 sem)', 'Tardía (>6 sem)', 'Fuera de rango'];
export const ESTADOS_OPCIONES = ['ELEGIBLE', 'EXCLUIDO', 'PENDIENTE'];

# Dx_calidad_fichas | Sistema de Auditoría y Control de Calidad Clínico

**Protocolo de Investigación:** `ICOR_BaseDatos_Screening`  
**Base de Datos Principal:** Google Sheets (`Base_Maestra` & `Log_Auditoria`)  
**Versión de Entrega:** 1.0.0 (Paquete de Prueba de Software Transparente)  

---

## 🎯 Propósito del Sistema

Aplicación web médica full-stack diseñada específicamente para el escrutinio, ingreso estandarizado, validación estricta y auditoría clínica de pacientes en protocolos maxilofaciales e imagenológicos (CBCT).

El sistema elimina el error humano en planillas de cálculo manuales mediante:
1. **Validación "Cero Casillas en Blanco":** Imposibilidad de enviar registros incompletos.
2. **Ayuda Visual de Progreso:** Los campos llenados se distinguen con un gris muy suave (`#f1f5f9`), mientras los pendientes permanecen en blanco puro (`#ffffff`).
3. **Autocálculos Clínicos Instantáneos:** Edad, mayoría de edad, $\Delta$ de días pre y postoperatorios y ventana temporal tomográfica calculados por fórmulas matemáticas en tiempo real.
4. **Protección de Datos Auditados ("Llave de Supervisor"):** Bloqueo automático en modo solo lectura para fichas confirmadas, requiriendo PIN maestro y justificación para cualquier modificación.
5. **Trazabilidad Inmutable (*Audit Trail*):** Historial permanente de qué cambió, quién lo hizo, fecha exacta y motivo tanto en la aplicación como en Google Sheets.
6. **Auto-Guardado Local Resiliente:** Respaldo continuo en el navegador ante cierres inesperados de sesión.

---

## 🚀 Puesta en Marcha Rápida (3 Pasos)

### 1. Instalar dependencias
```bash
cd Dx_calidad_fichas
npm install
```

### 2. Iniciar la Aplicación (Frontend + Backend)
```bash
npm run start
```
- **Frontend (Interfaz de Usuario):** [http://localhost:5173](http://localhost:5173)
- **Backend (API REST de Datos):** [http://localhost:3001](http://localhost:3001)

### 3. Ejecutar Batería de Pruebas E2E
```bash
npm run test:e2e
```

---

## 📂 Documentación Transparente para el Cliente (Sin Cajas Negras)

El paquete incluye 3 manuales detallados para máxima transparencia y autonomía:

1. 🏛️ **[ARQUITECTURA_TRANSPARENTE.md](./ARQUITECTURA_TRANSPARENTE.md):** Explicación exhaustiva de cómo funciona cada componente, cómo se comunican las capas, las fórmulas matemáticas de los cálculos y **cómo agregar o modificar campos en menos de 5 minutos**.
2. 📖 **[MANUAL_USUARIO_Y_AUDITORIA.md](./MANUAL_USUARIO_Y_AUDITORIA.md):** Guía de uso para revisores y supervisores clínicos con el flujo paso a paso de escrutinio, desbloqueo y consulta de historial.
3. ☁️ **[CONEXION_GOOGLE_SHEETS.md](./CONEXION_GOOGLE_SHEETS.md):** Guía paso a paso para vincular en 3 minutos la cuenta de servicio de Google Cloud a la hoja de Google Sheets en vivo.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- **Backend:** Node.js, Express, Google APIs v4 (Service Account JWT).
- **Almacenamiento:** Híbrido (Google Sheets en vivo + Almacenamiento JSON local de alta velocidad).
- **Seguridad:** Control de acceso por PIN, hashing de estado y aislamiento de fichas confirmadas.

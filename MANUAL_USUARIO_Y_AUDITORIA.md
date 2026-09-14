# Manual de Usuario y Guía de Auditoría Clínica

**Aplicación:** `Dx_calidad_fichas`  
**Destinatarios:** Revisores Clínicos, Investigadores Principales y Auditores Médicos.

---

## 🧭 1. Flujo de Ingreso y Auditoría de Pacientes

### **Paso 1: Selección o Creación de Ficha**
* **Buscar Paciente:** En el menú desplegable superior, escribe o selecciona el ID del paciente (ej: `PCO001`, `PCO002`). La ficha se cargará de inmediato con todos sus datos previos.
* **Nuevo Paciente:** Presiona el botón `+ Nuevo`. El sistema asignará automáticamente el siguiente identificador disponible (ej: `PCO151`) y preparará el formulario en blanco.

---

### **Paso 2: Navegación por Pestañas**
El formulario está dividido en 4 secciones compactas:
1. **1. Demografía:** Centro clínico, revisor asignado, cirujano, fecha de revisión, fecha quirúrgica, fecha de nacimiento, edad calculada y sexo.
2. **2. Plan Qx:** Planificación digital completa, disponibilidad de archivo 3D, tipo de cirugía, segmentación y osteotomía maxilar.
3. **3. CBCT & Calidad:** Fechas de tomografía pre y postoperatoria, deltas calculados de días, ventana temporal, exportabilidad 3D, calidad cualitativa y defectos de imagen.
4. **4. Criterios & Estado:** Criterios de exclusión E01 a E05, estado final de inclusión (`ELEGIBLE`, `EXCLUIDO`, `PENDIENTE`), motivo y observaciones.

---

### **Paso 3: Guía Visual de Llenado**
* **Campos con Fondo Gris Suave:** Indican que el campo ya fue tocado o completado.
* **Campos con Fondo Blanco Puro:** Indican que el campo aún está vacío y pendiente de ingreso.
* **Puntos Rojos (•):** Señalan los campos obligatorios pendientes de completar.

---

### **Paso 4: Confirmación y Guardado**
1. Revisa que todas las pestañas tengan su indicador de completitud verde (`✓`).
2. En la barra inferior, marca la casilla obligatoria:
   ☑️ **"He revisado todos los datos"**.
3. Presiona el botón **"Guardar Ficha"**. El registro quedará consolidado en la base de datos y bloqueado contra cambios accidentales.

---

## 🔒 2. Procedimiento de Desbloqueo Supervisado

Si necesitas modificar un paciente que ya fue auditado y confirmado:

1. Al abrir la ficha, verás el estado: `🔒 Ficha Auditada (Modo Solo Lectura)`.
2. Presiona el botón **`🔓 Desbloquear (Supervisor)`** en la barra superior.
3. Se abrirá la ventana de autorización donde debes ingresar:
   * **PIN de Supervisor:** `ICOR2026` *(o el configurado en tu archivo .env)*.
   * **Motivo Obligatorio:** Justificación clínica clara del por qué se realiza la corrección (mínimo 5 caracteres).
4. Presiona **"Autorizar y Desbloquear"**. Los campos se habilitarán para la edición durante la sesión.
5. Al volver a guardar, el sistema registrará automáticamente el diferencial de cambios en el historial inmutable.

---

## 📜 3. Consulta del Historial de Auditoría (*Audit Trail*)

Para revisar la trazabilidad histórica de cualquier paciente:

1. Selecciona el paciente en la barra superior.
2. Presiona el botón **`📜 Ver Historial`**.
3. Se desplegará una línea de tiempo detallando:
   * Fecha y hora exacta de cada modificación.
   * Nombre del revisor o supervisor que autorizó el cambio.
   * Motivo justificado registrado.
   * Comparativa exacta campo por campo (`Valor anterior` $\rightarrow$ `Valor nuevo`).

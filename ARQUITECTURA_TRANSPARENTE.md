# Arquitectura Técnica Transparente (Sin Cajas Negras)

**Proyecto:** `Dx_calidad_fichas`  
**Objetivo de Diseño:** Código limpio, tipado estricto en TypeScript, modular, altamente legible y preparado para modificaciones ágiles con mínimo consumo de recursos computacionales.

---

## 🏗️ 1. Estructura del Código Fuente

```
Dx_calidad_fichas/
├── server/
│   ├── index.js                  # Servidor API Express (Endpoints REST + Conector Google Sheets v4)
│   ├── initialData.json          # Copia seed inicial de los 150 pacientes de Google Sheets
│   ├── patients.json             # Base de datos local persistente de alta velocidad
│   ├── auditLog.json             # Registro inmutable de auditoría local (Audit Trail)
│   ├── seedGenerator.js          # Script generador de correlativos base
│   └── e2e_prelaunch_test.js     # Batería de pruebas automatizadas End-to-End
├── src/
│   ├── App.tsx                   # Coordinador principal de estado, pestañas y bloqueo
│   ├── main.tsx                  # Punto de entrada React
│   ├── index.css                 # Estilos globales y tokens visuales de Tailwind
│   ├── types/
│   │   └── schema.ts             # Definición única de tipos (39 columnas) y listas de opciones
│   ├── utils/
│   │   ├── calculations.ts       # Motor matemático de edad, días pre/post y ventanas CBCT
│   │   └── styleHelpers.ts       # Ayuda visual dinámica (gris = llenado, blanco = vacío)
│   ├── services/
│   │   └── api.ts                # Cliente HTTP para comunicación con el backend
│   └── components/
│       ├── HeaderBar.tsx              # Barra superior, KPIs, buscador y nuevo paciente
│       ├── SectionDemographics.tsx    # Pestaña 1: Datos demográficos y generales
│       ├── SectionSurgical.tsx        # Pestaña 2: Planificación quirúrgica y osteotomías
│       ├── SectionCBCT.tsx            # Pestaña 3: Tiempos tomográficos y control de calidad
│       ├── SectionExclusions.tsx      # Pestaña 4: Criterios E01-E05 y Estado de inclusión
│       ├── ValidationSummary.tsx      # Panel inferior de confirmación y botón Guardar
│       ├── SupervisorUnlockModal.tsx  # Modal de autorización y desbloqueo por PIN
│       └── AuditLogModal.tsx          # Modal de historial inmutable de cambios
├── .env.example                  # Plantilla de variables de entorno (credenciales Google)
├── package.json                  # Dependencias y scripts de ejecución
├── vite.config.ts                # Configuración de compilación Vite y Proxy API
└── tailwind.config.js            # Tokens de diseño y colores clínicos
```

---

## 🔄 2. Flujo de Datos y Trazabilidad

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  [Usuario interactúa] ──> [React State en App.tsx]          │
│                                  │                          │
│                                  ├──> [Auto-cálculos]       │
│                                  ├──> [localStorage Draft] │
│                                  └──> [Validación Estricta] │
└───────────────────────────────┬─────────────────────────────┘
                                │ HTTP POST /api/save
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│  [Express Server en port 3001]                              │
│   ├── 1. Valida payload y detecta diferencias con el previo │
│   ├── 2. Si era auditado: Genera entrada inmutable en Log   │
│   ├── 3. Guarda en patients.json y auditLog.json            │
│   └── 4. Sincroniza en segundo plano con Google Sheets      │
└───────────────────────────────┬─────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  Pestaña 'Base_Maestra'      │        │  Pestaña 'Log_Auditoria'     │
│  (39 columnas del paciente)  │        │  (Registro de modificaciones)│
└──────────────────────────────┘        └──────────────────────────────┘
```

---

## 📐 3. Motor de Autocálculos Clínicos (`src/utils/calculations.ts`)

Todos los cálculos están aislados en funciones puras sin dependencias externas:

1. **Edad:**
   $$\text{Edad} = \text{Año}_{\text{actual}} - \text{Año}_{\text{nacimiento}} - \mathbf{1}_{(\text{si aún no cumple años en el año en curso})}$$
2. **$\ge 18$ años:**
   $$\text{Mayoría} = \begin{cases} \text{"SI"} & \text{si Edad} \ge 18 \\ \text{"NO"} & \text{si Edad} < 18 \end{cases}$$
3. **Días CBCT Pre $\rightarrow$ Cirugía:**
   $$\Delta \text{Días}_{\text{pre}} = \frac{\text{Fecha}_{\text{cirugía}} - \text{Fecha}_{\text{CBCT pre}}}{1000 \times 60 \times 60 \times 24}$$
4. **Días Cirugía $\rightarrow$ CBCT Post:**
   $$\Delta \text{Días}_{\text{post}} = \frac{\text{Fecha}_{\text{CBCT post}} - \text{Fecha}_{\text{cirugía}}}{1000 \times 60 \times 60 \times 24}$$
5. **Ventana Temporal CBCT Postoperatoria:**
   $$\text{Ventana} = \begin{cases} \text{"Principal (<=2 sem)"} & \text{si } \Delta \text{Días}_{\text{post}} \le 14 \\ \text{"Secundaria (2-6 sem)"} & \text{si } 14 < \Delta \text{Días}_{\text{post}} \le 42 \\ \text{"Tardía (>6 sem)"} & \text{si } \Delta \text{Días}_{\text{post}} > 42 \end{cases}$$

---

## 🧩 4. Guía Rápida: Cómo Agregar o Modificar Campos en 2 Pasos

Si en el futuro necesitas agregar un nuevo campo (ejemplo: `alergia_latex`):

### **Paso 1: Declarar en `src/types/schema.ts`**
```typescript
export interface PatientRecord {
  // ... campos existentes ...
  alergia_latex: string; // Nuevo campo
}
```

### **Paso 2: Agregar el input en la sección correspondiente**
Por ejemplo en `src/components/SectionDemographics.tsx`:
```tsx
<div>
  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
    Alergia a Látex
  </label>
  <div className="grid grid-cols-2 gap-1.5">
    {['Sí', 'No'].map((opt) => (
      <button
        key={opt}
        type="button"
        onClick={() => onChange('alergia_latex', opt)}
        className={`py-1.5 text-xs rounded-lg border ${getButtonClass(data.alergia_latex === opt)}`}
      >
        {opt}
      </button>
    ))}
  </div>
</div>
```

¡Listo! El sistema automáticamente aplicará el guardado, la persistencia, el auto-guardado local y la sincronización con la base de datos sin requerir ninguna configuración extra.

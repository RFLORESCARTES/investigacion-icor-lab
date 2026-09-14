# Guía de Conexión en Vivo con Google Sheets API

Esta guía explica paso a paso cómo activar la sincronización directa en vivo con tu hoja de cálculo maestra en Google Sheets.

---

## 📋 Requisitos Previos
1. Acceso de edición a tu hoja de cálculo:
   `https://docs.google.com/spreadsheets/d/1xndhpqcFjHxWzCcz9xv2597ZV180HNekDfwY7Of87ak/edit`
2. Una cuenta de Google (Gmail institucional o personal).

---

## 🛠️ Paso a Paso (Configuración en 3 Minutos)

### **Paso 1: Crear la Cuenta de Servicio en Google Cloud**
1. Ingresa a la consola de [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto (ej: `ICOR-Audit-DB`) o usa uno existente.
3. En la barra de búsqueda superior, busca **Google Sheets API** y haz clic en **Habilitar**.
4. Ve al menú lateral **IAM y administración > Cuentas de servicio** y haz clic en **+ Crear cuenta de servicio**.
5. Asígnale un nombre (ej: `icor-sheets-writer`) y haz clic en **Crear y continuar**.

### **Paso 2: Generar la Clave de Seguridad (JSON)**
1. En el listado de Cuentas de servicio, haz clic sobre el correo que se acaba de crear (ej: `icor-sheets-writer@tu-proyecto.iam.gserviceaccount.com`).
2. Ve a la pestaña **Claves > Agregar clave > Crear clave nueva**.
3. Selecciona el formato **JSON** y haz clic en **Crear**. Se descargará un archivo `.json` a tu computador.

### **Paso 3: Compartir la Hoja de Google Sheets**
1. Abre tu [Hoja de Google Sheets](https://docs.google.com/spreadsheets/d/1xndhpqcFjHxWzCcz9xv2597ZV180HNekDfwY7Of87ak/edit).
2. Haz clic en el botón verde **Compartir** (esquina superior derecha).
3. Pega el correo de la cuenta de servicio (ej: `icor-sheets-writer@tu-proyecto.iam.gserviceaccount.com`).
4. asígnale el rol de **Editor** y desmarca "Notificar a los usuarios". Haz clic en **Compartir**.

### **Paso 4: Configurar el archivo `.env` en el Proyecto**
En la raíz de la carpeta `Dx_calidad_fichas/`, crea un archivo llamado `.env` y pega la información de tu clave JSON:

```env
PORT=3001
GOOGLE_SPREADSHEET_ID=1xndhpqcFjHxWzCcz9xv2597ZV180HNekDfwY7Of87ak
GOOGLE_SHEET_NAME=Base_Maestra
SUPERVISOR_PIN=ICOR2026

GOOGLE_SERVICE_ACCOUNT_EMAIL="icor-sheets-writer@tu-proyecto.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## 🟢 Verificación de Conexión

1. Inicia el servidor:
   ```bash
   npm run start
   ```
2. Al abrir la app en [http://localhost:5173](http://localhost:5173), verás en la cabecera el indicador **`🟢 Sheets Live`**.
3. Cada vez que guardes o actualices una ficha en la web, la fila correspondiente en Google Sheets se actualizará automáticamente en menos de un segundo.

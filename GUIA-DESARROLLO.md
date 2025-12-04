# 📘 Guía Completa: Cómo Modificar tu Proyecto Node + Express + MongoDB

---

## 🔄 ¿Por qué se necesita migrar datos?

**MongoDB es "schemaless"** - no valida ni modifica datos automáticamente. Cuando cambias tu código:

| Lo que cambias | ¿Qué pasa con datos existentes? | ¿Necesitas migrar? |
|----------------|--------------------------------|-------------------|
| Agregar campo nuevo | Documentos viejos NO lo tendrán | ⚠️ Opcional (si necesitas el campo en todos) |
| Eliminar campo del Schema | Datos viejos SIGUEN en MongoDB | ⚠️ Opcional (para limpiar) |
| Renombrar campo | Datos viejos tienen nombre viejo | ✅ **SÍ, obligatorio** |
| Cambiar tipo (String→Number) | Datos viejos mantienen tipo viejo | ✅ **SÍ, obligatorio** |
| Agregar `required: true` | Docs viejos sin el campo fallarán al actualizar | ✅ **SÍ, obligatorio** |
| Mover campo a subdocumento | Datos viejos están en ubicación vieja | ✅ **SÍ, obligatorio** |
| Agregar índice único | Puede fallar si hay duplicados | ⚠️ Verificar primero |

### Ejemplo visual:

```
ANTES (en MongoDB):                 DESPUÉS de cambiar Schema:
┌─────────────────────┐            ┌─────────────────────┐
│ { primerNombre: "Juan",          │ Schema espera:      │
│   segundoNombre: "Carlos" }      │   nombres: String   │
└─────────────────────┘            └─────────────────────┘
        ↓                                    ↓
   Documento viejo                    Schema nuevo
   NO cambia solo                     NO modifica DB
        ↓                                    ↓
┌─────────────────────────────────────────────────────────┐
│  ❌ PROBLEMA: El documento tiene primerNombre,          │
│     pero el código busca "nombres"                      │
│  ✅ SOLUCIÓN: Migrar datos                              │
└─────────────────────────────────────────────────────────┘
```

---

## 1️⃣ Agregar un nuevo campo a un modelo existente

**Ejemplo:** Agregar campo `telefono` al modelo Usuario

**Archivo:** `src/routes/models/usuarios.js`

```javascript
const UsuarioSchema = new Schema({
  nombreUsuario: { type: String, required: true, unique: true, index: true },
  // ... campos existentes ...
  telefono: { type: String },  // ← AGREGAR AQUÍ
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'usuarios' });
```

**Resultado:**
- ✅ Documentos nuevos tendrán el campo
- ⚠️ Documentos existentes NO tendrán el campo (a menos que migres)

---

## 2️⃣ Agregar un nuevo modelo/colección

**Paso 1:** Crear archivo del modelo en `src/routes/models/`

```javascript
// src/routes/models/notificaciones.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const NotificacionSchema = new Schema({
  usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  titulo: { type: String, required: true },
  mensaje: { type: String },
  leida: { type: Boolean, default: false },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'notificaciones' });

export default mongoose.model('Notificacion', NotificacionSchema);
```

**Paso 2:** Crear router en `src/routes/`

```javascript
// src/routes/notificaciones.js
import express from 'express';
import Notificacion from './models/notificaciones.js';

const router = express.Router();

// Crear
router.post('/notificaciones', async (req, res) => {
  try {
    const created = await Notificacion.create(req.body);
    res.status(201).json({ ok: true, notificacion: created });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Listar
router.get('/notificaciones', async (req, res) => {
  try {
    const list = await Notificacion.find().sort({ fechaCreacion: -1 });
    res.json({ ok: true, notificaciones: list });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por ID
router.get('/notificaciones/:id', async (req, res) => {
  try {
    const doc = await Notificacion.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, notificacion: doc });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Actualizar
router.put('/notificaciones/:id', async (req, res) => {
  try {
    const updated = await Notificacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, notificacion: updated });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Eliminar
router.delete('/notificaciones/:id', async (req, res) => {
  try {
    const deleted = await Notificacion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
```

**Paso 3:** Registrar en `index.js`

```javascript
import notificacionesRouter from './src/routes/notificaciones.js';
// ... otros imports ...

app.use('/api', notificacionesRouter);  // ← Agregar esta línea
```

---

## 3️⃣ Agregar un índice

**En el archivo del modelo:**

```javascript
// Índice simple
MiSchema.index({ campo: 1 });

// Índice compuesto
MiSchema.index({ campo1: 1, campo2: 1 });

// Índice único
MiSchema.index({ campo: 1 }, { unique: true });

// Índice único compuesto
MiSchema.index({ campo1: 1, campo2: 1 }, { unique: true });
```

⚠️ **NO uses `index: true` en el campo si ya tienes `Schema.index()` para evitar duplicados**

---

## 🛠️ Cómo hacer migraciones

### Paso 1: Crear script de migración

Crea un archivo `.js` temporal (puedes ponerlo en la raíz o en una carpeta `scripts/`):

```javascript
// migrar-ejemplo.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function migrar() {
  // 1. Conectar a MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Conectado a MongoDB');
  
  const db = mongoose.connection.db;
  const coleccion = db.collection('nombre_de_tu_coleccion');

  // 2. Tu lógica de migración aquí (ver ejemplos abajo)
  
  // 3. Desconectar
  await mongoose.disconnect();
  console.log('✅ Migración completada');
}

migrar().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
```

### Paso 2: Ejecutar

```powershell
node migrar-ejemplo.js
```

### Paso 3: Verificar y eliminar script

Una vez confirmado que funcionó, **elimina el script** (ya no lo necesitas).

---

## 📚 Ejemplos de Migraciones Comunes

### A) Agregar campo a documentos existentes

**Escenario:** Agregaste `telefono` al Schema y quieres que todos los usuarios tengan un valor default.

```javascript
const result = await coleccion.updateMany(
  { telefono: { $exists: false } },  // Filtro: docs sin el campo
  { $set: { telefono: '' } }         // Agregar con valor default
);
console.log(`Documentos actualizados: ${result.modifiedCount}`);
```

---

### B) Renombrar campo

**Escenario:** Cambiar `primerNombre` → `nombres`

```javascript
const result = await coleccion.updateMany(
  { primerNombre: { $exists: true } },  // Docs que tienen el campo viejo
  { $rename: { 'primerNombre': 'nombres' } }
);
console.log(`Renombrados: ${result.modifiedCount}`);
```

---

### C) Combinar campos

**Escenario:** Unir `primerNombre` + `segundoNombre` → `nombres`

```javascript
const cursor = coleccion.find({
  $or: [
    { primerNombre: { $exists: true } },
    { segundoNombre: { $exists: true } }
  ]
});

let count = 0;
while (await cursor.hasNext()) {
  const doc = await cursor.next();
  
  // Combinar campos
  const nombres = [doc.primerNombre, doc.segundoNombre]
    .filter(Boolean)  // Quitar nulls/undefined
    .join(' ');       // Unir con espacio
  
  // Actualizar documento
  await coleccion.updateOne(
    { _id: doc._id },
    { 
      $set: { nombres: nombres },
      $unset: { primerNombre: '', segundoNombre: '' }  // Eliminar campos viejos
    }
  );
  count++;
}
console.log(`Migrados: ${count}`);
```

---

### D) Mover campo a subdocumento

**Escenario:** Mover `tipoDocumento` y `numeroDocumento` dentro de `ciudadano: { }`

```javascript
const cursor = coleccion.find({
  ciudadano: { $exists: false },  // Docs sin subdocumento
  tipoDocumento: { $exists: true }  // Que tengan el campo en raíz
});

let count = 0;
while (await cursor.hasNext()) {
  const doc = await cursor.next();
  
  await coleccion.updateOne(
    { _id: doc._id },
    {
      $set: {
        ciudadano: {
          tipoDocumento: doc.tipoDocumento,
          numeroDocumento: doc.numeroDocumento,
          nombres: doc.nombres,
          apellidos: doc.apellidos
        }
      },
      $unset: {
        tipoDocumento: '',
        numeroDocumento: '',
        nombres: '',
        apellidos: ''
      }
    }
  );
  count++;
}
console.log(`Migrados: ${count}`);
```

---

### E) Cambiar tipo de dato

**Escenario:** Convertir `edad` de String a Number

```javascript
const cursor = coleccion.find({ 
  edad: { $type: 'string' }  // Solo docs donde edad es String
});

let count = 0;
while (await cursor.hasNext()) {
  const doc = await cursor.next();
  
  await coleccion.updateOne(
    { _id: doc._id },
    { $set: { edad: parseInt(doc.edad) || 0 } }
  );
  count++;
}
console.log(`Convertidos: ${count}`);
```

---

### F) Eliminar campo de documentos

**Escenario:** Quitar campo `campoObsoleto` que ya no usas

```javascript
const result = await coleccion.updateMany(
  { campoObsoleto: { $exists: true } },
  { $unset: { campoObsoleto: '' } }
);
console.log(`Limpiados: ${result.modifiedCount}`);
```

---

### G) Agregar campos baseSync a documentos viejos

**Escenario:** Documentos creados antes de tener `deleted` y `version`

```javascript
const colecciones = ['usuarios', 'eventos', 'caracterizaciones', 'seguimientos'];

for (const nombre of colecciones) {
  const col = db.collection(nombre);
  
  const result = await col.updateMany(
    { $or: [
      { deleted: { $exists: false } },
      { version: { $exists: false } }
    ]},
    { $set: { 
      deleted: false, 
      version: 1 
    }}
  );
  
  console.log(`${nombre}: ${result.modifiedCount} actualizados`);
}
```

---

## ⚠️ Precauciones antes de migrar

### 1. Hacer backup primero

```powershell
# Usando mongodump (si lo tienes instalado)
mongodump --uri="tu_connection_string" --out=./backup

# O exportar desde MongoDB Atlas (interfaz web)
```

### 2. Probar en desarrollo primero

Nunca migres directo en producción. Prueba con datos de prueba.

### 3. Modo "dry run" (ver qué cambiaría sin cambiar)

```javascript
// En vez de updateMany, primero cuenta:
const count = await coleccion.countDocuments({ 
  campoViejo: { $exists: true } 
});
console.log(`Se afectarían ${count} documentos`);
```

### 4. Migrar en lotes (para muchos datos)

```javascript
const BATCH_SIZE = 500;
let processed = 0;

while (true) {
  const docs = await coleccion.find({ /* filtro */ })
    .limit(BATCH_SIZE)
    .toArray();
  
  if (docs.length === 0) break;
  
  for (const doc of docs) {
    await coleccion.updateOne({ _id: doc._id }, { /* cambios */ });
  }
  
  processed += docs.length;
  console.log(`Procesados: ${processed}`);
}
```

---

## 4️⃣ Soft Delete (marcar como eliminado)

**Ya lo tienes configurado con `deleted: true`.** Usa así:

```javascript
// En vez de eliminar físicamente:
await Modelo.findByIdAndUpdate(id, { deleted: true });

// Para consultar solo activos:
await Modelo.find({ deleted: false });
```

---

## 📋 Checklist para cualquier cambio

| Paso | Acción |
|------|--------|
| 1 | Editar archivo(s) necesario(s) |
| 2 | Guardar cambios (Ctrl+S) |
| 3 | Nodemon reinicia automáticamente |
| 4 | Si hay datos existentes que migrar → crear script temporal |
| 5 | Probar con Postman/Thunder Client |
| 6 | Eliminar script de migración después de usarlo |

---

## 📋 Resumen: Flujo completo de cambios

```
┌─────────────────────────────────────────────────────────────┐
│  1. EDITAR CÓDIGO                                           │
│     └─ Modificar Schema en src/routes/models/xxx.js         │
│     └─ Actualizar Router si es necesario                    │
│     └─ Guardar (Ctrl+S) → Nodemon reinicia                  │
├─────────────────────────────────────────────────────────────┤
│  2. ¿HAY DATOS EXISTENTES QUE CAMBIAR?                      │
│     └─ NO → ¡Listo! Los nuevos docs usarán el nuevo Schema  │
│     └─ SÍ → Continuar al paso 3                             │
├─────────────────────────────────────────────────────────────┤
│  3. CREAR SCRIPT DE MIGRACIÓN                               │
│     └─ Archivo temporal: migrar-xxx.js                      │
│     └─ Conectar → Transformar datos → Desconectar           │
├─────────────────────────────────────────────────────────────┤
│  4. EJECUTAR MIGRACIÓN                                      │
│     └─ node migrar-xxx.js                                   │
│     └─ Verificar resultados                                 │
├─────────────────────────────────────────────────────────────┤
│  5. LIMPIAR                                                 │
│     └─ Eliminar script de migración (ya no es necesario)    │
├─────────────────────────────────────────────────────────────┤
│  6. PROBAR                                                  │
│     └─ Probar endpoints con Postman/Thunder Client          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Probar cambios

**Endpoints disponibles:**

```
GET    http://localhost:9000/api/[recurso]
GET    http://localhost:9000/api/[recurso]/:id
POST   http://localhost:9000/api/[recurso]
PUT    http://localhost:9000/api/[recurso]/:id
DELETE http://localhost:9000/api/[recurso]/:id
```

**Recursos actuales:**

| Endpoint | Descripción |
|----------|-------------|
| `/api/users` | Usuarios |
| `/api/caracterizaciones` | Caracterizaciones |
| `/api/eventos` | Eventos |
| `/api/seguimientos` | Seguimientos |
| `/api/entidades` | Entidades |
| `/api/auditoria` | Auditoría |
| `/api/configuracion` | Configuración |
| `/api/parametros` | Parámetros |
| `/api/evento-actual` | Evento actual |
| `/api/pendientes-sincronizacion` | Pendientes |

---

## 🚀 Comandos útiles

```powershell
# Iniciar servidor (con auto-reload)
npm start

# Iniciar servidor manualmente
node index.js

# Ver logs con trace de warnings
node --trace-warnings index.js
```

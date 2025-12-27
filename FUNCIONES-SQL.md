# Funciones SQL - Preparador de Trimestres

Este documento describe todas las funciones disponibles en la base de datos y cómo usarlas desde Astro.

## 📋 Índice de Funciones

1. [create_trimestre_with_checklist](#1-create_trimestre_with_checklist)
2. [close_trimestre](#2-close_trimestre)
3. [update_checklist_progress](#3-update_checklist_progress)
4. [mark_expected_document_fulfilled](#4-mark_expected_document_fulfilled)
5. [get_trimestre_summary](#5-get_trimestre_summary)
6. [reopen_trimestre](#6-reopen_trimestre)
7. [delete_trimestre_cascade](#7-delete_trimestre_cascade)

---

## 1. create_trimestre_with_checklist

Crea un nuevo trimestre con sus 17 items de checklist y documentos esperados basados en gastos recurrentes.

### Parámetros
- `p_user_id` (UUID) - ID del usuario
- `p_year` (INT) - Año del trimestre
- `p_quarter` (INT) - Número de trimestre (1-4)

### Retorna
JSON con información del trimestre creado:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "year": 2025,
  "quarter": 1,
  "status": "preparation",
  "checklist_progress": 0,
  "created_at": "timestamp",
  "closed_at": null,
  "checklist_items_count": 17,
  "expected_documents_count": 3
}
```

### Uso desde Astro

```javascript
// En un archivo .astro
---
import { supabase } from '../lib/supabase';

const user = Astro.locals.user; // Suponiendo que tienes auth

const { data: trimestre, error } = await supabase.rpc(
  'create_trimestre_with_checklist',
  {
    p_user_id: user.id,
    p_year: 2025,
    p_quarter: 1
  }
);

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Trimestre creado:', trimestre);
}
---
```

### Checklist Items Creados

El trimestre se crea automáticamente con estos 17 items:

**INGRESOS (3 items):**
1. Facturas emitidas
2. Tickets y albaranes
3. Justificantes de cobro

**GASTOS (5 items):**
4. Facturas de proveedores
5. Tickets de gastos menores
6. Recibos de suministros
7. Nóminas y Seguridad Social
8. Gastos de vehículo

**BANCO (3 items):**
9. Extractos bancarios completos
10. Justificantes de transferencias
11. Recibos domiciliados

**OTROS (3 items):**
12. Documentos de inversiones
13. Contratos nuevos
14. Subvenciones o ayudas

**CIERRE (3 items):**
15. Inventario de existencias
16. Amortizaciones
17. Notas y aclaraciones

---

## 2. close_trimestre

Cierra un trimestre, cambiando su estado a 'ready' y guardando los gastos recurrentes.

### Parámetros
- `p_trimestre_id` (UUID) - ID del trimestre a cerrar

### Retorna
JSON con información del trimestre cerrado:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "year": 2025,
  "quarter": 1,
  "status": "ready",
  "checklist_progress": 100,
  "created_at": "timestamp",
  "closed_at": "timestamp",
  "recurring_expenses_saved": 5
}
```

### Uso desde Astro

```javascript
---
import { supabase } from '../lib/supabase';

const trimestreId = '...'; // UUID del trimestre

const { data: result, error } = await supabase.rpc(
  'close_trimestre',
  {
    p_trimestre_id: trimestreId
  }
);

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Trimestre cerrado:', result);
  console.log('Gastos recurrentes guardados:', result.recurring_expenses_saved);
}
---
```

### Qué hace esta función

1. Verifica permisos del usuario
2. Busca todos los documentos marcados como `is_recurring = true`
3. Crea o actualiza registros en `recurring_expenses`
4. Cambia el status del trimestre a 'ready'
5. Guarda la fecha de cierre (`closed_at`)

---

## 3. update_checklist_progress

Recalcula el porcentaje de progreso del checklist de un trimestre.

**NOTA:** Esta función se ejecuta automáticamente mediante triggers cuando cambias el estado de items del checklist. Raramente necesitarás llamarla manualmente.

### Parámetros
- `p_trimestre_id` (UUID) - ID del trimestre

### Retorna
INT - Porcentaje de completitud (0-100)

### Uso desde Astro

```javascript
---
import { supabase } from '../lib/supabase';

const trimestreId = '...';

const { data: progress, error } = await supabase.rpc(
  'update_checklist_progress',
  {
    p_trimestre_id: trimestreId
  }
);

console.log('Progreso actualizado:', progress, '%');
---
```

### Lógica de Cálculo

- Items con status `'done'` → cuentan como completados
- Items con status `'doubtful'` → cuentan como completados
- Items con status `'pending'` → NO cuentan

Fórmula: `(done + doubtful) / total * 100`

---

## 4. mark_expected_document_fulfilled

Marca un documento esperado como cumplido, vinculándolo con un documento real subido.

### Parámetros
- `p_expected_doc_id` (UUID) - ID del documento esperado
- `p_document_id` (UUID) - ID del documento real que lo cumple

### Retorna
VOID (no retorna nada)

### Uso desde Astro

```javascript
---
import { supabase } from '../lib/supabase';

const expectedDocId = '...'; // ID del expected_document
const documentId = '...';    // ID del document subido

const { error } = await supabase.rpc(
  'mark_expected_document_fulfilled',
  {
    p_expected_doc_id: expectedDocId,
    p_document_id: documentId
  }
);

if (!error) {
  console.log('Documento esperado marcado como cumplido');
}
---
```

### Casos de Uso

Cuando el usuario sube un documento recurrente (ej: factura de luz):
1. El sistema detecta que coincide con un `expected_document`
2. Llamas a esta función para vincularlo
3. El `expected_document` pasa de status `'pending'` a `'fulfilled'`

---

## 5. get_trimestre_summary

Obtiene un resumen completo del trimestre con todas sus estadísticas.

### Parámetros
- `p_trimestre_id` (UUID) - ID del trimestre

### Retorna
JSON con resumen completo:
```json
{
  "trimestre": {
    "id": "uuid",
    "user_id": "uuid",
    "year": 2025,
    "quarter": 1,
    "status": "preparation",
    "checklist_progress": 65,
    "created_at": "timestamp",
    "closed_at": null
  },
  "checklist_stats": {
    "total": 17,
    "pending": 6,
    "done": 10,
    "doubtful": 1
  },
  "documents_stats": {
    "total": 12,
    "by_section": {
      "ingresos": 3,
      "gastos": 7,
      "banco": 2,
      "otros": 0
    }
  },
  "expected_documents_stats": {
    "total": 5,
    "pending": 2,
    "fulfilled": 2,
    "dismissed": 1
  },
  "notes_count": 2
}
```

### Uso desde Astro

```javascript
---
import { supabase } from '../lib/supabase';

const trimestreId = '...';

const { data: summary, error } = await supabase.rpc(
  'get_trimestre_summary',
  {
    p_trimestre_id: trimestreId
  }
);

// Acceder a los datos
const progress = summary.trimestre.checklist_progress;
const pendingItems = summary.checklist_stats.pending;
const totalDocs = summary.documents_stats.total;
---

<div>
  <h2>Resumen del Trimestre</h2>
  <p>Progreso: {progress}%</p>
  <p>Items pendientes: {pendingItems}</p>
  <p>Documentos subidos: {totalDocs}</p>
</div>
```

### Casos de Uso

- Dashboard principal: mostrar resumen de todos los trimestres
- Vista de detalle: mostrar estadísticas completas
- Página de resumen antes de cerrar

---

## 6. reopen_trimestre

Reabre un trimestre cerrado, cambiando su estado de 'ready' o 'sent' a 'preparation'.

### Parámetros
- `p_trimestre_id` (UUID) - ID del trimestre a reabrir

### Retorna
JSON con información del trimestre reabierto

### Uso desde Astro

```javascript
---
import { supabase } from '../lib/supabase';

const trimestreId = '...';

const { data: trimestre, error } = await supabase.rpc(
  'reopen_trimestre',
  {
    p_trimestre_id: trimestreId
  }
);

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Trimestre reabierto:', trimestre);
  console.log('Nuevo status:', trimestre.status); // 'preparation'
}
---
```

### Qué hace esta función

1. Verifica permisos del usuario
2. Cambia `status` a `'preparation'`
3. Limpia `closed_at` (lo pone en NULL)
4. Retorna el trimestre actualizado

---

## 7. delete_trimestre_cascade

Elimina un trimestre y todos sus registros relacionados (checklist, documentos, notas, etc.).

### Parámetros
- `p_trimestre_id` (UUID) - ID del trimestre a eliminar

### Retorna
JSON con estadísticas de eliminación:
```json
{
  "success": true,
  "trimestre_id": "uuid",
  "deleted_counts": {
    "checklist_items": 17,
    "documents": 12,
    "expected_documents": 5,
    "notes": 2
  }
}
```

### Uso desde Astro

```javascript
---
import { supabase } from '../lib/supabase';

const trimestreId = '...';

const { data: result, error } = await supabase.rpc(
  'delete_trimestre_cascade',
  {
    p_trimestre_id: trimestreId
  }
);

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Trimestre eliminado:', result);
  console.log('Items eliminados:', result.deleted_counts.checklist_items);
  console.log('Documentos eliminados:', result.deleted_counts.documents);
}
---
```

### Advertencia

⚠️ Esta operación es **irreversible**. Elimina:
- El trimestre
- Todos los checklist items
- Todos los documentos relacionados
- Todos los expected documents
- Todas las notas

Los archivos en Storage NO se eliminan automáticamente. Debes eliminarlos por separado.

---

## 🔄 Triggers Automáticos

### update_checklist_progress (automático)

Se ejecuta automáticamente cuando:
- Se crea un nuevo checklist item (INSERT)
- Se actualiza el status de un item (UPDATE)
- Se elimina un checklist item (DELETE)

No necesitas llamar a `update_checklist_progress()` manualmente en estos casos.

---

## 💡 Ejemplos de Flujo Completo

### Crear y cerrar un trimestre

```javascript
---
import { supabase } from '../lib/supabase';

const user = Astro.locals.user;

// 1. Crear trimestre
const { data: trimestre } = await supabase.rpc(
  'create_trimestre_with_checklist',
  {
    p_user_id: user.id,
    p_year: 2025,
    p_quarter: 1
  }
);

const trimestreId = trimestre.id;

// 2. Usuario trabaja en el trimestre (sube documentos, marca checklist, etc.)
// ... (código de tu app)

// 3. Obtener resumen antes de cerrar
const { data: summary } = await supabase.rpc(
  'get_trimestre_summary',
  { p_trimestre_id: trimestreId }
);

// 4. Cerrar trimestre si está completo
if (summary.checklist_stats.pending === 0) {
  const { data: closed } = await supabase.rpc(
    'close_trimestre',
    { p_trimestre_id: trimestreId }
  );

  console.log('Trimestre cerrado con', closed.recurring_expenses_saved, 'gastos recurrentes');
}
---
```

---

## 📚 Archivos Relacionados

- **supabase-schema.sql** - Schema completo con todas las funciones
- **supabase-storage-policies.sql** - Políticas de Storage
- **POLITICAS-RLS.md** - Documentación de RLS

---

## 🚀 Orden de Ejecución en Supabase

1. Ejecutar `supabase-schema.sql` en SQL Editor
2. Crear bucket 'documents' desde Dashboard (Private, RLS enabled)
3. Ejecutar `supabase-storage-policies.sql` en SQL Editor

Una vez hecho esto, todas las funciones estarán disponibles para usar desde tu app Astro.

# Políticas RLS (Row Level Security) - Preparador de Trimestres

## Resumen

Todas las tablas tienen RLS habilitado. Principio: **Un usuario solo puede ver y modificar sus propios datos**.

## 📋 Políticas por Tabla

### 1. **profiles**
- **Relación**: `id = auth.uid()` (el ID del perfil ES el ID del usuario)
- **SELECT**: ✅ Puede ver su propio perfil
- **INSERT**: ❌ No permitido (se crea automáticamente con trigger)
- **UPDATE**: ✅ Puede actualizar su propio perfil
- **DELETE**: ❌ No permitido (seguridad)

```sql
-- SELECT
USING (auth.uid() = id)

-- UPDATE
USING (auth.uid() = id)
```

---

### 2. **trimestres**
- **Relación**: `user_id = auth.uid()` (directo)
- **SELECT**: ✅ Ve solo sus trimestres
- **INSERT**: ✅ Puede crear trimestres para sí mismo
- **UPDATE**: ✅ Puede actualizar sus trimestres
- **DELETE**: ✅ Puede eliminar sus trimestres

```sql
-- SELECT
USING (auth.uid() = user_id)

-- INSERT
WITH CHECK (auth.uid() = user_id)

-- UPDATE
USING (auth.uid() = user_id)

-- DELETE
USING (auth.uid() = user_id)
```

---

### 3. **checklist_items**
- **Relación**: A través de `trimestre_id → trimestres.user_id`
- **SELECT**: ✅ Ve checklist de sus trimestres
- **INSERT**: ✅ Puede crear items en sus trimestres
- **UPDATE**: ✅ Puede actualizar items de sus trimestres
- **DELETE**: ✅ Puede eliminar items de sus trimestres

```sql
-- Validación común: verificar que el trimestre pertenece al usuario
EXISTS (
  SELECT 1 FROM trimestres
  WHERE trimestres.id = checklist_items.trimestre_id
  AND trimestres.user_id = auth.uid()
)
```

---

### 4. **documents**
- **Relación**: `user_id = auth.uid()` (directo)
- **SELECT**: ✅ Ve solo sus documentos
- **INSERT**: ✅ Puede subir documentos
- **UPDATE**: ✅ Puede actualizar sus documentos
- **DELETE**: ✅ Puede eliminar sus documentos

```sql
-- SELECT
USING (auth.uid() = user_id)

-- INSERT
WITH CHECK (auth.uid() = user_id)

-- UPDATE
USING (auth.uid() = user_id)

-- DELETE
USING (auth.uid() = user_id)
```

---

### 5. **recurring_expenses**
- **Relación**: `user_id = auth.uid()` (directo)
- **SELECT**: ✅ Ve solo sus gastos recurrentes
- **INSERT**: ✅ Puede crear gastos recurrentes
- **UPDATE**: ✅ Puede actualizar sus gastos recurrentes
- **DELETE**: ✅ Puede eliminar sus gastos recurrentes

```sql
-- SELECT
USING (auth.uid() = user_id)

-- INSERT
WITH CHECK (auth.uid() = user_id)

-- UPDATE
USING (auth.uid() = user_id)

-- DELETE
USING (auth.uid() = user_id)
```

---

### 6. **expected_documents**
- **Relación**: A través de `trimestre_id → trimestres.user_id`
- **SELECT**: ✅ Ve documentos esperados de sus trimestres
- **INSERT**: ✅ Puede crear expectativas en sus trimestres
- **UPDATE**: ✅ Puede actualizar expectativas de sus trimestres
- **DELETE**: ✅ Puede eliminar expectativas de sus trimestres

```sql
-- Validación común: verificar que el trimestre pertenece al usuario
EXISTS (
  SELECT 1 FROM trimestres
  WHERE trimestres.id = expected_documents.trimestre_id
  AND trimestres.user_id = auth.uid()
)
```

---

### 7. **notes**
- **Relación**: A través de `trimestre_id → trimestres.user_id`
- **SELECT**: ✅ Ve notas de sus trimestres
- **INSERT**: ✅ Puede crear notas en sus trimestres
- **UPDATE**: ✅ Puede actualizar sus notas
- **DELETE**: ✅ Puede eliminar sus notas

```sql
-- Validación común: verificar que el trimestre pertenece al usuario
EXISTS (
  SELECT 1 FROM trimestres
  WHERE trimestres.id = notes.trimestre_id
  AND trimestres.user_id = auth.uid()
)
```

---

## 🗂️ Storage Policies (Bucket: documents)

### Estructura de carpetas
```
documents/
  {user_id}/
    {trimestre_id}/
      archivo1.pdf
      archivo2.pdf
```

### Políticas

#### SELECT (Lectura)
```sql
bucket_id = 'documents'
AND (storage.foldername(name))[1] = auth.uid()::text
```

#### INSERT (Subida)
```sql
bucket_id = 'documents'
AND (storage.foldername(name))[1] = auth.uid()::text
```

#### UPDATE (Actualización)
```sql
bucket_id = 'documents'
AND (storage.foldername(name))[1] = auth.uid()::text
```

#### DELETE (Eliminación)
```sql
bucket_id = 'documents'
AND (storage.foldername(name))[1] = auth.uid()::text
```

---

## 🔐 Resumen de Seguridad

### Nivel de Aislamiento
- ✅ **Perfecto**: Cada usuario está completamente aislado
- ✅ **Sin fugas**: No hay forma de acceder a datos de otros usuarios
- ✅ **Cascada**: Al eliminar un usuario, se eliminan todos sus datos (CASCADE)

### Validación de Permisos
1. **Directa**: `user_id = auth.uid()`
   - profiles
   - trimestres
   - documents
   - recurring_expenses

2. **Indirecta (FK)**: A través de `trimestres.user_id`
   - checklist_items
   - expected_documents
   - notes

3. **Storage**: A través de carpeta `{user_id}/`
   - Todos los archivos en el bucket 'documents'

---

## 📝 Triggers Automáticos

### 1. Creación de Perfil
Cuando se registra un usuario en `auth.users`, automáticamente se crea su registro en `profiles`.

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 2. Actualización de Progreso
Cuando se modifica el estado de un checklist item, automáticamente se recalcula el porcentaje de completitud del trimestre.

```sql
CREATE TRIGGER update_progress_on_update
  AFTER UPDATE OF status ON checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_checklist_progress();
```

---

## 🚀 Implementación

### Orden de ejecución:

1. **Ejecutar schema principal**:
   ```bash
   # En Supabase SQL Editor
   supabase-schema.sql
   ```

2. **Crear bucket 'documents'**:
   - Ir a Storage en Supabase Dashboard
   - Crear bucket 'documents'
   - Marcar como **Private**
   - Habilitar RLS

3. **Ejecutar políticas de Storage**:
   ```bash
   # En Supabase SQL Editor
   supabase-storage-policies.sql
   ```

---

## ✅ Testing de Políticas

Para verificar que las políticas funcionan correctamente:

```javascript
// 1. Crear dos usuarios de prueba (user1, user2)

// 2. Como user1, crear un trimestre
const { data: trimestre1 } = await supabase
  .from('trimestres')
  .insert({ year: 2025, quarter: 1 })
  .select()

// 3. Como user2, intentar ver el trimestre de user1
const { data } = await supabase
  .from('trimestres')
  .select()

// ✅ Resultado esperado: solo ve sus propios trimestres, NO los de user1

// 4. Como user2, intentar actualizar trimestre de user1
const { error } = await supabase
  .from('trimestres')
  .update({ status: 'ready' })
  .eq('id', trimestre1.id)

// ✅ Resultado esperado: error o no afecta ninguna fila
```

---

## 📚 Archivos SQL

1. **supabase-schema.sql** - Schema completo con RLS para tablas
2. **supabase-storage-policies.sql** - Políticas RLS para Storage

Ambos archivos están listos para ejecutarse en el SQL Editor de Supabase.

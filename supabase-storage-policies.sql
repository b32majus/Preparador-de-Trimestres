-- ============================================
-- POLÍTICAS DE STORAGE PARA SUPABASE
-- Bucket: documents
-- ============================================

-- Crear el bucket 'documents' si no existe
-- NOTA: Esto debe hacerse desde el dashboard de Supabase
-- o usando la función de storage, no desde SQL directamente

-- Sin embargo, aquí están las políticas RLS para el bucket:

-- ============================================
-- ELIMINAR POLÍTICAS EXISTENTES
-- Para permitir recreación sin errores
-- ============================================

DROP POLICY IF EXISTS "Los usuarios pueden leer sus propios documentos" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden subir a su carpeta" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus archivos" ON storage.objects;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus archivos" ON storage.objects;

-- ============================================
-- POLÍTICA 1: SELECT (Lectura de archivos)
-- Los usuarios solo pueden leer archivos de su carpeta
-- ============================================

CREATE POLICY "Los usuarios pueden leer sus propios documentos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- POLÍTICA 2: INSERT (Subida de archivos)
-- Los usuarios solo pueden subir a su carpeta
-- ============================================

CREATE POLICY "Los usuarios pueden subir a su carpeta"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- POLÍTICA 3: UPDATE (Actualización de metadatos)
-- Los usuarios solo pueden actualizar sus archivos
-- ============================================

CREATE POLICY "Los usuarios pueden actualizar sus archivos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- POLÍTICA 4: DELETE (Eliminación de archivos)
-- Los usuarios solo pueden eliminar sus archivos
-- ============================================

CREATE POLICY "Los usuarios pueden eliminar sus archivos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- INSTRUCCIONES DE CONFIGURACIÓN
-- ============================================

-- 1. Crear el bucket 'documents' desde el Dashboard de Supabase:
--    - Ir a Storage
--    - Crear nuevo bucket llamado 'documents'
--    - Marcar como 'Private' (no público)
--    - Habilitar RLS

-- 2. Ejecutar este SQL en el SQL Editor

-- 3. Estructura de carpetas en Storage:
--    documents/
--      {user_id}/
--        {trimestre_id}/
--          {filename}
--
--    Ejemplo:
--    documents/
--      550e8400-e29b-41d4-a716-446655440000/
--        660e8400-e29b-41d4-a716-446655440001/
--          factura-luz-enero.pdf
--          recibo-agua-febrero.pdf

-- ============================================
-- FUNCIONES HELPER PARA STORAGE
-- ============================================

-- Función para obtener la URL pública firmada de un documento
CREATE OR REPLACE FUNCTION get_document_signed_url(file_path TEXT, expires_in INT DEFAULT 3600)
RETURNS TEXT AS $$
DECLARE
  signed_url TEXT;
BEGIN
  -- Verificar que el usuario tiene acceso al archivo
  IF NOT EXISTS (
    SELECT 1 FROM documents
    WHERE documents.file_path = get_document_signed_url.file_path
    AND documents.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'No tienes permiso para acceder a este archivo';
  END IF;

  -- Esta función debe ser llamada desde el cliente con supabase.storage
  -- Este es solo un ejemplo de validación
  RETURN file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. Las rutas de archivo deben seguir el formato:
--    {user_id}/{trimestre_id}/{filename}

-- 2. Al subir archivos desde el cliente, usar:
--    const { data, error } = await supabase.storage
--      .from('documents')
--      .upload(`${userId}/${trimestreId}/${filename}`, file)

-- 3. Para obtener URLs firmadas:
--    const { data } = await supabase.storage
--      .from('documents')
--      .createSignedUrl(`${userId}/${trimestreId}/${filename}`, 3600)

-- 4. Para listar archivos de un trimestre:
--    const { data, error } = await supabase.storage
--      .from('documents')
--      .list(`${userId}/${trimestreId}`)

-- 5. Para eliminar archivos:
--    const { data, error } = await supabase.storage
--      .from('documents')
--      .remove([`${userId}/${trimestreId}/${filename}`])

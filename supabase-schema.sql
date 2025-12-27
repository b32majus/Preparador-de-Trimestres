-- ============================================
-- SCHEMA SQL PARA PREPARADOR DE TRIMESTRES
-- Base de datos PostgreSQL en Supabase
-- ============================================

-- Habilitar extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: profiles
-- Perfiles de usuario vinculados a auth.users
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índice para búsqueda por email
CREATE INDEX idx_profiles_email ON profiles(email);

COMMENT ON TABLE profiles IS 'Perfiles de usuario extendidos';
COMMENT ON COLUMN profiles.id IS 'UUID del usuario, referencia a auth.users';
COMMENT ON COLUMN profiles.email IS 'Email del usuario';

-- ============================================
-- TABLA: trimestres
-- Registro de trimestres a preparar
-- ============================================

CREATE TABLE trimestres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  year INT NOT NULL,
  quarter INT NOT NULL CHECK (quarter >= 1 AND quarter <= 4),
  status TEXT NOT NULL DEFAULT 'preparation' CHECK (status IN ('preparation', 'ready', 'sent')),
  checklist_progress INT NOT NULL DEFAULT 0 CHECK (checklist_progress >= 0 AND checklist_progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, year, quarter)
);

-- Índices para optimizar consultas
CREATE INDEX idx_trimestres_user_id ON trimestres(user_id);
CREATE INDEX idx_trimestres_status ON trimestres(status);
CREATE INDEX idx_trimestres_year_quarter ON trimestres(year, quarter);

COMMENT ON TABLE trimestres IS 'Trimestres fiscales a preparar';
COMMENT ON COLUMN trimestres.year IS 'Año del trimestre';
COMMENT ON COLUMN trimestres.quarter IS 'Número de trimestre (1-4)';
COMMENT ON COLUMN trimestres.status IS 'Estado: preparation (preparando), ready (listo), sent (enviado)';
COMMENT ON COLUMN trimestres.checklist_progress IS 'Porcentaje de completitud del checklist (0-100)';
COMMENT ON COLUMN trimestres.closed_at IS 'Fecha de cierre del trimestre';

-- ============================================
-- TABLA: checklist_items
-- Items del checklist para cada trimestre
-- ============================================

CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trimestre_id UUID NOT NULL REFERENCES trimestres(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('ingresos', 'gastos', 'banco', 'otros', 'cierre')),
  item_number INT NOT NULL CHECK (item_number >= 1 AND item_number <= 17),
  label TEXT NOT NULL,
  help_text TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'doubtful')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para consultas frecuentes
CREATE INDEX idx_checklist_items_trimestre_id ON checklist_items(trimestre_id);
CREATE INDEX idx_checklist_items_section ON checklist_items(section);
CREATE INDEX idx_checklist_items_status ON checklist_items(status);

COMMENT ON TABLE checklist_items IS 'Items del checklist de tareas para cada trimestre';
COMMENT ON COLUMN checklist_items.section IS 'Sección: ingresos, gastos, banco, otros, cierre';
COMMENT ON COLUMN checklist_items.item_number IS 'Número de item dentro de la sección (1-17)';
COMMENT ON COLUMN checklist_items.status IS 'Estado: pending (pendiente), done (completado), doubtful (dudoso)';

-- ============================================
-- TABLA: documents
-- Documentos subidos por el usuario
-- ============================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trimestre_id UUID NOT NULL REFERENCES trimestres(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('ingresos', 'gastos', 'banco', 'otros')),
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT NOT NULL CHECK (file_size > 0),
  mime_type TEXT NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  concept_label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para consultas frecuentes
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_trimestre_id ON documents(trimestre_id);
CREATE INDEX idx_documents_section ON documents(section);
CREATE INDEX idx_documents_is_recurring ON documents(is_recurring);
CREATE INDEX idx_documents_concept_label ON documents(concept_label) WHERE concept_label IS NOT NULL;

COMMENT ON TABLE documents IS 'Documentos subidos para cada trimestre';
COMMENT ON COLUMN documents.section IS 'Sección a la que pertenece: ingresos, gastos, banco, otros';
COMMENT ON COLUMN documents.original_name IS 'Nombre original del archivo';
COMMENT ON COLUMN documents.file_path IS 'Ruta del archivo en Supabase Storage';
COMMENT ON COLUMN documents.file_size IS 'Tamaño del archivo en bytes';
COMMENT ON COLUMN documents.mime_type IS 'Tipo MIME del archivo';
COMMENT ON COLUMN documents.is_recurring IS 'Indica si es un gasto recurrente';
COMMENT ON COLUMN documents.concept_label IS 'Etiqueta del concepto para gastos recurrentes';

-- ============================================
-- TABLA: recurring_expenses
-- Gastos recurrentes identificados
-- ============================================

CREATE TABLE recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  concept_label TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'gastos' CHECK (section IN ('ingresos', 'gastos', 'banco', 'otros')),
  last_seen_quarter INT NOT NULL CHECK (last_seen_quarter >= 1 AND last_seen_quarter <= 4),
  last_seen_year INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para consultas frecuentes
CREATE INDEX idx_recurring_expenses_user_id ON recurring_expenses(user_id);
CREATE INDEX idx_recurring_expenses_concept_label ON recurring_expenses(concept_label);
CREATE INDEX idx_recurring_expenses_last_seen ON recurring_expenses(last_seen_year, last_seen_quarter);

COMMENT ON TABLE recurring_expenses IS 'Gastos recurrentes del usuario';
COMMENT ON COLUMN recurring_expenses.concept_label IS 'Etiqueta del concepto (ej: "Luz", "Agua", "Alquiler")';
COMMENT ON COLUMN recurring_expenses.section IS 'Sección a la que pertenece normalmente';
COMMENT ON COLUMN recurring_expenses.last_seen_quarter IS 'Último trimestre en que se vio este gasto';
COMMENT ON COLUMN recurring_expenses.last_seen_year IS 'Último año en que se vio este gasto';

-- ============================================
-- TABLA: expected_documents
-- Documentos esperados basados en recurrentes
-- ============================================

CREATE TABLE expected_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trimestre_id UUID NOT NULL REFERENCES trimestres(id) ON DELETE CASCADE,
  recurring_expense_id UUID NOT NULL REFERENCES recurring_expenses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'dismissed')),
  fulfilled_by UUID REFERENCES documents(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para consultas frecuentes
CREATE INDEX idx_expected_documents_trimestre_id ON expected_documents(trimestre_id);
CREATE INDEX idx_expected_documents_recurring_expense_id ON expected_documents(recurring_expense_id);
CREATE INDEX idx_expected_documents_status ON expected_documents(status);

COMMENT ON TABLE expected_documents IS 'Documentos esperados en cada trimestre basados en gastos recurrentes';
COMMENT ON COLUMN expected_documents.status IS 'Estado: pending (pendiente), fulfilled (cumplido), dismissed (descartado)';
COMMENT ON COLUMN expected_documents.fulfilled_by IS 'Documento que cumple con esta expectativa';

-- ============================================
-- TABLA: notes
-- Notas del usuario sobre trimestres
-- ============================================

CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trimestre_id UUID NOT NULL REFERENCES trimestres(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  for_advisor BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para consultas frecuentes
CREATE INDEX idx_notes_trimestre_id ON notes(trimestre_id);
CREATE INDEX idx_notes_for_advisor ON notes(for_advisor);

COMMENT ON TABLE notes IS 'Notas del usuario sobre el trimestre';
COMMENT ON COLUMN notes.content IS 'Contenido de la nota';
COMMENT ON COLUMN notes.for_advisor IS 'Indica si es una nota destinada al asesor';

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- Actualización automática de timestamps
-- ============================================

-- Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar triggers existentes para permitir recreación
DROP TRIGGER IF EXISTS update_checklist_items_updated_at ON checklist_items;
DROP TRIGGER IF EXISTS update_recurring_expenses_updated_at ON recurring_expenses;

-- Trigger para checklist_items
CREATE TRIGGER update_checklist_items_updated_at
  BEFORE UPDATE ON checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para recurring_expenses
CREATE TRIGGER update_recurring_expenses_updated_at
  BEFORE UPDATE ON recurring_expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Políticas de seguridad a nivel de fila
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trimestres ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para trimestres
CREATE POLICY "Los usuarios pueden ver sus propios trimestres"
  ON trimestres FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios trimestres"
  ON trimestres FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios trimestres"
  ON trimestres FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios trimestres"
  ON trimestres FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para checklist_items
CREATE POLICY "Los usuarios pueden ver checklist de sus trimestres"
  ON checklist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = checklist_items.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden crear checklist en sus trimestres"
  ON checklist_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = checklist_items.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden actualizar checklist de sus trimestres"
  ON checklist_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = checklist_items.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden eliminar checklist de sus trimestres"
  ON checklist_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = checklist_items.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

-- Políticas para documents
CREATE POLICY "Los usuarios pueden ver sus propios documentos"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios documentos"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios documentos"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios documentos"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para recurring_expenses
CREATE POLICY "Los usuarios pueden ver sus gastos recurrentes"
  ON recurring_expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus gastos recurrentes"
  ON recurring_expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus gastos recurrentes"
  ON recurring_expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus gastos recurrentes"
  ON recurring_expenses FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para expected_documents
CREATE POLICY "Los usuarios pueden ver documentos esperados de sus trimestres"
  ON expected_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = expected_documents.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden crear documentos esperados en sus trimestres"
  ON expected_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = expected_documents.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden actualizar documentos esperados de sus trimestres"
  ON expected_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = expected_documents.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden eliminar documentos esperados de sus trimestres"
  ON expected_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = expected_documents.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

-- Políticas para notes
CREATE POLICY "Los usuarios pueden ver notas de sus trimestres"
  ON notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = notes.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden crear notas en sus trimestres"
  ON notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = notes.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden actualizar notas de sus trimestres"
  ON notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = notes.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden eliminar notas de sus trimestres"
  ON notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trimestres
      WHERE trimestres.id = notes.trimestre_id
      AND trimestres.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCIÓN HELPER: Crear perfil automático
-- Trigger para crear perfil cuando se registra usuario
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
-- Eliminar si existe para permitir recreación
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCIONES DE NEGOCIO
-- ============================================

-- ============================================
-- FUNCIÓN: create_trimestre_with_checklist
-- Crea trimestre con checklist y documentos esperados
-- ============================================

CREATE OR REPLACE FUNCTION create_trimestre_with_checklist(
  p_user_id UUID,
  p_year INT,
  p_quarter INT
)
RETURNS JSON AS $$
DECLARE
  v_trimestre_id UUID;
  v_trimestre JSON;
  v_recurring_expense RECORD;
BEGIN
  -- Validar que el usuario existe
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  -- Validar quarter
  IF p_quarter < 1 OR p_quarter > 4 THEN
    RAISE EXCEPTION 'El trimestre debe estar entre 1 y 4';
  END IF;

  -- Crear el trimestre
  INSERT INTO trimestres (user_id, year, quarter, status, checklist_progress)
  VALUES (p_user_id, p_year, p_quarter, 'preparation', 0)
  RETURNING id INTO v_trimestre_id;

  -- CREAR CHECKLIST ITEMS (17 items)

  -- SECCIÓN: INGRESOS
  INSERT INTO checklist_items (trimestre_id, section, item_number, label, help_text, status)
  VALUES
    (v_trimestre_id, 'ingresos', 1, 'Facturas emitidas', 'Incluye todas las facturas de servicios o productos que hayas emitido en el trimestre', 'pending'),
    (v_trimestre_id, 'ingresos', 2, 'Tickets y albaranes', 'Documentos de venta sin factura formal (si aplica)', 'pending'),
    (v_trimestre_id, 'ingresos', 3, 'Justificantes de cobro', 'Comprobantes de transferencias o pagos recibidos', 'pending');

  -- SECCIÓN: GASTOS
  INSERT INTO checklist_items (trimestre_id, section, item_number, label, help_text, status)
  VALUES
    (v_trimestre_id, 'gastos', 4, 'Facturas de proveedores', 'Todas las facturas de compras o servicios contratados', 'pending'),
    (v_trimestre_id, 'gastos', 5, 'Tickets de gastos menores', 'Compras pequeñas (material oficina, dietas, etc.)', 'pending'),
    (v_trimestre_id, 'gastos', 6, 'Recibos de suministros', 'Luz, agua, internet, teléfono, alquiler, etc.', 'pending'),
    (v_trimestre_id, 'gastos', 7, 'Nóminas y Seguridad Social', 'Si tienes empleados: nóminas, seguros sociales, retenciones', 'pending'),
    (v_trimestre_id, 'gastos', 8, 'Gastos de vehículo', 'Combustible, mantenimiento, seguros (si aplica)', 'pending');

  -- SECCIÓN: BANCO
  INSERT INTO checklist_items (trimestre_id, section, item_number, label, help_text, status)
  VALUES
    (v_trimestre_id, 'banco', 9, 'Extractos bancarios completos', 'Movimientos del trimestre de todas las cuentas', 'pending'),
    (v_trimestre_id, 'banco', 10, 'Justificantes de transferencias', 'Para movimientos importantes o inusuales', 'pending'),
    (v_trimestre_id, 'banco', 11, 'Recibos domiciliados', 'Seguros, préstamos, leasing, renting', 'pending');

  -- SECCIÓN: OTROS
  INSERT INTO checklist_items (trimestre_id, section, item_number, label, help_text, status)
  VALUES
    (v_trimestre_id, 'otros', 12, 'Documentos de inversiones', 'Compra de activos fijos, equipos, maquinaria', 'pending'),
    (v_trimestre_id, 'otros', 13, 'Contratos nuevos', 'Contratos firmados en el trimestre (alquiler, colaboraciones, etc.)', 'pending'),
    (v_trimestre_id, 'otros', 14, 'Subvenciones o ayudas', 'Justificantes si has recibido ayudas públicas', 'pending');

  -- SECCIÓN: CIERRE
  INSERT INTO checklist_items (trimestre_id, section, item_number, label, help_text, status)
  VALUES
    (v_trimestre_id, 'cierre', 15, 'Inventario de existencias', 'Solo si tienes stock de productos (si aplica)', 'pending'),
    (v_trimestre_id, 'cierre', 16, 'Amortizaciones', 'Ya lo calcula tu asesor, pero revisa si hay activos nuevos', 'pending'),
    (v_trimestre_id, 'cierre', 17, 'Notas y aclaraciones', 'Cualquier comentario importante para tu asesor', 'pending');

  -- CREAR EXPECTED DOCUMENTS basándose en recurring_expenses del usuario
  FOR v_recurring_expense IN
    SELECT id, concept_label
    FROM recurring_expenses
    WHERE user_id = p_user_id
  LOOP
    INSERT INTO expected_documents (trimestre_id, recurring_expense_id, status)
    VALUES (v_trimestre_id, v_recurring_expense.id, 'pending');
  END LOOP;

  -- Obtener el trimestre creado con toda la información
  SELECT json_build_object(
    'id', t.id,
    'user_id', t.user_id,
    'year', t.year,
    'quarter', t.quarter,
    'status', t.status,
    'checklist_progress', t.checklist_progress,
    'created_at', t.created_at,
    'closed_at', t.closed_at,
    'checklist_items_count', (
      SELECT COUNT(*) FROM checklist_items WHERE trimestre_id = t.id
    ),
    'expected_documents_count', (
      SELECT COUNT(*) FROM expected_documents WHERE trimestre_id = t.id
    )
  )
  INTO v_trimestre
  FROM trimestres t
  WHERE t.id = v_trimestre_id;

  RETURN v_trimestre;

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Ya existe un trimestre para el año % Q% de este usuario', p_year, p_quarter;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al crear trimestre: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_trimestre_with_checklist IS 'Crea un trimestre con sus 17 checklist items y documentos esperados basados en recurring_expenses';

-- ============================================
-- FUNCIÓN: close_trimestre
-- Cierra el trimestre y guarda recurring_expenses
-- ============================================

CREATE OR REPLACE FUNCTION close_trimestre(p_trimestre_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_year INT;
  v_quarter INT;
  v_trimestre JSON;
  v_document RECORD;
  v_recurring_id UUID;
BEGIN
  -- Obtener información del trimestre
  SELECT user_id, year, quarter
  INTO v_user_id, v_year, v_quarter
  FROM trimestres
  WHERE id = p_trimestre_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trimestre no encontrado';
  END IF;

  -- Verificar que el usuario actual es el dueño
  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'No tienes permiso para cerrar este trimestre';
  END IF;

  -- GUARDAR RECURRING EXPENSES basándose en documents con is_recurring = true
  FOR v_document IN
    SELECT DISTINCT
      concept_label,
      section
    FROM documents
    WHERE trimestre_id = p_trimestre_id
      AND is_recurring = true
      AND concept_label IS NOT NULL
  LOOP
    -- Verificar si ya existe este recurring_expense
    SELECT id INTO v_recurring_id
    FROM recurring_expenses
    WHERE user_id = v_user_id
      AND concept_label = v_document.concept_label;

    IF FOUND THEN
      -- Actualizar el último trimestre visto
      UPDATE recurring_expenses
      SET
        last_seen_year = v_year,
        last_seen_quarter = v_quarter,
        updated_at = NOW()
      WHERE id = v_recurring_id;
    ELSE
      -- Crear nuevo recurring_expense
      INSERT INTO recurring_expenses (
        user_id,
        concept_label,
        section,
        last_seen_year,
        last_seen_quarter
      )
      VALUES (
        v_user_id,
        v_document.concept_label,
        v_document.section,
        v_year,
        v_quarter
      );
    END IF;
  END LOOP;

  -- ACTUALIZAR ESTADO DEL TRIMESTRE
  UPDATE trimestres
  SET
    status = 'ready',
    closed_at = NOW()
  WHERE id = p_trimestre_id;

  -- Retornar el trimestre actualizado
  SELECT json_build_object(
    'id', t.id,
    'user_id', t.user_id,
    'year', t.year,
    'quarter', t.quarter,
    'status', t.status,
    'checklist_progress', t.checklist_progress,
    'created_at', t.created_at,
    'closed_at', t.closed_at,
    'recurring_expenses_saved', (
      SELECT COUNT(DISTINCT concept_label)
      FROM documents
      WHERE trimestre_id = p_trimestre_id
        AND is_recurring = true
        AND concept_label IS NOT NULL
    )
  )
  INTO v_trimestre
  FROM trimestres t
  WHERE t.id = p_trimestre_id;

  RETURN v_trimestre;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al cerrar trimestre: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION close_trimestre IS 'Cierra un trimestre, guarda recurring_expenses y actualiza el estado a ready';

-- ============================================
-- FUNCIÓN: mark_expected_document_fulfilled
-- Marca un expected_document como cumplido
-- ============================================

CREATE OR REPLACE FUNCTION mark_expected_document_fulfilled(
  p_expected_doc_id UUID,
  p_document_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE expected_documents
  SET
    status = 'fulfilled',
    fulfilled_by = p_document_id
  WHERE id = p_expected_doc_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Expected document no encontrado';
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mark_expected_document_fulfilled IS 'Marca un documento esperado como cumplido por un documento específico';

-- ============================================
-- FUNCIÓN: get_trimestre_summary
-- Obtiene resumen completo de un trimestre
-- ============================================

CREATE OR REPLACE FUNCTION get_trimestre_summary(p_trimestre_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'trimestre', (
      SELECT row_to_json(t)
      FROM trimestres t
      WHERE t.id = p_trimestre_id
    ),
    'checklist_stats', (
      SELECT json_build_object(
        'total', COUNT(*),
        'pending', COUNT(*) FILTER (WHERE status = 'pending'),
        'done', COUNT(*) FILTER (WHERE status = 'done'),
        'doubtful', COUNT(*) FILTER (WHERE status = 'doubtful')
      )
      FROM checklist_items
      WHERE trimestre_id = p_trimestre_id
    ),
    'documents_stats', (
      SELECT json_build_object(
        'total', COUNT(*),
        'by_section', json_object_agg(
          section,
          count
        )
      )
      FROM (
        SELECT section, COUNT(*) as count
        FROM documents
        WHERE trimestre_id = p_trimestre_id
        GROUP BY section
      ) section_counts
    ),
    'expected_documents_stats', (
      SELECT json_build_object(
        'total', COUNT(*),
        'pending', COUNT(*) FILTER (WHERE status = 'pending'),
        'fulfilled', COUNT(*) FILTER (WHERE status = 'fulfilled'),
        'dismissed', COUNT(*) FILTER (WHERE status = 'dismissed')
      )
      FROM expected_documents
      WHERE trimestre_id = p_trimestre_id
    ),
    'notes_count', (
      SELECT COUNT(*)
      FROM notes
      WHERE trimestre_id = p_trimestre_id
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_trimestre_summary IS 'Obtiene un resumen completo del trimestre con todas sus estadísticas';

-- ============================================
-- FUNCIÓN: reopen_trimestre
-- Reabre un trimestre cerrado
-- ============================================

CREATE OR REPLACE FUNCTION reopen_trimestre(p_trimestre_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_trimestre JSON;
BEGIN
  -- Verificar que el trimestre existe y obtener user_id
  SELECT user_id INTO v_user_id
  FROM trimestres
  WHERE id = p_trimestre_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trimestre no encontrado';
  END IF;

  -- Verificar permisos
  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'No tienes permiso para reabrir este trimestre';
  END IF;

  -- Actualizar estado
  UPDATE trimestres
  SET
    status = 'preparation',
    closed_at = NULL
  WHERE id = p_trimestre_id;

  -- Retornar trimestre actualizado
  SELECT row_to_json(t)
  INTO v_trimestre
  FROM trimestres t
  WHERE t.id = p_trimestre_id;

  RETURN v_trimestre;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION reopen_trimestre IS 'Reabre un trimestre cerrado, cambiando su estado a preparation';

-- ============================================
-- FUNCIÓN: delete_trimestre_cascade
-- Elimina un trimestre y toda su información relacionada
-- ============================================

CREATE OR REPLACE FUNCTION delete_trimestre_cascade(p_trimestre_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_deleted_counts JSON;
BEGIN
  -- Verificar permisos
  SELECT user_id INTO v_user_id
  FROM trimestres
  WHERE id = p_trimestre_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Trimestre no encontrado';
  END IF;

  IF v_user_id != auth.uid() THEN
    RAISE EXCEPTION 'No tienes permiso para eliminar este trimestre';
  END IF;

  -- Contar registros antes de eliminar
  SELECT json_build_object(
    'checklist_items', (SELECT COUNT(*) FROM checklist_items WHERE trimestre_id = p_trimestre_id),
    'documents', (SELECT COUNT(*) FROM documents WHERE trimestre_id = p_trimestre_id),
    'expected_documents', (SELECT COUNT(*) FROM expected_documents WHERE trimestre_id = p_trimestre_id),
    'notes', (SELECT COUNT(*) FROM notes WHERE trimestre_id = p_trimestre_id)
  ) INTO v_deleted_counts;

  -- Eliminar trimestre (CASCADE eliminará el resto)
  DELETE FROM trimestres WHERE id = p_trimestre_id;

  RETURN json_build_object(
    'success', true,
    'trimestre_id', p_trimestre_id,
    'deleted_counts', v_deleted_counts
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION delete_trimestre_cascade IS 'Elimina un trimestre y todos sus registros relacionados, retornando estadísticas';

-- ============================================
-- FUNCIÓN HELPER: Calcular progreso checklist
-- Actualiza el porcentaje de completitud (standalone)
-- ============================================

-- Eliminar todas las versiones existentes de la función
DROP FUNCTION IF EXISTS update_checklist_progress();
DROP FUNCTION IF EXISTS update_checklist_progress(UUID);

CREATE OR REPLACE FUNCTION update_checklist_progress(p_trimestre_id UUID)
RETURNS INT AS $$
DECLARE
  total_items INT;
  completed_items INT;
  progress_percentage INT;
BEGIN
  -- Contar total de items y completados (done + doubtful)
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status IN ('done', 'doubtful'))
  INTO total_items, completed_items
  FROM checklist_items
  WHERE trimestre_id = p_trimestre_id;

  -- Calcular porcentaje
  IF total_items > 0 THEN
    progress_percentage := ROUND((completed_items::NUMERIC / total_items::NUMERIC) * 100);
  ELSE
    progress_percentage := 0;
  END IF;

  -- Actualizar trimestre
  UPDATE trimestres
  SET checklist_progress = progress_percentage
  WHERE id = p_trimestre_id;

  RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_checklist_progress IS 'Calcula y actualiza el progreso del checklist (cuenta done + doubtful como completados)';

-- ============================================
-- FUNCIÓN WRAPPER: Trigger para checklist progress
-- ============================================

CREATE OR REPLACE FUNCTION trigger_update_checklist_progress()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_checklist_progress(COALESCE(NEW.trimestre_id, OLD.trimestre_id));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Eliminar triggers existentes para permitir recreación
DROP TRIGGER IF EXISTS update_progress_on_insert ON checklist_items;
DROP TRIGGER IF EXISTS update_progress_on_update ON checklist_items;
DROP TRIGGER IF EXISTS update_progress_on_delete ON checklist_items;

-- Triggers para actualizar progreso del checklist
CREATE TRIGGER update_progress_on_insert
  AFTER INSERT ON checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_checklist_progress();

CREATE TRIGGER update_progress_on_update
  AFTER UPDATE OF status ON checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_checklist_progress();

CREATE TRIGGER update_progress_on_delete
  AFTER DELETE ON checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_checklist_progress();

-- ============================================
-- FIN DEL SCHEMA
-- ============================================

-- Comentario final
COMMENT ON SCHEMA public IS 'Schema para Preparador de Trimestres - Gestión de trimestres fiscales';

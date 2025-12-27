-- ============================================
-- SCRIPT DE REPARACIÓN RÁPIDA
-- Ejecuta esto en el SQL Editor de Supabase
-- ============================================

-- IMPORTANTE: Si ya tienes datos, este script NO los eliminará
-- Solo crea las funciones RPC que faltan

-- ============================================
-- FUNCIÓN: create_trimestre_with_checklist
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

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ejecuta esta query para verificar que la función se creó correctamente:
-- SELECT routine_name FROM information_schema.routines
-- WHERE routine_schema = 'public' AND routine_name = 'create_trimestre_with_checklist';

-- Si ves un resultado, ¡la función está lista!

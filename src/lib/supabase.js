import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtiene el usuario autenticado actual
 * @returns {Promise<{data: User|null, error: Error|null}>}
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return { data: null, error };
    }

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Obtiene el trimestre activo del usuario (status = 'preparation')
 * @param {string} userId - UUID del usuario
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getActiveTrimestre(userId) {
  try {
    const { data, error } = await supabase
      .from('trimestres')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'preparation')
      .order('year', { ascending: false })
      .order('quarter', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return { data: null, error };
    }

    return { data: data || null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Obtiene un trimestre existente o crea uno nuevo si no existe
 * @param {string} userId - UUID del usuario
 * @param {number} year - Año del trimestre
 * @param {number} quarter - Número de trimestre (1-4)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getOrCreateTrimestre(userId, year, quarter) {
  try {
    // Intentar obtener el trimestre existente
    const { data: existing, error: fetchError } = await supabase
      .from('trimestres')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .eq('quarter', quarter)
      .single();

    if (existing) {
      return { data: existing, error: null };
    }

    // Si no existe, crear uno nuevo usando la función RPC
    const { data: created, error: createError } = await supabase.rpc(
      'create_trimestre_with_checklist',
      {
        p_user_id: userId,
        p_year: year,
        p_quarter: quarter
      }
    );

    if (createError) {
      return { data: null, error: createError };
    }

    return { data: created, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Obtiene todos los items del checklist de un trimestre
 * @param {string} trimestreId - UUID del trimestre
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export async function getChecklistItems(trimestreId) {
  try {
    const { data, error } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('trimestre_id', trimestreId)
      .order('section')
      .order('item_number');

    if (error) {
      console.error('getChecklistItems error:', error);
      return { data: [], error }; // Return empty array instead of null
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('getChecklistItems exception:', error);
    return { data: [], error };
  }
}

/**
 * Actualiza el estado de un item del checklist
 * @param {string} itemId - UUID del item
 * @param {string} status - Nuevo estado: 'pending', 'done', 'doubtful'
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateChecklistItem(itemId, status) {
  try {
    const { data, error } = await supabase
      .from('checklist_items')
      .update({ status })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Obtiene los documentos de un trimestre, opcionalmente filtrados por sección
 * @param {string} trimestreId - UUID del trimestre
 * @param {string} [section] - Sección opcional: 'ingresos', 'gastos', 'banco', 'otros'
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export async function getDocuments(trimestreId, section = null) {
  try {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('trimestre_id', trimestreId)
      .order('created_at', { ascending: false });

    if (section) {
      query = query.eq('section', section);
    }

    const { data, error } = await query;

    if (error) {
      console.error('getDocuments error:', error);
      return { data: [], error }; // Return empty array instead of null to prevent crashes
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('getDocuments exception:', error);
    return { data: [], error };
  }
}

/**
 * Sube un documento al Storage y crea el registro en la base de datos
 * @param {File} file - Archivo a subir
 * @param {string} trimestreId - UUID del trimestre
 * @param {string} section - Sección: 'ingresos', 'gastos', 'banco', 'otros'
 * @param {boolean} isRecurring - Si es un gasto recurrente
 * @param {string} conceptLabel - Etiqueta del concepto (ej: "Factura luz")
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function uploadDocument(file, trimestreId, section, isRecurring, conceptLabel) {
  try {
    // Obtener usuario y trimestre
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error('Usuario no autenticado') };
    }

    const { data: trimestre, error: trimestreError } = await supabase
      .from('trimestres')
      .select('id, year, quarter')
      .eq('id', trimestreId)
      .single();

    if (trimestreError) {
      return { data: null, error: trimestreError };
    }

    // Crear path del archivo: {user_id}/{year}_Q{quarter}/{section}/{filename}
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${user.id}/${trimestre.year}_Q${trimestre.quarter}/${section}/${fileName}`;

    // Subir archivo a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      return { data: null, error: uploadError };
    }

    // Crear registro en la tabla documents
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        trimestre_id: trimestreId,
        original_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        section: section,
        is_recurring: isRecurring,
        concept_label: conceptLabel
      })
      .select()
      .single();

    if (docError) {
      // Si falla la inserción, eliminar el archivo subido
      await supabase.storage.from('documents').remove([filePath]);
      return { data: null, error: docError };
    }

    // Vincular con expected_documents si es recurrente
    if (isRecurring && conceptLabel) {
      try {
        const { data: expectedDoc } = await supabase
          .from('expected_documents')
          .select('id')
          .eq('trimestre_id', trimestreId)
          .filter('recurring_expenses.concept_label', 'eq', conceptLabel)
          .eq('status', 'pending')
          .single();

        if (expectedDoc) {
          // Marcar como fulfilled el expected_document
          await updateExpectedDocument(expectedDoc.id, 'fulfilled', docData.id);
        }
      } catch (matchError) {
        // Log warning pero NO fallar upload si no hay match
        console.warn('Could not match document with expected_document:', matchError);
      }
    }

    return { data: docData, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Obtiene los documentos esperados de un trimestre
 * @param {string} trimestreId - UUID del trimestre
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export async function getExpectedDocuments(trimestreId) {
  try {
    const { data, error } = await supabase
      .from('expected_documents')
      .select(`
        *,
        recurring_expenses:recurring_expense_id (
          id,
          concept_label,
          section
        ),
        documents:fulfilled_by (
          id,
          file_name,
          file_path
        )
      `)
      .eq('trimestre_id', trimestreId)
      .order('created_at');

    if (error) {
      console.error('getExpectedDocuments error:', error);
      return { data: [], error }; // Return empty array instead of null
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('getExpectedDocuments exception:', error);
    return { data: [], error };
  }
}

/**
 * Actualiza el estado de un documento esperado
 * @param {string} id - UUID del expected_document
 * @param {string} status - Nuevo estado: 'pending', 'fulfilled', 'dismissed'
 * @param {string} [fulfilledBy] - UUID del documento que cumple la expectativa (opcional)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateExpectedDocument(id, status, fulfilledBy = null) {
  try {
    // Si se proporciona fulfilledBy, usar la función RPC
    if (fulfilledBy && status === 'fulfilled') {
      const { error: rpcError } = await supabase.rpc(
        'mark_expected_document_fulfilled',
        {
          p_expected_doc_id: id,
          p_document_id: fulfilledBy
        }
      );

      if (rpcError) {
        return { data: null, error: rpcError };
      }

      // Obtener el documento actualizado
      const { data, error: fetchError } = await supabase
        .from('expected_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        return { data: null, error: fetchError };
      }

      return { data, error: null };
    }

    // Actualización simple de estado
    const { data, error } = await supabase
      .from('expected_documents')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Obtiene las notas de un trimestre
 * @param {string} trimestreId - UUID del trimestre
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export async function getNotes(trimestreId) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('trimestre_id', trimestreId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Guarda una nueva nota para un trimestre
 * @param {string} trimestreId - UUID del trimestre
 * @param {string} content - Contenido de la nota
 * @param {boolean} forAdvisor - Si la nota es para el asesor
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function saveNote(trimestreId, content, forAdvisor = false) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        trimestre_id: trimestreId,
        content: content,
        for_advisor: forAdvisor
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Cierra un trimestre usando la función RPC
 * @param {string} trimestreId - UUID del trimestre
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function closeTrimestre(trimestreId) {
  try {
    const { data, error } = await supabase.rpc(
      'close_trimestre',
      {
        p_trimestre_id: trimestreId
      }
    );

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

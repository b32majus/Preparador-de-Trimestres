  import { supabase } from '../lib/supabase.js';
  import { getQuarterDateRange } from '../lib/date-utils.js';
  import { getRandomNormalizationMessage } from '../lib/normalizationMessages.js';
  import { getClosureMessage } from '../lib/microcopy.js';

  const configElement = document.getElementById('trimestre-config');
  const baseUrl = configElement.dataset.baseUrl;
  const trimestreId = configElement.dataset.trimestreId;

  async function loadTrimestre() {
    try {
      // 1. Validate trimestreId
      if (!trimestreId) {
        window.location.href = `${baseUrl}dashboard`;
        return;
      }

      // 2. Get user and validate trimestre
      const { data: { user } } = await supabase.auth.getUser();

      const { data: trimestre, error: trimestreError } = await supabase
        .from('trimestres')
        .select('*')
        .eq('id', trimestreId)
        .eq('user_id', user.id)
        .single();

      if (trimestreError || !trimestre) {
        window.location.href = `${baseUrl}dashboard`;
        return;
      }

      // 3. Load data in parallel
      const [
        { data: checklistItems },
        { data: documents },
        { data: expectedDocs },
        { data: notes }
      ] = await Promise.all([
        supabase.from('checklist_items').select('*').eq('trimestre_id', trimestreId),
        supabase.from('documents').select('*').eq('trimestre_id', trimestreId).order('created_at', { ascending: false }),
        supabase.from('expected_documents').select('*, recurring_expenses(concept_label, section)').eq('trimestre_id', trimestreId),
        supabase.from('notes').select('*').eq('trimestre_id', trimestreId).order('created_at', { ascending: false })
      ]);

      // 4. Group data by section
      const sections = ['ingresos', 'gastos', 'banco', 'otros'];
      const groupedData = sections.map(section => {
        const items = checklistItems?.filter(item => item.section === section) || [];
        const sectionDocs = documents?.filter(doc => doc.section === section) || [];

        const completedCount = items.filter(item => item.status === 'done').length;
        const totalCount = items.length;
        const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          name: section,
          items,
          documents: sectionDocs,
          completedCount,
          totalCount,
          progress
        };
      });

      // 5. Format data
      const quarterLabel = `Q${trimestre.quarter}`;
      const quarterDates = getQuarterDateRange(trimestre.quarter);
      const progress = trimestre.checklist_progress || 0;

      const statusBadge = trimestre.status === 'preparation' ? 'En preparaciÃ³n' :
                         trimestre.status === 'ready' ? 'Listo para enviar' :
                         'Enviado';

      // Check if there are empty sections for info signal
      const emptySection = groupedData.find(s => s.name === 'otros' && s.documents.length === 0);

      // Get random normalization message for tip box
      const normalizationMsg = getRandomNormalizationMessage();

      // Make trimestre data available globally for scripts
      window.__TRIMESTRE_DATA__ = {
        id: trimestreId,
        year: trimestre.year,
        quarter: trimestre.quarter,
        status: trimestre.status,
        closed_at: trimestre.closed_at,
        checklist_progress: trimestre.checklist_progress
      };

      // Render all sections
      renderHeaderCard(quarterLabel, trimestre, quarterDates, progress, statusBadge);
      renderExpectedExpenses(expectedDocs, trimestreId);
      renderChecklistSections(groupedData);
      if (emptySection) renderInfoBox();
      renderDocumentList(documents, trimestreId);
      renderNotesSection(notes, trimestreId);
      if (trimestre.status === 'ready' || trimestre.status === 'sent') {
        renderDownloadPackage(trimestreId, trimestre.status);
      }
      renderStickyCTA(trimestreId);
      renderTipBox(normalizationMsg);
      renderUploadZone(trimestreId);
      renderRecentDocuments(documents?.slice(0, 3) || [], trimestreId);

      // Show content, hide loading
      document.getElementById('loading-trimestre').style.display = 'none';
      document.getElementById('trimestre-content').style.display = 'block';

    } catch (error) {
      console.error('Error loading trimestre:', error);
      alert('Error al cargar el trimestre. IntÃ©ntalo de nuevo.');
    }
  }

  function renderHeaderCard(quarterLabel, trimestre, quarterDates, progress, statusBadge) {
    const statusVariants = {
      'En preparaciÃ³n': 'primary',
      'Listo para enviar': 'success',
      'Enviado': 'info'
    };

    document.getElementById('header-card').innerHTML = `
      <div class="header-top">
        <div class="header-text">
          <span class="period-label">Periodo actual</span>
          <h1 class="period-title">${quarterLabel} / ${trimestre.year}</h1>
        </div>
        <div class="header-actions">
          <span class="badge badge-${statusVariants[statusBadge]}">${statusBadge}</span>
          ${(trimestre.status === 'ready' || trimestre.status === 'sent') ? `
            <a href="${baseUrl}resumen?id=${trimestreId}" class="btn-resumen">
              <span class="material-symbols-outlined">summarize</span>
              <span>Ver Resumen</span>
            </a>
          ` : ''}
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-header">
          <span class="progress-label">Progreso general</span>
          <span class="progress-percentage">${progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>
    `;
  }

  function renderExpectedExpenses(expectedDocs, trimestreId) {
    if (!expectedDocs || expectedDocs.length === 0) {
      document.getElementById('expected-expenses-section').innerHTML = '';
      return;
    }

    const pendingCount = expectedDocs.filter(d => d.status === 'pending').length;
    const fulfilledCount = expectedDocs.filter(d => d.status === 'fulfilled').length;

    const itemsHTML = expectedDocs.map(doc => {
      if (doc.status === 'pending') {
        return `
          <div class="expected-item status-pending">
            <label class="checkbox-item">
              <input
                type="checkbox"
                class="expected-checkbox"
                data-expected-id="${doc.id}"
                data-trimestre-id="${trimestreId}"
              />
              <span class="item-label">${doc.recurring_expenses.concept_label}</span>
            </label>
          </div>
        `;
      } else if (doc.status === 'fulfilled') {
        return `
          <div class="expected-item status-fulfilled">
            <div class="fulfilled-item">
              <span class="icon material-symbols-outlined">check_circle</span>
              <span class="item-label strikethrough">${doc.recurring_expenses.concept_label}</span>
              <span class="fulfilled-badge">Ya subido</span>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="expected-item status-dismissed">
            <div class="dismissed-item">
              <span class="icon material-symbols-outlined">cancel</span>
              <span class="item-label strikethrough">${doc.recurring_expenses.concept_label}</span>
              <span class="dismissed-badge">Descartado</span>
            </div>
          </div>
        `;
      }
    }).join('');

    document.getElementById('expected-expenses-section').innerHTML = `
      <section class="expected-expenses-section">
        <div class="section-header">
          <div class="header-left">
            <span class="icon material-symbols-outlined">assignment_turned_in</span>
            <div class="header-text">
              <h2 class="section-title">Gastos esperados (del Q anterior)</h2>
              <p class="section-subtitle">En el trimestre anterior subiste estos gastos recurrentes. Â¿Los tienes para este trimestre?</p>
            </div>
          </div>
        </div>

        <div class="expected-list">
          ${itemsHTML}
        </div>

        <button class="add-recurring-btn">
          <span class="icon material-symbols-outlined">add_circle</span>
          <span>AÃ±adir otro gasto recurrente</span>
        </button>
      </section>
    `;

    attachExpectedExpensesListeners();
  }

  function attachExpectedExpensesListeners() {
    document.querySelectorAll('.expected-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', async (e) => {
        const expectedId = checkbox.dataset.expectedId;
        const isChecked = checkbox.checked;

        const newStatus = isChecked ? 'fulfilled' : 'dismissed';

        const { error } = await supabase
          .from('expected_documents')
          .update({ status: newStatus })
          .eq('id', expectedId);

        if (error) {
          console.error('Error updating expected document:', error);
          checkbox.checked = !isChecked;
          alert('Error al actualizar gasto esperado');
        } else {
          const item = checkbox.closest('.expected-item');
          const conceptLabel = checkbox.parentElement.querySelector('.item-label').textContent;

          if (newStatus === 'fulfilled') {
            item.className = 'expected-item status-fulfilled';
            item.innerHTML = `
              <div class="fulfilled-item">
                <span class="icon material-symbols-outlined">check_circle</span>
                <span class="item-label strikethrough">${conceptLabel}</span>
                <span class="fulfilled-badge">Ya subido</span>
              </div>
            `;
          } else {
            item.className = 'expected-item status-dismissed';
            item.innerHTML = `
              <div class="dismissed-item">
                <span class="icon material-symbols-outlined">cancel</span>
                <span class="item-label strikethrough">${conceptLabel}</span>
                <span class="dismissed-badge">Descartado</span>
              </div>
            `;
          }
        }
      });
    });

    document.querySelector('.add-recurring-btn')?.addEventListener('click', () => {
      alert('Funcionalidad de aÃ±adir gastos recurrentes prÃ³ximamente');
    });
  }

  function renderChecklistSections(groupedData) {
    const sectionLabels = {
      ingresos: 'INGRESOS',
      gastos: 'GASTOS',
      banco: 'BANCO',
      otros: 'OTROS'
    };

    const sectionsHTML = groupedData.map((section, index) => {
      const isExpanded = index === 0;
      const completedCount = section.completedCount;
      const totalCount = section.totalCount;
      const progress = section.progress;

      const itemsHTML = section.items.map(item => renderChecklistItem(item, section.name)).join('');

      return `
        <div class="checklist-section ${isExpanded ? 'expanded' : 'collapsed'}" data-section="${section.name}">
          <button class="section-header" data-toggle-section aria-expanded="${isExpanded}">
            <div class="header-left">
              <span class="expand-icon material-symbols-outlined">expand_more</span>
              <h3 class="section-name">${sectionLabels[section.name]}</h3>
              <span class="completion-badge">${completedCount}/${totalCount} completados</span>
            </div>
            ${!isExpanded && totalCount > 0 ? `
              <div class="progress-mini">
                <div class="progress-bar" style="width: ${progress}%"></div>
              </div>
            ` : ''}
          </button>

          ${isExpanded ? `
            <div class="section-content">
              ${section.items.length > 0 ? itemsHTML : `
                <div class="empty-section">
                  <span class="material-symbols-outlined">inbox</span>
                  <p>No hay items en esta secciÃ³n</p>
                </div>
              `}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    document.getElementById('sections-list').innerHTML = sectionsHTML;
    attachChecklistListeners();
  }

  function renderChecklistItem(item, section) {
    const statusConfig = {
      pending: {
        icon: 'radio_button_unchecked',
        label: 'Esperando documento',
        borderColor: '#9B958F',
        bgColor: '#FFFFFF',
        iconBgColor: '#F2EFEA'
      },
      done: {
        icon: 'check',
        label: 'Documento validado',
        borderColor: '#4A7C59',
        bgColor: '#F0F7F2',
        iconBgColor: 'white'
      },
      doubtful: {
        icon: 'priority_high',
        label: 'Marcado como dudoso',
        borderColor: '#D4A84B',
        bgColor: '#FEF9EB',
        iconBgColor: 'white'
      }
    };

    const config = statusConfig[item.status];

    let actionButton = '';
    if (item.status === 'done') {
      actionButton = `<button class="btn-action btn-link" data-action="view">Ver archivo</button>`;
    } else if (item.status === 'doubtful') {
      actionButton = `<button class="btn-action btn-secondary" data-action="edit">Editar</button>`;
    } else {
      actionButton = `
        <button class="btn-action btn-primary" data-action="upload">
          <span class="material-symbols-outlined">upload</span>
          <span>Subir documento</span>
        </button>
      `;
    }

    return `
      <div class="checklist-item status-${item.status}" data-item-id="${item.id}" data-status="${item.status}" data-section="${section}" role="button" tabindex="0">
        <div class="item-info">
          <div class="status-icon icon-${item.status}">
            <span class="material-symbols-outlined">${config.icon}</span>
          </div>

          <div class="item-text">
            <p class="item-label">${item.label}</p>
            <p class="item-status-text">${config.label}</p>
            ${item.help_text ? `<p class="item-help">${item.help_text}</p>` : ''}
          </div>
        </div>

        <div class="item-actions">
          ${actionButton}
        </div>
      </div>
    `;
  }

  function attachChecklistListeners() {
    // Accordion toggle
    document.querySelectorAll('[data-toggle-section]').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.closest('[data-section]');
        const isExpanded = section.classList.contains('expanded');

        if (isExpanded) {
          section.classList.remove('expanded');
          section.classList.add('collapsed');
          btn.setAttribute('aria-expanded', 'false');

          // Remove section-content
          const content = section.querySelector('.section-content');
          if (content) content.remove();

          // Add progress mini
          const sectionData = section.dataset.section;
          // Recalculate progress for this section
          const items = section.querySelectorAll('.checklist-item');
          const completedCount = Array.from(items).filter(item => item.dataset.status === 'done').length;
          const totalCount = items.length;
          const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          btn.innerHTML = `
            <div class="header-left">
              <span class="expand-icon material-symbols-outlined">expand_more</span>
              <h3 class="section-name">${btn.querySelector('.section-name').textContent}</h3>
              <span class="completion-badge">${completedCount}/${totalCount} completados</span>
            </div>
            ${totalCount > 0 ? `
              <div class="progress-mini">
                <div class="progress-bar" style="width: ${progress}%"></div>
              </div>
            ` : ''}
          `;
        } else {
          section.classList.remove('collapsed');
          section.classList.add('expanded');
          btn.setAttribute('aria-expanded', 'true');

          // Remove progress mini
          const progressMini = btn.querySelector('.progress-mini');
          if (progressMini) progressMini.remove();

          // Re-render section content
          // (In production, store section data and re-render)
          window.location.reload(); // Simplified for now
        }
      });
    });

    // Checklist item interactions
    document.querySelectorAll('.checklist-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        if (e.target.closest('[data-action]')) return;

        const itemId = item.dataset.itemId;
        const currentStatus = item.dataset.status;
        const section = item.dataset.section;

        const stateFlow = {
          'pending': 'done',
          'done': 'doubtful',
          'doubtful': 'pending'
        };

        const nextStatus = stateFlow[currentStatus];

        item.style.opacity = '0.6';

        const { error } = await supabase
          .from('checklist_items')
          .update({ status: nextStatus })
          .eq('id', itemId);

        item.style.opacity = '1';

        if (error) {
          alert('Error al actualizar estado. Intenta de nuevo.');
        } else {
          item.dataset.status = nextStatus;
          item.className = `checklist-item status-${nextStatus}`;

          // Re-render item
          const itemData = { id: itemId, label: item.querySelector('.item-label').textContent, help_text: item.querySelector('.item-help')?.textContent, status: nextStatus };
          item.outerHTML = renderChecklistItem(itemData, section);

          // Re-attach listeners
          attachChecklistListeners();
        }
      });
    });
  }

  function renderInfoBox() {
    document.getElementById('info-box').style.display = 'block';
    document.getElementById('info-box').innerHTML = `
      <div class="info-box">
        <span class="material-symbols-outlined">info</span>
        <p>No has subido documentos en la secciÃ³n 'Otros'. Si no tienes gastos extraordinarios, esto es correcto y puedes continuar.</p>
      </div>
    `;
  }

  function renderDocumentList(documents, trimestreId) {
    if (!documents || documents.length === 0) {
      document.getElementById('document-list').innerHTML = '';
      return;
    }

    const groupedDocs = {
      ingresos: documents.filter(d => d.section === 'ingresos'),
      gastos: documents.filter(d => d.section === 'gastos'),
      banco: documents.filter(d => d.section === 'banco'),
      otros: documents.filter(d => d.section === 'otros')
    };

    const sectionLabels = {
      ingresos: 'INGRESOS',
      gastos: 'GASTOS',
      banco: 'BANCO',
      otros: 'OTROS'
    };

    function getFileIcon(mimeType) {
      if (mimeType.includes('pdf')) return 'picture_as_pdf';
      if (mimeType.includes('image')) return 'image';
      if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'table_chart';
      return 'description';
    }

    function formatFileSize(bytes) {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function formatRelativeTime(timestamp) {
      const now = new Date();
      const uploaded = new Date(timestamp);
      const diffMs = now.getTime() - uploaded.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Justo ahora';
      if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
      if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} dÃ­as`;
      return uploaded.toLocaleDateString('es-ES');
    }

    const sectionsHTML = Object.entries(groupedDocs).map(([section, docs]) => {
      if (docs.length === 0) return '';

      const docsHTML = docs.map(doc => `
        <div class="doc-card" data-doc-id="${doc.id}">
          <div class="doc-icon">
            <span class="material-symbols-outlined">${getFileIcon(doc.mime_type)}</span>
          </div>

          <div class="doc-info">
            <p class="doc-name">${doc.original_name}</p>
            <p class="doc-meta">${formatFileSize(doc.file_size)} â€¢ ${formatRelativeTime(doc.created_at)}</p>

            ${doc.is_recurring ? `
              <div class="doc-tags">
                <span class="badge badge-info">Recurrente</span>
                ${doc.concept_label ? `<p class="concept-label">${doc.concept_label}</p>` : ''}
              </div>
            ` : ''}
          </div>

          <button class="delete-btn" data-delete="${doc.id}" title="Eliminar documento">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      `).join('');

      return `
        <div class="section-group" data-section="${section}">
          <h4 class="section-label">${sectionLabels[section]} (${docs.length})</h4>
          <div class="docs-grid">
            ${docsHTML}
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('document-list').innerHTML = `
      <div class="document-list-container">
        <h3 class="list-title">Documentos (${documents.length})</h3>
        ${sectionsHTML || `
          <div class="empty-state">
            <span class="material-symbols-outlined">folder_open</span>
            <p>No hay documentos aÃºn</p>
          </div>
        `}
      </div>
    `;

    attachDocumentListListeners();
  }

  function attachDocumentListListeners() {
    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();

        const docId = btn.dataset.delete;
        const confirmed = confirm('Â¿Eliminar este documento?');

        if (!confirmed) return;

        btn.disabled = true;

        try {
          const { data: doc, error: fetchError } = await supabase
            .from('documents')
            .select('file_path')
            .eq('id', docId)
            .single();

          if (fetchError) throw fetchError;

          if (doc.file_path) {
            const { error: storageError } = await supabase.storage
              .from('documents')
              .remove([doc.file_path]);

            if (storageError) {
              console.error('Storage deletion error:', storageError);
            }
          }

          const { error: dbError } = await supabase
            .from('documents')
            .delete()
            .eq('id', docId);

          if (dbError) throw dbError;

          const docCard = btn.closest('[data-doc-id]');
          docCard.style.opacity = '0';
          docCard.style.transform = 'translateX(10px)';

          setTimeout(() => {
            docCard.remove();
          }, 200);
        } catch (error) {
          console.error('Error deleting document:', error);
          alert('Error al eliminar documento. Intenta de nuevo.');
          btn.disabled = false;
        }
      });
    });
  }

  function renderNotesSection(notes, trimestreId) {
    const latestNote = notes && notes.length > 0 ? notes[0] : null;

    document.getElementById('notes-section').innerHTML = `
      <section class="notes-section">
        <label for="notes-textarea-${trimestreId}" class="notes-label">
          Notas del trimestre
        </label>

        <textarea
          id="notes-textarea-${trimestreId}"
          class="notes-textarea"
          placeholder="Escribe aquÃ­ cualquier duda o comentario sobre este trimestre..."
          rows="4"
          data-trimestre-id="${trimestreId}"
        >${latestNote?.content || ''}</textarea>

        <div class="checkbox-wrapper">
          <label class="checkbox-label">
            <input
              type="checkbox"
              id="for-advisor-${trimestreId}"
              class="advisor-checkbox"
              ${latestNote?.for_advisor ? 'checked' : ''}
              data-trimestre-id="${trimestreId}"
            />
            <span>Marcar como mensaje importante para mi asesor</span>
          </label>
        </div>
      </section>
    `;

    attachNotesListeners(trimestreId);
  }

  function attachNotesListeners(trimestreId) {
    const textarea = document.querySelector(`#notes-textarea-${trimestreId}`);
    const checkbox = document.querySelector(`#for-advisor-${trimestreId}`);

    if (!textarea) return;

    let saveTimeout;
    let lastSavedContent = textarea.value;
    let lastSavedForAdvisor = checkbox?.checked || false;

    textarea.addEventListener('input', () => {
      clearTimeout(saveTimeout);

      saveTimeout = setTimeout(async () => {
        const content = textarea.value;
        const forAdvisor = checkbox?.checked || false;

        if (content !== lastSavedContent || forAdvisor !== lastSavedForAdvisor) {
          if (content.trim()) {
            try {
              const { error } = await supabase
                .from('notes')
                .upsert({
                  trimestre_id: trimestreId,
                  content: content,
                  for_advisor: forAdvisor
                }, { onConflict: 'trimestre_id' });

              if (error) {
                console.error('Error saving note:', error);
              } else {
                lastSavedContent = content;
                lastSavedForAdvisor = forAdvisor;
                textarea.classList.add('saved');
                setTimeout(() => {
                  textarea.classList.remove('saved');
                }, 1500);
              }
            } catch (error) {
              console.error('Unexpected error saving note:', error);
            }
          } else {
            lastSavedContent = '';
          }
        }
      }, 1000);
    });

    checkbox?.addEventListener('change', async () => {
      const content = textarea.value;
      const forAdvisor = checkbox.checked;

      if (content.trim()) {
        try {
          const { error } = await supabase
            .from('notes')
            .upsert({
              trimestre_id: trimestreId,
              content: content,
              for_advisor: forAdvisor
            }, { onConflict: 'trimestre_id' });

          if (error) {
            console.error('Error saving note:', error);
          } else {
            lastSavedForAdvisor = forAdvisor;
            checkbox.parentElement.classList.add('saved');
            setTimeout(() => {
              checkbox.parentElement.classList.remove('saved');
            }, 1500);
          }
        } catch (error) {
          console.error('Unexpected error saving note:', error);
        }
      }
    });
  }

  function renderDownloadPackage(trimestreId, status) {
    const isReady = status === 'ready' || status === 'sent';
    if (!isReady) {
      document.getElementById('download-package').innerHTML = '';
      return;
    }

    document.getElementById('download-package').innerHTML = `
      <div class="download-package-container" data-trimestre-id="${trimestreId}">
        <h3 class="title">Descargar documentaciÃ³n</h3>
        <p class="description">
          Tu trimestre estÃ¡ listo. Descarga el paquete completo para enviar a tu asesor.
        </p>

        <div class="buttons-grid">
          <button class="btn-download" data-action="download-zip">
            <span class="material-symbols-outlined">folder_zip</span>
            <div class="btn-text">
              <span class="btn-title">Paquete completo (ZIP)</span>
              <span class="btn-subtitle">Incluye todos los documentos y resÃºmenes</span>
            </div>
          </button>

          <button class="btn-download secondary" data-action="download-executive">
            <span class="material-symbols-outlined">picture_as_pdf</span>
            <div class="btn-text">
              <span class="btn-title">Resumen Ejecutivo (PDF)</span>
              <span class="btn-subtitle">1 pÃ¡gina con lo esencial</span>
            </div>
          </button>

          <button class="btn-download secondary" data-action="download-complete">
            <span class="material-symbols-outlined">description</span>
            <div class="btn-text">
              <span class="btn-title">Resumen Completo (PDF)</span>
              <span class="btn-subtitle">Detallado con checklist</span>
            </div>
          </button>

          <button class="btn-download secondary" data-action="download-certificate">
            <span class="material-symbols-outlined">workspace_premium</span>
            <div class="btn-text">
              <span class="btn-title">Certificado de Cierre (PDF)</span>
              <span class="btn-subtitle">Elegante y celebratorio</span>
            </div>
          </button>
        </div>

        <div class="text-templates">
          <h4 class="templates-title">Textos para copiar</h4>
          <div class="templates-grid">
            <button class="btn-copy" data-copy="email">
              <span class="material-symbols-outlined">email</span>
              <span>Copiar email</span>
            </button>
            <button class="btn-copy" data-copy="whatsapp">
              <span class="material-symbols-outlined">chat</span>
              <span>Copiar WhatsApp</span>
            </button>
          </div>
        </div>

        <div class="loading-overlay" style="display: none;">
          <div class="spinner"></div>
          <p>Generando documentos...</p>
        </div>
      </div>
    `;

    // Note: Download functionality requires generator libraries
    // This is placeholder for now
    document.querySelector('[data-action="download-zip"]')?.addEventListener('click', () => {
      alert('Funcionalidad de descarga ZIP prÃ³ximamente');
    });
  }

  function renderStickyCTA(trimestreId) {
    document.getElementById('sticky-cta').innerHTML = `
      <button class="btn-submit" data-trimestre-id="${trimestreId}">
        <span>Marcar trimestre como listo para enviar</span>
        <span class="material-symbols-outlined">send</span>
      </button>
    `;

    document.querySelector('.btn-submit')?.addEventListener('click', async () => {
      const confirmed = confirm('Â¿Marcar este trimestre como listo para enviar? Una vez enviado, ya no podrÃ¡s editarlo.');

      if (!confirmed) return;

      const submitBtn = document.querySelector('.btn-submit');
      submitBtn.disabled = true;
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Procesando...</span>';

      const { error } = await supabase
        .from('trimestres')
        .update({ status: 'ready', closed_at: new Date().toISOString() })
        .eq('id', trimestreId);

      if (error) {
        console.error('Error closing trimestre:', error);
        alert('Error al cerrar el trimestre. IntÃ©ntalo de nuevo.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
      } else {
        const closureMsg = getClosureMessage(window.__TRIMESTRE_DATA__.quarter, window.__TRIMESTRE_DATA__.year);
        alert(`${closureMsg.title}\n\n${closureMsg.message}`);
        window.location.href = `${baseUrl}resumen?id=${trimestreId}`;
      }
    });
  }

  function renderTipBox(normalizationMsg) {
    document.getElementById('tip-box').innerHTML = `
      <div class="tip-box">
        <div class="tip-icon-wrapper">
          <span class="material-symbols-outlined">${normalizationMsg.icon}</span>
        </div>
        <div class="tip-content">
          <p>
            <span class="tip-title">${normalizationMsg.title}</span>
            ${normalizationMsg.message}
          </p>
        </div>
      </div>
    `;
  }

  function renderUploadZone(trimestreId) {
    document.getElementById('upload-zone').innerHTML = `
      <div class="upload-zone-container">
        <h3 class="upload-title">Subida rÃ¡pida</h3>

        <div class="dropzone" data-trimestre-id="${trimestreId}" data-section="otros">
          <input type="file" id="file-input-${trimestreId}" multiple hidden />
          <input type="file" id="camera-input-${trimestreId}" accept="image/*" capture="environment" hidden />

          <label for="file-input-${trimestreId}" class="drop-label">
            <span class="upload-icon material-symbols-outlined">cloud_upload</span>
            <p class="primary-text">Arrastra archivos aquÃ­</p>
            <p class="secondary-text">o haz clic para buscar</p>
          </label>

          <button class="camera-btn" type="button" data-camera-btn="${trimestreId}">
            <span class="material-symbols-outlined">photo_camera</span>
            <span>Usar cÃ¡mara</span>
          </button>
        </div>

        <div class="preview-zone" style="display: none;" data-preview-zone="${trimestreId}">
          <h4 class="preview-title">Archivos seleccionados:</h4>
          <ul class="file-list" id="file-preview-list-${trimestreId}"></ul>
        </div>

        <div class="recurring-controls" style="display: none;" data-recurring-controls="${trimestreId}">
          <label class="checkbox-label">
            <input type="checkbox" id="is-recurring-${trimestreId}" class="recurring-checkbox" data-recurring-check="${trimestreId}" />
            <span>Marcar como recurrente</span>
          </label>

          <div class="concept-input-wrapper" style="display: none;" data-concept-wrapper="${trimestreId}">
            <label for="concept-label-${trimestreId}">Nombre del concepto:</label>
            <input type="text" id="concept-label-${trimestreId}" class="concept-input" data-concept-input="${trimestreId}" placeholder="Ej: Alquiler oficina, Seguro empresa..." />
          </div>
        </div>

        <div class="upload-progress" style="display: none;" data-progress-zone="${trimestreId}">
          <div class="progress-fill"></div>
          <p class="progress-text">Subiendo...</p>
        </div>

        <button class="btn-upload" type="button" disabled data-upload-btn="${trimestreId}">
          <span>Subir documentos</span>
          <span class="material-symbols-outlined">upload</span>
        </button>
      </div>
    `;

    // Note: Upload functionality requires full implementation
    // Placeholder for now
    document.getElementById(`file-input-${trimestreId}`)?.addEventListener('change', () => {
      alert('Funcionalidad de subida de archivos prÃ³ximamente');
    });
  }

  function renderRecentDocuments(documents, trimestreId) {
    function getFileIcon(mimeType) {
      if (mimeType.includes('pdf')) return 'picture_as_pdf';
      if (mimeType.includes('image')) return 'image';
      if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'table_chart';
      return 'description';
    }

    function getFileIconClass(mimeType) {
      if (mimeType.includes('pdf')) return 'icon-red';
      if (mimeType.includes('image')) return 'icon-blue';
      return 'icon-gray';
    }

    function formatRelativeTime(timestamp) {
      const now = new Date();
      const uploaded = new Date(timestamp);
      const diffMs = now.getTime() - uploaded.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Justo ahora';
      if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
      if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} dÃ­as`;
      return uploaded.toLocaleDateString('es-ES');
    }

    const docsHTML = documents.length > 0 ? documents.map(doc => `
      <div class="doc-item" data-doc-id="${doc.id}">
        <div class="file-icon ${getFileIconClass(doc.mime_type)}">
          <span class="material-symbols-outlined">${getFileIcon(doc.mime_type)}</span>
        </div>

        <div class="doc-info">
          <p class="file-name">${doc.file_name}</p>
          <p class="upload-time">${formatRelativeTime(doc.uploaded_at)}</p>
        </div>

        <button class="delete-btn" data-delete="${doc.id}" title="Eliminar documento">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `).join('') : `
      <div class="empty-docs">
        <span class="material-symbols-outlined">folder_open</span>
        <p>No hay documentos aÃºn</p>
      </div>
    `;

    document.getElementById('recent-documents').innerHTML = `
      <div class="recent-docs-container">
        <div class="docs-header">
          <h3 class="docs-title">Documentos recientes</h3>
          ${documents.length > 3 ? '<button class="link-btn">Ver todos</button>' : ''}
        </div>

        <div class="docs-list">
          ${docsHTML}
        </div>
      </div>
    `;
  }

  loadTrimestre();

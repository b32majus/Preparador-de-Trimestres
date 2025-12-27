import { supabase } from '../lib/supabase.js';
import { getCurrentYearQuarter, getCurrentDayOfMonth, getQuarterDateRange } from '../lib/date-utils.js';
import { getContextualMessage } from '../lib/microcopy.js';

const configElement = document.getElementById('dashboard-config');
const baseUrl = configElement.dataset.baseUrl;

async function loadDashboard() {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      window.location.href = `${baseUrl}login`;
      return;
    }

    // Get current year/quarter
    const { year: currentYear, quarter: currentQuarter } = getCurrentYearQuarter();

    // Create or get active trimestre
    let trimestreData;
    const { data: activeTrimestre, error: activeError } = await supabase.rpc(
      'create_trimestre_with_checklist',
      {
        p_user_id: user.id,
        p_year: currentYear,
        p_quarter: currentQuarter
      }
    );

    if (activeError?.code === '23505') {
      // Already exists, fetch it
      const { data } = await supabase
        .from('trimestres')
        .select('*, expected_documents(id, status)')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .eq('quarter', currentQuarter)
        .single();
      trimestreData = data;
    } else {
      trimestreData = activeTrimestre;
    }

    // Count pending expenses
    const pendingExpenses = trimestreData?.expected_documents?.filter(
      doc => doc.status === 'pending'
    ).length || 0;

    // Get past trimestres
    const { data: pastTrimestres } = await supabase
      .from('trimestres')
      .select('id, year, quarter, status, closed_at, checklist_progress')
      .eq('user_id', user.id)
      .neq('id', trimestreData?.id || '')
      .order('year', { ascending: false })
      .order('quarter', { ascending: false })
      .limit(5);

    // Render the dashboard
    renderDashboard(trimestreData, pendingExpenses, pastTrimestres);

  } catch (error) {
    console.error('Error loading dashboard:', error);
    alert('Error al cargar el dashboard. Inténtalo de nuevo.');
  }
}

function renderDashboard(activeTrimestre, pendingExpenses, pastTrimestres) {
  // Render contextual message
  const dayOfMonth = getCurrentDayOfMonth();
  const progress = activeTrimestre?.checklist_progress || 0;
  const message = getContextualMessage(progress, dayOfMonth);

  const contextualMessageEl = document.getElementById('contextual-message');
  if (contextualMessageEl) {
    contextualMessageEl.innerHTML = `
      <div class="contextual-message">
        <span class="icon material-symbols-outlined">${message.icon}</span>
        <div class="content">
          <h3 class="title">${message.title}</h3>
          <p class="message">${message.message}</p>
        </div>
      </div>
    `;
  }

  // Render active trimestre card
  const activeTrimestreEl = document.getElementById('active-trimestre');
  if (activeTrimestre && activeTrimestreEl) {
    const quarterLabel = `Q${activeTrimestre.quarter}`;
    const quarterDates = getQuarterDateRange(activeTrimestre.quarter);

    activeTrimestreEl.innerHTML = `
      <div class="trimestre-card active">
        <div class="card-header">
          <span class="badge badge-primary">EN CURSO</span>
        </div>

        <h1 class="trimestre-title">${quarterLabel} / ${activeTrimestre.year}</h1>
        <p class="trimestre-dates">${quarterDates}</p>

        <div class="card-content">
          <div class="progress-container">
            <div class="progress-header">
              <span class="progress-label">Progreso general</span>
              <span class="progress-percentage">${progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
          </div>

          ${pendingExpenses > 0 ? `
            <div class="expected-badge">
              <span class="icon material-symbols-outlined">folder_open</span>
              <span>${pendingExpenses} ${pendingExpenses === 1 ? 'gasto esperado' : 'gastos esperados'}</span>
            </div>
          ` : ''}

          <a href="${baseUrl}trimestre?id=${activeTrimestre.id}" class="btn-primary">
            <span>Continuar cierre</span>
            <span class="icon-arrow">→</span>
          </a>
        </div>
      </div>
    `;
  }

  // Render past trimestres
  const pastTrimestresEl = document.getElementById('past-trimestres');
  if (pastTrimestres && pastTrimestres.length > 0 && pastTrimestresEl) {
    const pastHTML = pastTrimestres.map(t => {
      const quarterLabel = `Q${t.quarter}`;
      const quarterDates = getQuarterDateRange(t.quarter);
      const closedDate = t.closed_at ? new Date(t.closed_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long'
      }) : null;

      return `
        <div class="trimestre-card past">
          <h1 class="trimestre-title">${quarterLabel} / ${t.year}</h1>
          <p class="trimestre-dates">${quarterDates}</p>
          <div class="past-info">
            <div class="status-row">
              <span class="badge badge-success">${t.status || 'Cerrado'}</span>
              ${closedDate ? `<span class="past-date">${closedDate}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    pastTrimestresEl.innerHTML = `
      <section class="past-trimestres">
        <h2 class="past-title">Trimestres anteriores</h2>
        <div class="past-list">
          ${pastHTML}
        </div>
      </section>
    `;
  }

  // Show content, hide loading
  const loadingDashboard = document.getElementById('loading-dashboard');
  const dashboardContent = document.getElementById('dashboard-content');
  if (loadingDashboard) loadingDashboard.style.display = 'none';
  if (dashboardContent) dashboardContent.style.display = 'flex';
}

loadDashboard();

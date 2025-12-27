import {
  createBasePDF,
  addHeader,
  addFooter,
  addSection,
  formatDate,
  getQuarterDates,
  PAGE
} from '../utils/pdfHelpers.js';

export async function generateResumenCompleto(
  trimestre,
  documents,
  checklistItems,
  notes
) {
  const doc = createBasePDF();

  // Header
  addHeader(doc, 'Resumen Completo');

  let y = 40;

  // Información del trimestre
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(44, 24, 16);

  doc.text(`Trimestre: Q${trimestre.quarter} / ${trimestre.year}`, 20, y);
  y += 8;
  doc.text(`Periodo: ${getQuarterDates(trimestre.quarter)}`, 20, y);
  y += 8;
  doc.text(`Estado: ✓ Listo para enviar`, 20, y);
  y += 8;
  doc.text(`Fecha de cierre: ${formatDate(trimestre.closed_at)}`, 20, y);

  y += 15;

  // Documentación completa por sección
  y = addSection(doc, y, 'DOCUMENTACIÓN COMPLETA');

  const sections = ['ingresos', 'gastos', 'banco', 'otros'];
  const sectionLabels = {
    ingresos: 'INGRESOS',
    gastos: 'GASTOS',
    banco: 'BANCO',
    otros: 'OTROS'
  };

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  sections.forEach(section => {
    const sectionDocs = documents.filter(d => d.section === section);
    doc.text(`${sectionLabels[section]} (${sectionDocs.length} documentos)`, 20, y);
    y += 6;

    if (sectionDocs.length > 0) {
      doc.setFontSize(9);
      sectionDocs.forEach(doc_item => {
        if (y > PAGE.height - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(`  • ${doc_item.original_name}`, 25, y);
        y += 5;
      });
      doc.setFontSize(11);
      y += 2;
    }
  });

  y += 10;

  // Confirmaciones
  if (y > PAGE.height - 40) {
    doc.addPage();
    y = 20;
  }

  y = addSection(doc, y, 'CONFIRMACIONES');

  const completed = checklistItems.filter(i => i.status === 'done').length;
  const total = checklistItems.length;
  const percentage = Math.round((completed / total) * 100);

  doc.setFontSize(11);
  doc.text(`Checklist completado: ${percentage}% (${completed}/${total} items)`, 20, y);

  y += 15;

  // Checklist completo
  if (y > PAGE.height - 40) {
    doc.addPage();
    y = 20;
  }

  y = addSection(doc, y, 'CHECKLIST DETALLADO');

  doc.setFontSize(9);

  const statusIcons = {
    done: '✓',
    pending: '○',
    doubtful: '?'
  };

  checklistItems.forEach(item => {
    if (y > PAGE.height - 20) {
      doc.addPage();
      y = 20;
    }

    const icon = statusIcons[item.status];
    const text = `${icon} [${item.section.toUpperCase()}] ${item.label}`;
    doc.text(text, 20, y);
    y += 5;
  });

  // Dudas
  y += 10;

  if (y > PAGE.height - 40) {
    doc.addPage();
    y = 20;
  }

  y = addSection(doc, y, 'DUDAS Y ACLARACIONES');

  const doubtful = checklistItems.filter(i => i.status === 'doubtful');

  doc.setFontSize(11);

  if (doubtful.length > 0) {
    doc.text('Items marcados como "Dudoso":', 20, y);
    y += 7;
    doc.setFontSize(10);

    doubtful.forEach(item => {
      if (y > PAGE.height - 20) {
        doc.addPage();
        y = 20;
      }

      doc.text(`• ${item.section} - ${item.label}`, 25, y);
      y += 6;
    });
  } else {
    doc.text('No hay dudas pendientes', 20, y);
  }

  y += 15;

  // Todas las notas
  if (y > PAGE.height - 40) {
    doc.addPage();
    y = 20;
  }

  y = addSection(doc, y, 'TODAS LAS NOTAS');

  doc.setFontSize(10);

  if (notes && notes.length > 0) {
    notes.forEach((note, index) => {
      if (y > PAGE.height - 30) {
        doc.addPage();
        y = 20;
      }

      const importantTag = note.for_advisor ? ' [IMPORTANTE PARA ASESOR]' : '';
      doc.setFont('helvetica', note.for_advisor ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(note.content + importantTag, 170);
      doc.text(lines, 20, y);
      y += lines.length * 5;

      if (index < notes.length - 1) {
        y += 3;
      }
    });
  } else {
    doc.text('Sin notas', 20, y);
  }

  addFooter(doc);

  return doc.output('blob');
}

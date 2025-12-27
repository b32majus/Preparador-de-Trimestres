import {
  createBasePDF,
  addHeader,
  addFooter,
  addSection,
  formatDate,
  getQuarterDates,
  COLORS,
  PAGE
} from '../utils/pdfHelpers.js';

export async function generateResumenEjecutivo(
  trimestre,
  documents,
  checklistItems,
  notes
) {
  const doc = createBasePDF();

  // Header
  addHeader(doc, 'Resumen Ejecutivo');

  let y = 40;

  // Información del trimestre
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const textRgb = { r: 44, g: 24, b: 16 }; // textMain color
  doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);

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
    const count = documents.filter(d => d.section === section).length;
    const checkmark = count > 0 ? '✓' : '○';
    doc.text(`${checkmark} ${sectionLabels[section]}  ${count} documentos`, 20, y);
    y += 7;
  });

  y += 10;

  // Confirmaciones
  y = addSection(doc, y, 'CONFIRMACIONES');

  const completed = checklistItems.filter(i => i.status === 'done').length;
  const total = checklistItems.length;
  const percentage = Math.round((completed / total) * 100);

  doc.setFontSize(11);
  doc.text(`Checklist completado: ${percentage}% (${completed}/${total} items)`, 20, y);

  y += 15;

  // Dudas
  y = addSection(doc, y, 'DUDAS Y ACLARACIONES');

  const doubtful = checklistItems.filter(i => i.status === 'doubtful');

  doc.setFontSize(11);

  if (doubtful.length > 0) {
    doc.text('Items marcados como "Dudoso":', 20, y);
    y += 7;
    doc.setFontSize(10);

    doubtful.forEach(item => {
      // Check if we need a new page
      if (y > PAGE.height - 30) {
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

  // Notas importantes
  if (y > PAGE.height - 40) {
    doc.addPage();
    y = 20;
  }

  y = addSection(doc, y, 'NOTAS IMPORTANTES PARA EL ASESOR');

  const importantNotes = notes.filter(n => n.for_advisor);

  doc.setFontSize(10);

  if (importantNotes.length > 0) {
    importantNotes.forEach((note, index) => {
      if (y > PAGE.height - 30) {
        doc.addPage();
        y = 20;
      }

      const lines = doc.splitTextToSize(note.content, 170);
      doc.text(lines, 20, y);
      y += lines.length * 5;

      if (index < importantNotes.length - 1) {
        y += 3;
      }
    });
  } else {
    doc.text('Sin notas importantes', 20, y);
  }

  addFooter(doc);

  return doc.output('blob');
}

import {
  createBasePDF,
  addFooter,
  formatDate,
  getQuarterDates,
  COLORS
} from '../utils/pdfHelpers.js';

export async function generateCertificado(trimestre, totalDocuments) {
  const doc = createBasePDF();

  // Diseño centrado y elegante sin header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');

  const rgb = { r: 184, g: 137, b: 125 }; // primary color
  doc.setTextColor(rgb.r, rgb.g, rgb.b);

  let y = 80;

  // Decoración
  doc.text('✦ ✦ ✦', 105, y, { align: 'center' });
  y += 20;

  doc.text('CERTIFICADO DE CIERRE', 105, y, { align: 'center' });
  y += 20;

  doc.text('✦ ✦ ✦', 105, y, { align: 'center' });
  y += 30;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(44, 24, 16); // textMain

  doc.text('Certifica que el trimestre', 105, y, { align: 'center' });
  y += 15;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.text(`Q${trimestre.quarter} / ${trimestre.year}`, 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(44, 24, 16);
  doc.text(`(${getQuarterDates(trimestre.quarter)})`, 105, y, { align: 'center' });
  y += 20;

  doc.text('ha sido preparado y cerrado exitosamente', 105, y, { align: 'center' });
  y += 15;

  doc.text(`con un total de ${totalDocuments} documentos`, 105, y, { align: 'center' });
  y += 8;
  doc.text('organizados y listos para entrega', 105, y, { align: 'center' });
  y += 30;

  doc.text('Fecha de cierre:', 105, y, { align: 'center' });
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(trimestre.closed_at), 105, y, { align: 'center' });

  addFooter(doc);

  return doc.output('blob');
}

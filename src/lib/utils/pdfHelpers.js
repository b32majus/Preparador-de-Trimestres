import { jsPDF } from 'jspdf';

// Colores Sophilux
export const COLORS = {
  primary: '#B8897D',      // Rose Gold
  primaryHover: '#A67A6E',
  success: '#4A7C59',
  warning: '#D4A84B',
  textMain: '#2C1810',
  textSecondary: '#8B7355',
  border: '#EAE4DF',
  background: '#FAFAF8'
};

// Configuración de página
export const PAGE = {
  width: 210,   // A4 mm
  height: 297,
  margin: 20
};

// Agregar header estándar
export function addHeader(doc, title) {
  // Convertir color hex a RGB para jsPDF
  const rgb = hexToRgb(COLORS.primary);
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.rect(0, 0, PAGE.width, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PREPARADOR DE TRIMESTRES', PAGE.width / 2, 15, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(title, PAGE.width / 2, 23, { align: 'center' });
}

// Agregar footer estándar
export function addFooter(doc) {
  const pageHeight = PAGE.height;
  doc.setFontSize(8);
  const rgb = hexToRgb(COLORS.textSecondary);
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.text('Generado con Preparador de Trimestres', PAGE.width / 2, pageHeight - 10, { align: 'center' });
  doc.text('preparador.sophilux.com', PAGE.width / 2, pageHeight - 5, { align: 'center' });
}

// Agregar sección con título
export function addSection(doc, yPos, title) {
  const rgb = hexToRgb(COLORS.border);
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.rect(PAGE.margin, yPos, PAGE.width - 2 * PAGE.margin, 1, 'F');

  yPos += 5;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const titleRgb = hexToRgb(COLORS.primary);
  doc.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
  doc.text(title, PAGE.margin, yPos);

  return yPos + 8;  // Return new yPos after section header
}

// Formatear fecha
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Formatear fechas de trimestre
export function getQuarterDates(quarter) {
  const dates = {
    1: 'Enero — Marzo',
    2: 'Abril — Junio',
    3: 'Julio — Septiembre',
    4: 'Octubre — Diciembre'
  };
  return dates[quarter];
}

// Crear documento base
export function createBasePDF() {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
}

// Convertir hex a RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 184, g: 137, b: 125 };
}

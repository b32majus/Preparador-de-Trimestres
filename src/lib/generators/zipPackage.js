import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateResumenEjecutivo } from './resumenEjecutivo.js';
import { generateResumenCompleto } from './resumenCompleto.js';
import { generateCertificado } from './certificado.js';
import { supabase } from '../supabase.js';

export async function generateAndDownloadZip(
  trimestre,
  documents,
  checklistItems,
  notes
) {
  const zip = new JSZip();

  // 1. Generar PDFs
  const resumenEjecutivo = await generateResumenEjecutivo(
    trimestre, documents, checklistItems, notes
  );
  const resumenCompleto = await generateResumenCompleto(
    trimestre, documents, checklistItems, notes
  );
  const certificado = await generateCertificado(trimestre, documents.length);

  // 2. Añadir PDFs generados al ZIP
  zip.file('00_RESUMEN_EJECUTIVO.pdf', resumenEjecutivo);
  zip.file('RESUMEN_COMPLETO.pdf', resumenCompleto);
  zip.file('CERTIFICADO_CIERRE.pdf', certificado);

  // 3. Crear carpetas por sección
  const sections = {
    ingresos: '01_INGRESOS',
    gastos: '02_GASTOS',
    banco: '03_BANCO',
    otros: '04_OTROS'
  };

  // 4. Descargar y añadir documentos de Storage
  for (const [section, folderName] of Object.entries(sections)) {
    const sectionDocs = documents.filter(d => d.section === section);

    for (const doc of sectionDocs) {
      try {
        // Descargar desde Supabase Storage
        const { data, error } = await supabase.storage
          .from('documents')
          .download(doc.file_path);

        if (error) {
          console.error(`Error downloading ${doc.original_name}:`, error);
          continue;
        }

        // Añadir al ZIP en la carpeta correspondiente
        zip.file(`${folderName}/${doc.original_name}`, data);
      } catch (err) {
        console.error(`Failed to add ${doc.original_name}:`, err);
      }
    }
  }

  // 5. Generar ZIP y descargar
  const blob = await zip.generateAsync({ type: 'blob' });
  const filename = `Q${trimestre.quarter}_${trimestre.year}_Documentos.zip`;
  saveAs(blob, filename);

  return filename;
}

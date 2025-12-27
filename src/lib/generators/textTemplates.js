import { getQuarterDates } from '../utils/pdfHelpers.js';

export function generateEmailText(trimestre, totalDocuments) {
  return `Asunto: Documentación Q${trimestre.quarter}/${trimestre.year} - Lista para revisión

Estimado/a asesor/a,

Le adjunto la documentación completa correspondiente al trimestre Q${trimestre.quarter}/${trimestre.year} (${getQuarterDates(trimestre.quarter)}).

Total de documentos: ${totalDocuments}

Los archivos están organizados por secciones en el ZIP adjunto:
- Ingresos
- Gastos
- Banco
- Otros

Además, encontrará:
- Resumen Ejecutivo (PDF de 1 página)
- Resumen Completo (PDF detallado)

Quedo atento/a a cualquier consulta.

Saludos cordiales,
[Nombre del usuario]

---
Generado automáticamente con Preparador de Trimestres
`;
}

export function generateWhatsAppText(trimestre, totalDocuments) {
  return `📊 Documentación Q${trimestre.quarter}/${trimestre.year} lista!

✅ ${totalDocuments} documentos organizados
📁 ZIP con todo incluido
📄 Resúmenes PDF

Cualquier duda me avisas 👍`;
}

# PRD V1 — Preparador de Trimestres

> Documento único de producto para diseño, desarrollo y validación.
> Versión 1.1 consolidada — Diciembre 2025

---

## Índice

1. [Visión y posicionamiento](#1-visión-y-posicionamiento)
2. [Público objetivo y dolor](#2-público-objetivo-y-dolor)
3. [Alcance V1](#3-alcance-v1)
4. [Elementos diferenciadores](#4-elementos-diferenciadores)
5. [Checklist trimestral](#5-checklist-trimestral)
6. [Memoria Trimestral](#6-memoria-trimestral)
7. [Output para el asesor](#7-output-para-el-asesor)
8. [Sistema de microcopy emocional](#8-sistema-de-microcopy-emocional)
9. [Automatizaciones](#9-automatizaciones)
10. [Arquitectura técnica](#10-arquitectura-técnica)
11. [Modelo de datos](#11-modelo-de-datos)
12. [Diseño UX/UI](#12-diseño-uxui)
13. [Pantallas y flujos](#13-pantallas-y-flujos)
14. [Matriz desktop/móvil](#14-matriz-desktopmóvil)
15. [Modelo de negocio](#15-modelo-de-negocio)
16. [Estrategia de distribución](#16-estrategia-de-distribución)
17. [Plan de validación](#17-plan-de-validación)
18. [Criterios de aceptación y testing](#18-criterios-de-aceptación-y-testing)
19. [Roadmap V2+](#19-roadmap-v2)
20. [Brief para desarrollo](#20-brief-para-desarrollo)

---

## 1. Visión y posicionamiento

### Qué es

Una web app ligera que ayuda a autónomos y micro-pymes con asesor fiscal a preparar, ordenar y cerrar un trimestre antes de enviar la información a su asesor.

### Qué NO es

- No es un ERP
- No es un software contable
- No calcula impuestos
- No presenta modelos fiscales
- No sustituye al asesor

### Propuesta de valor

> "Cierra el trimestre sin ansiedad. Todo listo para tu asesor."

El valor está en la **pre-campaña trimestral**: organización, checklist, documentación y empaquetado final.

### Propuesta de valor secundaria (marketing)

> "Esta herramienta se paga sola encontrando el dinero que olvidas deducir."

### Naming

El nombre del producto es provisional. El producto **no debe usar términos como "Fiscal", "Impuestos", "Taxes", "Hacienda"** en su naming final ni en su interfaz.

Motivo: evitar confusión con ERPs o software de cálculo fiscal y proteger el posicionamiento como capa previa y neutral.

### Diferenciación

No compite con Quipu, Holded, Declarando ni gestorías online. Compite con:

- El caos documental
- La ansiedad pre-trimestre
- El "me falta algo"
- Los emails desordenados al asesor
- Google Drive (que no te dice qué te falta)

---

## 2. Público objetivo y dolor

### Usuario principal

- Autónomos y freelancers
- Micro-pymes de servicios (1-5 personas)
- Profesionales: consultores, psicólogos, diseñadores, sanitarios, formadores
- Con asesor/gestor fiscal externo
- Patrón de uso: acumulación durante el trimestre + sprint de cierre

### Usuario secundario (indirecto)

Asesores fiscales que reciben la información preparada.

### Fuera de alcance V1

- Autónomos que quieren autogestionar impuestos sin asesor
- Empresas medianas o grandes
- Gestión multi-empresa por usuario
- Roles múltiples (admin, colaborador, etc.)

### Dolor que resuelve

**Verbatims reales:**

- "No sé si tengo todo"
- "Seguro que algo me falta"
- "Me da apuro escribir al asesor sin tenerlo claro"
- "Esto me ocupa la cabeza durante semanas"
- "Siempre lo hago tarde y con estrés"

**Dolor adicional identificado:**

- Miedo a sanciones retroactivas (Hacienda puede revisar hasta 4 años atrás)
- Sensación de caos documental (tickets en papel, PDFs en email, fotos en móvil)
- Relación tensa con el asesor por entregas incompletas
- Olvido de gastos deducibles (dinero que se pierde)

**El problema NO es:**

- Calcular IVA o IRPF
- Entender modelos fiscales
- Presentar declaraciones

El problema es **organizativo y emocional**, no matemático.

---

## 3. Alcance V1

### Incluido

| Funcionalidad | Descripción |
|---------------|-------------|
| Gestión de trimestres | Creación automática, estados, histórico |
| Checklist guiada | 17 ítems en 5 secciones con estados |
| **Memoria Trimestral** | Clonado de gastos recurrentes del trimestre anterior |
| Subida de documentación | Drag & drop múltiple, foto desde móvil |
| Organización automática | Por trimestre y tipo (ingresos, gastos, banco, otros) |
| Señales de huecos | Avisos neutros si falta documentación |
| **Señales de recurrentes** | Aviso si falta un gasto que subiste el trimestre anterior |
| Notas para el asesor | Campo libre con marcador "para el asesor" |
| Resumen final | PDF profesional generado automáticamente |
| **Resumen Ejecutivo** | PDF de 1 página optimizado para el asesor |
| Paquete documental | ZIP estructurado por carpetas |
| **Certificado de cierre** | Documento personal de confirmación |
| Ritual de cierre | Botón explícito + congelación del trimestre |
| **Microcopy emocional** | Mensajes contextuales según estado y momento |
| **Plantilla WhatsApp** | Texto optimizado para enviar al asesor |

### Explícitamente fuera de V1

| Funcionalidad | Razón | Versión futura |
|---------------|-------|----------------|
| Email forwarding | Complejidad técnica, coste | V2 |
| Checklist por profesión | Fricción en onboarding | V2 |
| Modo Foco (paso a paso) | Añade complejidad | V2 |
| Facturación | Fuera de posicionamiento | V3+ |
| Cálculo de impuestos | Fuera de posicionamiento | Nunca |
| Modelos fiscales | Fuera de posicionamiento | Nunca |
| Conciliación bancaria | Complejidad, riesgo | V3+ |
| Panel del asesor | Requiere B2B | V2 |
| IA/Asistente | Complejidad, coste | V3+ |
| Multi-empresa | Complejidad | V2+ |
| Recordatorios por email | Infraestructura adicional | V2 |

### Ámbito geográfico

- País: España
- Idioma: Español (ES)
- Sin internacionalización en V1

---

## 4. Elementos diferenciadores

Estas son las características que hacen el producto **outstanding** frente a alternativas como Google Drive o carpetas manuales.

### 4.1 Memoria Trimestral (diferenciador clave)

**Qué es:** El sistema recuerda los proveedores/conceptos de gastos recurrentes del trimestre anterior y los espera en el nuevo trimestre.

**Cómo funciona:**
- Al cerrar Q1, el sistema guarda: "Vodafone", "Adobe", "Seguro RC", "Alquiler"
- Al crear Q2, el sistema muestra: "En Q1 subiste estos gastos recurrentes. ¿Los tienes para Q2?"
- Lista de gastos esperados con estado "Pendiente"

**Por qué es clave:**
- Google Drive no hace esto
- Crea coste de cambio real (irse = empezar de cero)
- Reduce olvidos de gastos deducibles
- El usuario siente que el sistema "aprende"

**Mensaje:** "Cada trimestre que cierras, el siguiente es más fácil."

---

### 4.2 Certificado de Cierre

**Qué es:** Un documento personal (no para el asesor) que confirma al usuario que hizo las cosas bien.

**Contenido:**
```
CERTIFICADO DE CIERRE
─────────────────────────────────────

Trimestre Q4 2025 ✓ Cerrado

Fecha de cierre: 15 de enero de 2026

Lo que revisaste:
• 17 ítems de checklist
• 23 documentos organizados
• 2 dudas anotadas para tu asesor

Tiempo invertido: ~45 minutos
(distribuidos en 3 sesiones)

─────────────────────────────────────

Puedes soltar esto de tu cabeza.
Tu asesor tiene todo lo que necesita.
```

**Por qué importa:**
- Ancla emocional de "está hecho"
- Nadie te da un "recibo" de que hiciste las cosas bien
- Refuerza el valor del producto

---

### 4.3 Comparador Silencioso (normalización social)

**Qué es:** Mensajes que normalizan la experiencia sin mostrar datos de otros usuarios.

**Ejemplos:**
- "La mayoría de usuarios cierran el trimestre entre el día 10 y el 15. Vas bien."
- "El 70% de usuarios marca al menos un ítem como dudoso. Es completamente normal."
- "Es habitual olvidar los tickets de parking. Por eso te lo preguntamos."

**Por qué importa:**
- Reduce vergüenza y sensación de "soy el único desastre"
- Normaliza dudas y olvidos
- Tono empático sin ser condescendiente

---

### 4.4 Plantilla de WhatsApp

**Qué es:** Además del texto de email, un mensaje corto optimizado para WhatsApp (donde muchos autónomos realmente hablan con su gestor).

**Ejemplo:**
```
Hola! Te envío el trimestre Q4 2025 📋

📎 ZIP con todos los documentos
📄 PDF resumen

⚠️ 2 cosas para revisar contigo

Te lo mando por email también. ¡Gracias!
```

**Por qué importa:**
- Reconoce cómo funciona realmente la comunicación autónomo-asesor
- Reduce fricción del "¿cómo se lo digo?"

---

## 5. Checklist trimestral

### Principios de diseño

- No interpreta fiscalidad
- No asume error
- Actúa como **espejo organizativo**
- Lenguaje humano, no técnico
- Mensajes siempre neutros y no bloqueantes

### Estados de cada ítem

| Estado | Icono | Significado |
|--------|-------|-------------|
| Pendiente | ⬜ | No revisado |
| Completado | ✅ | Revisado y OK |
| Dudoso | ⚠️ | Revisar con asesor |

---

### 5.1 Sección: Ingresos

**Objetivo:** Asegurar que todos los ingresos del trimestre están documentados.

| # | Ítem | Ayuda contextual |
|---|------|------------------|
| 1 | He reunido todas las facturas emitidas en este trimestre | Incluye facturas a empresas, plataformas o particulares |
| 2 | He revisado que no haya ingresos cobrados sin factura | Cobros por Bizum, PayPal, Stripe, transferencias |
| 3 | He incluido ingresos de plataformas (Stripe, PayPal, marketplaces) | Aunque luego el asesor los trate de forma conjunta |
| 4 | He revisado cobros fuera de fecha (factura de un mes cobrada en otro) | Márcalo como dudoso si no estás seguro |

**Señal automática:** Si no hay ningún documento en esta sección → "No hay ingresos documentados. Puede que esté todo correcto, pero revisa esta sección."

---

### 5.2 Sección: Gastos

**Objetivo:** Recopilar justificantes y evitar olvidos típicos.

| # | Ítem | Ayuda contextual |
|---|------|------------------|
| 5 | He reunido todas las facturas de gastos del trimestre | Alquiler, suministros, herramientas, formación, servicios |
| 6 | He revisado tickets pequeños o gastos en efectivo | Transporte, parking, comidas puntuales |
| 7 | He incluido suscripciones y gastos recurrentes | Software, plataformas, herramientas digitales |
| 8 | He separado los gastos dudosos o mixtos (personal/profesional) | Márcalos como "revisar con el asesor" |
| 9 | He descartado gastos claramente personales | No hace falta subirlos |

**Señal automática:** Si no hay ningún documento → "No hay gastos documentados. Puede que esté todo correcto, pero revisa esta sección."

**Señal de Memoria Trimestral:** Si hay gastos recurrentes esperados → "En el trimestre anterior subiste [Vodafone, Adobe...]. ¿Los tienes para este?"

---

### 5.3 Sección: Banco

**Objetivo:** Permitir al asesor contrastar movimientos con documentación.

| # | Ítem | Ayuda contextual |
|---|------|------------------|
| 10 | He subido el extracto bancario del trimestre | Cuenta profesional o principal |
| 11 | He comprobado que los ingresos del banco coinciden con lo documentado | — |
| 12 | He identificado movimientos que no reconozco | Márcalos como dudosos |

**Señal automática:** Si no hay extracto bancario → "No hay extracto bancario. Puede que esté todo correcto, pero revisa esta sección."

---

### 5.4 Sección: Otros

**Objetivo:** No olvidar elementos menos frecuentes.

| # | Ítem | Ayuda contextual |
|---|------|------------------|
| 13 | He incluido documentación especial (subvenciones, ayudas, indemnizaciones) | — |
| 14 | He revisado si hay facturas rectificativas o abonos | — |
| 15 | He anotado cualquier situación poco habitual de este trimestre | — |

---

### 5.5 Sección: Cierre

**Objetivo:** Confirmar que el trimestre está listo.

| # | Ítem | Ayuda contextual |
|---|------|------------------|
| 16 | He revisado que todas las secciones tengan contenido o estén justificadas | — |
| 17 | He dejado notas claras para el asesor si hay dudas | — |

**Ítem final (no contabiliza en checklist):**
- ⬜ Considero este trimestre **listo para enviar**

---

### Qué significa "justificado"

Una sección se considera justificada cuando:

- El usuario la ha revisado conscientemente
- La ha marcado como completa
- Ha dejado nota si lo considera necesario

No implica corrección fiscal. El usuario decide, el sistema no bloquea.

---

## 6. Memoria Trimestral

### Concepto

El sistema detecta gastos recurrentes y los "espera" en trimestres futuros.

### Funcionamiento técnico

#### Al cerrar un trimestre:

1. Identificar documentos de gastos subidos
2. Extraer "concepto" del nombre del archivo o etiqueta del usuario
3. Guardar lista de conceptos recurrentes en `recurring_expenses`

#### Al crear el siguiente trimestre:

1. Consultar `recurring_expenses` del usuario
2. Crear entradas en `expected_documents` con estado "pending"
3. Mostrar sección "Gastos esperados" en la UI

### Interfaz

```
GASTOS ESPERADOS (del trimestre anterior)
─────────────────────────────────────────

En Q3 subiste estos gastos. ¿Los tienes para Q4?

⬜ Vodafone (factura mensual)
⬜ Adobe Creative Cloud
⬜ Seguro RC Profesional
✅ Alquiler oficina ← ya subido

[+ Añadir otro gasto recurrente]
```

### Lógica de detección

**V1 (simple):** El usuario puede marcar manualmente un documento como "recurrente" al subirlo.

**V1.1 (automático):** Detectar automáticamente si un concepto similar aparece en 2+ trimestres consecutivos.

### Valor diferencial

| Sin Memoria Trimestral | Con Memoria Trimestral |
|------------------------|------------------------|
| Cada trimestre empiezo de cero | El 50% del trabajo ya está identificado |
| Olvido gastos recurrentes | El sistema me los recuerda |
| Puedo irme a Drive fácilmente | Irme significa perder esta inteligencia |

---

## 7. Output para el asesor

### 7.1 Resumen Ejecutivo (1 página) — NUEVO

**Objetivo:** El asesor ve en 30 segundos si está todo.

**Estructura:**

```
RESUMEN EJECUTIVO — Q4 / 2025
═══════════════════════════════════════════════

Cliente: María García (maria@ejemplo.com)
Fecha de cierre: 15/01/2026

ESTADO GENERAL
──────────────
✅ Trimestre completo y listo para revisar

DOCUMENTACIÓN
─────────────
Ingresos    │ 8 documentos
Gastos      │ 15 documentos  
Banco       │ 1 extracto
Otros       │ 2 documentos
────────────┼─────────────
TOTAL       │ 26 documentos

CONFIRMACIONES DEL CLIENTE
──────────────────────────
✓ No hay ingresos sin factura
✓ No hay cobros por Bizum/PayPal sin documentar
✓ Todos los movimientos bancarios identificados

ELEMENTOS A REVISAR
───────────────────
⚠️ Gasto mixto: factura teléfono móvil (uso personal/profesional)
⚠️ Ingreso de plataforma: comisiones de Stripe

NOTAS DEL CLIENTE
─────────────────
"Este trimestre vendí un equipo usado, no sé cómo declararlo."

═══════════════════════════════════════════════
Documento generado automáticamente.
ZIP con documentación completa adjunto.
```

**Por qué importa para el asesor:**
- Ve todo en 1 página
- Sabe qué revisar sin abrir 26 archivos
- Reduce llamadas y emails
- Querrá que todos sus clientes usen esto

---

### 7.2 PDF Resumen Trimestral (completo)

**Estructura del documento:**

```
PORTADA
────────────────────────────────
Resumen Trimestral — Q[X] / [Año]

Cliente: [Nombre/Email]
Trimestre: Q[X] [Año]
Fecha de cierre: [dd/mm/aaaa]
────────────────────────────────

1. ESTADO GENERAL
────────────────────────────────
Checklist completada: [XX]%
Estado: ✅ Listo para revisar / ⚠️ Con elementos a revisar

2. DOCUMENTACIÓN INCLUIDA
────────────────────────────────
Ingresos: [X] documentos
Gastos: [X] documentos
Banco: Extracto incluido [Sí/No]
Otros: Documentación adicional [Sí/No]

3. ELEMENTOS MARCADOS PARA REVISIÓN
────────────────────────────────
[Lista de ítems marcados como ⚠️ Dudoso]
- [Texto del ítem 1]
- [Texto del ítem 2]

4. NOTAS DEL CLIENTE
────────────────────────────────
[Notas marcadas como "para el asesor"]
- [Nota 1]
- [Nota 2]

5. OBSERVACIONES
────────────────────────────────
Este resumen ha sido generado como herramienta 
de preparación documental.

No sustituye el criterio profesional del asesor 
ni implica cálculo o interpretación fiscal.
```

---

### 7.3 Certificado de Cierre (para el usuario)

**Documento personal, no se envía al asesor.**

```
╔═══════════════════════════════════════════════╗
║                                               ║
║         CERTIFICADO DE CIERRE                 ║
║                                               ║
║         Trimestre Q4 2025 ✓                   ║
║                                               ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  Cerrado el 15 de enero de 2026               ║
║                                               ║
║  Revisaste:                                   ║
║  • 17 ítems de checklist                      ║
║  • 26 documentos organizados                  ║
║  • 2 dudas anotadas para tu asesor            ║
║                                               ║
║  Gastos recurrentes guardados: 4              ║
║  (Te los recordaremos en Q1 2026)             ║
║                                               ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  Puedes soltar esto de tu cabeza.             ║
║  Tu asesor tiene todo lo que necesita.        ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

---

### 7.4 ZIP Estructurado

**Estructura de carpetas:**

```
[Nombre]_Q[X]_[Año].zip
├── 00_RESUMEN_EJECUTIVO.pdf
├── 01_INGRESOS/
│   ├── factura_001.pdf
│   ├── factura_002.pdf
│   └── ...
├── 02_GASTOS/
│   ├── gasto_001.pdf
│   ├── ticket_001.jpg
│   └── ...
├── 03_BANCO/
│   └── extracto_Q[X]_[Año].pdf
├── 04_OTROS/
│   └── ...
└── RESUMEN_COMPLETO_Q[X]_[Año].pdf
```

---

### 7.5 Texto para email

```
Hola,

Te envío la documentación del trimestre Q[X] [Año].

Adjunto encontrarás:
- ZIP con todos los documentos organizados por carpetas
- PDF con el resumen ejecutivo (1 página)
- PDF con el resumen completo

[Si hay elementos dudosos:]
He marcado algunos elementos para revisar contigo:
- [Lista de dudosos]

[Si hay notas:]
Notas adicionales:
- [Notas]

Quedo a tu disposición para cualquier duda.

Un saludo
```

---

### 7.6 Plantilla WhatsApp

```
Hola! Te envío el trimestre Q[X] [Año] 📋

📎 ZIP con todos los documentos
📄 PDF resumen ejecutivo

[Si hay dudosos:]
⚠️ [N] cosas para revisar contigo

Te lo mando por email también. ¡Gracias!
```

---

## 8. Sistema de microcopy emocional

### Principio

Los mensajes cambian según el estado del usuario y el momento del trimestre. El tono es humano, cálido y nunca culpabiliza.

### Mensajes por contexto

#### Al entrar por primera vez
```
"Bienvenido. Vamos a cerrar este trimestre juntos, paso a paso."
```

#### Dashboard - Inicio del trimestre (día 1-10 del periodo)
```
"Tranquilo, tienes tiempo. Pero empezar ahora es un regalo para tu yo futuro."
```

#### Dashboard - Mitad del periodo (día 10-15)
```
"Buen momento para avanzar. Unos minutos ahora te ahorran horas después."
```

#### Dashboard - Final del periodo (día 15-20)
```
"Últimos días. Pero no pasa nada, para eso estamos aquí."
```

#### Progreso 25%
```
"Ya has empezado. Eso es lo más difícil."
```

#### Progreso 50%
```
"Vas por la mitad. Esto ya es más de lo que la mayoría hace a estas alturas."
```

#### Progreso 75%
```
"Casi está. Solo quedan los últimos detalles."
```

#### Progreso 100% (antes de cerrar)
```
"Todo revisado. Cuando quieras, cierra el trimestre."
```

#### Al cerrar el trimestre
```
"Hecho. Respira. Tu asesor te lo agradecerá."
```

#### Al volver después de días sin acceder
```
"Bienvenido de vuelta. Todo sigue aquí, donde lo dejaste."
```

#### Al marcar algo como dudoso
```
"Bien hecho. Marcar dudas es señal de que lo estás haciendo bien."
```

#### Señal de sección vacía
```
"Puede que esté todo correcto, pero no hay documentos aquí. 
Solo asegúrate de que es así."
```

#### Señal de gasto recurrente faltante
```
"En el trimestre anterior subiste [concepto]. 
¿Lo tienes para este? Si no aplica, ignora esto."
```

### Comparador silencioso (normalización)

Mensajes que aparecen contextualmente:

```
"La mayoría de usuarios cierran entre el día 10 y el 15. Vas bien."

"El 70% de usuarios marca al menos un ítem como dudoso. Es completamente normal."

"Es habitual olvidar los tickets de parking. Por eso te lo preguntamos."

"Muchos autónomos olvidan los gastos de formación. ¿Tienes algún curso este trimestre?"
```

---

## 9. Automatizaciones

### Principios

- Automatizar solo lo obvio y repetitivo
- Nunca tomar decisiones fiscales por el usuario
- Mostrar señales, no juicios
- Priorizar alivio mental frente a eficiencia técnica

---

### 9.1 Ciclo trimestral

| Automatización | Trigger | Acción |
|----------------|---------|--------|
| Creación de trimestre | Primer acceso en nuevo trimestre | Crear trimestre (Q1-Q4) en estado "preparation" |
| Activación de trimestre | Login del usuario | Mostrar trimestre vigente como activo |
| **Clonado de recurrentes** | Creación de trimestre | Copiar gastos recurrentes del trimestre anterior como "esperados" |

---

### 9.2 Checklist

| Automatización | Trigger | Acción |
|----------------|---------|--------|
| Inicialización | Creación de trimestre | Generar 17 ítems con estado "pending" |
| Progreso | Cambio de estado de ítem | Recalcular % completado |

**Fórmula de progreso:**
```
progreso = (ítems completados + ítems dudosos) / total ítems × 100
```

Nota: Los ítems dudosos cuentan como "revisados" para el progreso.

---

### 9.3 Documentación

| Automatización | Trigger | Acción |
|----------------|---------|--------|
| Clasificación | Subida de archivo | Asociar a trimestre activo, clasificar por tipo |
| Normalización | Subida de archivo | Renombrar según patrón: `[tipo]_[timestamp].[ext]` |
| **Detección recurrente** | Subida de archivo | Si el usuario lo marca como recurrente, guardar en `recurring_expenses` |

---

### 9.4 Señales

| Señal | Condición | Mensaje |
|-------|-----------|---------|
| Sección vacía | 0 documentos en sección | "Puede que esté todo correcto, pero no hay documentos en esta sección." |
| Sin extracto | Sección Banco sin documento | "No hay extracto bancario." |
| Sin gastos | Sección Gastos vacía | "No hay gastos documentados." |
| **Recurrente faltante** | Gasto esperado sin documento | "En Q[anterior] subiste [concepto]. ¿Lo tienes para este trimestre?" |

**Comportamiento:** Las señales son informativas, nunca bloquean acciones.

---

### 9.5 Cierre

| Automatización | Trigger | Acción |
|----------------|---------|--------|
| Validación | Clic en "Marcar como listo" | Mostrar resumen de señales activas |
| Generación Resumen Ejecutivo | Confirmación de cierre | Generar PDF 1 página con jsPDF |
| Generación PDF completo | Confirmación de cierre | Generar PDF con jsPDF |
| Generación ZIP | Confirmación de cierre | Generar ZIP con JSZip |
| **Generación Certificado** | Confirmación de cierre | Generar PDF personal con jsPDF |
| **Guardado de recurrentes** | Confirmación de cierre | Guardar lista de gastos marcados como recurrentes |
| Congelación | Cierre confirmado | Cambiar estado a "ready", bloquear edición |

**Desbloqueo:** El usuario puede desbloquear un trimestre cerrado si necesita hacer cambios.

---

### 9.6 Microcopy

| Automatización | Trigger | Acción |
|----------------|---------|--------|
| Mensaje contextual | Carga de dashboard | Seleccionar mensaje según día del periodo y progreso |
| Mensaje de normalización | Carga de sección | Mostrar aleatoriamente 1 de N mensajes de normalización |
| Mensaje de bienvenida | Primer acceso del día tras >3 días | "Bienvenido de vuelta..." |

---

## 10. Arquitectura técnica

### Stack

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Frontend | Astro (MPA) | Simple, rápido, SEO-friendly |
| Estilos | CSS vanilla o Tailwind | Sin dependencias pesadas |
| Interactividad | JavaScript vanilla | Solo donde aporta valor |
| Backend | Supabase | Auth, DB, Storage, RLS integrados |
| Auth | Supabase Magic Link | Sin contraseñas, mínima fricción |
| Base de datos | PostgreSQL (Supabase) | Relacional, RLS nativo |
| Storage | Supabase Storage | Buckets privados por usuario |
| PDF | jsPDF (cliente) | Sin servidor, sin límites |
| ZIP | JSZip (cliente) | Sin servidor, sin límites |
| Hosting | GitHub Pages / Netlify | Gratuito, simple |

### Principios de arquitectura

- Frontend estático, backend desacoplado
- Seguridad por diseño (RLS), no por lógica en frontend
- Generación de PDF/ZIP en cliente (sin dependencia de servidor)
- Todo lo crítico en Supabase (auth, datos, archivos)

### Decisiones técnicas V1

| Decisión | Opción elegida | Alternativa descartada | Razón |
|----------|----------------|------------------------|-------|
| PDF/ZIP | Cliente (jsPDF, JSZip) | Edge Functions | Más simple, sin límites de tiempo/memoria, coste 0 |
| Email forwarding | Descartado V1 | Mailgun/Postmark | Complejidad técnica, coste, poca ganancia |
| Auth | Magic Link | Contraseña + OAuth | Mínima fricción, sin gestión de passwords |

---

## 11. Modelo de datos

### 11.1 Diagrama de relaciones

```
users (Supabase Auth)
  │
  └──< profiles
        │
        ├──< recurring_expenses (NUEVO)
        │
        └──< trimestres
              │
              ├──< checklist_items
              ├──< documents
              ├──< expected_documents (NUEVO)
              └──< notes
```

### 11.2 Tabla: profiles

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID, PK | Vinculado a auth.users |
| email | TEXT | Email del usuario |
| created_at | TIMESTAMP | Fecha de registro |

### 11.3 Tabla: trimestres

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID, PK | — |
| user_id | UUID, FK | → profiles.id |
| year | INT | Año (2024, 2025...) |
| quarter | INT | Trimestre (1-4) |
| status | ENUM | 'preparation', 'ready', 'sent' |
| checklist_progress | INT | 0-100 |
| created_at | TIMESTAMP | — |
| closed_at | TIMESTAMP | Nullable, fecha de cierre |

**Constraint:** UNIQUE(user_id, year, quarter)

### 11.4 Tabla: checklist_items

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID, PK | — |
| trimestre_id | UUID, FK | → trimestres.id |
| section | ENUM | 'ingresos', 'gastos', 'banco', 'otros', 'cierre' |
| item_number | INT | 1-17 |
| label | TEXT | Texto del ítem |
| help_text | TEXT | Ayuda contextual |
| status | ENUM | 'pending', 'done', 'doubtful' |
| created_at | TIMESTAMP | — |
| updated_at | TIMESTAMP | — |

### 11.5 Tabla: documents

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID, PK | — |
| user_id | UUID, FK | → profiles.id |
| trimestre_id | UUID, FK | → trimestres.id |
| section | ENUM | 'ingresos', 'gastos', 'banco', 'otros' |
| original_name | TEXT | Nombre original del archivo |
| file_path | TEXT | Ruta en Storage |
| file_size | INT | Bytes |
| mime_type | TEXT | — |
| **is_recurring** | BOOLEAN | Marcado como gasto recurrente |
| **concept_label** | TEXT | Etiqueta del concepto (ej: "Vodafone") |
| created_at | TIMESTAMP | — |

### 11.6 Tabla: recurring_expenses (NUEVA)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID, PK | — |
| user_id | UUID, FK | → profiles.id |
| concept_label | TEXT | Nombre del concepto (ej: "Vodafone") |
| section | ENUM | 'gastos' (por ahora solo gastos) |
| last_seen_quarter | INT | Último trimestre donde apareció |
| last_seen_year | INT | Último año donde apareció |
| created_at | TIMESTAMP | — |
| updated_at | TIMESTAMP | — |

### 11.7 Tabla: expected_documents (NUEVA)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID, PK | — |
| trimestre_id | UUID, FK | → trimestres.id |
| recurring_expense_id | UUID, FK | → recurring_expenses.id |
| status | ENUM | 'pending', 'fulfilled', 'dismissed' |
| fulfilled_by | UUID, FK, nullable | → documents.id (cuando se sube) |
| created_at | TIMESTAMP | — |

### 11.8 Tabla: notes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID, PK | — |
| trimestre_id | UUID, FK | → trimestres.id |
| content | TEXT | Contenido de la nota |
| for_advisor | BOOLEAN | Marcar como "para el asesor" |
| created_at | TIMESTAMP | — |

### 11.9 Storage

**Estructura de buckets:**

```
documents (bucket privado)
└── {user_id}/
    └── {year}_Q{quarter}/
        ├── ingresos/
        ├── gastos/
        ├── banco/
        └── otros/
```

### 11.10 Row Level Security (RLS)

**Principio:** Un usuario solo ve y modifica sus propios datos.

```sql
-- Ejemplo para trimestres
CREATE POLICY "Users can only access own trimestres"
ON trimestres
FOR ALL
USING (user_id = auth.uid());

-- Ejemplo para documents
CREATE POLICY "Users can only access own documents"
ON documents
FOR ALL
USING (user_id = auth.uid());

-- Ejemplo para recurring_expenses
CREATE POLICY "Users can only access own recurring_expenses"
ON recurring_expenses
FOR ALL
USING (user_id = auth.uid());
```

**RLS obligatorio en todas las tablas.** La seguridad nunca se delega al frontend.

---

## 12. Diseño UX/UI

### Principios de diseño

| Principio | Significado |
|-----------|-------------|
| Calma antes que densidad | Pocas cosas en pantalla, bien espaciadas |
| Claridad > eficiencia | Que se entienda sin explicar |
| Estado visible | El usuario sabe siempre dónde está |
| Cierre explícito | Cada trimestre debe sentirse terminado |
| **Tono humano** | Mensajes que acompañan, no que juzgan |

### Look & Feel

- Profesional, sobrio, cálido
- Inspiración: herramientas financieras modernas + bienestar digital
- **No debe parecer un ERP ni software contable**

### Paleta de colores

| Uso | Color | Ejemplo |
|-----|-------|---------|
| Fondo principal | Gris muy claro / piedra | #F5F5F0 |
| Texto principal | Gris oscuro casi negro | #1A1A1A |
| Acción primaria | Verde suave o azul petróleo | #2D5A4A |
| Completado/OK | Verde suave | #4A7C59 |
| Revisar/Dudoso | Ámbar | #D4A84B |
| Pendiente | Gris medio | #9CA3AF |

**Prohibido:** Rojo agresivo, colores saturados, degradados llamativos.

### Tipografía

- Sans-serif moderna y legible (Inter, DM Sans, o similar)
- Jerarquía clara: títulos grandes y tranquilos, texto de checklist legible
- Tamaño mínimo: 16px para texto principal

### Componentes clave

#### Tarjeta de trimestre
```
┌─────────────────────────────────┐
│  Q4 / 2025                      │
│  ━━━━━━━━━━━━━━━━━━ 65%        │
│  En preparación                 │
│                                 │
│  "Vas por la mitad. Esto ya    │
│   es más de lo que la mayoría  │
│   hace a estas alturas."       │
│                                 │
│  [Continuar cierre]             │
└─────────────────────────────────┘
```

#### Ítem de checklist
```
┌─────────────────────────────────────────────┐
│ ⬜ He reunido todas las facturas emitidas   │
│    ℹ️ Incluye facturas a empresas...        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ✅ He reunido todas las facturas emitidas   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ⚠️ He reunido todas las facturas emitidas   │
│    Marcado para revisar con el asesor       │
└─────────────────────────────────────────────┘
```

#### Sección de gastos esperados (Memoria Trimestral)
```
┌─────────────────────────────────────────────┐
│ 📋 GASTOS ESPERADOS                         │
│    (del trimestre anterior)                 │
│                                             │
│ En Q3 subiste estos gastos. ¿Los tienes?   │
│                                             │
│ ⬜ Vodafone                                 │
│ ⬜ Adobe Creative Cloud                     │
│ ✅ Alquiler oficina ← ya subido            │
│ ⬜ Seguro RC                                │
│                                             │
│ [+ Añadir otro gasto recurrente]           │
└─────────────────────────────────────────────┘
```

#### Señal/Aviso
```
┌─────────────────────────────────────────────┐
│ ℹ️ Puede que esté todo correcto, pero no   │
│    hay documentos en esta sección.          │
└─────────────────────────────────────────────┘
```

#### Mensaje de normalización
```
┌─────────────────────────────────────────────┐
│ 💡 El 70% de usuarios marca al menos un    │
│    ítem como dudoso. Es completamente      │
│    normal.                                  │
└─────────────────────────────────────────────┘
```

Nunca modal bloqueante. Siempre discreto e informativo.

#### Zona de documentación
```
┌─────────────────────────────────────────────┐
│                                             │
│     📄 Arrastra archivos aquí               │
│        o haz clic para seleccionar          │
│                                             │
└─────────────────────────────────────────────┘

Archivos subidos:
├── factura_001.pdf (245 KB)
├── factura_002.pdf (189 KB) ⟲ Recurrente
└── ticket_003.jpg (1.2 MB)
```

#### Checkbox de recurrente
```
☐ Marcar como gasto recurrente
  (Te lo recordaremos en el próximo trimestre)
```

### Antipatrones (prohibido)

- ❌ Tablas complejas con muchas columnas
- ❌ Terminología fiscal (IVA, IRPF, modelo 303...)
- ❌ Colores agresivos o alertas rojas
- ❌ Dashboards con muchos números
- ❌ Múltiples CTAs competiendo
- ❌ Sensación de "software contable"
- ❌ Modales bloqueantes
- ❌ Formularios largos
- ❌ Mensajes culpabilizadores

---

## 13. Pantallas y flujos

### Mapa de pantallas

```
Landing → Login → Dashboard → Trimestre → Resumen → Certificado
                     │                       │
                     └── Ajustes             └── Descarga
```

**Solo 6 pantallas + 1 documento.** Todo lo demás es navegación.

---

### 13.1 Landing

**Pregunta mental:** "¿Esto es para mí?"

**Contenido:**

```
PREPARADOR DE TRIMESTRES
────────────────────────────────────────

Prepara el trimestre antes de escribir 
a tu asesor.

No calculamos impuestos. 
Te ayudamos a llegar con todo ordenado.

✓ Checklist guiada
✓ Documentos organizados  
✓ El sistema recuerda tus gastos recurrentes
✓ Resumen listo para enviar

[Empezar mi trimestre]

─────────────────────────────────────────
"Esta herramienta se paga sola encontrando
el dinero que olvidas deducir."
```

**Decisiones:**
- Sin features detalladas
- Sin pricing visible
- Contexto emocional + claridad
- Un solo CTA

---

### 13.2 Login

**Pregunta mental:** "Déjame entrar sin líos"

**Contenido:**

```
ACCEDER
────────────────────────────────────────

[Email                               ]

[Enviarme enlace]

Sin contraseñas. Sin spam.
```

**Decisiones:**
- Magic link únicamente
- Sin registro separado (login = registro)
- Cero fricción

---

### 13.3 Dashboard

**Pregunta mental:** "¿Cómo voy con el trimestre?"

**Contenido:**

```
DASHBOARD
────────────────────────────────────────

[Mensaje contextual según fecha/progreso]
"Vas por la mitad. Esto ya es más de lo 
que la mayoría hace a estas alturas."

┌─────────────────────────────────┐
│  Q4 / 2025                      │
│  ━━━━━━━━━━━━━━━━━━ 65%        │
│  En preparación                 │
│                                 │
│  4 gastos esperados pendientes  │
│                                 │
│  [Continuar cierre]             │
└─────────────────────────────────┘

Trimestres anteriores
─────────────────────
Q3 / 2025 — ✅ Enviado
Q2 / 2025 — ✅ Enviado
```

**Decisiones:**
- El dashboard NO es analítico
- Es un punto de reentrada
- Una sola acción principal
- Históricos en modo lectura
- Mensaje contextual visible

---

### 13.4 Trimestre (pantalla principal)

**Pregunta mental:** "¿Qué tengo que hacer ahora?"

**Estructura:**

```
TRIMESTRE Q4 / 2025
━━━━━━━━━━━━━━━━━━━━━━━━ 65%
En preparación
────────────────────────────────────────

📋 GASTOS ESPERADOS (del Q3)
┌─────────────────────────────────────────┐
│ ⬜ Vodafone                             │
│ ⬜ Adobe Creative Cloud                 │
│ ✅ Alquiler oficina                     │
│ [+ Añadir otro]                         │
└─────────────────────────────────────────┘

────────────────────────────────────────

INGRESOS (3/4 completados)               ▼
┌─────────────────────────────────────────┐
│ ✅ He reunido todas las facturas...     │
│ ✅ He revisado ingresos sin factura...  │
│ ⬜ He incluido ingresos de plataformas  │
│ ✅ He revisado cobros fuera de fecha    │
└─────────────────────────────────────────┘

📄 Documentos de ingresos (3)
   ├── factura_001.pdf
   ├── factura_002.pdf
   └── factura_003.pdf
   [+ Subir documento]

────────────────────────────────────────

GASTOS (4/5 completados)                 ▶
BANCO (2/3 completados)                  ▶
OTROS (0/3 completados)                  ▶

ℹ️ No hay documentos en "Otros". 
   Puede que esté todo correcto.

💡 El 70% de usuarios marca al menos un 
   ítem como dudoso. Es normal.

────────────────────────────────────────

NOTAS
┌─────────────────────────────────────────┐
│ [Escribe notas o dudas...]              │
│                                         │
│                                         │
└─────────────────────────────────────────┘
☐ Esto es para mi asesor

────────────────────────────────────────

[Marcar trimestre como listo para enviar]
```

**Comportamiento:**
- Gastos esperados visibles arriba (si hay)
- Secciones plegables (acordeón)
- Documentos asociados a cada sección
- Señales visibles pero no bloqueantes
- Progreso se actualiza en tiempo real
- Mensaje de normalización aleatorio

---

### 13.5 Resumen

**Pregunta mental:** "¿Puedo enviarlo tranquilo?"

**Contenido:**

```
RESUMEN Q4 / 2025
────────────────────────────────────────

Estado: ✅ Listo para enviar
Checklist: 100%
Fecha de cierre: 15/01/2026

DOCUMENTACIÓN
─────────────
Ingresos: 5 documentos
Gastos: 12 documentos
Banco: 1 extracto
Otros: 2 documentos

GASTOS RECURRENTES GUARDADOS
────────────────────────────
4 conceptos guardados para Q1 2026:
• Vodafone
• Adobe Creative Cloud
• Alquiler oficina
• Seguro RC

ELEMENTOS A REVISAR CON EL ASESOR
─────────────────────────────────
• Gasto mixto: factura teléfono móvil
• Ingreso de plataforma: comisión Stripe

NOTAS PARA EL ASESOR
────────────────────
• Este trimestre vendí un equipo usado, 
  no sé cómo declararlo.

────────────────────────────────────────

[Descargar Resumen Ejecutivo (1 pág)]
[Descargar PDF completo]
[Descargar ZIP]

[Copiar texto para email]
[Copiar texto para WhatsApp]

────────────────────────────────────────

[Ver mi Certificado de Cierre]
```

**Decisiones:**
- Solo lectura
- No se edita aquí
- Múltiples opciones de exportación claras
- Acceso al Certificado personal

---

### 13.6 Ajustes

**Contenido mínimo:**

```
AJUSTES
────────────────────────────────────────

Email: usuario@ejemplo.com

Gastos recurrentes guardados: 4
[Ver y editar]

[Descargar mis datos]

[Borrar mi cuenta]
```

---

### Flujo completo del usuario

```
1. ENTRADA
   Usuario llega a landing → CTA "Empezar mi trimestre"

2. ACCESO
   Introduce email → Recibe magic link → Accede

3. ACTIVACIÓN
   Si no existe trimestre → Sistema lo crea automáticamente
   Si hay trimestre anterior → Clonar gastos recurrentes como "esperados"
   Dashboard muestra trimestre activo + mensaje contextual

4. RECOPILACIÓN
   Usuario entra en Trimestre
   Ve gastos esperados (si hay) → Los va marcando
   Recorre secciones de checklist
   Marca ítems, sube documentos, añade notas
   Al subir documento de gasto → opción "marcar como recurrente"

5. CIERRE
   Usuario revisa señales
   Pulsa "Marcar como listo"
   Sistema genera: Resumen Ejecutivo + PDF completo + ZIP + Certificado
   Sistema guarda gastos marcados como recurrentes

6. ENVÍO
   Usuario descarga archivos
   Copia texto de email o WhatsApp
   Envía a su asesor fuera del sistema

7. CELEBRACIÓN
   Usuario ve Certificado de Cierre
   Mensaje: "Puedes soltar esto de tu cabeza"

8. FIN
   Trimestre queda como "enviado"
   Usuario marca manualmente cuando lo envía
```

---

## 14. Matriz desktop/móvil

### Regla de oro

| Tipo de acción | Desktop | Móvil |
|----------------|---------|-------|
| Pensar/Decidir | ✅ Ideal | ⚠️ Posible |
| Revisar en profundidad | ✅ Ideal | ⚠️ Limitado |
| Capturar documentos | ✅ Sí | ✅ Ideal |
| Consultar estado | ✅ Sí | ✅ Sí |
| Cerrar trimestre | ✅ Ideal | ⚠️ Con aviso |
| Marcar gastos esperados | ✅ Sí | ✅ Sí |

---

### Por pantalla

#### Landing
- Desktop: Completa
- Móvil: Igual (responsive)

#### Login
- Desktop: Completo
- Móvil: Igual

#### Dashboard
- Desktop: Trimestre activo + históricos + mensaje contextual
- Móvil: Solo trimestre activo + progreso + mensaje

#### Trimestre
- Desktop: Vista completa, todas las secciones expandibles, gastos esperados
- Móvil: Secciones colapsadas, una a una
- Móvil: Subida de documentos optimizada (cámara)

#### Resumen
- Desktop: Vista completa + todas las descargas
- Móvil: Vista resumida + solo PDF + WhatsApp

#### Cierre
- Desktop: Botón normal
- Móvil: Botón con confirmación extra + mensaje "Mejor revisarlo en escritorio"

---

## 15. Modelo de negocio

### Pricing

| Opción | Precio | Descripción |
|--------|--------|-------------|
| Trimestre suelto | 15-20 € | Pago único por trimestre |
| Pack anual | 49-59 € | 4 trimestres (ahorro ~20%) |
| Prueba | Gratis | 1 trimestre completo |

### Justificación del precio

- Por debajo del ancla mental de "gestoría online" (30-50€/mes)
- Por encima de "herramienta gratuita" (percepción de valor)
- Comparable a: 1-2 cafés por semana durante el trimestre
- **Argumento ROI:** "Si gracias a un recordatorio recuperas el IVA de una factura de 50€, la herramienta ya se ha pagado."

### Modelo

- B2C directo (usuario paga)
- Sin tier gratuito permanente (el producto es el core)
- Prueba gratuita para reducir fricción de primera compra

### Métricas clave

| Métrica | Objetivo V1 |
|---------|-------------|
| Usuarios registrados | 100 en 3 meses |
| Conversión prueba → pago | >20% |
| Trimestres cerrados / usuario | >1 |
| Retención anual | >50% |
| **Gastos recurrentes por usuario** | >3 (indica valor de Memoria) |

---

## 16. Estrategia de distribución

### Canal principal: Contenido + SEO

**Hipótesis:** Los autónomos buscan activamente cómo preparar el trimestre.

**Búsquedas objetivo:**
- "cómo preparar trimestre autónomo"
- "qué documentos necesita mi gestor"
- "checklist cierre trimestral autónomo"
- "errores comunes declaración trimestral"
- "gastos deducibles autónomo olvidados"

**Táctica:**
1. Crear 5-10 artículos de blog optimizados para SEO
2. Ofrecer checklist descargable como lead magnet
3. Capturar emails → nurturing → conversión

### Canal secundario: LinkedIn

**Hipótesis:** Los autónomos de servicios están en LinkedIn.

**Táctica:**
1. Contenido educativo sobre organización trimestral
2. Posts sobre el dolor (no sobre el producto)
3. CTA a landing con lista de espera

### Canal terciario: Partnerships con asesorías

**Hipótesis:** Los asesores recomendarían una herramienta que les facilite el trabajo.

**Táctica (V2):**
1. Contactar 10 asesorías pequeñas
2. Ofrecer acceso gratuito para sus clientes
3. Modelo B2B2C: asesoría paga licencia, clientes usan gratis

### Canales descartados V1

- Publicidad pagada (coste alto, conversión incierta)
- Redes sociales generalistas (audiencia difusa)
- Afiliados (complejidad operativa)

---

## 17. Plan de validación

### Fase 1: Pre-desarrollo (2 semanas)

#### 17.1 Landing de validación

**Objetivo:** 100 registros en lista de espera

**Contenido:**
- Propuesta de valor clara
- Checklist visual (mockup)
- Mención de "el sistema recuerda tus gastos"
- Formulario de email
- Sin producto funcional

**Métricas:**
- Visitas → Registros (conversión >5%)
- Fuente de tráfico
- Comentarios/feedback

#### 17.2 Entrevistas con usuarios (5)

**Perfil:** Autónomos de servicios con gestor externo

**Preguntas:**
1. ¿Cómo preparas actualmente el trimestre?
2. ¿Qué es lo que más te cuesta o estresa?
3. ¿Qué herramientas usas? ¿Qué te falta?
4. ¿Olvidas a veces gastos recurrentes como teléfono o suscripciones?
5. ¿Pagarías 15-20€ por trimestre por esto?

**Output:** Validación/invalidación de hipótesis de dolor

#### 17.3 Entrevistas con asesores (3)

**Preguntas:**
1. ¿Cómo te llega la información de tus clientes?
2. ¿Qué formato te facilita más el trabajo?
3. **¿Prefieres ZIP con carpetas o PDF único con todas las facturas?**
4. ¿Un resumen ejecutivo de 1 página te sería útil?
5. ¿Recomendarías una herramienta así a tus clientes?

**Output:** Validación del formato de salida (PDF/ZIP) y del Resumen Ejecutivo

### Fase 2: Beta cerrada (4 semanas post-desarrollo)

**Participantes:** 10-20 usuarios de lista de espera

**Objetivo:**
- Validar flujo completo
- Validar Memoria Trimestral (requiere 2 trimestres o simulación)
- Detectar bugs y fricciones
- Obtener testimonios

**Incentivo:** Acceso gratuito de por vida (founding members)

### Fase 3: Lanzamiento público

**Requisitos previos:**
- [ ] 100+ registros en lista de espera
- [ ] 5+ entrevistas con usuarios validando dolor
- [ ] 3+ entrevistas con asesores validando output
- [ ] Decisión sobre formato ZIP vs PDF único
- [ ] Beta completada sin bugs críticos
- [ ] 3+ testimonios de beta testers

---

## 18. Criterios de aceptación y testing

### 18.1 Criterios funcionales

#### Auth
| Criterio | Esperado |
|----------|----------|
| Usuario introduce email válido | Recibe magic link en <30s |
| Usuario hace clic en magic link | Accede al dashboard |
| Usuario con sesión activa accede | Va directo a dashboard |
| Magic link expirado | Mensaje de error claro + opción de reenvío |

#### Trimestre
| Criterio | Esperado |
|----------|----------|
| Usuario nuevo accede por primera vez | Trimestre actual creado automáticamente |
| Trimestre creado | 17 ítems de checklist generados |
| Usuario marca ítem como completado | Progreso se actualiza en <1s |
| Usuario marca ítem como dudoso | Ítem aparece en resumen |
| Usuario accede en Q1 2026 | Nuevo trimestre Q1 2026 creado |
| **Usuario tiene gastos recurrentes de Q4** | **Se crean como "esperados" en Q1** |

#### Memoria Trimestral
| Criterio | Esperado |
|----------|----------|
| Usuario marca documento como recurrente | Se guarda en `recurring_expenses` |
| Usuario cierra trimestre con recurrentes | Lista guardada correctamente |
| Nuevo trimestre con recurrentes previos | Aparece sección "Gastos esperados" |
| Usuario sube documento que coincide con esperado | Se marca como "fulfilled" |
| Usuario descarta gasto esperado | Se marca como "dismissed" |

#### Documentos
| Criterio | Esperado |
|----------|----------|
| Usuario sube archivo (drag & drop) | Archivo aparece en sección correcta en <3s |
| Usuario sube archivo desde móvil | Funciona con cámara |
| Usuario sube múltiples archivos | Todos procesados correctamente |
| Archivo >10MB | Mensaje de error claro |
| Formato no soportado | Mensaje de error claro |
| **Usuario marca "recurrente"** | **Checkbox visible y funcional** |

#### Checklist
| Criterio | Esperado |
|----------|----------|
| Sección sin documentos | Señal visible (no bloqueante) |
| Todas las secciones vacías | Señales en todas |
| Usuario ignora señales y cierra | Permitido (no bloqueante) |
| **Gasto esperado sin documento** | **Señal visible** |

#### Cierre
| Criterio | Esperado |
|----------|----------|
| Usuario pulsa "Marcar como listo" | Resumen Ejecutivo generado |
| Usuario pulsa "Marcar como listo" | PDF completo generado |
| Usuario pulsa "Marcar como listo" | ZIP generado con estructura correcta |
| **Usuario pulsa "Marcar como listo"** | **Certificado de Cierre generado** |
| Trimestre cerrado | Estado cambia a "ready" |
| Trimestre cerrado | Edición bloqueada |
| **Trimestre cerrado** | **Gastos recurrentes guardados** |
| Usuario quiere editar trimestre cerrado | Puede desbloquearlo |

#### Exportación
| Criterio | Esperado |
|----------|----------|
| **Resumen Ejecutivo** | **1 página, formato limpio** |
| PDF completo | Contiene todas las secciones del template |
| PDF generado | Ítems dudosos listados |
| PDF generado | Notas para asesor incluidas |
| ZIP generado | Estructura de carpetas correcta |
| ZIP generado | Resumen Ejecutivo incluido |
| ZIP generado | Todos los documentos incluidos |
| **Certificado de Cierre** | **Documento personal generado** |
| **Texto WhatsApp** | **Disponible para copiar** |

#### Microcopy
| Criterio | Esperado |
|----------|----------|
| Dashboard cargado día 1-10 | Mensaje de inicio de periodo |
| Dashboard cargado día 15-20 | Mensaje de final de periodo |
| Progreso 50% | Mensaje de mitad |
| Usuario vuelve tras >3 días | Mensaje de bienvenida |

### 18.2 Criterios de rendimiento

| Criterio | Esperado |
|----------|----------|
| Carga inicial de dashboard | <2s |
| Carga de pantalla Trimestre | <2s |
| Subida de archivo 5MB | <5s |
| Generación de Resumen Ejecutivo | <2s |
| Generación de PDF completo | <3s |
| Generación de ZIP (20 docs) | <10s |
| Generación de Certificado | <1s |

### 18.3 Criterios de seguridad

| Criterio | Esperado |
|----------|----------|
| Usuario A accede a datos de Usuario B | Denegado (RLS) |
| Usuario sin sesión accede a /dashboard | Redirigido a login |
| Storage: Usuario A accede a archivos de B | Denegado |
| Usuario A accede a recurring_expenses de B | Denegado (RLS) |

### 18.4 Casos de prueba críticos

```
TEST-001: Flujo completo de cierre
─────────────────────────────────────
1. Usuario nuevo accede
2. Verifica trimestre creado
3. Marca 5 ítems como completados
4. Sube 3 documentos (1 marcado como recurrente)
5. Añade 1 nota para el asesor
6. Marca 1 ítem como dudoso
7. Pulsa "Marcar como listo"
8. Descarga Resumen Ejecutivo → Verifica formato 1 página
9. Descarga PDF completo → Verifica contenido
10. Descarga ZIP → Verifica estructura
11. Verifica Certificado de Cierre disponible
12. Verifica trimestre bloqueado
13. Verifica gasto recurrente guardado

Resultado esperado: Todo OK
```

```
TEST-002: Memoria Trimestral
─────────────────────────────────────
1. Usuario cierra Q4 con 3 gastos recurrentes
2. Simular paso a Q1 2026
3. Usuario accede
4. Verifica: Q1 creado con 3 gastos esperados
5. Usuario sube documento que coincide con 1 esperado
6. Verifica: esperado marcado como fulfilled
7. Usuario descarta 1 esperado
8. Verifica: esperado marcado como dismissed

Resultado esperado: Memoria funciona correctamente
```

```
TEST-003: Señales de huecos
─────────────────────────────────────
1. Usuario accede a trimestre vacío
2. No sube ningún documento
3. Navega por secciones

Resultado esperado: Señales visibles en cada sección
```

```
TEST-004: Microcopy contextual
─────────────────────────────────────
1. Usuario accede día 5 del periodo → Mensaje inicio
2. Usuario con 50% progreso → Mensaje mitad
3. Usuario accede tras 5 días sin entrar → Mensaje bienvenida

Resultado esperado: Mensajes correctos según contexto
```

```
TEST-005: Múltiples trimestres
─────────────────────────────────────
1. Usuario cierra Q4 2025
2. Simular paso a Q1 2026
3. Usuario accede

Resultado esperado: Q1 2026 creado, Q4 2025 en histórico, gastos esperados clonados
```

---

## 19. Roadmap V2+

### V1.1 — Mejoras post-lanzamiento

- Feedback de usuarios
- Bugs y ajustes de UX
- Optimización de rendimiento
- Mejora de detección automática de recurrentes

### V2 — Expansión de experiencia

| Feature | Descripción |
|---------|-------------|
| Email forwarding | Dirección dedicada para reenviar facturas |
| Checklist por profesión | Ítems específicos según actividad |
| Modo Foco | Flujo paso a paso alternativo |
| Link de solo lectura para asesor | El asesor ve el estado sin descargar |
| Recordatorios | Email 2-4 semanas antes del cierre |
| Integración Google Drive | Importar documentos desde Drive |

### V3 — Modo asesor

| Feature | Descripción |
|---------|-------------|
| Panel de asesor | Vista de estado de clientes |
| Invitación de clientes | Asesor invita a sus clientes |
| Modelo B2B2C | Asesor paga, clientes usan gratis |
| Historial de salud trimestral | Evolución del usuario a lo largo del tiempo |

### V4 — IA y automatización

| Feature | Descripción |
|---------|-------------|
| Clasificación automática | IA clasifica documentos por tipo |
| Predictor de problemas | IA detecta patrones de olvidos |
| Asistente de dudas | Chat para resolver preguntas |
| Redacción de resumen | IA genera texto para el asesor |

### Fuera de roadmap (decisión estratégica)

- Facturación (hay demasiados competidores)
- Cálculo de impuestos (fuera de posicionamiento)
- Presentación de modelos (riesgo regulatorio)

---

## 20. Brief para desarrollo

### Contexto

**Producto:** Web app para preparación de cierre trimestral

**Qué es:** Herramienta ligera que ayuda a autónomos a organizar documentación antes de enviarla a su asesor, con memoria de gastos recurrentes

**Qué NO es:** ERP, software contable, calculadora de impuestos

### Alcance cerrado

**Incluido:**
- Auth por magic link
- Dashboard con trimestre activo + mensaje contextual
- **Memoria Trimestral (gastos recurrentes)**
- Pantalla de trimestre (checklist + docs + notas + gastos esperados)
- Subida de documentos (drag & drop, móvil) con opción "recurrente"
- **Generación de Resumen Ejecutivo (1 página)**
- Generación de PDF completo (jsPDF)
- Generación de ZIP (JSZip)
- **Generación de Certificado de Cierre**
- **Plantilla WhatsApp**
- **Sistema de microcopy emocional**
- Responsive (desktop-first)

**Excluido:**
- Email forwarding
- Checklist por profesión
- Modo Foco
- Facturación
- Cálculo de impuestos
- Panel de asesor
- IA

### Stack obligatorio

- Frontend: Astro (MPA)
- Backend: Supabase (Auth, PostgreSQL, Storage, RLS)
- PDF: jsPDF
- ZIP: JSZip
- Hosting: GitHub Pages o compatible

### Tablas nuevas a crear

- `recurring_expenses` — Gastos recurrentes del usuario
- `expected_documents` — Gastos esperados por trimestre

### Entregables

1. Código fuente versionado (GitHub)
2. Base de datos creada con RLS (incluyendo nuevas tablas)
3. App desplegada y funcional
4. README con instrucciones de despliegue

### Forma de trabajo

- Desarrollo iterativo
- Comunicación semanal (mínimo)
- Priorizar funcionalidad sobre estética
- Preguntar ante cualquier duda
- Referencia: Este PRD es la fuente de verdad

### Criterios de aceptación

Ver sección 18. Todos los criterios deben cumplirse para considerar el desarrollo completo.

---

## Anexo A: Checklist de lanzamiento

### Pre-desarrollo
- [ ] 100+ registros en lista de espera
- [ ] 5 entrevistas con usuarios
- [ ] 3 entrevistas con asesores
- [ ] Decisión sobre formato ZIP vs PDF único
- [ ] Validación de propuesta de valor

### Desarrollo
- [ ] Auth funcional
- [ ] CRUD de trimestres
- [ ] Checklist completa
- [ ] **Memoria Trimestral funcional**
- [ ] Subida de documentos con opción recurrente
- [ ] **Resumen Ejecutivo (1 página)**
- [ ] Generación PDF completo
- [ ] Generación ZIP
- [ ] **Certificado de Cierre**
- [ ] **Plantilla WhatsApp**
- [ ] **Microcopy contextual**
- [ ] RLS configurado
- [ ] Responsive

### Pre-lanzamiento
- [ ] Beta con 10-20 usuarios
- [ ] **Test de Memoria Trimestral (2 trimestres)**
- [ ] Bugs críticos resueltos
- [ ] 3+ testimonios
- [ ] Landing actualizada
- [ ] Pasarela de pago integrada

### Lanzamiento
- [ ] Anuncio a lista de espera
- [ ] Contenido SEO publicado
- [ ] Monitorización activa

---

## Anexo B: Mensajes de microcopy

### Mensajes de dashboard por momento

| Condición | Mensaje |
|-----------|---------|
| Día 1-10, progreso 0% | "Tranquilo, tienes tiempo. Pero empezar ahora es un regalo para tu yo futuro." |
| Día 1-10, progreso >0% | "Buen ritmo. Tienes tiempo de sobra." |
| Día 10-15, progreso <50% | "Buen momento para avanzar. Unos minutos ahora te ahorran horas después." |
| Día 10-15, progreso ≥50% | "Vas por buen camino. Solo quedan los últimos detalles." |
| Día 15-20, progreso <75% | "Últimos días. Pero no pasa nada, para eso estamos aquí." |
| Día 15-20, progreso ≥75% | "Casi está. Un último empujón y listo." |
| Progreso 100% | "Todo revisado. Cuando quieras, cierra el trimestre." |
| Reentrada tras >3 días | "Bienvenido de vuelta. Todo sigue aquí, donde lo dejaste." |

### Mensajes de normalización (aleatorios)

- "La mayoría de usuarios cierran entre el día 10 y el 15. Vas bien."
- "El 70% de usuarios marca al menos un ítem como dudoso. Es completamente normal."
- "Es habitual olvidar los tickets de parking. Por eso te lo preguntamos."
- "Muchos autónomos olvidan los gastos de formación. ¿Tienes algún curso este trimestre?"
- "Marcar dudas es señal de que lo estás haciendo bien."

### Mensajes de cierre

| Momento | Mensaje |
|---------|---------|
| Al cerrar | "Hecho. Respira. Tu asesor te lo agradecerá." |
| Certificado | "Puedes soltar esto de tu cabeza. Tu asesor tiene todo lo que necesita." |

---

**Fin del documento**

*PRD V1 — Preparador de Trimestres*
*Versión 1.1 consolidada — Diciembre 2025*

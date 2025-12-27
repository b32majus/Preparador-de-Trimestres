# Guía de Implementación — Preparador de Trimestres

> Documento técnico para desarrollo con Claude Code y diseño con Stitch
> Versión 1.1 — Diciembre 2025 (Lanzamiento previsto: 2026)

---

## PARTE 0: HOMOGENEIZACIÓN DE DISEÑOS (Stitch)

Esta sección define los elementos que deben ser consistentes en todas las pantallas generadas con Stitch.

### 0.1 Header — Versión Pública (Landing)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🌿 Sophilux       Cómo funciona   Precios      [Iniciar sesión] │
└─────────────────────────────────────────────────────────────────┘
```

- Logo Sophilux a la izquierda
- Links de navegación centrados
- CTA "Iniciar sesión" o "Empezar gratis" a la derecha (botón primario)

### 0.2 Header — Versión App (Autenticado)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🌿 Sophilux  │  Preparador de Trimestres              ⚙️   👤   │
└─────────────────────────────────────────────────────────────────┘
```

- Logo Sophilux (izquierda)
- Nombre del producto: "Preparador de Trimestres" (junto al logo, separado por línea vertical)
- Icono de ajustes ⚙️ (derecha)
- Avatar de usuario 👤 (derecha)
- **SIN navegación tipo "Dashboard | Trimestres | Perfil"** — La navegación es lineal y contextual

### 0.3 Footer — Versión Pública (Landing)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🌿 Sophilux                                                     │
│ Herramientas financieras diseñadas para                        │
│ humanos, no para contables.                                    │
│                                                                 │
│ © 2026 Sophilux. Todos los derechos reservados.                │
│ Términos · Privacidad · Ayuda · Contacto                       │
│                                      Parte del ecosistema Sophilux │
└─────────────────────────────────────────────────────────────────┘
```

### 0.4 Footer — Versión App (Autenticado)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Sophilux © 2026 · Ayuda                      │
└─────────────────────────────────────────────────────────────────┘
```

- Una sola línea, centrada
- Link "Ayuda" funcional
- Sin frases decorativas

### 0.5 Decisión de diseño: Pantalla Resumen

**Elegida: Versión 2** (con iconos de color en la documentación)

Razones:
- Los iconos con color ayudan a escanear rápidamente
- Mejor contraste visual para una pantalla de "victoria"
- Tipografía normal en las notas (más legible)

**Ajuste de colores en iconos de documentación:**

| Tipo | Color |
|------|-------|
| Ingresos | #4A7C59 (verde suave) |
| Gastos | #B8897D (oro rosa) |
| Banco | #5B8FA8 (azul suave) |
| Otros | #9B958F (gris cálido) |

### 0.6 Consistencia tipográfica

| Elemento | Fuente | Peso | Tamaño |
|----------|--------|------|--------|
| Títulos principales (h1) | Cormorant Garamond | Medium | 36-48px |
| Subtítulos (h2) | Cormorant Garamond | Medium | 24-30px |
| Labels de sección | Inter | Semibold, UPPERCASE | 12-14px |
| Texto cuerpo | Inter | Regular | 16px |
| Texto secundario | Inter | Regular | 14px |
| Números grandes (métricas) | Inter | Semibold | 24-32px |

### 0.7 Botones (consistencia)

| Tipo | Uso | Estilo |
|------|-----|--------|
| **Primario** | CTA principal | Fondo #B8897D, texto blanco, border-radius 8px, padding 12-16px 24-32px |
| **Secundario** | Acciones secundarias | Borde #D4D0CC, fondo blanco/transparente, texto #2D2926 |
| **Texto** | Links, acciones terciarias | Sin borde ni fondo, color #B8897D, hover: underline |

### 0.8 Estados de checklist (colores)

| Estado | Color borde izquierdo | Color fondo |
|--------|----------------------|-------------|
| Pendiente | #9B958F (gris) | Transparente |
| Completado | #4A7C59 (verde) | #E8F0E8 (verde claro) |
| Dudoso | #D4A84B (ámbar) | #FFF8E1 (amarillo claro) |

### 0.9 Año en todo el producto

**Usar 2026** en:
- Footer: "© 2026 Sophilux"
- Certificado de Cierre (si muestra año de copyright)
- Cualquier referencia legal

---

## PARTE 1: SISTEMA DE DISEÑO SOPHILUX (Adaptado)

### 1.1 Filosofía de diseño

Esta herramienta pertenece a la familia Sophilux pero tiene un tono diferente:

| Aspecto | Sophilux Privacy | Preparador Trimestres |
|---------|------------------|----------------------|
| Emoción principal | Seguridad, protección | Calma, orden, alivio |
| Tono | Clínico, técnico | Cálido, humano, empático |
| Mensaje | "Protege datos sensibles" | "Cierra sin ansiedad" |
| Usuario | Profesional sanitario | Autónomo/freelancer |

### 1.2 Paleta de Colores (Adaptada)

```css
:root {
  /* ===== COLORES PRIMARIOS SOPHILUX ===== */
  --oro-rosa: #B8897D;
  --oro-rosa-hover: #A67868;
  --oro-rosa-light: #D4AFA6;
  --oro-rosa-ultra-light: #F5E6D3;
  
  /* ===== FONDOS ===== */
  --bg-primary: #FAF8F5;        /* Piedra cálida */
  --bg-card: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --bg-dark: #3D3633;
  --bg-dark-hover: #2D2926;
  
  /* ===== TEXTO ===== */
  --text-primary: #2D2926;      /* Casi negro cálido */
  --text-secondary: #6B635D;
  --text-muted: #9B958F;
  --text-inverse: #FFFFFF;
  
  /* ===== ESTADOS DE CHECKLIST ===== */
  --state-pending: #9B958F;           /* Gris cálido */
  --state-pending-bg: #F5F3F0;
  --state-done: #4A7C59;              /* Verde suave */
  --state-done-bg: #E8F0E8;
  --state-doubtful: #D4A84B;          /* Ámbar */
  --state-doubtful-bg: #FFF8E1;
  
  /* ===== ESTADOS FUNCIONALES ===== */
  --success: #4A7C59;
  --success-light: #E8F0E8;
  --warning: #D4A84B;
  --warning-light: #FFF8E1;
  --error: #C45C4A;
  --error-light: #FFEBE8;
  --info: #5B8FA8;
  --info-light: #E8F4F8;
  
  /* ===== BORDES ===== */
  --border-light: #E8E4E0;
  --border-medium: #D4D0CC;
  
  /* ===== SOMBRAS ===== */
  --shadow-sm: 0 1px 2px rgba(45, 41, 38, 0.05);
  --shadow-md: 0 4px 12px rgba(45, 41, 38, 0.08);
  --shadow-lg: 0 8px 24px rgba(45, 41, 38, 0.12);
  --shadow-card: 0 2px 8px rgba(45, 41, 38, 0.06);
}
```

### 1.3 Tipografía

```css
:root {
  /* ===== FAMILIAS (heredadas de Sophilux) ===== */
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* ===== TAMAÑOS ===== */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  
  /* ===== PESOS ===== */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
}
```

### 1.4 Espaciado y Radios

```css
:root {
  /* Espaciado */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  
  /* Radios */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Transiciones */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

---

## PARTE 2: COMPONENTES ESPECÍFICOS

### 2.1 Tarjeta de Trimestre

```css
.trimestre-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-light);
}

.trimestre-header {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.trimestre-progress {
  height: 6px;
  background: var(--border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-2);
}

.trimestre-progress-fill {
  height: 100%;
  background: var(--oro-rosa);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
}

.trimestre-status {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.trimestre-message {
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: var(--oro-rosa-ultra-light);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-style: italic;
}
```

### 2.2 Ítem de Checklist

```css
.checklist-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.checklist-item:hover {
  border-color: var(--oro-rosa-light);
}

/* Estados */
.checklist-item[data-status="pending"] {
  border-left: 3px solid var(--state-pending);
}

.checklist-item[data-status="done"] {
  border-left: 3px solid var(--state-done);
  background: var(--state-done-bg);
}

.checklist-item[data-status="doubtful"] {
  border-left: 3px solid var(--state-doubtful);
  background: var(--state-doubtful-bg);
}

.checklist-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.checklist-content {
  flex: 1;
}

.checklist-label {
  font-size: var(--text-base);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.checklist-help {
  font-size: var(--text-sm);
  color: var(--text-muted);
}
```

### 2.3 Sección de Gastos Esperados

```css
.expected-section {
  background: var(--oro-rosa-ultra-light);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
}

.expected-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.expected-icon {
  font-size: var(--text-lg);
}

.expected-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--text-primary);
}

.expected-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}

.expected-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
}
```

### 2.4 Señales/Avisos

```css
.signal {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--info-light);
  border-radius: var(--radius-md);
  margin: var(--space-3) 0;
}

.signal-icon {
  flex-shrink: 0;
  color: var(--info);
}

.signal-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* Variante: normalización */
.signal-normalize {
  background: var(--oro-rosa-ultra-light);
}

.signal-normalize .signal-icon {
  color: var(--oro-rosa);
}
```

### 2.5 Zona de Subida

```css
.upload-zone {
  border: 2px dashed var(--border-medium);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.upload-zone:hover,
.upload-zone.dragover {
  border-color: var(--oro-rosa);
  background: var(--oro-rosa-ultra-light);
}

.upload-icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--space-3);
  color: var(--text-muted);
}

.upload-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.upload-hint {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-top: var(--space-2);
}
```

### 2.6 Documento Subido

```css
.document-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
}

.document-icon {
  width: 32px;
  height: 32px;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-info {
  flex: 1;
}

.document-name {
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.document-meta {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.document-recurring {
  font-size: var(--text-xs);
  color: var(--oro-rosa);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

### 2.7 Botones

```css
/* Primario - Oro Rosa Sophilux */
.btn-primary {
  background: var(--oro-rosa);
  color: var(--text-inverse);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: background var(--transition-normal);
}

.btn-primary:hover {
  background: var(--oro-rosa-hover);
}

/* Secundario */
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-secondary:hover {
  border-color: var(--oro-rosa);
  background: var(--oro-rosa-ultra-light);
}

/* CTA Grande (Landing) */
.btn-cta {
  background: var(--oro-rosa);
  color: var(--text-inverse);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-md);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.btn-cta:hover {
  background: var(--oro-rosa-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

---

## PARTE 3: PROMPTS PARA STITCH

### 3.1 Contexto general (usar en todos los prompts)

```
CONTEXTO DE MARCA:
- Marca: Sophilux (familia de herramientas para profesionales)
- Producto: Preparador de Trimestres (cierre trimestral para autónomos)
- Tono: Cálido, humano, empático. Transmite calma y orden, no urgencia.
- Estilo visual: Profesional pero acogedor. Inspiración: apps de bienestar + finanzas modernas.

PALETA DE COLORES:
- Primario: #B8897D (oro rosa cálido) - para CTAs y acentos
- Fondo: #FAF8F5 (piedra cálida)
- Texto principal: #2D2926 (casi negro cálido)
- Texto secundario: #6B635D
- Éxito/Completado: #4A7C59 (verde suave)
- Advertencia/Dudoso: #D4A84B (ámbar)
- Bordes: #E8E4E0

TIPOGRAFÍA:
- Títulos: Cormorant Garamond (serif elegante)
- Cuerpo: Inter (sans-serif limpia)

PRINCIPIOS:
- Calma antes que densidad
- Mucho espacio en blanco
- Sin colores agresivos (nada de rojos brillantes)
- Sin sensación de "software contable"
- Elementos redondeados (border-radius: 8-12px)
```

---

### 3.2 Prompt: Landing Page

```
Diseña una landing page para "Preparador de Trimestres", una herramienta web para autónomos españoles que les ayuda a organizar su documentación trimestral antes de enviarla a su asesor fiscal.

CONTEXTO DE MARCA:
[Pegar el contexto general de arriba]

ESTRUCTURA DE LA LANDING:

1. HERO SECTION
- Título principal (h1): "Prepara el trimestre antes de escribir a tu asesor"
- Subtítulo: "No calculamos impuestos. Te ayudamos a llegar con todo ordenado."
- 3 bullets cortos:
  • Checklist guiada
  • Documentos organizados
  • El sistema recuerda tus gastos recurrentes
- CTA principal: "Empezar mi trimestre" (botón grande, color #B8897D)
- Imagen/ilustración: Algo que transmita orden y calma (no gráficos fiscales)

2. SECCIÓN "CÓMO FUNCIONA" (3 pasos)
- Paso 1: Revisa la checklist (icono de lista)
- Paso 2: Sube tus documentos (icono de carpeta)
- Paso 3: Envía a tu asesor (icono de envío)
- Cada paso en una card con fondo blanco

3. SECCIÓN "LO QUE TE OLVIDAS DEDUCIR"
- Mensaje: "Esta herramienta se paga sola encontrando el dinero que olvidas deducir"
- Lista visual de gastos típicos olvidados:
  • Suscripciones (Adobe, Spotify Business)
  • Tickets de transporte
  • Formación profesional
  • Seguros RC

4. SECCIÓN "CADA TRIMESTRE ES MÁS FÁCIL"
- Explicar la Memoria Trimestral
- Ilustración de Q1 → Q2 con gastos que se "recuerdan"

5. FOOTER
- Links: Términos, Privacidad, Contacto
- Badge: "Parte de Sophilux"

ESTILO VISUAL:
- Fondo general: #FAF8F5
- Cards con sombra suave y bordes redondeados
- Mucho espacio entre secciones
- Sin imágenes de stock de gente sonriendo
- Ilustraciones abstractas o iconos line-art
- El hero puede tener un elemento visual grande a la derecha (ilustración, no foto)

NO INCLUIR:
- Pricing visible
- Formularios largos
- Testimonios (aún no tenemos)
- Capturas de pantalla del producto
```

---

### 3.3 Prompt: Login Page

```
Diseña una página de login minimalista para "Preparador de Trimestres".

CONTEXTO DE MARCA:
[Pegar el contexto general]

ESTRUCTURA:

1. LOGO
- Logo de Sophilux arriba (pequeño)

2. FORMULARIO CENTRAL
- Título: "Acceder"
- Campo de email (input limpio, bordes redondeados)
- Botón: "Enviarme enlace" (color #B8897D)
- Texto debajo: "Sin contraseñas. Sin spam."

3. FONDO
- Color sólido #FAF8F5
- Posiblemente un elemento decorativo sutil (forma geométrica suave)

ESTILO:
- Ultra minimalista
- El formulario centrado vertical y horizontalmente
- Máximo 400px de ancho para el formulario
- Sensación de "esto va a ser fácil"

NO INCLUIR:
- Login con Google/Apple
- Link de registro separado
- "¿Olvidaste tu contraseña?"
```

---

### 3.4 Prompt: Dashboard

```
Diseña el dashboard principal para "Preparador de Trimestres". Es la primera pantalla que ve el usuario al entrar.

CONTEXTO DE MARCA:
[Pegar el contexto general]

ESTRUCTURA:

1. HEADER
- Logo Sophilux (pequeño, izquierda)
- Botón "Ajustes" (derecha, icono engranaje)

2. MENSAJE CONTEXTUAL (arriba del contenido principal)
- Caja con fondo #F5E6D3 (oro rosa ultra light)
- Texto ejemplo: "Vas por la mitad. Esto ya es más de lo que la mayoría hace a estas alturas."
- Tono empático, no urgente

3. TARJETA DE TRIMESTRE ACTIVO (protagonista)
- Grande, centrada
- Contenido:
  - "Q4 / 2025" (título grande, tipografía serif)
  - Barra de progreso (65% llena, color #B8897D)
  - Estado: "En preparación"
  - Indicador: "4 gastos esperados pendientes"
  - Botón CTA: "Continuar cierre" (botón primario grande)

4. TRIMESTRES ANTERIORES (abajo, secundario)
- Lista simple:
  - Q3 / 2025 — ✓ Enviado
  - Q2 / 2025 — ✓ Enviado
- Estilo discreto, texto gris

LAYOUT:
- Una sola columna centrada (max-width: 600px)
- Mucho espacio vertical
- La tarjeta del trimestre activo es el foco visual

ESTILO:
- Fondo: #FAF8F5
- Tarjeta: blanca con sombra suave
- Sin sidebar
- Sin métricas numéricas complejas
- Sensación de "una sola cosa que hacer"
```

---

### 3.5 Prompt: Pantalla de Trimestre (Principal)

```
Diseña la pantalla principal de trabajo del trimestre para "Preparador de Trimestres". Aquí el usuario revisa su checklist, sube documentos y prepara el cierre.

CONTEXTO DE MARCA:
[Pegar el contexto general]

ESTRUCTURA (layout de 2 columnas en desktop):

COLUMNA PRINCIPAL (izquierda, ~65%):

1. HEADER DEL TRIMESTRE
- "Q4 / 2025" (título grande)
- Barra de progreso con porcentaje
- Estado textual: "En preparación"

2. SECCIÓN "GASTOS ESPERADOS" (si hay)
- Caja con fondo #F5E6D3
- Título: "📋 Gastos esperados (del Q3)"
- Subtítulo: "En Q3 subiste estos gastos. ¿Los tienes para Q4?"
- Lista de ítems:
  - ⬜ Vodafone
  - ⬜ Adobe Creative Cloud
  - ✅ Alquiler oficina (ya subido)
- Link: "+ Añadir otro gasto recurrente"

3. SECCIONES DE CHECKLIST (acordeón)
- INGRESOS (3/4 completados) ▼
  - Lista de ítems con estados (pending/done/doubtful)
  - Zona de documentos asociados
  - Botón "+ Subir documento"
- GASTOS (4/5 completados) ▶
- BANCO (2/3 completados) ▶
- OTROS (0/3 completados) ▶

4. SEÑALES (si aplica)
- Caja info: "ℹ️ No hay documentos en 'Otros'. Puede que esté todo correcto."

5. NOTAS
- Textarea: "Escribe notas o dudas..."
- Checkbox: "☐ Esto es para mi asesor"

6. CTA DE CIERRE (fijo abajo o al final)
- Botón grande: "Marcar trimestre como listo para enviar"

COLUMNA LATERAL (derecha, ~35%):

1. MENSAJE DE NORMALIZACIÓN
- Caja con icono 💡
- "El 70% de usuarios marca al menos un ítem como dudoso. Es completamente normal."

2. ZONA DE SUBIDA RÁPIDA
- Drag & drop
- "Arrastra archivos aquí"

3. DOCUMENTOS RECIENTES
- Lista de últimos 3-5 documentos subidos

ESTADOS DE CHECKLIST:
- Pendiente: Borde izquierdo gris (#9B958F)
- Completado: Borde izquierdo verde (#4A7C59), fondo verde claro
- Dudoso: Borde izquierdo ámbar (#D4A84B), fondo amarillo claro

MOBILE:
- Una sola columna
- Sidebar se convierte en secciones colapsables
- Zona de subida prominente (para cámara)

ESTILO:
- Fondo general: #FAF8F5
- Secciones de checklist: cards blancas
- Transiciones suaves al expandir/colapsar
- Sin sensación de formulario largo
```

---

### 3.6 Prompt: Pantalla de Resumen

```
Diseña la pantalla de resumen final del trimestre para "Preparador de Trimestres". Es la pantalla de revisión antes de enviar al asesor.

CONTEXTO DE MARCA:
[Pegar el contexto general]

ESTRUCTURA:

1. HEADER
- "Resumen Q4 / 2025"
- Badge: "✅ Listo para enviar"

2. ESTADO GENERAL
- Checklist: 100%
- Fecha de cierre: 15/01/2026

3. DOCUMENTACIÓN (resumen visual)
- Cards o lista:
  - Ingresos: 5 documentos
  - Gastos: 12 documentos
  - Banco: 1 extracto
  - Otros: 2 documentos
- Total: 20 documentos

4. GASTOS RECURRENTES GUARDADOS
- Lista: Vodafone, Adobe, Alquiler, Seguro RC
- Nota: "Te los recordaremos en Q1 2026"

5. ELEMENTOS A REVISAR (si hay)
- Lista con icono ⚠️
- Elementos marcados como "dudoso"

6. NOTAS PARA EL ASESOR (si hay)
- Texto de las notas

7. ACCIONES DE EXPORTACIÓN
- Botón primario: "Descargar Resumen Ejecutivo (1 pág)"
- Botón secundario: "Descargar PDF completo"
- Botón secundario: "Descargar ZIP"
- Separador
- Botón texto: "Copiar texto para email"
- Botón texto: "Copiar texto para WhatsApp"

8. CERTIFICADO
- Link destacado: "📜 Ver mi Certificado de Cierre"

ESTILO:
- Pantalla de "victoria" - debe sentirse como logro
- Colores suaves, predomina el verde (#4A7C59) para indicar completado
- Sin acciones de edición (solo lectura)
- Botones de descarga prominentes
```

---

### 3.7 Prompt: Certificado de Cierre

```
Diseña un "Certificado de Cierre" que el usuario puede descargar como PDF. Es un documento personal de celebración, no para el asesor.

CONTEXTO DE MARCA:
[Pegar el contexto general]

ESTRUCTURA DEL DOCUMENTO (1 página, orientación vertical):

1. HEADER
- Logo Sophilux (pequeño, centrado)
- Línea decorativa

2. TÍTULO PRINCIPAL
- "CERTIFICADO DE CIERRE"
- Estilo elegante, tipografía serif (Cormorant Garamond)

3. TRIMESTRE DESTACADO
- "Trimestre Q4 2025 ✓"
- Grande, con check mark verde

4. INFORMACIÓN DEL CIERRE
- "Cerrado el 15 de enero de 2026"
- Lista de logros:
  • 17 ítems de checklist revisados
  • 26 documentos organizados
  • 2 dudas anotadas para tu asesor
- "Gastos recurrentes guardados: 4"
- "(Te los recordaremos en Q1 2026)"

5. MENSAJE FINAL
- Caja con fondo suave
- "Puedes soltar esto de tu cabeza."
- "Tu asesor tiene todo lo que necesita."

6. FOOTER
- "Documento generado por Preparador de Trimestres"
- "Parte de Sophilux"

ESTILO:
- Elegante pero cálido
- Bordes decorativos sutiles
- Colores: oro rosa (#B8897D) + verde (#4A7C59)
- Sensación de diploma/certificado pero moderno
- NO debe parecer un documento fiscal oficial
```

---

## PARTE 4: GUÍA DE IMPLEMENTACIÓN POR FASES

### Fase 0 — Preparación (½ día)

#### 0.1 Repo y estructura

```
Prompt para Claude Code:

"Crea la estructura inicial de un proyecto Astro para una web app llamada 'Preparador de Trimestres'. 

Estructura de carpetas:
/src
  /pages
    index.astro (landing)
    login.astro
    dashboard.astro
    trimestre.astro
    resumen.astro
    ajustes.astro
  /components
    /ui (botones, inputs, cards)
    /checklist
    /documents
    /layout
  /layouts
    Landing.astro
    App.astro
  /styles
    global.css (con las variables CSS que te proporcionaré)
  /lib
    supabase.js
/public
  /assets

Incluye:
- Configuración básica de Astro
- El archivo global.css con el sistema de diseño que te paso
- Un .env.example con SUPABASE_URL y SUPABASE_ANON_KEY

No incluyas ninguna funcionalidad todavía, solo la estructura."
```

#### 0.2 Supabase

```
Pasos manuales:
1. Crear proyecto en supabase.com
2. Activar Auth → Email → Magic Link
3. Crear bucket "documents" (privado)
4. Copiar URL y anon key al .env
```

---

### Fase 1 — Modelo de datos + RLS (1 día)

#### 1.1 Crear tablas

```
Prompt para Claude Code:

"Genera el SQL para crear las siguientes tablas en Supabase PostgreSQL para una app de cierre trimestral:

1. profiles
   - id (UUID, PK, referencia a auth.users)
   - email (TEXT)
   - created_at (TIMESTAMP, default now())

2. trimestres
   - id (UUID, PK, default gen_random_uuid())
   - user_id (UUID, FK → profiles.id)
   - year (INT)
   - quarter (INT, 1-4)
   - status (TEXT, enum: 'preparation', 'ready', 'sent')
   - checklist_progress (INT, 0-100, default 0)
   - created_at (TIMESTAMP)
   - closed_at (TIMESTAMP, nullable)
   - UNIQUE(user_id, year, quarter)

3. checklist_items
   - id (UUID, PK)
   - trimestre_id (UUID, FK → trimestres.id, ON DELETE CASCADE)
   - section (TEXT: 'ingresos', 'gastos', 'banco', 'otros', 'cierre')
   - item_number (INT, 1-17)
   - label (TEXT)
   - help_text (TEXT)
   - status (TEXT: 'pending', 'done', 'doubtful', default 'pending')
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

4. documents
   - id (UUID, PK)
   - user_id (UUID, FK → profiles.id)
   - trimestre_id (UUID, FK → trimestres.id, ON DELETE CASCADE)
   - section (TEXT: 'ingresos', 'gastos', 'banco', 'otros')
   - original_name (TEXT)
   - file_path (TEXT)
   - file_size (INT)
   - mime_type (TEXT)
   - is_recurring (BOOLEAN, default false)
   - concept_label (TEXT, nullable)
   - created_at (TIMESTAMP)

5. recurring_expenses
   - id (UUID, PK)
   - user_id (UUID, FK → profiles.id)
   - concept_label (TEXT)
   - section (TEXT, default 'gastos')
   - last_seen_quarter (INT)
   - last_seen_year (INT)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

6. expected_documents
   - id (UUID, PK)
   - trimestre_id (UUID, FK → trimestres.id, ON DELETE CASCADE)
   - recurring_expense_id (UUID, FK → recurring_expenses.id)
   - status (TEXT: 'pending', 'fulfilled', 'dismissed', default 'pending')
   - fulfilled_by (UUID, FK → documents.id, nullable)
   - created_at (TIMESTAMP)

7. notes
   - id (UUID, PK)
   - trimestre_id (UUID, FK → trimestres.id, ON DELETE CASCADE)
   - content (TEXT)
   - for_advisor (BOOLEAN, default false)
   - created_at (TIMESTAMP)

Incluye:
- Todos los índices necesarios
- Triggers para updated_at
- Comentarios explicativos"
```

#### 1.2 RLS

```
Prompt para Claude Code:

"Genera las políticas RLS (Row Level Security) para Supabase.

Principio: Un usuario solo puede ver y modificar sus propios datos.

Para cada tabla:
1. Habilitar RLS
2. Política SELECT: WHERE user_id = auth.uid() (o a través de FK)
3. Política INSERT: WHERE user_id = auth.uid()
4. Política UPDATE: WHERE user_id = auth.uid()
5. Política DELETE: WHERE user_id = auth.uid()

Tablas:
- profiles: user_id = id (es el mismo)
- trimestres: user_id = auth.uid()
- checklist_items: via trimestre → user_id
- documents: user_id = auth.uid()
- recurring_expenses: user_id = auth.uid()
- expected_documents: via trimestre → user_id
- notes: via trimestre → user_id

También configura RLS para el bucket 'documents' en Storage:
- Solo acceso a carpeta {user_id}/*"
```

---

### Fase 2 — Lógica de negocio backend (1-2 días)

#### 2.1 Funciones de base de datos

```
Prompt para Claude Code:

"Crea funciones PostgreSQL para Supabase:

1. create_trimestre_with_checklist(p_user_id UUID, p_year INT, p_quarter INT)
   - Crea el trimestre
   - Genera los 17 checklist_items con sus labels y help_text (te paso la lista)
   - Busca recurring_expenses del usuario
   - Crea expected_documents para cada uno
   - Retorna el trimestre creado

2. update_checklist_progress(p_trimestre_id UUID)
   - Cuenta items done + doubtful
   - Actualiza trimestres.checklist_progress
   - Trigger: ejecutar después de UPDATE en checklist_items

3. close_trimestre(p_trimestre_id UUID)
   - Cambia status a 'ready'
   - Guarda closed_at
   - Guarda recurring_expenses basándose en documents.is_recurring = true
   - Retorna el trimestre actualizado

Lista de checklist_items (17 total):
[Incluir la lista del PRD con section, item_number, label, help_text]"
```

#### 2.2 Cliente Supabase en Astro

```
Prompt para Claude Code:

"Crea el archivo /src/lib/supabase.js para Astro que:

1. Inicializa el cliente Supabase con las variables de entorno
2. Exporta funciones helper:
   - getCurrentUser()
   - getActiveTrimestre(userId)
   - getOrCreateTrimestre(userId, year, quarter)
   - getChecklistItems(trimestreId)
   - updateChecklistItem(itemId, status)
   - getDocuments(trimestreId, section?)
   - uploadDocument(file, trimestreId, section, isRecurring, conceptLabel)
   - getExpectedDocuments(trimestreId)
   - updateExpectedDocument(id, status, fulfilledBy?)
   - getNotes(trimestreId)
   - saveNote(trimestreId, content, forAdvisor)
   - closeTrimestre(trimestreId)

Usa async/await y maneja errores apropiadamente."
```

---

### Fase 3 — Auth + estructura frontend (1 día)

```
Prompt para Claude Code:

"Implementa la autenticación en Astro con Supabase Magic Link:

1. /src/pages/login.astro
   - Formulario con campo email
   - Al submit, llamar supabase.auth.signInWithOtp({ email })
   - Mostrar mensaje de confirmación
   - Si ya hay sesión, redirigir a /dashboard

2. /src/middleware.js (o index.js si Astro no soporta middleware)
   - Verificar sesión en rutas protegidas (/dashboard, /trimestre, /resumen, /ajustes)
   - Si no hay sesión, redirigir a /login

3. /src/layouts/App.astro
   - Layout para páginas de la app
   - Header con logo y botón de logout
   - Slot para contenido

4. Callback de magic link
   - Manejar el redirect de Supabase después del click en el email

Usa el sistema de diseño CSS que ya tenemos."
```

---

### Fase 4 — Dashboard + Trimestre funcional (2-3 días)

```
Prompt para Claude Code:

"Implementa el Dashboard (/src/pages/dashboard.astro):

1. Al cargar:
   - Obtener usuario actual
   - Obtener o crear trimestre activo (año y quarter actual)
   - Obtener trimestres anteriores

2. UI:
   - Mensaje contextual (basado en día del mes y progreso)
   - Tarjeta de trimestre activo:
     - Q[X] / [Año]
     - Barra de progreso
     - Estado
     - Contador de gastos esperados pendientes
     - Botón 'Continuar cierre' → link a /trimestre?id=[id]
   - Lista de trimestres anteriores (solo lectura)

3. Lógica de mensaje contextual:
   - Día 1-10 del mes: mensaje de inicio
   - Día 10-15: mensaje de avance
   - Día 15-20: mensaje de urgencia suave
   - Basado también en % de progreso

Usa componentes reutilizables para la tarjeta y la barra de progreso."
```

```
Prompt para Claude Code:

"Implementa la pantalla de Trimestre (/src/pages/trimestre.astro):

1. Parámetro: ?id=[trimestre_id]

2. Cargar datos:
   - Trimestre
   - Checklist items (agrupados por section)
   - Documents (agrupados por section)
   - Expected documents
   - Notes

3. UI (ver diseño):
   - Header con Q[X]/[Año], progreso, estado
   - Sección 'Gastos esperados' (si hay)
   - Acordeón de secciones de checklist
   - Cada ítem: click para cambiar estado (pending → done → doubtful → pending)
   - Zona de documentos por sección
   - Textarea de notas
   - Botón de cierre

4. Interactividad (JavaScript):
   - Cambio de estado de ítem → API → actualizar UI
   - Subida de documento → API → actualizar lista
   - Checkbox 'recurrente' al subir
   - Expandir/colapsar secciones

5. Señales:
   - Mostrar si sección sin documentos
   - Mostrar si gasto esperado sin cumplir

Separa en componentes:
- ChecklistSection.astro
- ChecklistItem.astro (con JS para interactividad)
- DocumentList.astro
- UploadZone.astro
- ExpectedSection.astro"
```

---

### Fase 5 — Storage + documentos (1-2 días)

```
Prompt para Claude Code:

"Implementa la subida y gestión de documentos:

1. Componente UploadZone.astro:
   - Drag & drop
   - Click para seleccionar
   - Preview de archivos seleccionados
   - Checkbox 'Marcar como recurrente'
   - Input para 'Nombre del concepto' (si recurrente)
   - Botón subir

2. Lógica de subida (/src/lib/documents.js):
   - Subir a Supabase Storage: /{user_id}/{year}_Q{quarter}/{section}/
   - Crear registro en tabla documents
   - Si is_recurring, guardar concept_label
   - Si coincide con expected_document, marcar como fulfilled

3. Componente DocumentList.astro:
   - Lista de documentos subidos
   - Icono por tipo (PDF, imagen, etc.)
   - Nombre y tamaño
   - Badge 'Recurrente' si aplica
   - Botón eliminar (con confirmación)

4. Mobile:
   - Botón para abrir cámara
   - Subida directa de foto"
```

---

### Fase 6 — Cierre + outputs (2 días)

```
Prompt para Claude Code:

"Implementa la generación de PDFs y ZIP en cliente:

1. Instalar dependencias:
   - jsPDF (para PDFs)
   - JSZip (para ZIP)
   - file-saver (para descargar)

2. /src/lib/generators/resumenEjecutivo.js:
   - Generar PDF de 1 página con jsPDF
   - Estructura según el PRD (estado, documentación, confirmaciones, dudas, notas)
   - Estilo: limpio, profesional, colores Sophilux

3. /src/lib/generators/resumenCompleto.js:
   - PDF más detallado
   - Incluir lista completa de checklist
   - Incluir todas las notas

4. /src/lib/generators/certificado.js:
   - PDF del certificado de cierre
   - Estilo elegante/celebratorio
   - Datos del trimestre cerrado

5. /src/lib/generators/zipPackage.js:
   - Crear ZIP con JSZip
   - Estructura:
     /00_RESUMEN_EJECUTIVO.pdf
     /01_INGRESOS/
     /02_GASTOS/
     /03_BANCO/
     /04_OTROS/
     /RESUMEN_COMPLETO.pdf
   - Descargar los archivos de Supabase Storage
   - Añadir al ZIP
   - Generar y descargar

6. Textos para copiar:
   - Generar texto de email (función que retorna string)
   - Generar texto de WhatsApp (versión corta)"
```

```
Prompt para Claude Code:

"Implementa la pantalla de Resumen (/src/pages/resumen.astro):

1. Parámetro: ?id=[trimestre_id]

2. Verificar que el trimestre esté en status 'ready'

3. Cargar todos los datos del trimestre

4. UI:
   - Header con badge de estado
   - Resumen de documentación
   - Gastos recurrentes guardados
   - Elementos dudosos
   - Notas para el asesor
   - Botones de descarga:
     - Resumen Ejecutivo (1 pág) → genera y descarga PDF
     - PDF completo → genera y descarga
     - ZIP → genera y descarga
   - Botones de copiar:
     - Texto email → copiar al clipboard
     - Texto WhatsApp → copiar al clipboard
   - Link al Certificado de Cierre

5. Feedback visual:
   - Loading mientras genera
   - Confirmación de copiado"
```

---

### Fase 7 — Pulido UX + microcopy (1-2 días)

```
Prompt para Claude Code:

"Implementa el sistema de microcopy contextual:

1. /src/lib/microcopy.js:
   - Función getContextualMessage(progress, dayOfMonth, lastVisit)
   - Retorna mensaje según lógica del PRD
   - Incluir todos los mensajes definidos

2. /src/lib/normalizationMessages.js:
   - Array de mensajes de normalización
   - Función getRandomNormalizationMessage()

3. Integrar en Dashboard:
   - Mostrar mensaje contextual

4. Integrar en Trimestre:
   - Mostrar mensaje de normalización aleatorio
   - Mensajes específicos al marcar como 'doubtful'

5. Mensajes de cierre:
   - Al cerrar trimestre, mostrar mensaje de celebración
   - En Certificado, mensaje final"
```

```
Prompt para Claude Code:

"Aplica los estilos finales del sistema de diseño Sophilux:

1. Verificar que todas las variables CSS están aplicadas
2. Ajustar espaciados según el sistema
3. Verificar tipografías (Cormorant Garamond para títulos, Inter para cuerpo)
4. Añadir transiciones suaves
5. Verificar estados hover en botones y cards
6. Responsive: verificar móvil
7. Añadir iconos (usar emoji o iconos SVG simples)"
```

---

### Fase 8 — Landing + pago (1 día)

```
Prompt para Claude Code:

"Implementa la landing page (/src/pages/index.astro):

1. Usar el diseño de Stitch que importaremos
2. Secciones:
   - Hero con CTA
   - Cómo funciona (3 pasos)
   - Lo que te olvidas deducir
   - Cada trimestre es más fácil (Memoria)
   - Footer

3. CTA → link a /login

4. SEO básico:
   - Title y meta description
   - Open Graph tags"
```

---

### Fase 9 — Testing + beta (1 semana)

```
Checklist de testing manual:

AUTH:
[ ] Magic link se envía correctamente
[ ] Magic link redirige al dashboard
[ ] Sesión persiste al recargar
[ ] Logout funciona

TRIMESTRE:
[ ] Se crea automáticamente al primer acceso
[ ] Checklist tiene 17 ítems
[ ] Cambiar estado funciona
[ ] Progreso se actualiza

MEMORIA TRIMESTRAL:
[ ] Marcar documento como recurrente
[ ] Al cerrar, se guarda en recurring_expenses
[ ] Al crear nuevo trimestre, aparecen como esperados
[ ] Marcar esperado como fulfilled/dismissed

DOCUMENTOS:
[ ] Subida drag & drop funciona
[ ] Subida desde móvil funciona
[ ] Documentos aparecen en sección correcta
[ ] Eliminar documento funciona

CIERRE:
[ ] Botón de cierre cambia estado
[ ] PDFs se generan correctamente
[ ] ZIP contiene todos los archivos
[ ] Certificado se genera

OUTPUTS:
[ ] Resumen Ejecutivo tiene formato correcto
[ ] Texto de email es correcto
[ ] Texto de WhatsApp es correcto

MOBILE:
[ ] Dashboard usable
[ ] Trimestre usable (secciones colapsadas)
[ ] Subida de foto funciona
```

---

## PARTE 5: CHECKLIST DE ARCHIVOS A CREAR

```
/
├── .env.example
├── astro.config.mjs
├── package.json
│
├── /public
│   └── /assets
│       ├── logo.svg
│       └── favicon.ico
│
├── /src
│   ├── /pages
│   │   ├── index.astro (landing)
│   │   ├── login.astro
│   │   ├── dashboard.astro
│   │   ├── trimestre.astro
│   │   ├── resumen.astro
│   │   └── ajustes.astro
│   │
│   ├── /layouts
│   │   ├── Landing.astro
│   │   └── App.astro
│   │
│   ├── /components
│   │   ├── /ui
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Input.astro
│   │   │   ├── Badge.astro
│   │   │   ├── ProgressBar.astro
│   │   │   └── Signal.astro
│   │   │
│   │   ├── /checklist
│   │   │   ├── ChecklistSection.astro
│   │   │   ├── ChecklistItem.astro
│   │   │   └── ExpectedSection.astro
│   │   │
│   │   ├── /documents
│   │   │   ├── UploadZone.astro
│   │   │   ├── DocumentList.astro
│   │   │   └── DocumentItem.astro
│   │   │
│   │   └── /layout
│   │       ├── Header.astro
│   │       ├── Footer.astro
│   │       └── TrimestreCard.astro
│   │
│   ├── /lib
│   │   ├── supabase.js
│   │   ├── auth.js
│   │   ├── trimestre.js
│   │   ├── checklist.js
│   │   ├── documents.js
│   │   ├── microcopy.js
│   │   │
│   │   └── /generators
│   │       ├── resumenEjecutivo.js
│   │       ├── resumenCompleto.js
│   │       ├── certificado.js
│   │       ├── zipPackage.js
│   │       └── textos.js
│   │
│   └── /styles
│       └── global.css
│
└── /supabase
    ├── schema.sql
    ├── rls.sql
    └── functions.sql
```

---

---

## PARTE 6: CONFIGURACIÓN EMAIL MAGIC LINK

### Configuración en Supabase

**Ruta:** Authentication → Email Templates → Magic Link

### Asunto (Subject)

```
Tu enlace de acceso a Preparador de Trimestres
```

### Cuerpo del email (Body)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF8F5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 2px 8px rgba(45, 41, 38, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #E8E4E0;">
              <span style="font-family: Georgia, serif; font-size: 24px; color: #2D2926; font-weight: 500;">
                Preparador de Trimestres
              </span>
              <br>
              <span style="font-size: 12px; color: #9B958F; margin-top: 4px; display: inline-block;">
                Parte de Sophilux
              </span>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #2D2926; line-height: 1.6;">
                Hola,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #6B635D; line-height: 1.6;">
                Haz clic en el botón para acceder a tu cuenta. El enlace caduca en 1 hora.
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="{{ .ConfirmationURL }}" 
                       style="display: inline-block; background-color: #B8897D; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 500;">
                      Acceder a mi cuenta
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; font-size: 14px; color: #9B958F; line-height: 1.6;">
                Si no has solicitado este enlace, puedes ignorar este email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #FAF8F5; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9B958F;">
                Sophilux © 2026<br>
                No respondas a este mensaje.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Configuración adicional

| Campo | Valor |
|-------|-------|
| Site URL | `https://tudominio.com` |
| Redirect URLs | `https://tudominio.com/dashboard` |
| Mailer OTP Expiration | `3600` (1 hora) |
| Sender name | `Preparador de Trimestres` |

---

**Fin del documento**

*Guía de Implementación — Preparador de Trimestres*
*Versión 1.1 — Diciembre 2025 (Lanzamiento: 2026)*
